import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIntersect, useCarousel } from "./hooks";
import { useApiListStrict } from "./apiHooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

const PROJECTS_STYLE = `
  @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }

  .projects-grid-desktop {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 280px);
    gap: 16px;
  }
  .projects-grid-desktop .card-5 { grid-column: 2 / 4; }
  .projects-grid-mobile { display: none; }

  @media (max-width: 1000px) {
    .projects-grid-desktop { display: none !important; }
    .projects-grid-mobile { display: flex; flex-direction: column; gap: 20px; }
  }
`;

function truncate(text, max = 120) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

function ProjectModal({ project, onClose, t }) {
  const [activeImage, setActiveImage] = useState(0);
  useEffect(() => { setActiveImage(0); }, [project]);
  if (!project) return null;
  const images = project.images && project.images.length > 0 ? project.images : (project.image ? [project.image] : []);
  const current = images[Math.min(activeImage, Math.max(images.length - 1, 0))];

  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#1a1a25", borderRadius:20, maxWidth:680, width:"100%", maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,0.6)", animation:"fadeInUp 0.25s ease" }}>
        <div style={{ height:320, background: current ? `url(${current}) center/cover no-repeat` : `linear-gradient(135deg, ${project.bg||"#1a1a2e"}, #2a2a3e)`, position:"relative", display:"flex", alignItems:"flex-end", flexShrink:0 }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(26,26,37,0.95) 0%, transparent 60%)" }} />
          <button onClick={onClose} style={{ position:"absolute", top:16, right:16, width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.5)", border:"none", color:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2 }}>✕</button>
          {!current && <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-60%)", fontSize:72, opacity:0.18 }}>🏗️</div>}
          <div style={{ position:"relative", zIndex:1, padding:"0 28px 24px" }}>
            <div style={{ display:"inline-block", padding:"4px 12px", background:"var(--color-primary)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", borderRadius:3, marginBottom:8 }}>{project.category}</div>
            <h2 style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:900, fontSize:24, color:"#fff", margin:0 }}>{project.title}</h2>
          </div>
        </div>
        {images.length > 1 && (
          <div style={{ display:"flex", gap:10, padding:"16px 28px 0", overflowX:"auto" }}>
            {images.map((img, gi) => (
              <button key={gi} type="button" onClick={() => setActiveImage(gi)} style={{ flexShrink:0, width:96, height:72, borderRadius:10, padding:0, cursor:"pointer", border: gi===activeImage ? "2px solid var(--color-primary)" : "2px solid transparent", outline: gi===activeImage ? "none" : "1px solid rgba(255,255,255,0.12)", background:`url(${img}) center/cover no-repeat`, opacity: gi===activeImage ? 1 : 0.6, transform: gi===activeImage ? "scale(1)" : "scale(0.96)", transition:"all 0.2s ease" }} />
            ))}
          </div>
        )}
        <div style={{ padding:"24px 28px 36px" }}>
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"inline-block", padding:"6px 14px", borderRadius:8, background:"rgba(50,63,124,0.12)", border:"1px solid rgba(50,63,124,0.25)", color:"var(--color-primary)", fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:14 }}>📅 {project.year}</div>
          </div>
          {project.desc
            ? <p style={{ color:"#aaa", fontFamily:"'DM Sans',sans-serif", fontSize:15, lineHeight:1.8, margin:0 }}>{project.desc}</p>
            : <p style={{ color:"#555", fontFamily:"'DM Sans',sans-serif", fontSize:14, fontStyle:"italic" }}>{t("projects.noDesc")||"Aucune description disponible."}</p>
          }
        </div>
      </div>
    </div>
  );
}

/* ── Desktop card ─────────────────────────────────────────────────────────── */
function ProjectCardDesktop({ p, i, visible, onClick, isLast }) {
  const [hovered, setHovered] = useState(false);
  const gallery = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
  const coverIndex = Math.min(Math.max(p.coverIndex || 0, 0), Math.max(gallery.length - 1, 0));
  const orderedImages = gallery.length > 0 ? [...gallery.slice(coverIndex), ...gallery.slice(0, coverIndex)] : [];
  const current = useCarousel(orderedImages.length, 4500, hovered);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={isLast ? "card-5" : ""}
      style={{ background: orderedImages.length > 0 ? "#0d0e10" : (p.bg || "#1a1a2e"), borderRadius:12, position:"relative", overflow:"hidden", cursor:"pointer", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition:`opacity 0.6s ${i*0.08}s, transform 0.6s ${i*0.08}s` }}
    >
      {orderedImages.map((img, gi) => (
        <div key={gi} style={{ position:"absolute", inset:0, backgroundImage:`url(${img})`, backgroundSize:"cover", backgroundPosition:"center", opacity: gi===current ? 1 : 0, transform: gi===current && hovered ? "scale(1.06)" : "scale(1)", transition:"opacity 1.2s ease, transform 6s ease" }} />
      ))}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.05))", opacity: hovered ? 1 : 0.35, transition:"opacity 0.3s" }} />
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"var(--color-primary)", transform: hovered ? "scaleX(1)" : "scaleX(0)", transition:"transform 0.3s", transformOrigin:"left" }} />
      {orderedImages.length > 1 && (
        <div style={{ position:"absolute", top:14, right:14, display:"flex", gap:5, zIndex:1 }}>
          {orderedImages.map((_, gi) => (
            <span key={gi} style={{ width:6, height:6, borderRadius:"50%", background: gi===current ? "var(--color-primary)" : "rgba(255,255,255,0.4)", transition:"background 0.3s" }} />
          ))}
        </div>
      )}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:24, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:"inline-block", padding:"4px 12px", background:"var(--color-primary)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", borderRadius:3, marginBottom:8, transform: hovered ? "translateY(0)" : "translateY(8px)", opacity: hovered ? 1 : 0, transition:"all 0.3s" }}>{p.category}</div>
          <h3 style={{ color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:20, margin:0 }}>{p.title}</h3>
          {p.desc && <p style={{ color:"rgba(255,255,255,0.7)", fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.6, margin:"6px 0 0", maxWidth:320, maxHeight: hovered ? 60 : 0, opacity: hovered ? 1 : 0, overflow:"hidden", transition:"all 0.3s" }}>{truncate(p.desc)}</p>}
          <p style={{ color:"rgba(255,255,255,0.5)", fontFamily:"'DM Sans',sans-serif", fontSize:13, margin:"4px 0 0" }}>{p.year}</p>
        </div>
        <div style={{ width:40, height:40, borderRadius:"50%", background:"var(--color-primary)", display:"flex", alignItems:"center", justifyContent:"center", transform: hovered ? "scale(1)" : "scale(0)", transition:"transform 0.3s", color:"#fff", fontWeight:700, flexShrink:0 }}>→</div>
      </div>
      {orderedImages.length === 0 && <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:60, opacity:0.1 }}>🏗️</div>}
    </div>
  );
}

/* ── Mobile card — always shows image + title + description ──────────────── */
function ProjectCardMobile({ p, i, visible, onClick }) {
  const gallery = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
  const coverIndex = Math.min(Math.max(p.coverIndex || 0, 0), Math.max(gallery.length - 1, 0));
  const orderedImages = gallery.length > 0 ? [...gallery.slice(coverIndex), ...gallery.slice(0, coverIndex)] : [];
  const current = useCarousel(orderedImages.length, 4500, false);

  // Fallback description using title if no desc available
  const descText = p.desc || "";

  return (
    <div
      onClick={onClick}
      style={{ borderRadius:14, overflow:"hidden", background:"#1a1b22", border:"1px solid rgba(255,255,255,0.07)", cursor:"pointer", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition:`opacity 0.5s ${i*0.07}s, transform 0.5s ${i*0.07}s`, boxShadow:"0 4px 24px rgba(0,0,0,0.35)" }}
    >
      {/* Image */}
      <div style={{ position:"relative", height:200, background: orderedImages.length===0 ? (p.bg||"#1a1a2e") : "#0d0e10", overflow:"hidden" }}>
        {orderedImages.map((img, gi) => (
          <div key={gi} style={{ position:"absolute", inset:0, backgroundImage:`url(${img})`, backgroundSize:"cover", backgroundPosition:"center", opacity: gi===current ? 1 : 0, transition:"opacity 1.2s ease" }} />
        ))}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
        {orderedImages.length === 0 && <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:52, opacity:0.15 }}>🏗️</div>}
        {/* Category badge */}
        <div style={{ position:"absolute", top:12, left:12 }}>
          <span style={{ padding:"4px 10px", background:"var(--color-primary)", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", borderRadius:3 }}>{p.category}</span>
        </div>
        {/* Year badge */}
        <div style={{ position:"absolute", top:12, right:12 }}>
          <span style={{ padding:"4px 10px", background:"rgba(0,0,0,0.55)", color:"rgba(255,255,255,0.8)", fontFamily:"'DM Sans',sans-serif", fontSize:10, fontWeight:600, borderRadius:3 }}>{p.year}</span>
        </div>
        {/* Carousel dots */}
        {orderedImages.length > 1 && (
          <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5 }}>
            {orderedImages.map((_, gi) => (
              <span key={gi} style={{ width:5, height:5, borderRadius:"50%", background: gi===current ? "#fff" : "rgba(255,255,255,0.35)", transition:"background 0.3s" }} />
            ))}
          </div>
        )}
      </div>

      {/* Text — always visible */}
      <div style={{ padding:"16px 18px 20px" }}>
        <h3 style={{ color:"#fff", fontFamily:"'DM Sans',sans-serif", fontWeight:800, fontSize:17, margin:"0 0 8px", lineHeight:1.3 }}>{p.title}</h3>
        {descText ? (
          <p style={{ color:"rgba(255,255,255,0.55)", fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.65, margin:"0 0 14px" }}>
            {truncate(descText, 120)}
          </p>
        ) : (
          <p style={{ color:"rgba(255,255,255,0.25)", fontFamily:"'DM Sans',sans-serif", fontSize:13, lineHeight:1.65, margin:"0 0 14px", fontStyle:"italic" }}>
            Appuyez pour voir les détails du projet.
          </p>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:6, color:"var(--color-primary)", fontFamily:"'DM Sans',sans-serif", fontSize:12, fontWeight:700 }}>
          <span>Voir le projet</span>
          <span style={{ fontSize:14 }}>→</span>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const apiProjects = useApiListStrict("/api/projects");
  const [ref, visible] = useIntersect();
  const [selected, setSelected] = useState(null);

  // null = still loading. Once loaded, use exactly what's in the DB (possibly empty) — no static fallback.
  const loading = apiProjects === null;
  const projects = loading
    ? []
    : apiProjects.map(p => ({
        ...p,
        title: loc(p, "title", lang),
        category: loc(p, "category", lang),
        desc: loc(p, "desc", lang),
      }));

  if (!loading && projects.length === 0) return null;

  return (
    <>
      <style>{PROJECTS_STYLE}</style>

      <section id="projects" ref={ref} className="section-padding" style={{ padding:"100px 0", background:"var(--color-dark, #121315)", overflow:"hidden" }}>
        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition:"all 0.7s" }}>
            <SectionTitle tag={t("projects.tag")} title={t("projects.title")} center dark />
          </div>

          {/* ── Desktop grid ── */}
          <div className="projects-grid-desktop" style={{ marginTop:48 }}>
            {projects.map((p, i) => (
              <ProjectCardDesktop key={i} p={p} i={i} visible={visible} onClick={() => setSelected(p)} isLast={i === 4} />
            ))}
          </div>

          {/* ── Mobile list ── */}
          <div className="projects-grid-mobile" style={{ marginTop:36 }}>
            {projects.map((p, i) => (
              <ProjectCardMobile key={i} p={p} i={i} visible={visible} onClick={() => setSelected(p)} />
            ))}
          </div>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} t={t} />
    </>
  );
}