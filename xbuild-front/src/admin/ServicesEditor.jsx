import { useState } from "react";
import { useCrud } from "./components/useCrud";
import {
  Alert, Badge, Button, Card, EmptyState, Field, Input,
  ListItem, PageHeader, SectionHeading, Spinner, Textarea,
} from "./components/UI";
import { ImageUploader } from "./components/ImageUploader";

const EMPTY = { order: 1, title_fr: "", title_en: "", desc_fr: "", desc_en: "", features_fr: [], features_en: [], icon: "🏗️", color: "var(--color-primary, #0A1684)", image: "" };
const ICON_SUGGESTIONS = ["🏗️","🔨","🏛️","🧪","⚙️","🏠","🔧","🏢","🌉","⛏️","🔩","🛠️"];
const LANG_TABS = [{ code:"fr", label:"🇫🇷 Français" }, { code:"en", label:"🇬🇧 English" }];

const CSS = `
  .svc-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
  .svc-grid.has-form { grid-template-columns: 1fr 1fr; }
  @media (max-width: 768px) {
    .svc-grid.has-form { grid-template-columns: 1fr !important; }
  }
`;

export default function ServicesEditor() {
  const { items, loading, saving, error, editing, form, isEdit, load, startCreate, startEdit, cancel, save, remove, patch } = useCrud("/api/services", EMPTY);
  const [lang, setLang] = useState("fr");

  return (
    <div>
      <style>{CSS}</style>

      <PageHeader
        icon="🏗️"
        title="Services"
        subtitle={`${items.length} service${items.length !== 1 ? "s" : ""} — affichés sur la page d'accueil`}
        actions={<>
          <Button variant="ghost" onClick={load} disabled={loading}>{loading ? <Spinner size={14} /> : "↺"} Actualiser</Button>
          <Button variant="primary" onClick={startCreate}>+ Nouveau</Button>
        </>}
      />

      {error && <Alert type="error">{error}</Alert>}

      <div className={`svc-grid ${editing ? "has-form" : ""}`}>

        {/* ── Formulaire ── */}
        {editing && (
          <Card>
            <SectionHeading
              title={isEdit ? "Modifier le service" : "Nouveau service"}
              subtitle={isEdit ? `ID: ${editing._id}` : "Remplissez les champs dans les deux langues"}
            />

            <Field label="Ordre d'affichage" hint="Position (01, 02…)">
              <Input type="number" value={form.order || 1} onChange={e => patch("order", Number(e.target.value))} placeholder="1" />
            </Field>

            {/* Onglets langue */}
            <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
              {LANG_TABS.map(tab => (
                <button key={tab.code} onClick={() => setLang(tab.code)} style={{
                  padding:"6px 14px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12,
                  cursor:"pointer", border:"1px solid",
                  borderColor: lang === tab.code ? "var(--color-primary, #0A1684)" : "rgba(255,255,255,0.12)",
                  background:  lang === tab.code ? "rgba(10,22,132,0.15)" : "rgba(255,255,255,0.04)",
                  color:       lang === tab.code ? "var(--color-primary, #0A1684)" : "#aaa",
                }}>{tab.label}</button>
              ))}
            </div>

            <Field label={`Titre — ${lang === "fr" ? "Français" : "English"}`}>
              <Input
                value={form[`title_${lang}`] || ""}
                onChange={e => patch(`title_${lang}`, e.target.value)}
                placeholder={lang === "fr" ? "Ex: Planification des Bâtiments" : "Ex: Building Planning"}
              />
            </Field>

            <Field label={`Description — ${lang === "fr" ? "Français" : "English"}`}>
              <Textarea
                value={form[`desc_${lang}`] || ""}
                onChange={e => patch(`desc_${lang}`, e.target.value)}
                placeholder={lang === "fr" ? "Décrivez ce service…" : "Describe this service…"}
                rows={3}
              />
            </Field>

            <Field label={`Points forts — ${lang === "fr" ? "Français" : "English"}`} hint="un par ligne">
              <Textarea
                value={(form[`features_${lang}`] || []).join("\n")}
                onChange={e => patch(`features_${lang}`, e.target.value.split("\n").map(l => l.trim()).filter(Boolean))}
                placeholder={lang === "fr" ? "Études de faisabilité\nModélisation 2D/3D\nPlans détaillés" : "Feasibility studies\n2D/3D modeling\nDetailed plans"}
                rows={4}
              />
            </Field>

            <Field label="Icône" hint="emoji">
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <Input value={form.icon} onChange={e => patch("icon", e.target.value)} placeholder="🏗️" />
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {ICON_SUGGESTIONS.map(ic => (
                    <button key={ic} onClick={() => patch("icon", ic)} style={{
                      width:34, height:34, borderRadius:8, fontSize:18, cursor:"pointer",
                      border: form.icon === ic ? "2px solid var(--color-primary, #0A1684)" : "1px solid rgba(255,255,255,0.10)",
                      background: form.icon === ic ? "rgba(10,22,132,0.15)" : "rgba(255,255,255,0.04)",
                    }}>{ic}</button>
                  ))}
                </div>
              </div>
            </Field>

            <Field label="Image du service">
              <ImageUploader value={form.image || ""} onChange={v => patch("image", v)} />
            </Field>

            <Field label="Couleur" hint="hex ou var(…)">
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <Input value={form.color} onChange={e => patch("color", e.target.value)} placeholder="#0A1684" />
                <div style={{ width:36, height:36, borderRadius:8, background:form.color, border:"1px solid rgba(255,255,255,0.15)", flexShrink:0 }} />
              </div>
            </Field>

            {/* Aperçu */}
            <div style={{ marginBottom:16, padding:"14px", borderRadius:12, background:"rgba(0,0,0,0.25)", border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:10, color:"#555", fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:8 }}>Aperçu</div>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ fontSize:26, flexShrink:0 }}>{form.icon || "🏗️"}</span>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:800, color:"#fff", fontSize:14 }}>{form[`title_${lang}`] || "Titre"}</div>
                  <div style={{ color:"#666", fontSize:12, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {(form[`desc_${lang}`] || "Description…").slice(0, 60)}{(form[`desc_${lang}`] || "").length > 60 ? "…" : ""}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Button variant="primary" onClick={save} disabled={saving || (!form.title_fr && !form.title_en)}>
                {saving ? <><Spinner size={14} /> Sauvegarde…</> : (isEdit ? "💾 Mettre à jour" : "✚ Créer")}
              </Button>
              <Button variant="ghost" onClick={cancel}>Annuler</Button>
            </div>
          </Card>
        )}

        {/* ── Liste ── */}
        <Card>
          <SectionHeading
            title="Liste des services"
            subtitle={loading ? "Chargement…" : `${items.length} élément${items.length !== 1 ? "s" : ""}`}
          />
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner size={28} /></div>
          ) : items.length === 0 ? (
            <EmptyState icon="🏗️" title="Aucun service" message="Cliquez sur « + Nouveau » pour commencer." />
          ) : (
            items.map(doc => (
              <ListItem key={doc._id} active={editing?._id === doc._id}>
                <div style={{ display:"flex", gap:10, alignItems:"center", flex:1, minWidth:0 }}>
                  {doc.image
                    ? <img src={doc.image} alt="" style={{ width:38, height:38, borderRadius:8, objectFit:"cover", flexShrink:0 }} />
                    : <span style={{ fontSize:22, flexShrink:0 }}>{doc.icon}</span>
                  }
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontWeight:800, color:"#fff", fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {doc.title_fr || doc.title || "—"}
                    </div>
                    <div style={{ color:"#666", fontSize:11, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {doc.desc_fr || ""}
                    </div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                  <Button variant="ghost" onClick={() => startEdit(doc)}>✏️</Button>
                  <Button variant="danger" onClick={() => remove(doc)}>🗑️</Button>
                </div>
              </ListItem>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}