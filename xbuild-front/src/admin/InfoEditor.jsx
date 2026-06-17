import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Alert, Button, Card, Field, Input, PageHeader, SectionHeading, Spinner, Textarea } from "./components/UI";
import { INFO_DEFAULT } from "../features/xbuild/apiHooks";
import { ImageUploader } from "./components/ImageUploader";

const LANG_TABS = [{ code: "fr", label: "🇫🇷 Français" }, { code: "en", label: "🇬🇧 English" }];

/* ── Toggle ──────────────────────────────────────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, position: "relative", cursor: "pointer", background: value ? "var(--color-primary, #0A1684)" : "rgba(255,255,255,0.12)", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function InfoEditor() {
  const [form, setForm] = useState(INFO_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [lang, setLang] = useState("fr");

  // Password change state
  const [pwdForm, setPwdForm] = useState({ current: "", next: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    apiFetch("/api/info")
      .then(d => setForm({ ...INFO_DEFAULT, ...d, heroStats: { ...INFO_DEFAULT.heroStats, ...(d.heroStats || {}) } }))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const patch = (key, value) => { setForm(f => ({ ...f, [key]: value })); setDirty(true); setSuccess(false); };
  const patchStats = (key, value) => { setForm(f => ({ ...f, heroStats: { ...(f.heroStats || {}), [key]: value } })); setDirty(true); setSuccess(false); };

  const save = async () => {
    setSaving(true); setError(""); setSuccess(false);
    try {
      await apiFetch("/api/info", { method: "PUT", auth: true, body: JSON.stringify(form) });
      setSuccess(true); setDirty(false);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    setPwdError(""); setPwdSuccess(false);
    if (!pwdForm.current) { setPwdError("Entrez le mot de passe actuel."); return; }
    if (!pwdForm.next || pwdForm.next.length < 6) { setPwdError("Le nouveau mot de passe doit faire au moins 6 caractères."); return; }
    if (pwdForm.next !== pwdForm.confirm) { setPwdError("Les deux nouveaux mots de passe ne correspondent pas."); return; }
    setPwdSaving(true);
    try {
      // Verify current password by attempting login
      await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ password: pwdForm.current }) });
      // Change password via dedicated endpoint
      await apiFetch("/api/auth/change-password", { method: "POST", auth: true, body: JSON.stringify({ newPassword: pwdForm.next }) });
      setPwdSuccess(true);
      setPwdForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwdSuccess(false), 5000);
    } catch (e) {
      setPwdError(e.message === "Mot de passe incorrect" ? "Mot de passe actuel incorrect." : e.message);
    }
    finally { setPwdSaving(false); }
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><Spinner size={36} /></div>;

  const phoneHref = form.phone ? `tel:${form.phone.replace(/\s+/g, "")}` : "#";

  return (
    <div>
      <PageHeader icon="⚙️" title="Informations & Site"
        subtitle="Hero, À propos, images, coordonnées, réseaux sociaux, mot de passe"
        actions={
          <Button variant="primary" onClick={save} disabled={saving || !dirty}>
            {saving ? <><Spinner size={14} /> Sauvegarde…</> : "💾 Sauvegarder"}
          </Button>
        }
      />
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">Modifications enregistrées avec succès !</Alert>}

      {/* Lang tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {LANG_TABS.map(tab => (
          <button key={tab.code} onClick={() => setLang(tab.code)} style={{ padding: "7px 16px", borderRadius: 8, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer", border: "1px solid", borderColor: lang === tab.code ? "var(--color-primary, #0A1684)" : "rgba(255,255,255,0.12)", background: lang === tab.code ? "rgba(245,91,31,0.15)" : "rgba(255,255,255,0.04)", color: lang === tab.code ? "var(--color-primary, #0A1684)" : "#aaa" }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Identité ── */}
        <Card>
          <SectionHeading title="🏢 Identité de l'entreprise" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            <Field label="Nom de l'entreprise"><Input value={form.companyName || ""} onChange={e => patch("companyName", e.target.value)} placeholder="XBuild" /></Field>
            <Field label="Années d'expérience"><Input type="number" value={form.yearsExperience || ""} onChange={e => patch("yearsExperience", e.target.value)} placeholder="25" /></Field>
            <Field label="Nom du CEO"><Input value={form.ceoName || ""} onChange={e => patch("ceoName", e.target.value)} placeholder="Shikhon Islam" /></Field>
          </div>
          <Field label="🖼️ Logo Navbar / Admin" hint="Affiché dans la barre de navigation et le dashboard.">
            <ImageUploader value={form.logoImage || ""} onChange={v => patch("logoImage", v)} label="Logo Navbar" hint="Format PNG/SVG transparent recommandé. Hauteur affichée : 64px." />
            {!form.logoImage && (
              <div style={{ marginTop: 10, padding: "10px 16px", borderRadius: 8, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.07)", display: "inline-flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#aaa", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>Aperçu texte :</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
                  {(() => {
                    const n = form.companyName;
                    const m = n.match(/build/i);
                    const pre = m ? n.slice(0, m.index) : n.slice(0, -1);
                    const suf = m ? m[0] : n.slice(-1);
                    return <>{pre}<span style={{ color: "var(--color-primary, #0A1684)" }}>{suf}</span></>;
                  })()}
                </span>
              </div>
            )}
          </Field>
          <Field label="🖼️ Logo Footer" hint="Logo affiché dans le footer (section centrale). Si vide, utilise le logo navbar.">
            <ImageUploader value={form.footerLogoImage || ""} onChange={v => patch("footerLogoImage", v)} label="Logo Footer" hint="Recommandé : version blanche/claire du logo pour fond sombre. PNG transparent. Hauteur affichée : 88px." />
            {form.footerLogoImage && (
              <div style={{ marginTop: 12, padding: "16px 20px", borderRadius: 10, background: "var(--color-dark, #121315)", border: "1px solid rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 200 }}>
                <img src={form.footerLogoImage} alt="Footer logo preview" style={{ height: 56, width: "auto", maxWidth: 280, objectFit: "contain" }} />
              </div>
            )}
            {!form.footerLogoImage && (
              <div style={{ marginTop: 10, padding: "10px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", color: "#555", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
                Non défini — utilise le logo navbar par défaut.
              </div>
            )}
          </Field>
        </Card>

        {/* ── Hero Section ── */}
        <Card>
          <SectionHeading title="🎯 Hero Section" subtitle="Bannière principale du site" />
          <Field label={`Slogan — ${lang === "fr" ? "Français 🇫🇷" : "English 🇬🇧"}`}>
            <Input value={form[`tagline_${lang}`] || ""} onChange={e => patch(`tagline_${lang}`, e.target.value)} placeholder={lang === "fr" ? "Nous Construisons…" : "We Build…"} />
          </Field>
          <Field label={`Description Hero — ${lang === "fr" ? "Français 🇫🇷" : "English 🇬🇧"}`}>
            <Textarea value={form[`heroDesc_${lang}`] || ""} onChange={e => patch(`heroDesc_${lang}`, e.target.value)} rows={3} placeholder={lang === "fr" ? "Description sous le slogan…" : "Description under the tagline…"} />
          </Field>
          <Field label="📸 Image de fond (Hero)" hint="">
            <ImageUploader value={form.heroImage || ""} onChange={v => patch("heroImage", v)} label="Hero" hint="Image plein écran derrière le texte principal. Recommandé : 1920×1080px." />
          </Field>
          <SectionHeading title="📊 Statistiques Hero" subtitle="Chiffres dans la bande orange" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            <Field label="Projets réalisés"><Input value={form.heroStats?.projects || ""} onChange={e => patchStats("projects", e.target.value)} placeholder="45K+" /></Field>
            <Field label="Clients satisfaits"><Input value={form.heroStats?.clients || ""} onChange={e => patchStats("clients", e.target.value)} placeholder="25K+" /></Field>
            <Field label="Ingénieurs"><Input value={form.heroStats?.engineers || ""} onChange={e => patchStats("engineers", e.target.value)} placeholder="120+" /></Field>
          </div>
          {/* Stats preview */}
          <div style={{ padding: "14px 20px", borderRadius: 10, background: "var(--color-primary, #0A1684)", display: "flex", gap: 24, flexWrap: "wrap", marginTop: 4 }}>
            {[{ v: form.heroStats?.projects || "45K+", l: "Projets", ic: "🏗️" }, { v: form.heroStats?.clients || "25K+", l: "Clients", ic: "😊" }, { v: `${form.yearsExperience || 25}+`, l: "Ans", ic: "⭐" }, { v: form.heroStats?.engineers || "120+", l: "Ingénieurs", ic: "👷" }].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{s.ic}</span>
                <div><div style={{ color: "#fff", fontWeight: 900, fontSize: 20, lineHeight: 1 }}>{s.v}</div><div style={{ color: "rgba(255,255,255,0.8)", fontSize: 10 }}>{s.l}</div></div>
              </div>
            ))}
          </div>
        </Card>

        {/* ── À propos ── */}
        <Card>
          <SectionHeading title="📖 Section À Propos" />
          <Field label={`Texte À propos — ${lang === "fr" ? "Français 🇫🇷" : "English 🇬🇧"}`}>
            <Textarea value={form[`about_${lang}`] || ""} onChange={e => patch(`about_${lang}`, e.target.value)} placeholder={lang === "fr" ? "Décrivez votre entreprise…" : "Describe your company…"} rows={5} />
          </Field>
          <Field label={`Texte footer — ${lang === "fr" ? "Français 🇫🇷" : "English 🇬🇧"}`}>
            <Textarea value={form[`footerAbout_${lang}`] || ""} onChange={e => patch(`footerAbout_${lang}`, e.target.value)} rows={2} />
          </Field>
          <Field label="📸 Photo section À Propos">
            <ImageUploader value={form.aboutImage || ""} onChange={v => patch("aboutImage", v)} label="About" hint="Photo affichée à droite dans la section À Propos. Recommandé : 800×900px." />
          </Field>
        </Card>

        {/* ── Stats section ── */}
        <Card>
          <SectionHeading title="📊 Section Statistiques" />
          <Field label="📸 Photo section Statistiques">
            <ImageUploader value={form.statsImage || ""} onChange={v => patch("statsImage", v)} label="Stats" hint="Photo affichée à droite dans la section Chiffres clés. Recommandé : 800×600px." />
          </Field>
        </Card>

        {/* ── Coordonnées ── */}
        <Card>
          <SectionHeading title="📞 Coordonnées" subtitle="Le numéro de téléphone alimente le bouton d'appel sur tout le site" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {[{ key: "address", label: "Adresse", type: "text", ph: "4648 Rocky, New York" }, { key: "email", label: "Email", type: "email", ph: "example@gmail.com" }, { key: "phone", label: "📞 Téléphone (bouton appel)", type: "text", ph: "+88 0123 654 99" }, { key: "workingHours", label: "Heures d'ouverture", type: "text", ph: "Mon-Fri, 09am - 05pm" }].map(f => (
              <Field key={f.key} label={f.label}><Input type={f.type} value={form[f.key] || ""} onChange={e => patch(f.key, e.target.value)} placeholder={f.ph} /></Field>
            ))}
          </div>
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(245,91,31,0.08)", border: "1px solid rgba(245,91,31,0.2)", display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
            <span>📞</span>
            <span style={{ color: "#aaa", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Bouton d'appel → </span>
            <a href={phoneHref} style={{ color: "var(--color-primary, #0A1684)", fontWeight: 800, fontFamily: "'DM Sans',sans-serif", fontSize: 14, textDecoration: "none" }}>{form.phone || "—"}</a>
          </div>
        </Card>

        {/* ── Réseaux sociaux ── */}
        <Card>
          <SectionHeading title="🌐 Réseaux sociaux" subtitle="Toggle ON/OFF pour afficher ou masquer chaque réseau dans le footer" />
          {[{ key: "socialFacebook", label: "Facebook", icon: "📘" }, { key: "socialTwitter", label: "Twitter/X", icon: "🐦" }, { key: "socialYoutube", label: "YouTube", icon: "▶️" }, { key: "socialLinkedin", label: "LinkedIn", icon: "💼" }].map(s => (
            <div key={s.key} style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontWeight: 800, color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, flex: 1 }}>{s.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Toggle value={form[`${s.key}Active`] !== false} onChange={v => patch(`${s.key}Active`, v)} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: form[`${s.key}Active`] !== false ? "var(--color-primary, #0A1684)" : "#555", fontWeight: 600 }}>
                    {form[`${s.key}Active`] !== false ? "Affiché" : "Masqué"}
                  </span>
                </div>
              </div>
              <Input value={form[s.key] || ""} onChange={e => patch(s.key, e.target.value)} placeholder={`https://www.${s.label.toLowerCase().replace("/x", "")}.com/votre-profil`} />
            </div>
          ))}
        </Card>

        {/* ── Changer le mot de passe ── */}
        <Card>
          <SectionHeading title="🔐 Changer le mot de passe admin" subtitle="Modifiez ici le mot de passe de connexion au dashboard" />
          {pwdError && <Alert type="error">{pwdError}</Alert>}
          {pwdSuccess && <Alert type="success">Mot de passe mis à jour avec succès !</Alert>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            <Field label="Mot de passe actuel">
              <div style={{ position: "relative" }}>
                <Input type={showPwd ? "text" : "password"} value={pwdForm.current} onChange={e => setPwdForm(f => ({ ...f, current: e.target.value }))} placeholder="••••••••" />
                <button onClick={() => setShowPwd(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", fontSize: 16 }}>{showPwd ? "🙈" : "👁️"}</button>
              </div>
            </Field>
            <Field label="Nouveau mot de passe">
              <Input type={showPwd ? "text" : "password"} value={pwdForm.next} onChange={e => setPwdForm(f => ({ ...f, next: e.target.value }))} placeholder="Min. 6 caractères" />
            </Field>
            <Field label="Confirmer le nouveau">
              <Input type={showPwd ? "text" : "password"} value={pwdForm.confirm} onChange={e => setPwdForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Répétez le mot de passe" />
            </Field>
          </div>
          <div style={{ marginTop: 8 }}>
            <Button variant="outline" onClick={changePassword} disabled={pwdSaving || !pwdForm.current || !pwdForm.next}>
              {pwdSaving ? <><Spinner size={14} /> Mise à jour…</> : "🔐 Mettre à jour le mot de passe"}
            </Button>
          </div>
          <p style={{ color: "#444", fontSize: 12, fontFamily: "'DM Sans',sans-serif", marginTop: 10, lineHeight: 1.6 }}>
            ⚠️ Pour un changement permanent, mettez également à jour <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>ADMIN_PASSWORD</code> dans le fichier <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px", borderRadius: 4 }}>.env</code> du serveur.
          </p>
        </Card>
        <Card>
          <SectionHeading title="🎨 Couleurs du thème" subtitle="Appliquées immédiatement sur tout le site et l'admin" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            <Field label="Couleur principale">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={form.primaryColor || "#0A1684"} onChange={e => patch("primaryColor", e.target.value)}
                  style={{ width: 44, height: 40, padding: 0, border: "1px solid rgba(255,255,255,0.10)", borderRadius: 8, background: "transparent", cursor: "pointer" }} />
                <Input value={form.primaryColor || ""} onChange={e => patch("primaryColor", e.target.value)} placeholder="#0A1684" />
              </div>
            </Field>
            <Field label="Couleur sombre">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={form.darkColor || "#121315"} onChange={e => patch("darkColor", e.target.value)}
                  style={{ width: 44, height: 40, padding: 0, border: "1px solid rgba(255,255,255,0.10)", borderRadius: 8, background: "transparent", cursor: "pointer" }} />
                <Input value={form.darkColor || ""} onChange={e => patch("darkColor", e.target.value)} placeholder="#121315" />
              </div>
            </Field>
          </div>
        </Card>
      </div>

      {/* Floating save */}
      {dirty && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, background: "#0a0c0f", border: "1px solid rgba(245,91,31,0.3)", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <span style={{ color: "var(--color-primary, #0A1684)", fontSize: 13, fontWeight: 700 }}>⚠️ Non sauvegardé</span>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? <><Spinner size={14} /> …</> : "💾 Sauvegarder"}
          </Button>
        </div>
      )}
    </div>
  );
}