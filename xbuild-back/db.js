/**
 * db.js  —  MongoDB / Mongoose edition
 *
 * Drop-in replacement for the NeDB version.
 * The exported `db` object exposes the same methods used in index.js:
 *   db.<collection>.find(query)
 *   db.<collection>.findOne(query)
 *   db.<collection>.insert(doc)
 *   db.<collection>.update(query, update, opts)   // opts.returnUpdatedDocs
 *   db.<collection>.remove(query, opts)
 *   db.<collection>.ensureIndex(...)              // no-op shim (Mongoose handles indexes)
 *   db.<collection>.sort(...)                     // chained on find() result
 *
 * Connection string is read from MONGODB_URI in .env.
 */

import mongoose from "mongoose";
import {
  SEED_PROJECTS,
  SEED_SERVICES,
  SEED_PROCESS,
  SEED_BLOG,
  SEED_TESTIMONIALS,
} from "./seed.js";

// ─── Connect ──────────────────────────────────────────────────────────────────
export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is missing from .env");
  await mongoose.connect(uri);
  console.log("✅ MongoDB connected");
}

// ─── Generic schema (flexible, mirrors NeDB's schemaless approach) ─────────────
function flexModel(name) {
  // Use Mixed type for maximum flexibility — same as NeDB
  const schema = new mongoose.Schema({}, { strict: false, timestamps: false });
  // Avoid re-compiling on hot-reload (nodemon)
  return mongoose.models[name] || mongoose.model(name, schema, name.toLowerCase());
}

const ServiceModel     = flexModel("Service");
const ProjectModel     = flexModel("Project");
const InfoModel        = flexModel("Info");
const ProcessModel     = flexModel("Process");
const BlogModel        = flexModel("Blog");
const TestimonialModel = flexModel("Testimonial");
const DevisModel       = flexModel("Devis");

// ─── Adapter ──────────────────────────────────────────────────────────────────
// Wraps a Mongoose Model so it exposes the exact same API that index.js calls.
// NeDB uses `_id` as a plain string; Mongoose uses ObjectId.
// We normalise by always converting _id → string in returned documents.

function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj._id) obj._id = obj._id.toString();
  delete obj.__v;
  return obj;
}

function toPlainArr(docs) {
  return docs.map(toPlain);
}

// Build a Mongoose filter from an NeDB-style query.
// The only special case used in index.js is `{ _id: someString }`.
function buildFilter(query = {}) {
  const filter = { ...query };
  if (filter._id && typeof filter._id === "string") {
    try { filter._id = new mongoose.Types.ObjectId(filter._id); }
    catch { /* invalid id → no match */ filter._id = null; }
  }
  return filter;
}

function makeAdapter(Model) {
  return {
    // ── find(query).sort(sortObj) ────────────────────────────────────────────
    find(query = {}) {
      const filter = buildFilter(query);
      // Return a thenable that also has .sort()
      let sortObj = null;
      const thenable = {
        sort(s) { sortObj = s; return thenable; },
        then(resolve, reject) {
          const q = Model.find(filter);
          if (sortObj) q.sort(sortObj);
          return q.exec().then(toPlainArr).then(resolve, reject);
        },
        catch(reject) { return thenable.then(null, reject); },
      };
      return thenable;
    },

    // ── findOne(query) ───────────────────────────────────────────────────────
    async findOne(query = {}) {
      const doc = await Model.findOne(buildFilter(query)).exec();
      return toPlain(doc);
    },

    // ── insert(doc) ──────────────────────────────────────────────────────────
    async insert(doc) {
      const created = await Model.create(doc);
      return toPlain(created);
    },

    // ── update(query, update, opts) ──────────────────────────────────────────
    // Supports: { $set: {...} }
    // opts.returnUpdatedDocs → return updated document (NeDB behaviour)
    async update(query, update, opts = {}) {
      const filter = buildFilter(query);
      const updated = await Model.findOneAndUpdate(filter, update, {
        new: true,           // return the updated doc
        runValidators: false,
      }).exec();
      if (opts.returnUpdatedDocs) return toPlain(updated);
      return { numAffected: updated ? 1 : 0 };
    },

    // ── remove(query, opts) ──────────────────────────────────────────────────
    async remove(query, _opts = {}) {
      const result = await Model.deleteOne(buildFilter(query)).exec();
      return { numRemoved: result.deletedCount };
    },

    // ── ensureIndex — no-op; Mongoose handles indexes at schema level ─────────
    async ensureIndex() {},
  };
}

// ─── Seeding (idempotent upsert, same logic as the NeDB version) ─────────────
async function upsertSeed(Model, docs, keyField) {
  for (const doc of docs) {
    const filter = { [keyField]: doc[keyField] };
    await Model.updateOne(filter, { $setOnInsert: doc }, { upsert: true });
  }
}

// ─── Migrations ───────────────────────────────────────────────────────────────
async function migrateProjects() {
  // Backfill images[] from legacy image field
  await ProjectModel.updateMany(
    { images: { $exists: false }, image: { $exists: true, $ne: "" } },
    [{ $set: { images: ["$image"] } }],
    { updatePipeline: true }
  );
  // Ensure coverIndex exists
  await ProjectModel.updateMany(
    { coverIndex: { $exists: false } },
    { $set: { coverIndex: 0 } }
  );
}

// ─── initDb — call once at startup ───────────────────────────────────────────
export async function initDb() {
  await connectDb();

  // Seed all collections (idempotent)
  await upsertSeed(ServiceModel,     SEED_SERVICES,     "title_fr");
  await upsertSeed(ProjectModel,     SEED_PROJECTS,     "title_fr");
  await upsertSeed(ProcessModel,     SEED_PROCESS,      "title_fr");
  await upsertSeed(BlogModel,        SEED_BLOG,         "title_fr");
  await upsertSeed(TestimonialModel, SEED_TESTIMONIALS, "author");

  // Backfill new fields on older docs
  await migrateProjects();

  console.log("✅ DB seeded & migrations applied");
}

// ─── Exported db object (same shape as before) ───────────────────────────────
export const db = {
  services:     makeAdapter(ServiceModel),
  projects:     makeAdapter(ProjectModel),
  info:         makeAdapter(InfoModel),
  process:      makeAdapter(ProcessModel),
  blog:         makeAdapter(BlogModel),
  testimonials: makeAdapter(TestimonialModel),
  devis:        makeAdapter(DevisModel),
};