import { useState } from "react";
import { useCrud } from "./components/useCrud";
import { Alert, Button, Card, EmptyState, Field, Input, ListItem, PageHeader, SectionHeading, Spinner, Textarea } from "./components/UI";
import { ImageUploader } from "./components/ImageUploader";


const EMPTY = { order:1, name:"", role_fr:"", role_en:"", company:"", stars:5, text_fr:"", text_en:"", image:"" };
const LANG_TABS = [{ code:"fr", label:"🇫🇷 Français" }, { code:"en", label:"🇬🇧 English" }];

export default function TestimonialsEditor() {
  const { items, loading, saving, error, editing, form, isEdit, load, startCreate, startEdit, cancel, save, remove, patch } = useCrud("/api/testimonials", EMPTY);
  const [lang, setLang] = useState("fr");

  return (
    <div>
      <PageHeader icon="⭐" title="Témoignages"
        subtitle={`${items.length} témoignage${items.length!==1?"s":""} — section « Témoignages » du site`}
        actions={<>
          <Button variant="ghost" onClick={load} disabled={loading}>{loading ? <Spinner size={14} /> : "↺"} Actualiser</Button>
          <Button variant="primary" onClick={startCreate}>+ Nouveau témoignage</Button>
        </>}
      />
      {error && <Alert type="error">{error}</Alert>}

      <div style={{ display:"grid", gridTemplateColumns: editing ? "1fr 1fr" : "1fr", gap:20 }}>
        {editing && (
          <Card>
            <SectionHeading title={isEdit ? "Modifier le témoignage" : "Nouveau témoignage"} subtitle="Remplissez les champs dans les deux langues" />
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {LANG_TABS.map(tab => (
                <button key={tab.code} onClick={() => setLang(tab.code)} style={{ padding:"7px 16px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", border:"1px solid", borderColor: lang===tab.code?"var(--color-primary, #0A1684)":"rgba(255,255,255,0.12)", background: lang===tab.code?"rgba(245,91,31,0.15)":"rgba(255,255,255,0.04)", color: lang===tab.code?"var(--color-primary, #0A1684)":"#aaa" }}>{tab.label}</button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Field label="Ordre d'affichage">
                <Input type="number" value={form.order||1} onChange={e => patch("order", Number(e.target.value))} placeholder="1" />
              </Field>
              <Field label="Étoiles (1-5)">
                <div style={{ display:"flex", gap:6 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => patch("stars", n)} style={{ width:36, height:36, borderRadius:8, fontSize:18, border: form.stars>=n?"1px solid rgba(245,91,31,0.5)":"1px solid rgba(255,255,255,0.1)", background: form.stars>=n?"rgba(245,91,31,0.15)":"rgba(255,255,255,0.04)", cursor:"pointer" }}>★</button>
                  ))}
                </div>
              </Field>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Field label="Nom du client">
                <Input value={form.name||""} onChange={e => patch("name", e.target.value)} placeholder="John Doe" />
              </Field>
              <Field label="Entreprise">
                <Input value={form.company||""} onChange={e => patch("company", e.target.value)} placeholder="Amazon" />
              </Field>
            </div>
            <Field label={`Rôle/Poste — ${lang==="fr"?"Français":"English"}`}>
              <Input value={form[`role_${lang}`]||""} onChange={e => patch(`role_${lang}`, e.target.value)} placeholder={lang==="fr"?"Ex: Chef de projet":"Ex: Project Manager"} />
            </Field>
            <Field label={`Témoignage — ${lang==="fr"?"Français":"English"}`}>
              <Textarea value={form[`text_${lang}`]||""} onChange={e => patch(`text_${lang}`, e.target.value)} placeholder={lang==="fr"?"Le témoignage du client en français…":"The client testimonial in English…"} rows={4} />
            </Field>
            <Field label="Photo du client (avatar)">
              <ImageUploader value={form.image||""} onChange={v => patch("image", v)} />
            </Field>

            {/* Preview */}
            <div style={{ marginTop:4, marginBottom:16, padding:"16px", borderRadius:12, background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:11, color:"#555", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Aperçu</div>
              <p style={{ color:"#ccc", fontStyle:"italic", fontSize:14, lineHeight:1.7, marginBottom:12 }}>"{form[`text_${lang}`] || "Texte du témoignage…"}"</p>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,var(--color-primary, #0A1684),#ff8c6b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>👤</div>
                <div>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14 }}>{form.name||"Nom du client"}</div>
                  <div style={{ color:"#aaa", fontSize:12 }}>{form[`role_${lang}`]||"Rôle"} — {form.company||"Entreprise"}</div>
                  <div style={{ display:"flex", gap:2, marginTop:2 }}>
                    {Array.from({length: form.stars||5}).map((_,i) => <span key={i} style={{ color:"var(--color-primary, #0A1684)", fontSize:12 }}>★</span>)}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <Button variant="primary" onClick={save} disabled={saving || !form.name}>
                {saving ? <><Spinner size={14} /> Sauvegarde…</> : (isEdit ? "💾 Mettre à jour" : "✚ Créer")}
              </Button>
              <Button variant="ghost" onClick={cancel}>Annuler</Button>
            </div>
          </Card>
        )}

        <Card>
          <SectionHeading title="Liste des témoignages" subtitle={loading ? "Chargement…" : `${items.length} témoignage${items.length!==1?"s":""}`} />
          {loading ? <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner size={28} /></div>
          : items.length===0 ? <EmptyState icon="⭐" title="Aucun témoignage" message="Cliquez sur « Nouveau témoignage » pour commencer." />
          : [...items].sort((a,b)=>(a.order||0)-(b.order||0)).map(doc => (
            <ListItem key={doc._id} active={editing?._id===doc._id}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start", flex:1, minWidth:0 }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,var(--color-primary, #0A1684),#ff8c6b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>👤</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:2 }}>{doc.name} <span style={{ color:"#555", fontWeight:400, fontSize:12 }}>— {doc.company}</span></div>
                  <div style={{ display:"flex", gap:1, marginBottom:4 }}>
                    {Array.from({length:doc.stars||5}).map((_,i) => <span key={i} style={{ color:"var(--color-primary, #0A1684)", fontSize:11 }}>★</span>)}
                  </div>
                  <div style={{ color:"#666", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:280 }}>{doc.text_fr||""}</div>
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
