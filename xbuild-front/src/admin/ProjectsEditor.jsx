import { useState } from "react";
import { useCrud } from "./components/useCrud";
import {
  Alert, Badge, Button, Card, EmptyState, Field, Input,
  ListItem, PageHeader, SectionHeading, Spinner, Textarea,
} from "./components/UI";
import { ImageUploader } from "./components/ImageUploader";

const EMPTY = { title_fr:"", title_en:"", category_fr:"", category_en:"", desc_fr:"", desc_en:"", year: String(new Date().getFullYear()), bg:"#1a1a2e", image:"", images:[], coverIndex:0 };
const BG_PRESETS  = ["#1a1a2e","#16213e","#0f3460","#533483","#1a2744","#0d1b2a","#1e3a1e","#2d1b1b"];
const CAT = { fr:["Industriel","Construction","Civil","Architecture","Énergie","Résidentiel","Commercial","Infrastructure"], en:["Industrial","Construction","Civil","Architecture","Energy","Residential","Commercial","Infrastructure"] };
const YEAR_RANGE  = Array.from({ length:10 }, (_, i) => String(new Date().getFullYear() - i));
const LANG_TABS   = [{ code:"fr", label:"🇫🇷 Français" }, { code:"en", label:"🇬🇧 English" }];

export default function ProjectsEditor() {
  const { items, loading, saving, error, editing, form, isEdit, load, startCreate, startEdit, cancel, save, remove, patch } = useCrud("/api/projects", EMPTY);
  const [lang, setLang] = useState("fr");

  return (
    <div>
      <style>{`
        .editor-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .editor-grid.has-form { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) {
          .editor-grid.has-form { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <PageHeader icon="📁" title="Projets"
        subtitle={`${items.length} projet${items.length !== 1 ? "s" : ""} — affichés dans le portfolio`}
        actions={<>
          <Button variant="ghost" onClick={load} disabled={loading}>{loading ? <Spinner size={14} /> : "↺"} Actualiser</Button>
          <Button variant="primary" onClick={startCreate}>+ Nouveau projet</Button>
        </>}
      />
      {error && <Alert type="error">{error}</Alert>}

      <div className={`editor-grid ${editing ? "has-form" : ""}`}>
        {editing && (
          <Card>
            <SectionHeading title={isEdit ? "Modifier le projet" : "Nouveau projet"} subtitle="Remplissez les champs dans les deux langues" />
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
              {LANG_TABS.map(tab => (
                <button key={tab.code} onClick={() => setLang(tab.code)} style={{ padding:"7px 16px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", border:"1px solid", borderColor: lang===tab.code?"var(--color-primary, #0A1684)":"rgba(255,255,255,0.12)", background: lang===tab.code?"rgba(10,22,132,0.15)":"rgba(255,255,255,0.04)", color: lang===tab.code?"var(--color-primary, #0A1684)":"#aaa" }}>{tab.label}</button>
              ))}
            </div>
            <Field label={`Titre — ${lang==="fr"?"Français 🇫🇷":"English 🇬🇧"}`}>
              <Input value={form[`title_${lang}`]||""} onChange={e => patch(`title_${lang}`, e.target.value)} placeholder={lang==="fr"?"Ex: Expansion Usine Acier":"Ex: Steel Factory Expansion"} />
            </Field>
            <Field label={`Description — ${lang==="fr"?"Français 🇫🇷":"English 🇬🇧"}`}>
              <Textarea value={form[`desc_${lang}`]||""} onChange={e => patch(`desc_${lang}`, e.target.value)} placeholder={lang==="fr"?"Décrivez ce projet…":"Describe this project…"} rows={3} />
            </Field>
            <Field label={`Catégorie — ${lang==="fr"?"Français 🇫🇷":"English 🇬🇧"}`}>
              <Input value={form[`category_${lang}`]||""} onChange={e => patch(`category_${lang}`, e.target.value)} placeholder={lang==="fr"?"Ex: Industriel":"Ex: Industrial"} />
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:6 }}>
                {CAT[lang].map(c => (
                  <button key={c} onClick={() => patch(`category_${lang}`, c)} style={{ padding:"3px 10px", borderRadius:6, fontSize:11, fontWeight:700, cursor:"pointer", border: form[`category_${lang}`]===c?"1px solid rgba(245,91,31,0.5)":"1px solid rgba(255,255,255,0.10)", background: form[`category_${lang}`]===c?"rgba(245,91,31,0.12)":"rgba(255,255,255,0.04)", color: form[`category_${lang}`]===c?"var(--color-primary, #0A1684)":"#888" }}>{c}</button>
                ))}
              </div>
            </Field>
            <Field label="Année">
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {YEAR_RANGE.map(y => (
                  <button key={y} onClick={() => patch("year", y)} style={{ padding:"6px 12px", borderRadius:8, fontSize:13, fontWeight:800, cursor:"pointer", border: form.year===y?"1px solid rgba(245,91,31,0.5)":"1px solid rgba(255,255,255,0.10)", background: form.year===y?"rgba(245,91,31,0.12)":"rgba(255,255,255,0.04)", color: form.year===y?"var(--color-primary, #0A1684)":"#888" }}>{y}</button>
                ))}
              </div>
            </Field>
            <Field label="Images du projet (galerie)" hint="Ajoutez plusieurs images. Choisissez la couverture (1ère image affichée).">
              {form.images.length > 0 && (
                <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:12 }}>
                  {form.images.map((img, gi) => (
                    <div key={gi} style={{ position:"relative", width:88 }}>
                      <div style={{ borderRadius:8, overflow:"hidden", height:66, border: form.coverIndex === gi ? "2px solid var(--color-primary, #0A1684)" : "1px solid rgba(255,255,255,0.12)" }}>
                        <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                      </div>
                      <div style={{ display:"flex", gap:3, marginTop:4 }}>
                        <button
                          onClick={() => patch("coverIndex", gi)}
                          style={{ flex:1, fontSize:10, fontWeight:700, padding:"3px 0", borderRadius:5, cursor:"pointer", border: form.coverIndex === gi ? "1px solid rgba(245,91,31,0.5)" : "1px solid rgba(255,255,255,0.10)", background: form.coverIndex === gi ? "rgba(245,91,31,0.15)" : "rgba(255,255,255,0.04)", color: form.coverIndex === gi ? "var(--color-primary, #0A1684)" : "#888" }}
                        >{form.coverIndex === gi ? "★" : "☆"}</button>
                        <button
                          onClick={() => {
                            const next = form.images.filter((_, idx) => idx !== gi);
                            let nextCover = form.coverIndex;
                            if (gi === form.coverIndex) nextCover = 0;
                            else if (gi < form.coverIndex) nextCover = form.coverIndex - 1;
                            patch("images", next);
                            patch("coverIndex", Math.min(nextCover, Math.max(next.length - 1, 0)));
                          }}
                          style={{ fontSize:10, fontWeight:700, padding:"3px 6px", borderRadius:5, cursor:"pointer", border:"1px solid rgba(239,68,68,0.2)", background:"rgba(239,68,68,0.1)", color:"#f87171" }}
                        >✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <ImageUploader value="" onChange={v => { if (v) patch("images", [...form.images, v]); }} label="+ Ajouter une image" hint="" />
            </Field>
            <Field label="Couleur de fond" hint="si pas d'image">
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <Input value={form.bg} onChange={e => patch("bg", e.target.value)} placeholder="#1a1a2e" />
                <div style={{ width:38, height:38, borderRadius:8, background:form.bg, border:"1px solid rgba(255,255,255,0.15)", flexShrink:0 }} />
              </div>
              <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                {BG_PRESETS.map(bg => (
                  <button key={bg} onClick={() => patch("bg", bg)} style={{ width:28, height:28, borderRadius:6, background:bg, cursor:"pointer", border: form.bg===bg?"2px solid var(--color-primary, #0A1684)":"1px solid rgba(255,255,255,0.15)" }} />
                ))}
              </div>
            </Field>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              <Button variant="primary" onClick={save} disabled={saving || (!form.title_fr && !form.title_en)}>
                {saving ? <><Spinner size={14} /> Sauvegarde…</> : (isEdit ? "💾 Mettre à jour" : "✚ Créer")}
              </Button>
              <Button variant="ghost" onClick={cancel}>Annuler</Button>
            </div>
          </Card>
        )}

        <Card>
          <SectionHeading title="Liste des projets" subtitle={loading ? "Chargement…" : `${items.length} projet${items.length!==1?"s":""}`} />
          {loading ? <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner size={28} /></div>
          : items.length === 0 ? <EmptyState icon="📁" title="Aucun projet" message="Cliquez sur « Nouveau projet » pour commencer." />
          : items.map(doc => (
            <ListItem key={doc._id} active={editing?._id === doc._id}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start", flex:1, minWidth:0 }}>
                {(() => {
                  const cover = (doc.images && doc.images.length > 0)
                    ? doc.images[Math.min(doc.coverIndex || 0, doc.images.length - 1)]
                    : doc.image;
                  return cover
                    ? <img src={cover} alt="" style={{ width:40, height:40, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
                    : <div style={{ width:40, height:40, borderRadius:8, background:doc.bg||"#1a1a2e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🏗️</div>;
                })()}
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:3 }}>
                    {doc.title_fr || "—"} {doc.title_en && <span style={{ color:"#555", fontWeight:400, fontSize:12 }}>/ {doc.title_en}</span>}
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ color:"#666", fontSize:12 }}>{doc.category_fr || ""}</span>
                    <Badge color="var(--color-primary, #0A1684)">{doc.year}</Badge>
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                <Button variant="ghost" onClick={() => startEdit(doc)}>✏️</Button>
                <Button variant="danger" onClick={() => remove(doc)}>🗑️</Button>
              </div>
            </ListItem>
          ))}
        </Card>
      </div>
    </div>
  );
}