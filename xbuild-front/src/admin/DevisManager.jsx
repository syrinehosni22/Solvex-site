import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useInfo } from "../features/xbuild/apiHooks";
import { Alert, Button, Card, EmptyState, Field, Input, PageHeader, Spinner, Textarea } from "./components/UI";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString("fr-FR", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";

const STATUS = {
  new:       { label:"Nouveau",      color:"#f55b1f", bg:"rgba(245,91,31,0.12)" },
  read:      { label:"Lu",           color:"#8e95a3", bg:"rgba(142,149,163,0.10)" },
  replied:   { label:"Répondu",      color:"#10b981", bg:"rgba(16,185,129,0.12)" },
  scheduled: { label:"RDV planifié", color:"#06b6d4", bg:"rgba(6,182,212,0.12)" },
  closed:    { label:"Clôturé",      color:"#6b7280", bg:"rgba(107,114,128,0.10)" },
};

const GLOBAL_CSS = `
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:none; } }

  /* ── layout liste/détail ── */
  .dv-layout                { display: grid; grid-template-columns: 1fr; gap: 16px; align-items: start; }
  .dv-layout.dv-split       { grid-template-columns: 1fr 1fr; }
  .dv-detail-sticky         { position: sticky; top: 16px; }

  /* ── info grid dans le détail ── */
  .dv-info-grid             { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }

  /* ── modal ── */
  .dv-modal-overlay         { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,0.85);
                              backdrop-filter:blur(4px); display:flex;
                              align-items:center; justify-content:center; padding:16px; }
  .dv-modal-box             { border-radius:20px; max-width:520px; width:100%; max-height:88vh;
                              display:flex; flex-direction:column; overflow:hidden; animation:slideUp 0.22s ease; }
  .dv-modal-body            { padding:18px 22px 22px; overflow-y:auto; flex:1; }
  .dv-modal-header          { padding:18px 22px 14px; border-bottom:1px solid rgba(255,255,255,0.07);
                              display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-shrink:0; }
  .dv-date-grid             { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .dv-back-btn              { display:none; }
  .dv-actions-row           { display:flex; gap:8px; margin-top:6px; }

  /* ── MOBILE ── */
  @media (max-width: 700px) {
    .dv-layout.dv-split       { grid-template-columns: 1fr !important; }
    /* sur mobile avec détail ouvert → cacher la liste */
    .dv-layout.dv-split .dv-list-card  { display: none !important; }
    .dv-detail-sticky         { position: static !important; }
    .dv-info-grid             { grid-template-columns: 1fr !important; }
    .dv-modal-overlay         { align-items: flex-end !important; padding: 0 !important; }
    .dv-modal-box             { border-radius: 16px 16px 0 0 !important; max-width:100% !important; max-height:92vh !important; }
    .dv-modal-body            { padding: 14px 16px 20px !important; }
    .dv-modal-header          { padding: 14px 16px 12px !important; }
    .dv-date-grid             { grid-template-columns: 1fr !important; }
    .dv-back-btn              { display: flex !important; }
    .dv-actions-row           { flex-direction: column !important; }
  }
`;

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.new;
  return (
    <span style={{ padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:800,
      color:s.color, background:s.bg, border:`1px solid ${s.color}30`, whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
}

/* ── Modal ── */
function ResponseModal({ message, mode, onClose, onSent, info }) {
  const company = info?.companyName || "XBuild";
  const isReply = mode === "reply";
  const accent  = isReply ? "#10b981" : "#06b6d4";

  const [form,     setForm]    = useState(isReply ? { objet:"", corps:"" } : { date:"", heure:"", lieu:"", duree:"60", notes:"" });
  const [sending,  setSending] = useState(false);
  const [error,    setError]   = useState("");
  const [fieldErr, setFldErr]  = useState({});

  const patch = (k, v) => { setForm(f=>({...f,[k]:v})); setFldErr(fe=>({...fe,[k]:false})); };

  const buildBody = () => isReply
    ? encodeURIComponent(`Bonjour ${message.name},\n\nMerci pour votre message${message.subject?` concernant "${message.subject}"`:""}.\n\n${form.corps}\n\nCordialement,\nL'équipe ${company}`)
    : encodeURIComponent(`Bonjour ${message.name},\n\nRDV proposé :\n📅 ${form.date}  ⏰ ${form.heure}\n📍 ${form.lieu}  ⏱ ${form.duree} min\n${form.notes?`\n${form.notes}\n`:""}\nCordialement,\nL'équipe ${company}`);

  const handleSend = async () => {
    if (isReply && !form.corps.trim()) { setFldErr({corps:true}); setError("Veuillez rédiger votre réponse."); return; }
    if (!isReply) {
      const m = { date:!form.date.trim(), heure:!form.heure.trim(), lieu:!form.lieu.trim() };
      if (m.date||m.heure||m.lieu) { setFldErr(m); setError("Champs obligatoires manquants."); return; }
    }
    setFldErr({}); setSending(true); setError("");
    try {
      const newStatus = isReply ? "replied" : "scheduled";
      await apiFetch(`/api/contact/${message._id}/status`, {
        method:"PUT", auth:true,
        body: JSON.stringify({ status:newStatus, response:{ mode, form, sentAt:new Date().toISOString() } }),
      });
      onSent(message._id, newStatus);
      const subj = isReply
        ? encodeURIComponent(`Re: ${message.subject||"Votre message"} — ${company}`)
        : encodeURIComponent(`Proposition de rendez-vous — ${company}`);
      window.open(`mailto:${message.email}?subject=${subj}&body=${buildBody()}`, "_blank");
      onClose();
    } catch(e) { setError(e.message); }
    finally { setSending(false); }
  };

  return (
    <div className="dv-modal-overlay" onClick={onClose}>
      <div className="dv-modal-box" style={{ background:"#131519", border:`1px solid ${accent}25` }} onClick={e=>e.stopPropagation()}>
        <div className="dv-modal-header" style={{ background:`linear-gradient(135deg,${accent}0d,transparent)` }}>
          <div style={{ minWidth:0 }}>
            <h3 style={{ margin:0, fontSize:16, fontWeight:900, color:"#fff", fontFamily:"'DM Sans',sans-serif" }}>
              {isReply ? "✉️ Répondre" : "🗓️ Proposer un RDV"}
            </h3>
            <p style={{ margin:"3px 0 0", fontSize:12, color:"#666", fontFamily:"'DM Sans',sans-serif",
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              Pour <strong style={{color:"#ccc"}}>{message.name}</strong> · {message.email}
            </p>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:"1px solid rgba(255,255,255,0.12)",
            background:"rgba(255,255,255,0.06)", color:"#888", cursor:"pointer", fontSize:15, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        <div className="dv-modal-body">
          {error && <Alert type="error">{error}</Alert>}

          <div style={{ padding:"10px 12px", borderRadius:10, background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)", marginBottom:14 }}>
            <div style={{ fontSize:10, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>
              Message original
            </div>
            {message.subject && <div style={{ color:"var(--color-primary,#0A1684)", fontWeight:700, fontSize:12, marginBottom:3 }}>{message.subject}</div>}
            <div style={{ color:"#aaa", fontSize:12, lineHeight:1.6, maxHeight:70, overflowY:"auto" }}>{message.message}</div>
          </div>

          {isReply ? (
            <>
              <Field label="Objet (optionnel)">
                <Input value={form.objet} onChange={e=>patch("objet",e.target.value)} placeholder={`Re: ${message.subject||"Votre message"}`} />
              </Field>
              <Field label="Votre réponse *">
                <Textarea value={form.corps} onChange={e=>patch("corps",e.target.value)} rows={6}
                  placeholder="Bonjour,\n\nMerci pour votre message…" error={fieldErr.corps} />
              </Field>
            </>
          ) : (
            <>
              <div className="dv-date-grid">
                <Field label="Date *"><Input value={form.date} onChange={e=>patch("date",e.target.value)} type="date" error={fieldErr.date} /></Field>
                <Field label="Heure *"><Input value={form.heure} onChange={e=>patch("heure",e.target.value)} type="time" error={fieldErr.heure} /></Field>
              </div>
              <Field label="Lieu *">
                <Input value={form.lieu} onChange={e=>patch("lieu",e.target.value)} placeholder="123 Rue Hassan II" error={fieldErr.lieu} />
              </Field>
              <Field label="Durée">
                <select value={form.duree} onChange={e=>patch("duree",e.target.value)} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1px solid rgba(255,255,255,0.10)", background:"rgba(0,0,0,0.28)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:"none" }}>
                  {["30","60","90","120","180"].map(d=><option key={d} value={d}>{d} min</option>)}
                </select>
              </Field>
              <Field label="Notes (optionnel)">
                <Textarea value={form.notes} onChange={e=>patch("notes",e.target.value)} rows={3} placeholder="Informations complémentaires…" />
              </Field>
            </>
          )}

          <div className="dv-actions-row">
            <button onClick={handleSend} disabled={sending} style={{
              flex:1, padding:"13px", borderRadius:10, border:"none",
              cursor:sending?"not-allowed":"pointer", fontWeight:900, fontSize:13,
              background:sending?"#333":accent, color:"#fff", fontFamily:"'DM Sans',sans-serif",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {sending
                ? <><span style={{display:"inline-block",width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.7s linear infinite"}} /> Envoi…</>
                : isReply ? "✉️ Ouvrir dans la messagerie" : "🗓️ Envoyer la proposition"
              }
            </button>
            <button onClick={onClose} style={{ padding:"13px 18px", borderRadius:10, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:"#888", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:13 }}>
              Annuler
            </button>
          </div>
          <p style={{ textAlign:"center", marginTop:10, color:"#444", fontSize:11, lineHeight:1.5 }}>
            ℹ️ Un brouillon s'ouvrira dans votre messagerie.
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
  const [modal,    setModal]    = useState(null);
  const [filter,   setFilter]   = useState("all");

  const load = async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/contact", { auth:true })); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await apiFetch(`/api/contact/${id}/read`, { method:"PUT", auth:true });
      setItems(it => it.map(i => i._id===id ? {...i, read:true, status:i.status||"read"} : i));
      setSelected(s => s?._id===id ? {...s, read:true, status:s.status||"read"} : s);
    } catch {}
  };

  const selectMessage = (doc) => {
    setSelected(doc);
    if (!doc.read) markRead(doc._id);
  };

  const onResponseSent = (id, newStatus) => {
    setItems(it => it.map(i => i._id===id ? {...i, status:newStatus, read:true} : i));
    setSelected(s => s?._id===id ? {...s, status:newStatus, read:true} : s);
  };

  const filtered = items.filter(i => {
    if (filter==="unread")    return !i.read;
    if (filter==="replied")   return i.status==="replied";
    if (filter==="scheduled") return i.status==="scheduled";
    return true;
  });

  const counts = {
    all:       items.length,
    unread:    items.filter(i=>!i.read).length,
    replied:   items.filter(i=>i.status==="replied").length,
    scheduled: items.filter(i=>i.status==="scheduled").length,
  };

  return (
    <div>
      <style>{GLOBAL_CSS}</style>

      <PageHeader icon="✉️" title="Messages de contact"
        subtitle={`${counts.unread>0?`${counts.unread} non lu${counts.unread>1?"s":""} · `:""}${items.length} message${items.length!==1?"s":""}`}
        actions={<Button variant="ghost" onClick={load} disabled={loading}>{loading?<Spinner size={14}/>:"↺"} Actualiser</Button>}
      />
      {error && <Alert type="error">{error}</Alert>}

      {/* Filtres */}
      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {[
          { key:"all",       label:`Tous (${counts.all})` },
          { key:"unread",    label:`Non lus (${counts.unread})` },
          { key:"replied",   label:`Répondus (${counts.replied})` },
          { key:"scheduled", label:`RDV (${counts.scheduled})` },
        ].map(f => (
          <button key={f.key} onClick={()=>setFilter(f.key)} style={{
            padding:"6px 12px", borderRadius:20, fontFamily:"'DM Sans',sans-serif",
            fontWeight:700, fontSize:11, cursor:"pointer", border:"1px solid",
            borderColor: filter===f.key?"var(--color-primary,#0A1684)":"rgba(255,255,255,0.12)",
            background:  filter===f.key?"rgba(10,22,132,0.15)":"rgba(255,255,255,0.04)",
            color:       filter===f.key?"var(--color-primary,#0A1684)":"#8e95a3",
          }}>{f.label}</button>
        ))}
      </div>

      <div className={`dv-layout ${selected ? "dv-split" : ""}`}>

        {/* ── Détail ── */}
        {selected && (
          <div className="dv-detail-sticky">
            <Card>
              {/* Bouton retour mobile */}
              <button className="dv-back-btn" onClick={()=>setSelected(null)} style={{
                alignItems:"center", gap:5, background:"none", border:"none",
                color:"#666", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                fontSize:12, padding:"0 0 10px", marginLeft:-2 }}>
                ← Retour à la liste
              </button>

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, gap:8 }}>
                <div style={{ minWidth:0 }}>
                  <h3 style={{ margin:"0 0 5px", color:"#fff", fontWeight:900, fontSize:16,
                    fontFamily:"'DM Sans',sans-serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {selected.name}
                  </h3>
                  <StatusBadge status={selected.status||(selected.read?"read":"new")} />
                </div>
                <button onClick={()=>setSelected(null)} style={{ width:30, height:30, borderRadius:8,
                  border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.06)",
                  color:"#666", cursor:"pointer", fontSize:14, flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
              </div>

              {/* Infos */}
              <div className="dv-info-grid">
                {[
                  { label:"Email",     value:selected.email },
                  { label:"Téléphone", value:selected.phone },
                  { label:"Sujet",     value:selected.subject },
                  { label:"Reçu le",   value:fmtDate(selected.sentAt) },
                ].filter(f=>f.value).map(f => (
                  <div key={f.label} style={{ padding:"9px 11px", borderRadius:8,
                    background:"rgba(0,0,0,0.2)", border:"1px solid rgba(255,255,255,0.07)", minWidth:0 }}>
                    <div style={{ fontSize:10, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{f.label}</div>
                    <div style={{ color:"#ccc", fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Message */}
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:10, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Message</div>
                <div style={{ color:"#aaa", fontSize:13, lineHeight:1.7, background:"rgba(0,0,0,0.2)",
                  padding:"11px 13px", borderRadius:10, border:"1px solid rgba(255,255,255,0.07)",
                  maxHeight:130, overflowY:"auto" }}>
                  {selected.message||"—"}
                </div>
              </div>

              {/* Historique */}
              {selected.response && (
                <div style={{ marginBottom:14, padding:"10px 12px", borderRadius:10,
                  background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)" }}>
                  <div style={{ fontSize:10, fontWeight:800, color:"#10b981", textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>
                    {selected.response.mode==="reply"?"✅ Répondu":"✅ RDV planifié"} le {fmtDate(selected.response.sentAt)}
                  </div>
                  {selected.response.mode==="schedule" && selected.response.form && (
                    <div style={{ color:"#aaa", fontSize:12 }}>
                      📅 {selected.response.form.date} à {selected.response.form.heure} · 📍 {selected.response.form.lieu}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ fontSize:10, fontWeight:800, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>Répondre par</div>
                {[
                  { mode:"reply",    icon:"✉️", label:"Envoyer une réponse",    sub:"Réponse libre par email", accent:"#10b981" },
                  { mode:"schedule", icon:"🗓️", label:"Proposer un rendez-vous", sub:"Date, heure, lieu",       accent:"#06b6d4" },
                ].map(a => (
                  <button key={a.mode} onClick={()=>setModal(a.mode)} style={{
                    padding:"11px 14px", borderRadius:10, width:"100%", textAlign:"left",
                    border:`1px solid ${a.accent}30`, background:`${a.accent}10`,
                    color:a.accent, fontFamily:"'DM Sans',sans-serif", fontWeight:800,
                    fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:17, flexShrink:0 }}>{a.icon}</span>
                    <div style={{ minWidth:0 }}>
                      <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.label}</div>
                      <div style={{ fontSize:11, opacity:0.65, fontWeight:400 }}>{a.sub}</div>
                    </div>
                    <span style={{ marginLeft:"auto" }}>→</span>
                  </button>
                ))}
                <div style={{ display:"flex", gap:8, marginTop:2, flexWrap:"wrap" }}>
                  {!selected.read && (
                    <Button variant="ghost" onClick={()=>markRead(selected._id)}>✓ Marquer lu</Button>
                  )}
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} style={{
                      display:"inline-flex", alignItems:"center", gap:5, padding:"9px 13px",
                      borderRadius:10, background:"rgba(255,255,255,0.06)", color:"#cfd2da",
                      fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:12,
                      textDecoration:"none", border:"1px solid rgba(255,255,255,0.1)" }}>
                      ✉️ Email direct
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── Liste ── */}
        <div className="dv-list-card">
          <Card>
            {loading
              ? <div style={{ display:"flex", justifyContent:"center", padding:40 }}><Spinner size={28}/></div>
              : filtered.length===0
                ? <EmptyState icon="✉️" title={filter==="all"?"Aucun message":"Aucun résultat"}
                    message={filter==="all"?"Les messages apparaîtront ici.":"Changez le filtre."} />
                : filtered.map(doc => {
                    const status = doc.status||(doc.read?"read":"new");
                    const isActive = selected?._id===doc._id;
                    return (
                      <div key={doc._id} onClick={()=>selectMessage(doc)} style={{
                        padding:"11px 12px", borderRadius:12, marginBottom:8, cursor:"pointer",
                        display:"flex", gap:10, alignItems:"flex-start",
                        border: isActive?"1px solid rgba(10,22,132,0.4)":"1px solid rgba(255,255,255,0.07)",
                        background: isActive?"rgba(10,22,132,0.08)":"rgba(0,0,0,0.18)",
                        transition:"background 0.15s" }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", marginTop:5, flexShrink:0,
                          background:!doc.read?"var(--color-primary,#0A1684)":"transparent" }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                            <span style={{ fontWeight:800, color:"#fff", fontSize:13 }}>{doc.name||"—"}</span>
                            <StatusBadge status={status} />
                          </div>
                          <div style={{ color:"#555", fontSize:11, marginBottom:2,
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.email}</div>
                          <div style={{ color:"#666", fontSize:11,
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {doc.subject?<span style={{ color:"#8e95a3", fontWeight:700 }}>[{doc.subject}] </span>:null}
                            {doc.message}
                          </div>
                        </div>
                        <div style={{ color:"#444", fontSize:10, flexShrink:0, paddingTop:2 }}>
                          {doc.sentAt?new Date(doc.sentAt).toLocaleDateString("fr-FR"):""}
                        </div>
                      </div>
                    );
                  })
            }
          </Card>
        </div>
      </div>

      {modal && selected && (
        <ResponseModal message={selected} mode={modal} info={info}
          onClose={()=>setModal(null)} onSent={onResponseSent} />
      )}
    </div>
  );
}