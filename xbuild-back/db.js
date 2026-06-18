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
  const schema = new mongoose.Schema({}, { strict: false, timestamps: false });
  return mongoose.models[name] || mongoose.model(name, schema, name.toLowerCase());
}

const ServiceModel     = flexModel("Service");
const ProjectModel     = flexModel("Project");
const InfoModel        = flexModel("Info");
const ProcessModel     = flexModel("Process");
const BlogModel        = flexModel("Blog");
const TestimonialModel = flexModel("Testimonial");
const DevisModel       = flexModel("Devis");

// ─── Serialization ────────────────────────────────────────────────────────────
// Recursively convert ObjectIds → strings so React never receives a
// non-serialisable object as a child (fixes React error #300).
function deepSerialize(val) {
  if (val === null || val === undefined) return val;

  // ObjectId → string
  if (val instanceof mongoose.Types.ObjectId) return val.toString();

  // Array
  if (Array.isArray(val)) return val.map(deepSerialize);

  // Date → keep as-is (JSON.stringify handles it fine)
  if (val instanceof Date) return val;

  // Buffer → skip
  if (Buffer.isBuffer(val)) return val;

  // Plain object
  if (typeof val === "object") {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      if (k === "__v") continue;
      out[k] = deepSerialize(v);
    }
    if (out._id && typeof out._id !== "string") out._id = String(out._id);
    return out;
  }

  // Primitives
  return val;
}

function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject({ versionKey: false }) : JSON.parse(JSON.stringify(doc));
  return deepSerialize(obj);
}

function toPlainArr(docs) {
  return docs.map(toPlain);
}

// ─── Filter builder ───────────────────────────────────────────────────────────
function buildFilter(query = {}) {
  const filter = { ...query };
  if (filter._id && typeof filter._id === "string") {
    if (mongoose.Types.ObjectId.isValid(filter._id)) {
      filter._id = new mongoose.Types.ObjectId(filter._id);
    }
    // else leave as string — query will simply find nothing (no crash)
  }
  return filter;
}

// ─── Adapter ──────────────────────────────────────────────────────────────────
function makeAdapter(Model) {
  return {
    // ── find(query).sort(sortObj) ────────────────────────────────────────────
    find(query = {}) {
      const filter = buildFilter(query);
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
    async update(query, update, opts = {}) {
      const filter = buildFilter(query);
      const updated = await Model.findOneAndUpdate(filter, update, {
        new: true,
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

    // ── ensureIndex — no-op ──────────────────────────────────────────────────
    async ensureIndex() {},
  };
}

// ─── Seeding (idempotent) ─────────────────────────────────────────────────────
async function upsertSeed(Model, docs, keyField) {
  for (const doc of docs) {
    const filter = { [keyField]: doc[keyField] };
    await Model.updateOne(filter, { $setOnInsert: doc }, { upsert: true });
  }
}

// ─── Migrations ───────────────────────────────────────────────────────────────
async function migrateProjects() {
  await ProjectModel.updateMany(
    { images: { $exists: false }, image: { $exists: true, $ne: "" } },
    [{ $set: { images: ["$image"] } }],
    { updatePipeline: true }
  );
  await ProjectModel.updateMany(
    { coverIndex: { $exists: false } },
    { $set: { coverIndex: 0 } }
  );
}

// ─── initDb — call once at startup ───────────────────────────────────────────
export async function initDb() {
  await connectDb();

  await upsertSeed(ServiceModel,     SEED_SERVICES,     "title_fr");
  await upsertSeed(ProjectModel,     SEED_PROJECTS,     "title_fr");
  await upsertSeed(ProcessModel,     SEED_PROCESS,      "title_fr");
  await upsertSeed(BlogModel,        SEED_BLOG,         "title_fr");
  await upsertSeed(TestimonialModel, SEED_TESTIMONIALS, "author");

  await migrateProjects();

  console.log("✅ DB seeded & migrations applied");
}

// ─── Exported db object ───────────────────────────────────────────────────────
export const db = {
  services:     makeAdapter(ServiceModel),
  projects:     makeAdapter(ProjectModel),
  info:         makeAdapter(InfoModel),
  process:      makeAdapter(ProcessModel),
  blog:         makeAdapter(BlogModel),
  testimonials: makeAdapter(TestimonialModel),
  devis:        makeAdapter(DevisModel),
};