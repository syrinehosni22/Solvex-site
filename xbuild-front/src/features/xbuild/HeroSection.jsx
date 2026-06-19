import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loc } from "./helpers";

const FALLBACK_BG = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80";

export default function HeroSection({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [typed, setTyped] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const fullText = loc(info, "tagline", lang);
  const phoneHref = info.phone ? `tel:${info.phone.replace(/\s+/g, "")}` : "#";
  const bgImage = info.heroImage || FALLBACK_BG;

  useEffect(() => {
    setTyped("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) { setTyped(fullText.slice(0, i + 1)); i++; }
      else clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [fullText]);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const cycle = setInterval(() => setVisible(v => !v), 4000);
    return () => clearInterval(cycle);
  }, []);

  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  const heroStats = info.heroStats || {};
  const stats = [
    { value: heroStats.projects  || "45K+", label: t("hero.stats.projects"),   icon: "🏗️" },
    { value: heroStats.clients   || "25K+", label: t("hero.stats.clients"),    icon: "😊" },
    { value: `${info.yearsExperience}+`,    label: t("hero.stats.experience"), icon: "⭐" },
    { value: heroStats.engineers || "120+", label: t("hero.stats.engineers"),  icon: "👷" },
  ];

  const cs = { transition: "opacity 0.9s, transform 0.9s", opacity: visible ? 1 : 0, transform: visible ? "translateY(0px)" : "translateY(18px)" };
  const heroDesc = loc(info, "heroDesc", lang) || t("hero.description", { years: info.yearsExperience });

  return (
    <section id="home" style={{ minHeight: "100vh", position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes kenBurns{from{transform:scale(1)}to{transform:scale(1.09) translate(-1.5%,1%)}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(38px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeSlideLeft{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:translateX(0)}}
        @keyframes statReveal{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes accentDrop{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}

        /* ── Base button styles ── */
        .h-btn-primary{
          background:var(--color-primary, #0A1684);color:#fff;border:none;
          padding:16px 32px;font-weight:800;font-size:14px;letter-spacing:1px;
          text-transform:uppercase;cursor:pointer;font-family:'DM Sans',sans-serif;
          transition:background .25s,transform .22s,box-shadow .25s;
          text-decoration:none;display:inline-flex;align-items:center;
          justify-content:center;gap:10px;
          clip-path:polygon(0 0,calc(100% - 14px) 0,100% 100%,0 100%);
          white-space:nowrap;
        }
        .h-btn-primary:hover{background:#d94b10;transform:translateY(-3px);box-shadow:0 14px 36px rgba(245,91,31,.48)}
        .h-btn-secondary{
          background:transparent;color:#fff;border:2px solid rgba(255,255,255,.35);
          padding:14px 32px;font-weight:700;font-size:14px;letter-spacing:1px;
          text-transform:uppercase;cursor:pointer;font-family:'DM Sans',sans-serif;
          transition:border-color .25s,background .25s,transform .22s;
          white-space:nowrap;
        }
        .h-btn-secondary:hover{border-color:var(--color-primary, #0A1684);background:rgba(245,91,31,.12);transform:translateY(-3px)}
        .stat-card{transition:transform .3s,background .3s}.stat-card:hover{transform:translateY(-5px);background:rgba(255,255,255,.13)!important}

        /* ── Tablet (≤ 800px) ── */
        @media(max-width:800px){
          .hero-btns{gap:12px!important;flex-wrap:wrap!important;}
          .h-btn-primary,.h-btn-secondary{
            padding:13px 22px!important;
            font-size:13px!important;
          }
        }

        /* ── Mobile (≤ 480px) ── */
        @media(max-width:480px){
          .hero-btns{flex-direction:column!important;gap:12px!important;width:100%!important;}
          .h-btn-primary,.h-btn-secondary{
            width:100%!important;
            padding:15px 20px!important;
            font-size:14px!important;
            clip-path:none!important;
            justify-content:center!important;
            text-align:center!important;
          }
        }
      `}</style>

      <div style={{ position:"absolute", inset:0, backgroundImage:`url('${bgImage}')`, backgroundSize:"cover", backgroundPosition:"center", animation:"kenBurns 20s ease-in-out infinite alternate", transform:`translateY(${scrollY * 0.38}px)` }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(21deg,rgba(10, 10, 12, 0.34) 20%,rgba(10,10,14,.58) 60%)", transform:`translateY(${scrollY * 0.1}px)` }} />
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:5, background:"linear-gradient(to bottom,var(--color-primary, #0A1684),rgba(245,91,31,.25))", transformOrigin:"top", animation:"accentDrop 0.9s ease 0.1s both" }} />

      <div className="hero-content" style={{ position:"relative", flex:1, display:"flex", alignItems:"center", maxWidth:1200, margin:"0 auto", padding:"160px 48px 120px 64px", width:"100%", transform:`translateY(${scrollY * -0.07}px)` }}>
        <div style={{ maxWidth:640 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:12, marginBottom:28, animation:"fadeSlideLeft 0.75s ease 0.15s both" }}>
            <div style={{ width:3, height:20, background:"var(--color-primary, #0A1684)", flexShrink:0 }} />
            <span style={{ color:"var(--color-primary, #0A1684)", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:700, letterSpacing:3, textTransform:"uppercase" }}>
              {t("hero.welcome", { company: info.companyName })}
            </span>
          </div>
          <div style={{ ...cs, marginBottom:24 }}>
            <h1 style={{ fontSize:"clamp(38px,5vw,72px)", fontWeight:900, lineHeight:1.08, color:"#fff", fontFamily:"'DM Sans',sans-serif", margin:0, letterSpacing:-1, animation:"fadeSlideUp 0.9s ease 0.32s both" }}>
              {typed}<span style={{ color:"var(--color-primary, #0A1684)", animation:"blink 0.8s infinite" }}>|</span>
            </h1>
          </div>
          <div style={{ ...cs, transitionDelay: visible?"0.08s":"0s", marginBottom:44 }}>
            <p style={{ color:"rgba(255,255,255,.65)", fontFamily:"'DM Sans',sans-serif", fontSize:17, lineHeight:1.8, maxWidth:520, margin:0 }}>{heroDesc}</p>
          </div>
          <div className="hero-btns" style={{ ...cs, transitionDelay: visible?"0.24s":"0s", display:"flex", gap:16, flexWrap:"wrap", alignItems:"center" }}>
            <button className="h-btn-secondary" onClick={() => scrollTo("#services")}>{t("hero.ourServices")}</button>
            <a className="h-btn-primary" href={phoneHref}>
              <span style={{ fontSize:18 }}>📞</span>
              {info.phone || "Appelez-nous"}
            </a>
          </div>
        </div>
      </div>

      <div style={{ position:"relative", background:"var(--color-primary, #0A1684)", width:"100%" }}>
        <div className="hero-stats-bar" style={{ maxWidth:1200, margin:"0 auto", padding:"0 64px", display:"flex", alignItems:"stretch", flexWrap:"wrap" }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-card hero-stat-card" style={{ flex:1, padding:"28px 24px", display:"flex", alignItems:"center", gap:16, borderLeft: i===0?"none":"1px solid rgba(255,255,255,.2)", animation:`statReveal 0.7s ease ${0.92+i*0.13}s both` }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:"rgba(255,255,255,.2)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:22 }}>{s.icon}</span>
              </div>
              <div>
                <div style={{ fontSize:30, fontWeight:900, color:"#fff", fontFamily:"'DM Sans',sans-serif", lineHeight:1 }}>{s.value}</div>
                <div style={{ color:"rgba(255,255,255,.82)", fontFamily:"'DM Sans',sans-serif", fontSize:12, marginTop:4, textTransform:"uppercase", letterSpacing:1.2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}