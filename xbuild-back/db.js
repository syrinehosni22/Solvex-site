import Datastore from "nedb-promises";
import { SEED_PROJECTS, SEED_SERVICES, SEED_PROCESS, SEED_BLOG, SEED_TESTIMONIALS } from "./seed.js";

const mk = (name) => Datastore.create({ filename: new URL(`./data/${name}.db`, import.meta.url).pathname, autoload: true });

const services     = mk("services");
const projects     = mk("projects");
const info         = mk("info");
const process      = mk("process");
const blog         = mk("blog");
const testimonials = mk("testimonials");
const devis        = mk("devis");

async function seedIfEmpty(store, docs) {
  const count = await store.count({});
  if (count > 0) return;
  await store.insert(docs);
}

// Backfill missing fields (order, icon, color, features_fr/en…) on services that
// already exist in the DB but were created before these fields were introduced.
// Matches existing docs to SEED_SERVICES by title_fr, and only fills in fields
// that are currently empty/missing — it never overwrites content already edited
// in the admin.
async function migrateServices() {
  const existing = await services.find({});
  if (existing.length === 0) return; // nothing to migrate, seedIfEmpty will handle it

  for (const doc of existing) {
    const seedMatch = SEED_SERVICES.find(s => s.title_fr === doc.title_fr);
    if (!seedMatch) continue;

    const patch = {};
    for (const key of ["order", "icon", "color", "features_fr", "features_en"]) {
      const current = doc[key];
      const isMissing = current === undefined || current === null ||
        (Array.isArray(current) && current.length === 0);
      if (isMissing && seedMatch[key] !== undefined) {
        patch[key] = seedMatch[key];
      }
    }

    if (Object.keys(patch).length > 0) {
      await services.update({ _id: doc._id }, { $set: patch }, {});
    }
  }
}

// Backfill the new gallery fields (images[], coverIndex) on existing projects:
// - if a project already has a single legacy "image" but no "images" gallery,
//   seed "images" with that single image so it keeps displaying.
// - ensure "coverIndex" defaults to 0.
// Never overwrites images/coverIndex that were already set.
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

// Backfill the new full-article fields (content_fr/content_en) on existing blog
// posts that were created before the blog detail page existed. Matches by
// title_fr and only fills in content if currently missing/empty.
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

export async function initDb() {
  await seedIfEmpty(services,     SEED_SERVICES);
  await migrateServices();
  await seedIfEmpty(projects,     SEED_PROJECTS);
  await migrateProjects();
  await seedIfEmpty(process,      SEED_PROCESS);
  await seedIfEmpty(blog,         SEED_BLOG);
  await migrateBlog();
  await seedIfEmpty(testimonials, SEED_TESTIMONIALS);
}

export const db = { services, projects, info, process, blog, testimonials, devis };