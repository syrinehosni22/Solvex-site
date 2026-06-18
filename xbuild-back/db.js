import Datastore from "nedb-promises";
import { SEED_PROJECTS, SEED_SERVICES, SEED_PROCESS, SEED_BLOG, SEED_TESTIMONIALS } from "./seed.js";

const mk = (name) =>
  Datastore.create({
    filename: new URL(`./data/${name}.db`, import.meta.url).pathname,
    autoload: true,
  });

const services     = mk("services");
const projects     = mk("projects");
const info         = mk("info");
const process      = mk("process");
const blog         = mk("blog");
const testimonials = mk("testimonials");
const devis        = mk("devis");

// ─── Ensure unique indexes ────────────────────────────────────────────────────
async function ensureIndexes() {
  await services.ensureIndex({ fieldName: "title_fr", unique: true });
  await projects.ensureIndex({ fieldName: "title_fr", unique: true });
  await blog.ensureIndex    ({ fieldName: "title_fr", unique: true });
  await process.ensureIndex ({ fieldName: "title_fr", unique: true });
  await testimonials.ensureIndex({ fieldName: "author", unique: true });
}

// ─── Upsert-based seeding (replaces seedIfEmpty) ──────────────────────────────
// Inserts each doc only if no existing doc matches on `keyField`.
// This is idempotent: safe to re-run on every boot, never creates duplicates.
async function upsertSeed(store, docs, keyField) {
  for (const doc of docs) {
    const query = { [keyField]: doc[keyField] };
    const existing = await store.findOne(query);
    if (!existing) {
      await store.insert(doc);
    }
  }
}

// ─── Migrations ───────────────────────────────────────────────────────────────
async function migrateServices() {
  const existing = await services.find({});
  if (existing.length === 0) return;

  for (const doc of existing) {
    const seedMatch = SEED_SERVICES.find(s => s.title_fr === doc.title_fr);
    if (!seedMatch) continue;

    const patch = {};
    for (const key of ["order", "icon", "color", "features_fr", "features_en"]) {
      const current = doc[key];
      const isMissing =
        current === undefined ||
        current === null ||
        (Array.isArray(current) && current.length === 0);
      if (isMissing && seedMatch[key] !== undefined) patch[key] = seedMatch[key];
    }
    if (Object.keys(patch).length > 0) {
      await services.update({ _id: doc._id }, { $set: patch }, {});
    }
  }
}

async function migrateProjects() {
  const existing = await projects.find({});
  for (const doc of existing) {
    const patch = {};
    if ((!Array.isArray(doc.images) || doc.images.length === 0) && doc.image) {
      patch.images = [doc.image];
    }
    if (doc.coverIndex === undefined || doc.coverIndex === null) {
      patch.coverIndex = 0;
    }
    if (Object.keys(patch).length > 0) {
      await projects.update({ _id: doc._id }, { $set: patch }, {});
    }
  }
}

async function migrateBlog() {
  const existing = await blog.find({});
  if (existing.length === 0) return;

  for (const doc of existing) {
    const seedMatch = SEED_BLOG.find(b => b.title_fr === doc.title_fr);
    if (!seedMatch) continue;

    const patch = {};
    for (const key of ["content_fr", "content_en"]) {
      if (!doc[key] && seedMatch[key]) patch[key] = seedMatch[key];
    }
    if (Object.keys(patch).length > 0) {
      await blog.update({ _id: doc._id }, { $set: patch }, {});
    }
  }
}

// ─── Remove duplicate docs keeping only the first inserted ───────────────────
async function deduplicateCollection(store, keyField) {
  const all = await store.find({});
  const seen = new Map();
  for (const doc of all) {
    const key = doc[keyField];
    if (seen.has(key)) {
      await store.remove({ _id: doc._id }, {});
      console.warn(`[dedup] Removed duplicate "${key}" in ${store.filename}`);
    } else {
      seen.set(key, doc._id);
    }
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────
export async function initDb() {
  // 1. Clean up any existing duplicates from past boots
  await deduplicateCollection(services,     "title_fr");
  await deduplicateCollection(projects,     "title_fr");
  await deduplicateCollection(blog,         "title_fr");
  await deduplicateCollection(process,      "title_fr");
  await deduplicateCollection(testimonials, "author");

  // 2. Enforce uniqueness at DB level going forward
  await ensureIndexes();

  // 3. Seed missing entries (idempotent)
  await upsertSeed(services,     SEED_SERVICES,     "title_fr");
  await upsertSeed(projects,     SEED_PROJECTS,     "title_fr");
  await upsertSeed(process,      SEED_PROCESS,      "title_fr");
  await upsertSeed(blog,         SEED_BLOG,         "title_fr");
  await upsertSeed(testimonials, SEED_TESTIMONIALS, "author");

  // 4. Backfill new fields on older docs
  await migrateServices();
  await migrateProjects();
  await migrateBlog();
}

export const db = { services, projects, info, process, blog, testimonials, devis };