import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApiList, useInfo } from "./apiHooks";
import { TESTIMONIALS_META } from "./data";
import { useIntersect } from "./hooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

export default function TestimonialsSection() {
  const info = useInfo();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [active, setActive] = useState(0);
  const [ref, visible] = useIntersect();

  const apiTestimonials = useApiList("/api/testimonials", null);

  const testimonials = apiTestimonials && apiTestimonials.length > 0
    ? apiTestimonials.map(t => ({
        name: t.name,
        role: loc(t, "role", lang),
        company: t.company,
        stars: t.stars || 5,
        text: loc(t, "text", lang),
      }))
    : TESTIMONIALS_META.map((m, i) => ({
        ...m,
        text: t(`testimonials.items.${i}.text`, { company: info.companyName }),
      }));

  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const testimonial = testimonials[active] || testimonials[0];
  if (!testimonial) return null;

  return (
    <section ref={ref} style={{ padding:"100px 0", background:"linear-gradient(135deg,var(--color-dark, #121315) 0%,#1a1a25 100%)", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(ellipse at 30% 50%, rgba(245,91,31,0.08) 0%, transparent 60%)" }} />
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px", textAlign:"center", position:"relative" }}>
        <div style={{ opacity: visible?1:0, transform: visible?"none":"translateY(30px)", transition:"all 0.7s" }}>
          <SectionTitle tag={t("testimonials.tag")} title={t("testimonials.title")} center dark />
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"48px 48px 40px", opacity: visible?1:0, transition:"all 0.6s 0.3s" }}>
          <div style={{ fontSize:80, color:"var(--color-primary, #0A1684)", opacity:0.3, fontFamily:"Georgia,serif", lineHeight:0.5, marginBottom:24 }}>"</div>
          <p style={{ color:"#ccc", fontFamily:"'DM Sans',sans-serif", fontSize:18, lineHeight:1.8, marginBottom:32, fontStyle:"italic" }}>{testimonial.text}</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div style={{ width:56, height:56, borderRadius:"50%", overflow:"hidden", background:"linear-gradient(135deg,var(--color-primary, #0A1684),#ff8c6b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>
                {testimonial.image
                  ? <img src={testimonial.image} alt={testimonial.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : "👤"
                }
              </div>
              <div style={{ textAlign:"left" }}>
                <h4 style={{ color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:800, margin:0 }}>{testimonial.name}</h4>
                <span style={{ color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>{testimonial.role}</span>
                <div style={{ display:"flex", gap:2, marginTop:4 }}>
                  {Array.from({ length: testimonial.stars || 5 }).map((_, i) => <span key={i} style={{ color:"var(--color-primary, #0A1684)", fontSize:14 }}>★</span>)}
                </div>
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.05)", padding:"8px 20px", borderRadius:8, color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:14 }}>{testimonial.company}</div>
          </div>
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:32 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: i===active?28:8, height:8, borderRadius:4, background: i===active?"var(--color-primary, #0A1684)":"rgba(255,255,255,0.2)", border:"none", cursor:"pointer", transition:"all 0.3s" }} />
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"center", gap:12, marginTop:20 }}>
          <button onClick={() => setActive(a => (a-1+testimonials.length)%testimonials.length)} style={{ width:44, height:44, borderRadius:"50%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", cursor:"pointer", fontSize:18 }}>←</button>
          <button onClick={() => setActive(a => (a+1)%testimonials.length)} style={{ width:44, height:44, borderRadius:"50%", background:"var(--color-primary, #0A1684)", border:"none", color:"#fff", cursor:"pointer", fontSize:18 }}>→</button>
        </div>
      </div>
    </section>
  );
}
