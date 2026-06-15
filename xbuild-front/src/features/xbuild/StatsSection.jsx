import { useTranslation } from "react-i18next";
import { STATIC_STATS } from "./data";
import { useCountUp, useIntersect } from "./hooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

export default function StatsSection({ info }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [ref, visible] = useIntersect();

  // Use dynamic statsItems from info if available, else STATIC_STATS
  const statsItems = info.statsItems && info.statsItems.length > 0
    ? info.statsItems
    : STATIC_STATS.map((s, i) => ({
        value: String(s.value),
        suffix: s.suffix,
        label_fr: t(`stats.items.${i}.label`, { defaultValue: s.label || "" }),
        label_en: t(`stats.items.${i}.label`, { defaultValue: s.label || "" }),
      }));

  // Animated counts
  const counts = statsItems.map(s => useCountUp(parseFloat(s.value) || 0, 2000, visible));

  // Dynamic badges or fallback
  const badges = info.statsBadges && info.statsBadges.length > 0
    ? info.statsBadges
    : [
        { icon:"🏅", label_fr:"Certifié ISO",      label_en:"ISO Certified" },
        { icon:"🕐", label_fr:"Support 24/7",      label_en:"24/7 Support" },
        { icon:"👷", label_fr:"Équipe d'Experts",  label_en:"Expert Team" },
        { icon:"🛡️", label_fr:"Sûr & Sécurisé",   label_en:"Safe & Secure" },
      ];

  // Dynamic texts
  const sectionTag   = loc(info, "statsTag",   lang) || t("stats.tag");
  const sectionTitle = loc(info, "statsTitle", lang) || t("stats.title");
  const sectionDesc  = loc(info, "statsDesc",  lang) || t("stats.description", { years: info.yearsExperience, company: info.companyName });

  return (
    <section ref={ref} style={{ padding:"80px 0", background:"var(--color-dark, #121315)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, opacity:0.05 }}>
        <svg width="100%" height="100%"><defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-primary)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid2)"/></svg>
      </div>

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px" }}>
        <div className="stats-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>

          {/* Left — textes + compteurs */}
          <div>
            <SectionTitle tag={sectionTag} title={sectionTitle} dark />
            <p style={{ color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:16, lineHeight:1.8, marginBottom:40 }}>
              {sectionDesc}
            </p>

            <div className="stats-counts" style={{ display:"flex", gap:40, marginBottom:40, flexWrap:"wrap" }}>
              {statsItems.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize:40, fontWeight:900, color:"var(--color-primary)", fontFamily:"'DM Sans',sans-serif" }}>
                    {counts[i]}{s.suffix}
                  </div>
                  <div style={{ color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>
                    {s[`label_${lang}`] || s.label_fr}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior:"smooth" })}
              style={{ background:"var(--color-primary)", color:"#fff", border:"none", padding:"14px 32px", borderRadius:4, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
            >
              {t("stats.learnMore")}
            </button>
          </div>

          {/* Right — image ou badges */}
          <div style={{ opacity: visible?1:0, transform: visible?"none":"translateX(40px)", transition:"all 0.8s 0.2s" }}>
            {info.statsImage ? (
              <div style={{ borderRadius:16, overflow:"hidden", height:360 }}>
                <img src={info.statsImage} alt="Stats" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
            ) : (
              <div style={{ borderRadius:16, overflow:"hidden", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", padding:32 }}>
                <div style={{ fontSize:80, textAlign:"center", marginBottom:24 }}>🏭</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {badges.map((b, i) => (
                    <div key={i} style={{ background:"rgba(245,91,31,0.1)", border:"1px solid rgba(245,91,31,0.2)", borderRadius:8, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:20 }}>{b.icon}</span>
                      <span style={{ color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600 }}>
                        {b[`label_${lang}`] || b.label_fr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
