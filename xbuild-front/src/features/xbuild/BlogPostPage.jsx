import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useInfo, useApiItem, useApiList } from "./apiHooks";
import { loc } from "./helpers";
import GlobalStyles from "./GlobalStyles";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

export default function BlogPostPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const info = useInfo();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: post, loading, error } = useApiItem("/api/blog", id);
  const apiPosts = useApiList("/api/blog", null);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const title   = post ? loc(post, "title", lang) : "";
  const tag     = post ? loc(post, "tag", lang) : "";
  const content = post ? loc(post, "content", lang) : "";
  const excerpt = post ? loc(post, "excerpt", lang) : "";
  const paragraphs = (content || excerpt || "").split(/\n+/).filter(Boolean);

  const related = (apiPosts || [])
    .filter(p => p._id !== id)
    .slice(0, 3)
    .map(p => ({ ...p, title: loc(p, "title", lang), tag: loc(p, "tag", lang) }));

  return (
    <>
      <GlobalStyles />
      <Navbar active="#news" info={info} />

      {/* Page header */}
      <section style={{ background: "var(--color-dark, #121315)", paddingTop: 160, paddingBottom: 70, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
          <svg width="100%" height="100%"><defs><pattern id="blogHeaderGrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-primary, #0A1684)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#blogHeaderGrid)"/></svg>
        </div>
        <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(var(--color-primary-rgb, 10, 22, 132),0.10)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#aaa", marginBottom: 16 }}>
            <Link to="/" style={{ color: "#aaa", textDecoration: "none" }}>{t("nav.home")}</Link>
            <span style={{ color: "var(--color-primary, #0A1684)" }}>›</span>
            <Link to="/#news" style={{ color: "#aaa", textDecoration: "none" }}>{t("news.tag")}</Link>
            {title && <><span style={{ color: "var(--color-primary, #0A1684)" }}>›</span><span style={{ color: "var(--color-primary, #0A1684)" }}>{title}</span></>}
          </div>
          {loading ? (
            <div style={{ height: 40 }} />
          ) : error || !post ? (
            <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,42px)", color: "#fff", margin: 0 }}>
              {t("news.notFound") || "Article introuvable"}
            </h1>
          ) : (
            <>
              {tag && (
                <div style={{ display: "inline-block", padding: "4px 12px", background: "var(--color-primary, #0A1684)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", borderRadius: 4, marginBottom: 14 }}>{tag}</div>
              )}
              <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 900, fontSize: "clamp(28px,4vw,42px)", color: "#fff", margin: 0, lineHeight: 1.25 }}>
                {title}
              </h1>
              <div style={{ display: "flex", gap: 18, marginTop: 18, flexWrap: "wrap", fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#999" }}>
                {post.author && <span>✍️ {post.author}</span>}
                {post.date && <span>📅 {post.date}</span>}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Article content */}
      <section className="section-padding" style={{ padding: "80px 0", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          {loading ? (
            <p style={{ color: "#999", fontFamily: "'DM Sans',sans-serif" }}>…</p>
          ) : error || !post ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "#666", fontFamily: "'DM Sans',sans-serif", marginBottom: 24 }}>
                {t("news.notFoundDesc") || "Cet article n'existe pas ou a été supprimé."}
              </p>
              <Link to="/#news" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--color-primary, #0A1684)", color: "#fff", padding: "12px 28px", borderRadius: 4, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                ← {t("nav.blog")}
              </Link>
            </div>
          ) : (
            <>
              {post.image && (
                <div style={{ height: 360, borderRadius: 16, overflow: "hidden", marginBottom: 40, background: `url(${post.image}) center/cover no-repeat` }} />
              )}

              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, lineHeight: 1.9, color: "#444" }}>
                {paragraphs.length > 0 ? paragraphs.map((p, i) => (
                  <p key={i} style={{ marginBottom: 22 }}>{p}</p>
                )) : (
                  <p style={{ color: "#999", fontStyle: "italic" }}>{t("news.noContent") || "Le contenu de cet article sera bientôt disponible."}</p>
                )}
              </div>

              <div style={{ marginTop: 48 }}>
                <Link to="/#news" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--color-primary, #0A1684)", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  ← {t("news.backToList") || "Retour aux actualités"}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="section-padding" style={{ padding: "0 0 100px", background: "#fff" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <h3 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 22, color: "var(--color-dark, #121315)", marginBottom: 24 }}>
              {t("news.related") || "À lire aussi"}
            </h3>
            <div className="news-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
              {related.map(r => (
                <Link key={r._id} to={`/blog/${r._id}`} style={{ textDecoration: "none", borderRadius: 12, overflow: "hidden", background: "#f8f8f8", display: "block" }}>
                  <div style={{
                    height: 140,
                    background: r.image ? `url(${r.image}) center/cover no-repeat` : "linear-gradient(135deg,#1a1a2e,#16213e)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
                  }}>{!r.image && "🏗️"}</div>
                  <div style={{ padding: "16px 18px" }}>
                    {r.tag && <span style={{ background: "var(--color-primary, #0A1684)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>{r.tag}</span>}
                    <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 15, color: "var(--color-dark, #121315)", marginTop: 10, lineHeight: 1.4 }}>{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer info={info} />
      <BackToTop />
    </>
  );
}