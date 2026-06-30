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

// ─── Models ───────────────────────────────────────────────────────────────────
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
// JSON round-trip converts ObjectId → string, strips undefined, Buffer, etc.
// This guarantees React never receives a non-serialisable value.
function toPlain(doc) {
  if (!doc) return null;
  const raw = doc.toObject ? doc.toObject({ versionKey: false }) : doc;
  const plain = JSON.parse(JSON.stringify(raw));
  if (plain._id) plain._id = String(plain._id);
  return plain;
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
  }
  return filter;
}

// ─── Adapter ──────────────────────────────────────────────────────────────────
function makeAdapter(Model) {
  return {
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

    async findOne(query = {}) {
      const doc = await Model.findOne(buildFilter(query)).exec();
      return toPlain(doc);
    },

    async insert(doc) {
      const created = await Model.create(doc);
      return toPlain(created);
    },

    async update(query, update, opts = {}) {
      const updated = await Model.findOneAndUpdate(buildFilter(query), update, {
        new: true,
        runValidators: false,
      }).exec();
      if (opts.returnUpdatedDocs) return toPlain(updated);
      return { numAffected: updated ? 1 : 0 };
    },

    async remove(query, _opts = {}) {
      const result = await Model.deleteOne(buildFilter(query)).exec();
      return { numRemoved: result.deletedCount };
    },

    async ensureIndex() {},
  };
}

// ─── Seeding ──────────────────────────────────────────────────────────────────
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

// ─── initDb ───────────────────────────────────────────────────────────────────
export async function initDb() {
  await connectDb();
  // NOTE: Services et Projects ne sont PLUS réinsérés automatiquement.
  // La base de données est la source unique de vérité pour ces deux collections —
  // si un utilisateur les supprime ou les modifie depuis le dashboard, ils ne
  // doivent jamais réapparaître au redémarrage du serveur.
  // await upsertSeed(ServiceModel, SEED_SERVICES, "title_fr");
  // await upsertSeed(ProjectModel, SEED_PROJECTS, "title_fr");
  await upsertSeed(ProcessModel,     SEED_PROCESS,      "title_fr");
  await upsertSeed(BlogModel,        SEED_BLOG,         "title_fr");
  await upsertSeed(TestimonialModel, SEED_TESTIMONIALS, "author");
  await migrateProjects();
  console.log("✅ DB seeded & migrations applied (services/projects auto-seed disabled)");
}

// ─── Exports ──────────────────────────────────────────────────────────────────
export const db = {
  services:     makeAdapter(ServiceModel),
  projects:     makeAdapter(ProjectModel),
  info:         makeAdapter(InfoModel),
  process:      makeAdapter(ProcessModel),
  blog:         makeAdapter(BlogModel),
  testimonials: makeAdapter(TestimonialModel),
  devis:        makeAdapter(DevisModel),
};