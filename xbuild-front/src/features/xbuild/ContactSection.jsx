import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useIntersect } from "./hooks";
import SectionTitle from "./SectionTitle";

export default function ContactSection({ info }) {
  const { t } = useTranslation();
  const [ref, visible] = useIntersect();
  const [form, setForm] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState("");

  const phoneHref = info.phone ? `tel:${info.phone.replace(/\s+/g, "")}` : "#";

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setErrMsg(t("contact.errorRequired") || "Veuillez remplir les champs obligatoires (nom, email, message).");
      setStatus("error");
      return;
    }
    setStatus("sending"); setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sentAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setStatus("sent");
      setForm({ name:"", email:"", phone:"", subject:"", message:"" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (e) {
      setErrMsg(e.message || "Une erreur est survenue. Veuillez réessayer.");
      setStatus("error");
    }
  };

  const contactItems = [
    { icon:"📍", label: t("contact.location"), value: info.address },
    { icon:"✉️", label: t("contact.email"),    value: info.email },
    { icon:"📞", label: t("contact.phone"),    value: info.phone },
    { icon:"⏰", label: t("contact.hours"),    value: info.workingHours },
  ];

  return (
    <section id="contact" ref={ref} className="section-padding" style={{ padding:"100px 0", background:"#f8f8f8" }}>
      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ opacity: visible?1:0, transform: visible?"none":"translateY(30px)", transition:"all 0.7s" }}>
          <SectionTitle tag={t("contact.tag")} title={t("contact.title")} center />
        </div>
        <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:60, alignItems:"start" }}>

          {/* Left: infos + call button */}
          <div>
            <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:26, color:"var(--color-dark, #121315)", marginBottom:12 }}>{t("contact.subtitle")}</h3>
            <p style={{ color:"#666", fontFamily:"'DM Sans',sans-serif", lineHeight:1.8, marginBottom:40 }}>{t("contact.description")}</p>
            {contactItems.map((item, i) => (
              <div key={i} style={{ display:"flex", gap:20, alignItems:"flex-start", marginBottom:28, opacity: visible?1:0, transform: visible?"none":"translateX(-20px)", transition:`all 0.6s ${i*0.1+0.3}s` }}>
                <div style={{ width:50, height:50, borderRadius:10, background:"var(--color-primary, #0A1684)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <p style={{ color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:13, margin:0 }}>{item.label}</p>
                  <h4 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:16, color:"var(--color-dark, #121315)", margin:"4px 0 0" }}>{item.value}</h4>
                </div>
              </div>
            ))}

            {/* Call button */}
            <a href={phoneHref}
              style={{ display:"inline-flex", alignItems:"center", gap:12, background:"var(--color-primary, #0A1684)", color:"#fff", padding:"16px 32px", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:16, textDecoration:"none", boxShadow:"0 4px 20px rgba(10,22,132,0.35)", transition:"all 0.25s", marginTop:8 }}
              onMouseEnter={e => { e.currentTarget.style.background="var(--color-primary-dark, #091372)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="var(--color-primary, #0A1684)"; e.currentTarget.style.transform="none"; }}
            >
              <span style={{ fontSize:22 }}>📞</span>
              <span>{info.phone || t("contact.callUs") || "Appelez-nous"}</span>
            </a>
          </div>

          {/* Right: contact form */}
          <div style={{ background:"#fff", borderRadius:16, padding:40, boxShadow:"0 4px 40px rgba(0,0,0,0.08)", opacity: visible?1:0, transform: visible?"none":"translateX(40px)", transition:"all 0.8s 0.2s" }}>
            <h3 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:24, color:"var(--color-dark, #121315)", marginBottom:8 }}>
              {t("contact.formTitle") || "Envoyez-nous un message"}
            </h3>
            <p style={{ color:"#888", fontFamily:"'DM Sans',sans-serif", fontSize:14, lineHeight:1.6, marginBottom:24 }}>
              {t("contact.formSubtitle") || "Nous vous répondrons dans les plus brefs délais."}
            </p>

            {status === "sent" && (
              <div style={{ background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:8, padding:"14px 18px", marginBottom:20, color:"#16a34a", fontFamily:"'DM Sans',sans-serif", fontWeight:600, display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:20 }}>✅</span>
                {t("contact.success") || "Votre message a bien été envoyé ! Nous vous contacterons rapidement."}
              </div>
            )}
            {status === "error" && (
              <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:8, padding:"14px 18px", marginBottom:20, color:"#dc2626", fontFamily:"'DM Sans',sans-serif", fontWeight:600, display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ fontSize:18 }}>⚠️</span> {errMsg}
              </div>
            )}

            {/* Ligne Nom + Email */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:0 }}>
              <input type="text" placeholder={`${t("contact.name") || "Votre nom"} *`} value={form.name}
                onChange={e => { setForm({ ...form, name: e.target.value }); setStatus("idle"); }}
                style={{ width:"100%", padding:"14px 18px", marginBottom:14, border: status==="error" && !form.name ? "1px solid rgba(239,68,68,0.5)" : "1px solid #e0e0e0", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"var(--color-dark, #121315)", outline:"none", boxSizing:"border-box", background:"#f9f9f9" }}
              />
              <input type="email" placeholder={`${t("contact.emailField") || "Votre email"} *`} value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setStatus("idle"); }}
                style={{ width:"100%", padding:"14px 18px", marginBottom:14, border: status==="error" && !form.email ? "1px solid rgba(239,68,68,0.5)" : "1px solid #e0e0e0", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"var(--color-dark, #121315)", outline:"none", boxSizing:"border-box", background:"#f9f9f9" }}
              />
            </div>

            {/* Ligne Téléphone + Sujet */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <input type="tel" placeholder={t("contact.phoneField") || "Votre téléphone"} value={form.phone}
                onChange={e => { setForm({ ...form, phone: e.target.value }); setStatus("idle"); }}
                style={{ width:"100%", padding:"14px 18px", marginBottom:14, border:"1px solid #e0e0e0", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"var(--color-dark, #121315)", outline:"none", boxSizing:"border-box", background:"#f9f9f9" }}
              />
              <input type="text" placeholder={t("contact.subject") || "Sujet"} value={form.subject}
                onChange={e => { setForm({ ...form, subject: e.target.value }); setStatus("idle"); }}
                style={{ width:"100%", padding:"14px 18px", marginBottom:14, border:"1px solid #e0e0e0", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"var(--color-dark, #121315)", outline:"none", boxSizing:"border-box", background:"#f9f9f9" }}
              />
            </div>

            <textarea placeholder={`${t("contact.message") || "Votre message"} *`} value={form.message}
              onChange={e => { setForm({ ...form, message: e.target.value }); setStatus("idle"); }} rows={5}
              style={{ width:"100%", padding:"14px 18px", marginBottom:20, border: status==="error" && !form.message ? "1px solid rgba(239,68,68,0.5)" : "1px solid #e0e0e0", borderRadius:8, fontFamily:"'DM Sans',sans-serif", fontSize:15, color:"var(--color-dark, #121315)", outline:"none", resize:"vertical", boxSizing:"border-box", background:"#f9f9f9" }}
            />
            <button onClick={handleSubmit} disabled={status==="sending"}
              style={{ width:"100%", background: status==="sending" ? "#aaa" : "var(--color-primary, #0A1684)", color:"#fff", border:"none", padding:"16px 32px", borderRadius:8, fontWeight:800, fontSize:16, cursor: status==="sending" ? "not-allowed" : "pointer", fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"background 0.2s" }}
              onMouseEnter={e => { if(status!=="sending") e.currentTarget.style.background="var(--color-primary-dark, #091372)"; }}
              onMouseLeave={e => { if(status!=="sending") e.currentTarget.style.background="var(--color-primary, #0A1684)"; }}
            >
              {status === "sending" ? "⏳ Envoi en cours…" : `✉️ ${t("contact.send") || "Envoyer le message →"}`}
            </button>
            <p style={{ textAlign:"center", marginTop:14, color:"#aaa", fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>
              * Champs obligatoires — Ou appelez directement le <a href={phoneHref} style={{ color:"var(--color-primary, #0A1684)", fontWeight:700, textDecoration:"none" }}>{info.phone}</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}