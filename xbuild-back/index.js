import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { db, initDb } from "./db.js";
import { requireAuth, signToken } from "./auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "data", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));

// ── Force all JSON responses through a plain serialization pass ───────────────
// This guarantees Mongoose ObjectIds, DocumentArrays, etc. never reach React.
app.set("json replacer", (_key, val) => {
  if (val && typeof val === "object" && val.constructor?.name === "ObjectId") return val.toString();
  return val;
});

await initDb();

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Auth
let runtimePassword = null;

app.post("/api/auth/login", (req, res) => {
  const { password } = req.body ?? {};
  const validPwd = runtimePassword || process.env.ADMIN_PASSWORD;
  if (!password || password !== validPwd)
    return res.status(401).json({ error: "Mot de passe incorrect" });
  res.json({ token: signToken({ role: "admin" }), user: { role: "admin" } });
});
app.get("/api/auth/verify", requireAuth, (req, res) => res.json(req.user));

app.post("/api/auth/change-password", requireAuth, (req, res) => {
  const { newPassword } = req.body ?? {};
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: "Mot de passe trop court (min. 6 caractères)" });
  runtimePassword = newPassword;
  res.json({ ok: true, message: "Mot de passe mis à jour (session courante). Mettez aussi à jour ADMIN_PASSWORD dans .env pour le rendre permanent." });
});

// Upload
app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Info
app.get("/api/info", async (_req, res) => {
  try {
    let doc = await db.info.findOne({});
    if (!doc) doc = {
      companyName: "", logoImage: "", tagline_fr: "Nous Construisons & Gérons Vos Chantiers", tagline_en: "We Build & Construction Site Management",
      about_fr: "", about_en: "", footerAbout_fr: "", footerAbout_en: "",
      heroDesc_fr: "", heroDesc_en: "",
      heroStats: { projects: "45K+", clients: "25K+", engineers: "120+" },
      yearsExperience: 25, ceoName: "Shikhon Islam",
      address: "4648 Rocky, New York", email: "example@gmail.com",
      phone: "+88 0123 654 99", workingHours: "Mon-Fri, 09am - 05pm",
      socialFacebook: "#", socialFacebookActive: true,
      socialTwitter: "#",  socialTwitterActive: true,
      socialYoutube: "#",  socialYoutubeActive: true,
      socialLinkedin: "#", socialLinkedinActive: true,
      heroImage: "", aboutImage: "", statsImage: "",
      statsTitle_fr: "Nos Services Répondent aux Plus Hautes Normes.",
      statsTitle_en: "Our Services Meet the Highest Standards.",
      statsTag_fr: "Statut de l'Entreprise",
      statsTag_en: "Company Status",
      statsDesc_fr: "Avec plus de 25 ans d'expérience, XBuild continue de fixer la référence en qualité.",
      statsDesc_en: "With over 25 years of experience, XBuild continues to set the benchmark in quality.",
      statsItems: [
        { value:"45", suffix:"k+", label_fr:"Projets Réalisés", label_en:"Projects Completed" },
        { value:"25", suffix:"k+", label_fr:"Clients Actifs", label_en:"Active Clients" },
        { value:"2.4", suffix:"k+", label_fr:"Prix Remportés", label_en:"Awards Won" },
      ],
      statsBadges: [
        { icon:"🏅", label_fr:"Certifié ISO", label_en:"ISO Certified" },
        { icon:"🕐", label_fr:"Support 24/7", label_en:"24/7 Support" },
        { icon:"👷", label_fr:"Équipe d'Experts", label_en:"Expert Team" },
        { icon:"🛡️", label_fr:"Sûr & Sécurisé", label_en:"Safe & Secure" },
      ],
    };
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/info", requireAuth, async (req, res) => {
  try {
    const existing = await db.info.findOne({});
    let doc;
    if (existing) {
      await db.info.update({ _id: existing._id }, { $set: req.body }, {});
      doc = await db.info.findOne({ _id: existing._id });
    } else {
      doc = await db.info.insert(req.body);
    }
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Services
app.get("/api/services", async (_req, res) => {
  try { res.json(await db.services.find({}).sort({ order: 1, title_fr: 1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/services", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.services.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/services/:id", requireAuth, async (req, res) => {
  try { res.json(await db.services.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/services/:id", requireAuth, async (req, res) => {
  try { await db.services.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Projects
app.get("/api/projects", async (_req, res) => {
  try { res.json(await db.projects.find({}).sort({ year: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/projects", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.projects.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/projects/:id", requireAuth, async (req, res) => {
  try { res.json(await db.projects.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/projects/:id", requireAuth, async (req, res) => {
  try { await db.projects.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Process
app.get("/api/process", async (_req, res) => {
  try { res.json(await db.process.find({}).sort({ order: 1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/process", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.process.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/process/:id", requireAuth, async (req, res) => {
  try { res.json(await db.process.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/process/:id", requireAuth, async (req, res) => {
  try { await db.process.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Blog
app.get("/api/blog", async (_req, res) => {
  try { res.json(await db.blog.find({}).sort({ date: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get("/api/blog/:id", async (req, res) => {
  try {
    const doc = await db.blog.findOne({ _id: req.params.id });
    if (!doc) return res.status(404).json({ error: "Article introuvable" });
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/blog", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.blog.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/blog/:id", requireAuth, async (req, res) => {
  try { res.json(await db.blog.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/blog/:id", requireAuth, async (req, res) => {
  try { await db.blog.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Testimonials
app.get("/api/testimonials", async (_req, res) => {
  try { res.json(await db.testimonials.find({}).sort({ order: 1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post("/api/testimonials", requireAuth, async (req, res) => {
  try { res.status(201).json(await db.testimonials.insert(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/testimonials/:id", requireAuth, async (req, res) => {
  try { res.json(await db.testimonials.update({ _id: req.params.id }, { $set: req.body }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.delete("/api/testimonials/:id", requireAuth, async (req, res) => {
  try { await db.testimonials.remove({ _id: req.params.id }, {}); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Contact
app.post("/api/contact", async (req, res) => {
  try {
    const doc = await db.devis.insert({ ...req.body, createdAt: new Date().toISOString(), read: false });
    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get("/api/contact", requireAuth, async (_req, res) => {
  try { res.json(await db.devis.find({}).sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/contact/:id/status", requireAuth, async (req, res) => {
  try {
    const { status, response } = req.body ?? {};
    const doc = await db.devis.update(
      { _id: req.params.id },
      { $set: { status, response, read: true } },
      { returnUpdatedDocs: true }
    );
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/contact/:id/read", requireAuth, async (req, res) => {
  try { res.json(await db.devis.update({ _id: req.params.id }, { $set: { read: true } }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// Devis (alias)
app.post("/api/devis", async (req, res) => {
  try {
    const doc = await db.devis.insert({ ...req.body, createdAt: new Date().toISOString(), read: false });
    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get("/api/devis", requireAuth, async (_req, res) => {
  try { res.json(await db.devis.find({}).sort({ createdAt: -1 })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/devis/:id/status", requireAuth, async (req, res) => {
  try {
    const { status, response } = req.body ?? {};
    const doc = await db.devis.update(
      { _id: req.params.id },
      { $set: { status, response, read: true } },
      { returnUpdatedDocs: true }
    );
    res.json(doc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.put("/api/devis/:id/read", requireAuth, async (req, res) => {
  try { res.json(await db.devis.update({ _id: req.params.id }, { $set: { read: true } }, { returnUpdatedDocs: true })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

const port = Number(process.env.PORT || 5174);
app.listen(port, () => console.log(`API → http://localhost:${port}`));