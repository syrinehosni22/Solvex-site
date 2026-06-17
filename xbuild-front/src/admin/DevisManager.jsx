import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useInfo } from "../features/xbuild/apiHooks";
import { Alert, Button, Card, EmptyState, Field, Input, PageHeader, Spinner, Textarea } from "./components/UI";

/* ── helpers ── */
const fmtDate = (iso) => iso ? new Date(iso).toLocaleString("fr-FR", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";

const statusInfo = {
  new:       { label:"Nouveau",        color:"#f55b1f", bg:"rgba(245,91,31,0.12)" },
  read:      { label:"Lu",             color:"#8e95a3", bg:"rgba(142,149,163,0.10)" },
  replied:   { label:"Répondu",        color:"#10b981", bg:"rgba(16,185,129,0.12)" },
  scheduled: { label:"RDV planifié",   color:"#06b6d4", bg:"rgba(6,182,212,0.12)" },
  closed:    { label:"Clôturé",        color:"#6b7280", bg:"rgba(107,114,128,0.10)" },
};

function StatusBadge({ status }) {
  const s = statusInfo[status] || statusInfo.new;
  return (
    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:800, fontFamily:"'DM Sans',sans-serif", color:s.color, background:s.bg, border:`1px solid ${s.color}30`, whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
}

/* ── Modal réponse ── */
function ResponseModal({ message, mode, onClose, onSent, info }) {
  const companyName = info?.companyName || "XBuild";
  const [form, setForm] = useState(
    mode === "reply"
      ? { objet:"", corps:"" }
      : { date:"", heure:"", lieu:"", duree:"60", notes:"" }
  );
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const patch = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setFieldErrors(fe => (fe[k] ? { ...fe, [k]: false } : fe));
  };

  const buildEmailBody = () => {
    if (mode === "reply") {
      return encodeURIComponent(
`Bonjour ${message.name},

Merci pour votre message${message.subject ? ` concernant "${message.subject}"` : ""}.

${form.corps}

━━━━━━━━━━━━━━━━━━━━━━━━

Cordialement,
L'équipe ${companyName}`
      );
    } else {
      return encodeURIComponent(
`Bonjour ${message.name},

Suite à votre message, nous souhaitons planifier un rendez-vous :

━━━━━━━━━━━━━━━━━━━━━━━━
RENDEZ-VOUS
━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date : ${form.date}
⏰ Heure : ${form.heure}
📍 Lieu : ${form.lieu}
⏱ Durée estimée : ${form.duree} minutes

${form.notes ? `Notes :\n${form.notes}\n` : ""}━━━━━━━━━━━━━━━━━━━━━━━━

Merci de confirmer votre présence en répondant à cet email.

Cordialement,
L'équipe ${companyName}`
      );
    }
  };

  const handleSend = async () => {
    if (mode === "reply") {
      if (!String(form.corps ?? "").trim()) {
        setFieldErrors({ corps: true });
        setError("Veuillez rédiger votre réponse.");
        return;
      }
    } else {
      const missing = {
        date:  !String(form.date  ?? "").trim(),
        heure: !String(form.heure ?? "").trim(),
        lieu:  !String(form.lieu  ?? "").trim(),
      };
      if (missing.date || missing.heure || missing.lieu) {
        const labels = [];
        if (missing.date)  labels.push("Date");
        if (missing.heure) labels.push("Heure");
        if (missing.lieu)  labels.push("Lieu");
        setFieldErrors(missing);
        setError(`Champ${labels.length > 1 ? "s" : ""} obligatoire${labels.length > 1 ? "s" : ""} manquant${labels.length > 1 ? "s" : ""} : ${labels.join(", ")}.`);
        return;
      }
    }
    setFieldErrors({});
    setSending(true); setError("");
    try {
      const newStatus = mode === "reply" ? "replied" : "scheduled";
      await apiFetch(`/api/contact/${message._id}/status`, {
        method: "PUT", auth: true,
        body: JSON.stringify({ status: newStatus, response: { mode, form, sentAt: new Date().toISOString() } }),
      });
      onSent(message._id, newStatus);
      const subject = mode === "reply"
        ? encodeURIComponent(`Re: ${message.subject || "Votre message"} — ${companyName}`)
        : encodeURIComponent(`Proposition de rendez-vous — ${companyName}`);
      window.open(`mailto:${message.email}?subject=${subject}&body=${buildEmailBody()}`, "_blank");
      onClose();
    } catch (e) { setError(e.message); }
    finally { setSending(false); }
  };

  const isReply  = mode === "reply";
  const title    = isReply ? "✉️ Répondre au message" : "🗓️ Proposer un rendez-vous";
  const accent   = isReply ? "#10b981" : "#06b6d4";

  return (
    <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }} onClick={onClose}>
      <div style={{ background:"#131519", border:`1px solid ${accent}30`, borderRadius:20, maxWidth:560, width:"100%", boxShadow:`0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px ${accent}20`, overflow:"hidden", animation:"fadeUp 0.25s ease" }} onClick={e => e.stopPropagation()}>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }`}</style>

        {/* Header */}
        <div style={{ padding:"20px 24px 16px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center", background:`linear-gradient(135deg, ${accent}12, transparent)` }}>
          <div>
            <h3 style={{ margin:0, fontSize:18, fontWeight:900, color:"#fff", fontFamily:"'DM Sans',sans-serif" }}>{title}</h3>
            <p style={{ margin:"4px 0 0", fontSize:13, color:"#666", fontFamily:"'DM Sans',sans-serif" }}>
              Pour <strong style={{ color:"#ccc" }}>{message.name}</strong> · <span style={{ color:"#555" }}>{message.email}</span>
            </p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", color:"#888", width:34, height:34, borderRadius:8, cursor:"pointer", fontSize:16 }}>✕</button>
        </div>

        <div style={{ padding:"20px 24px 24px", maxHeight:"70vh", overflowY:"auto" }}>
          {error && <Alert type="error">{error}</Alert>}

          {/* Récap du message original */}
          <div style={{ padding:"12px 16px", borderRadius:10, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Message original</div>
            {message.subject && (
              <div style={{ color:"var(--color-primary, #0A1684)", fontWeight:700, fontSize:13, marginBottom:4 }}>{message.subject}</div>
            )}
            <div style={{ color:"#aaa", fontSize:13, fontFamily:"'DM Sans',sans-serif", lineHeight:1.6 }}>{message.message}</div>
          </div>

          {isReply ? (
            <>
              <Field label="Objet de votre réponse (optionnel)">
                <Input value={form.objet} onChange={e => patch("objet", e.target.value)} placeholder={`Re: ${message.subject || "Votre message"}`} type="text" />
              </Field>
              <Field label="Votre réponse *">
                <Textarea value={form.corps} onChange={e => patch("corps", e.target.value)} rows={7}
                  placeholder={"Bonjour,\n\nMerci pour votre message. Suite à votre demande…"} error={fieldErrors.corps} />
              </Field>
            </>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <Field label="Date *">
                  <Input value={form.date} onChange={e => patch("date", e.target.value)} type="date" error={fieldErrors.date} />
                </Field>
                <Field label="Heure *">
                  <Input value={form.heure} onChange={e => patch("heure", e.target.value)} type="time" error={fieldErrors.heure} />
                </Field>
              </div>
              <Field label="Lieu / Adresse *">
                <Input value={form.lieu} onChange={e => patch("lieu", e.target.value)} placeholder="123 Rue Hassan II, Casablanca" error={fieldErrors.lieu} />
              </Field>
              <Field label="Durée estimée (minutes)">
                <select value={form.duree} onChange={e => patch("duree", e.target.value)}
                  style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(0,0,0,0.28)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none" }}>
                  {["30","60","90","120","180"].map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </Field>
              <Field label="Notes supplémentaires (optionnel)">
                <Textarea value={form.notes} onChange={e => patch("notes", e.target.value)} rows={3}
                  placeholder="Informations complémentaires pour le rendez-vous…" />
              </Field>
            </>
          )}

          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <button onClick={handleSend} disabled={sending}
              style={{ flex:1, padding:"13px", borderRadius:10, border:"none", cursor: sending?"not-allowed":"pointer", fontWeight:900, fontSize:14, background: sending ? "rgba(0,0,0,0.3)" : accent, color:"#fff", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all 0.2s" }}>
              {sending
                ? <><div style={{ width:15, height:15, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> Enregistrement…</>
                : isReply ? "✉️ Ouvrir dans la messagerie" : "🗓️ Envoyer la proposition"
              }
            </button>
            <button onClick={onClose} style={{ padding:"13px 20px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)", color:"#888", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14 }}>
              Annuler
            </button>
          </div>
          <p style={{ textAlign:"center", marginTop:12, color:"#444", fontSize:12, fontFamily:"'DM Sans',sans-serif", lineHeight:1.5 }}>
            ℹ️ Un brouillon d'email s'ouvrira dans votre messagerie avec le contenu pré-rempli.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function DevisManager() {
  const info = useInfo();
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [selected, setSelected] = useState(null);
  const [modal,    setModal]    = useState(null); // "reply" | "schedule" | null
  const [filter,   setFilter]   = useState("all");

  const load = async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/contact", { auth:true })); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await apiFetch(`/api/contact/${id}/read`, { method:"PUT", auth:true });
      setItems(it => it.map(i => i._id===id ? {...i, read:true, status: i.status||"read"} : i));
    } catch {}
  };

  const onResponseSent = (id, newStatus) => {
    setItems(it => it.map(i => i._id===id ? {...i, status:newStatus, read:true} : i));
    setSelected(s => s?._id===id ? {...s, status:newStatus, read:true} : s);
  };

  const filtered = items.filter(i => {
    if (filter === "all")       return true;
    if (filter === "unread")    return !i.read;
    if (filter === "replied")   return i.status === "replied";
    if (filter === "scheduled") return i.status === "scheduled";
    return true;
  });

  const counts = {
    all:       items.length,
    unread:    items.filter(i => !i.read).length,
    replied:   items.filter(i => i.status === "replied").length,
    scheduled: items.filter(i => i.status === "scheduled").length,
  };

  return (
    <div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>

      <PageHeader
        icon="✉️"
        title="Messages de contact"
        subtitle={`${counts.unread > 0 ? `${counts.unread} non lu${counts.unread>1?"s":""} · ` : ""}${items.length} message${items.length!==1?"s":""} au total`}
        actions={<Button variant="ghost" onClick={load} disabled={loading}>{loading ? <Spinner size={14} /> : "↺"} Actualiser</Button>}
      />

      {error && <Alert type="error">{error}</Alert>}

      {/* Filtres */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {[
          { key:"all",       label:`Tous (${counts.all})` },
          { key:"unread",    label:`Non lus (${counts.unread})` },
          { key:"replied",   label:`Répondus (${counts.replied})` },
          { key:"scheduled", label:`RDV planifiés (${counts.scheduled})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding:"7px 16px", borderRadius:20, fontFamily:"'DM Sans',sans-serif",
            fontWeight:700, fontSize:12, cursor:"pointer", border:"1px solid",
            borderColor: filter===f.key ? "var(--color-primary, #0A1684)" : "rgba(255,255,255,0.12)",
            background:  filter===f.key ? "rgba(10,22,132,0.15)" : "rgba(255,255,255,0.04)",
            color:       filter===f.key ? "var(--color-primary, #0A1684)" : "#8e95a3",
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap:20 }}>

        {/* ── Détail + actions ── */}
        {selected && (
          <Card style={{ position:"sticky", top:20, alignSelf:"start" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div>
                <h3 style={{ margin:"0 0 6px", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:900, fontSize:18 }}>
                  {selected.name}
                </h3>
                <StatusBadge status={selected.status || (selected.read ? "read" : "new")} />
              </div>
              <Button variant="ghost" onClick={() => setSelected(null)}>✕</Button>
            </div>

            {/* Infos */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {[
                { label:"Email",    value: selected.email },
                { label:"Téléphone",value: selected.phone },
                { label:"Sujet",    value: selected.subject },
                { label:"Reçu le",  value: fmtDate(selected.sentAt) },
              ].map(f => f.value ? (
                <div key={f.label} style={{ padding:"10px 12px", borderRadius:8, background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.07)" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>{f.label}</div>
                  <div style={{ color:"#ccc", fontFamily:"'DM Sans',sans-serif", fontSize:13 }}>{f.value}</div>
                </div>
              ) : null)}
            </div>

            {/* Message */}
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Message</div>
              <div style={{ color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:14, lineHeight:1.7, background:"rgba(0,0,0,0.2)", padding:"14px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.07)", maxHeight:160, overflowY:"auto" }}>
                {selected.message || "—"}
              </div>
            </div>

            {/* Historique réponse */}
            {selected.response && (
              <div style={{ marginBottom:20, padding:"12px 14px", borderRadius:10, background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)" }}>
                <div style={{ fontSize:11, fontWeight:800, color:"#10b981", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>
                  {selected.response.mode === "reply" ? "✅ Répondu" : "✅ RDV planifié"} le {fmtDate(selected.response.sentAt)}
                </div>
                {selected.response.mode === "reply" && selected.response.form?.objet && (
                  <div style={{ color:"#aaa", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                    Objet : <strong style={{ color:"#fff" }}>{selected.response.form.objet}</strong>
                  </div>
                )}
                {selected.response.mode === "schedule" && (
                  <div style={{ color:"#aaa", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                    📅 {selected.response.form?.date} à {selected.response.form?.heure}
                    {" · "}📍 {selected.response.form?.lieu}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:11, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Répondre par</div>

              <button onClick={() => setModal("reply")}
                style={{ padding:"12px 16px", borderRadius:10, border:"1px solid rgba(16,185,129,0.3)", background:"rgba(16,185,129,0.10)", color:"#10b981", fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(16,185,129,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(16,185,129,0.10)"}
              >
                <span style={{ fontSize:20 }}>✉️</span>
                <div style={{ textAlign:"left" }}>
                  <div>Envoyer une réponse</div>
                  <div style={{ fontSize:12, opacity:0.7, fontWeight:400 }}>Réponse libre par email</div>
                </div>
                <span style={{ marginLeft:"auto" }}>→</span>
              </button>

              <button onClick={() => setModal("schedule")}
                style={{ padding:"12px 16px", borderRadius:10, border:"1px solid rgba(6,182,212,0.3)", background:"rgba(6,182,212,0.10)", color:"#06b6d4", fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:10, transition:"all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(6,182,212,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(6,182,212,0.10)"}
              >
                <span style={{ fontSize:20 }}>🗓️</span>
                <div style={{ textAlign:"left" }}>
                  <div>Proposer un rendez-vous</div>
                  <div style={{ fontSize:12, opacity:0.7, fontWeight:400 }}>Date, heure, lieu</div>
                </div>
                <span style={{ marginLeft:"auto" }}>→</span>
              </button>

              <div style={{ display:"flex", gap:8, marginTop:4 }}>
                {!selected.read && (
                  <Button variant="ghost" onClick={() => { markRead(selected._id); setSelected({...selected, read:true}); }}>
                    ✓ Marquer lu
                  </Button>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`}
                    style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.06)", color:"#cfd2da", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13, textDecoration:"none", border:"1px solid rgba(255,255,255,0.1)" }}>
                    ✉️ Email libre
                  </a>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ── Liste ── */}
        <Card>
          {loading
            ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner size={28} /></div>
            : filtered.length === 0
              ? <EmptyState icon="✉️" title={filter==="all" ? "Aucun message" : "Aucun résultat"} message={filter==="all" ? "Les messages de contact apparaîtront ici." : "Changez le filtre."} />
              : filtered.map(doc => {
                  const status = doc.status || (doc.read ? "read" : "new");
                  return (
                    <div key={doc._id}
                      onClick={() => { setSelected(doc); if(!doc.read) markRead(doc._id); }}
                      style={{ padding:"14px 16px", borderRadius:12, marginBottom:8, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, transition:"all 0.15s", border: selected?._id===doc._id ? "1px solid rgba(10,22,132,0.4)" : "1px solid rgba(255,255,255,0.07)", background: selected?._id===doc._id ? "rgba(10,22,132,0.08)" : "rgba(0,0,0,0.18)" }}
                      onMouseEnter={e => { if(selected?._id!==doc._id) e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
                      onMouseLeave={e => { if(selected?._id!==doc._id) e.currentTarget.style.background="rgba(0,0,0,0.18)"; }}
                    >
                      <div style={{ display:"flex", gap:10, flex:1, minWidth:0, alignItems:"flex-start" }}>
                        {/* Indicateur non-lu */}
                        <div style={{ width:8, height:8, borderRadius:"50%", background: !doc.read ? "var(--color-primary, #0A1684)" : "transparent", flexShrink:0, marginTop:5 }} />
                        <div style={{ minWidth:0, flex:1 }}>
                          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4, flexWrap:"wrap" }}>
                            <span style={{ fontWeight:800, color:"#fff", fontSize:14 }}>{doc.name||"—"}</span>
                            <StatusBadge status={status} />
                          </div>
                          <div style={{ color:"#555", fontSize:12, marginBottom:4 }}>{doc.email}</div>
                          <div style={{ color:"#666", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:300 }}>
                            {doc.subject ? <span style={{ color:"#8e95a3", fontWeight:700 }}>[{doc.subject}] </span> : null}{doc.message}
                          </div>
                        </div>
                      </div>
                      <div style={{ color:"#444", fontSize:11, flexShrink:0, textAlign:"right", paddingTop:2 }}>
                        {doc.sentAt ? new Date(doc.sentAt).toLocaleDateString("fr-FR") : ""}
                      </div>
                    </div>
                  );
                })
          }
        </Card>
      </div>

      {/* Modal réponse */}
      {modal && selected && (
        <ResponseModal
          message={selected}
          mode={modal}
          info={info}
          onClose={() => setModal(null)}
          onSent={onResponseSent}
        />
      )}
    </div>
  );
}