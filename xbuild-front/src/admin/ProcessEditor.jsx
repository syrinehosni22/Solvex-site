import { useState } from "react";
import { useCrud } from "./components/useCrud";
import {
  Alert, Button, Card, EmptyState, Field, Input,
  ListItem, PageHeader, SectionHeading, Spinner, Textarea,
} from "./components/UI";

const EMPTY = { order:1, title_fr:"", title_en:"", desc_fr:"", desc_en:"", icon:"⚙️" };
const ICON_SUGGESTIONS = ["🔍","📐","🏗️","✅","📋","🔧","⚙️","🚧","📦","🛠️"];
const LANG_TABS = [{ code:"fr", label:"🇫🇷 Français" }, { code:"en", label:"🇬🇧 English" }];

export default function ProcessEditor() {
  const { items, loading, saving, error, editing, form, isEdit, load, startCreate, startEdit, cancel, save, remove, patch } = useCrud("/api/process", EMPTY);
  const [lang, setLang] = useState("fr");

  return (
    <div>
      <PageHeader icon="⚙️" title="Processus"
        subtitle={`${items.length} étape${items.length!==1?"s":""} — section « Notre Processus » du site`}
        actions={<>
          <Button variant="ghost" onClick={load} disabled={loading}>{loading ? <Spinner size={14} /> : "↺"} Actualiser</Button>
          <Button variant="primary" onClick={startCreate}>+ Nouvelle étape</Button>
        </>}
      />
      {error && <Alert type="error">{error}</Alert>}

      <div style={{ display:"grid", gridTemplateColumns: editing ? "1fr 1fr" : "1fr", gap:20 }}>
        {editing && (
          <Card>
            <SectionHeading title={isEdit ? "Modifier l'étape" : "Nouvelle étape"} subtitle="Remplissez les champs dans les deux langues" />
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {LANG_TABS.map(tab => (
                <button key={tab.code} onClick={() => setLang(tab.code)} style={{ padding:"7px 16px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12, cursor:"pointer", border:"1px solid", borderColor: lang===tab.code?"var(--color-primary)":"rgba(255,255,255,0.12)", background: lang===tab.code?"rgba(245,91,31,0.15)":"rgba(255,255,255,0.04)", color: lang===tab.code?"var(--color-primary)":"#aaa" }}>{tab.label}</button>
              ))}
            </div>
            <Field label="Ordre d'affichage">
              <Input type="number" value={form.order || 1} onChange={e => patch("order", Number(e.target.value))} placeholder="1" />
            </Field>
            <Field label={`Titre — ${lang==="fr"?"Français":"English"}`}>
              <Input value={form[`title_${lang}`]||""} onChange={e => patch(`title_${lang}`, e.target.value)} placeholder={lang==="fr"?"Ex: Analyse & Planification":"Ex: Analysis & Planning"} />
            </Field>
            <Field label={`Description — ${lang==="fr"?"Français":"English"}`}>
              <Textarea value={form[`desc_${lang}`]||""} onChange={e => patch(`desc_${lang}`, e.target.value)} placeholder={lang==="fr"?"Décrivez cette étape…":"Describe this step…"} rows={4} />
            </Field>
            <Field label="Icône" hint="emoji">
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <Input value={form.icon || ""} onChange={e => patch("icon", e.target.value)} placeholder="⚙️" />
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {ICON_SUGGESTIONS.map(ic => (
                    <button key={ic} onClick={() => patch("icon", ic)} style={{ width:34, height:34, borderRadius:8, fontSize:18, border: form.icon === ic ? "2px solid var(--color-primary)" : "1px solid rgba(255,255,255,0.10)", background: form.icon === ic ? "rgba(245,91,31,0.15)" : "rgba(255,255,255,0.04)", cursor:"pointer" }}>{ic}</button>
                  ))}
                </div>
              </div>
            </Field>

            <div style={{ marginTop:4, marginBottom:16, padding:"14px 16px", borderRadius:12, background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:11, color:"#555", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:10 }}>Aperçu</div>
              <div style={{ display:"flex", gap:16 }}>
                <div style={{ width:52, height:52, flexShrink:0, borderRadius:10, background:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:16 }}>{form.icon || `0${form.order||1}`}</div>
                <div>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:15 }}>{form[`title_${lang}`] || "Titre de l'étape"}</div>
                  <div style={{ color:"#666", fontSize:13, marginTop:4, lineHeight:1.5 }}>{(form[`desc_${lang}`] || "Description…").slice(0, 80)}{(form[`desc_${lang}`] || "").length > 80 ? "…" : ""}</div>
                </div>
              </div>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <Button variant="primary" onClick={save} disabled={saving || (!form.title_fr && !form.title_en)}>
                {saving ? <><Spinner size={14} /> Sauvegarde…</> : (isEdit ? "💾 Mettre à jour" : "✚ Créer")}
              </Button>
              <Button variant="ghost" onClick={cancel}>Annuler</Button>
            </div>
          </Card>
        )}

        <Card>
          <SectionHeading title="Étapes du processus" subtitle={loading ? "Chargement…" : `${items.length} étape${items.length!==1?"s":""} (triées par ordre)`} />
          {loading ? <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner size={28} /></div>
          : items.length === 0 ? <EmptyState icon="⚙️" title="Aucune étape" message="Cliquez sur « Nouvelle étape » pour commencer." />
          : [...items].sort((a,b) => (a.order||0)-(b.order||0)).map(doc => (
            <ListItem key={doc._id} active={editing?._id === doc._id}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start", flex:1, minWidth:0 }}>
                <div style={{ width:40, height:40, borderRadius:8, background:"var(--color-dark, #121315)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:18, flexShrink:0 }}>{doc.icon || `0${doc.order||"?"}`}</div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14, marginBottom:3 }}>
                    {doc.title_fr || "—"} {doc.title_en && <span style={{ color:"#555", fontWeight:400, fontSize:12 }}>/ {doc.title_en}</span>}
                  </div>
                  <div style={{ color:"#666", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:280 }}>{doc.desc_fr || ""}</div>
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