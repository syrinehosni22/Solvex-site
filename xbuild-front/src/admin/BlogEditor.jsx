import { useState } from "react";
import { useCrud } from "./components/useCrud";
import {
  Alert, Badge, Button, Card, EmptyState, Field, Input,
  ListItem, PageHeader, SectionHeading, Spinner, Textarea,
} from "./components/UI";
import { ImageUploader } from "./components/ImageUploader";

const today = new Date().toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" });
const EMPTY = { title_fr:"", title_en:"", tag_fr:"", tag_en:"", excerpt_fr:"", excerpt_en:"", content_fr:"", content_en:"", date:today, author:"", featured:false, image:"" };
const LANG_TABS = [{ code:"fr", label:"🇫🇷 Français" }, { code:"en", label:"🇬🇧 English" }];

export default function BlogEditor() {
  const { items, loading, saving, error, editing, form, isEdit, load, startCreate, startEdit, cancel, save, remove, patch } = useCrud("/api/blog", EMPTY);
  const [lang, setLang] = useState("fr");

  return (
    <div>
      <style>{`
        .editor-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .editor-grid.has-form { grid-template-columns: 1fr 1fr; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        @media (max-width: 768px) {
          .editor-grid.has-form { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <PageHeader icon="📰" title="Blog / Actualités"
        subtitle={`${items.length} article${items.length!==1?"s":""} — section « Actualités » du site`}
        actions={<>
          <Button variant="ghost" onClick={load} disabled={loading}>{loading ? <Spinner size={14} /> : "↺"} Actualiser</Button>
          <Button variant="primary" onClick={startCreate}>+ Nouvel article</Button>
        </>}
      />
      {error && <Alert type="error">{error}</Alert>}

      <div className={`editor-grid ${editing ? "has-form" : ""}`}>
        {editing && (
          <Card>
            <SectionHeading title={isEdit ? "Modifier l'article" : "Nouvel article"} subtitle="Remplissez les champs dans les deux langues" />
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
              {LANG_TABS.map(tab => (
                <button key={tab.code} onClick={() => setLang(tab.code)} style={{ padding:"7px 16px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", border:"1px solid", borderColor: lang===tab.code?"#0A1684":"rgba(255,255,255,0.12)", background: lang===tab.code?"rgba(10,22,132,0.15)":"rgba(255,255,255,0.04)", color: lang===tab.code?"#0A1684":"#aaa" }}>{tab.label}</button>
              ))}
            </div>
            <Field label={`Titre — ${lang==="fr"?"Français":"English"}`}>
              <Input value={form[`title_${lang}`]||""} onChange={e => patch(`title_${lang}`, e.target.value)} placeholder={lang==="fr"?"Ex: Tendances 2024":"Ex: Trends 2024"} />
            </Field>
            <Field label={`Tag/Catégorie — ${lang==="fr"?"Français":"English"}`}>
              <Input value={form[`tag_${lang}`]||""} onChange={e => patch(`tag_${lang}`, e.target.value)} placeholder={lang==="fr"?"Ex: Tendances":"Ex: Trends"} />
            </Field>
            <Field label={`Extrait — ${lang==="fr"?"Français":"English"}`}>
              <Textarea value={form[`excerpt_${lang}`]||""} onChange={e => patch(`excerpt_${lang}`, e.target.value)} placeholder={lang==="fr"?"Résumé de l'article…":"Article summary…"} rows={3} />
            </Field>
            <Field label={`Contenu complet — ${lang==="fr"?"Français":"English"}`} hint="Les sauts de ligne séparent les paragraphes.">
              <Textarea value={form[`content_${lang}`]||""} onChange={e => patch(`content_${lang}`, e.target.value)} placeholder={lang==="fr"?"Texte complet de l'article…":"Full article text…"} rows={8} />
            </Field>
            <div className="two-col">
              <Field label="Date">
                <Input value={form.date||""} onChange={e => patch("date", e.target.value)} placeholder="01 Jan 2024" />
              </Field>
              <Field label="Auteur">
                <Input value={form.author||""} onChange={e => patch("author", e.target.value)} placeholder="Team" />
              </Field>
            </div>
            <Field label="Image de couverture">
              <ImageUploader value={form.image||""} onChange={v => patch("image", v)} />
            </Field>
            <Field label="Mise en avant">
              <button onClick={() => patch("featured", !form.featured)} style={{ padding:"8px 20px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, cursor:"pointer", border:"1px solid", borderColor: form.featured?"#0A1684":"rgba(255,255,255,0.12)", background: form.featured?"rgba(10,22,132,0.15)":"rgba(255,255,255,0.04)", color: form.featured?"#0A1684":"#aaa" }}>
                {form.featured ? "⭐ Mis en avant" : "☆ Non mis en avant"}
              </button>
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
          <SectionHeading title="Liste des articles" subtitle={loading ? "Chargement…" : `${items.length} article${items.length!==1?"s":""}`} />
          {loading ? <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner size={28} /></div>
          : items.length === 0 ? <EmptyState icon="📰" title="Aucun article" message="Cliquez sur « Nouvel article » pour commencer." />
          : items.map(doc => (
            <ListItem key={doc._id} active={editing?._id === doc._id}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start", flex:1, minWidth:0 }}>
                {doc.image
                  ? <img src={doc.image} alt="" style={{ width:44, height:44, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
                  : <div style={{ width:44, height:44, borderRadius:8, background:"#16213e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🏗️</div>
                }
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:3, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    {doc.title_fr || "—"}
                    {doc.featured && <span style={{ fontSize:10, background:"rgba(10,22,132,0.2)", color:"#0A1684", padding:"2px 6px", borderRadius:4, fontWeight:700 }}>★</span>}
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <Badge color="#0A1684">{doc.tag_fr || "–"}</Badge>
                    <span style={{ color:"#555", fontSize:11 }}>📅 {doc.date}</span>
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