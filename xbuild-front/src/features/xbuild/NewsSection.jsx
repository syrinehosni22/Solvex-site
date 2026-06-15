import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useIntersect } from "./hooks";
import { useApiList } from "./apiHooks";
import { loc } from "./helpers";
import SectionTitle from "./SectionTitle";

export default function NewsSection() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [ref, visible] = useIntersect();
  const [hovered, setHovered] = useState(null);

  const apiPosts = useApiList("/api/blog", null);
  const staticPosts = t("news.items", { returnObjects: true });

  const newsItems = apiPosts && apiPosts.length > 0
    ? apiPosts.map(p => ({
        ...p,
        title: loc(p, "title", lang),
        tag: loc(p, "tag", lang),
        excerpt: loc(p, "excerpt", lang),
      }))
    : staticPosts;

  return (
    <section id="news" ref={ref} className="section-padding" style={{ padding: "100px 0", background: "#fff" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)", transition: "all 0.7s" }}>
          <SectionTitle tag={t("news.tag")} title={t("news.title")} center />
        </div>
        <div className="news-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {newsItems.map((n, i) => {
            const CardTag = n._id ? Link : "div";
            const cardProps = n._id ? { to: `/blog/${n._id}` } : {};
            return (
            <CardTag
              key={i}
              {...cardProps}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: 12, overflow: "hidden", background: "#fff",
                boxShadow: hovered === i ? "0 20px 60px rgba(0,0,0,0.12)" : "0 4px 24px rgba(0,0,0,0.06)",
                transition: "all 0.4s",
                transform: visible ? (hovered === i ? "translateY(-6px)" : "none") : "translateY(30px)",
                opacity: visible ? 1 : 0, transitionDelay: `${i * 0.12}s`,
                cursor: "pointer", textDecoration: "none", display: "block",
              }}
            >
              <div style={{
                height: 220,
                background: n.image
                  ? `url(${n.image}) center/cover no-repeat`
                  : `linear-gradient(135deg,${["#1a1a2e","#16213e","#0f3460"][i % 3]},${["#16213e","#0f3460","#533483"][i % 3]})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 64, position: "relative",
              }}>
                {!n.image && "🏗️"}
                {n.featured && (
                  <div style={{ position: "absolute", top: 16, right: 16, background: "var(--color-primary, #0A1684)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 4, letterSpacing: 1 }}>{t("news.featured")}</div>
                )}
              </div>
              <div style={{ padding: "28px 28px 32px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                  <span style={{ background: "var(--color-primary, #0A1684)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 4 }}>{n.tag}</span>
                  <span style={{ color: "#999", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>📅 {n.date}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-dark, #121315)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4, marginBottom: 12 }}>{n.title}</h3>
                {n.excerpt && (
                  <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>{n.excerpt}</p>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#999", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>✍️ {n.author}</span>
                  <span style={{ color: "var(--color-primary, #0A1684)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {t("news.readMore")} {n._id && <span>→</span>}
                  </span>
                </div>
              </div>
            </CardTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}