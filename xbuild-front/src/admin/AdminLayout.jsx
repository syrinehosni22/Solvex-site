import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInfo, useThemeVars } from "../features/xbuild/apiHooks";

const NAV = [
  { to:"/admin",               label:"Dashboard",     icon:"🏠", exact:true },
  { to:"/admin/info",          label:"Infos & Site",  icon:"⚙️" },
  { to:"/admin/about",         label:"À Propos",      icon:"📖" },
  { to:"/admin/services",      label:"Services",      icon:"🏗️" },
  { to:"/admin/projects",      label:"Projets",       icon:"📁" },
  { to:"/admin/process",       label:"Processus",     icon:"🔄" },
  { to:"/admin/stats",         label:"Statut",        icon:"📊" },
  // { to:"/admin/testimonials",  label:"Témoignages",   icon:"⭐" },
  // { to:"/admin/blog",          label:"Blog",          icon:"📰" },
  { to:"/admin/devis",         label:"Messages",      icon:"✉️" },
];

function AdminLogo({ info }) {
  if (info.logoImage) {
    return <img src={info.logoImage} alt={info.companyName || "Logo"} style={{ height:28, width:"auto", objectFit:"contain" }} />;
  }
  const name = info.companyName || "XBuild";
  const match = name.match(/build/i);
  const prefix = match ? name.slice(0, match.index) : name;
  const suffix = match ? match[0] : "";
  return (
    <span style={{ fontSize:18, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>
      {prefix}<span style={{ color:"var(--color-primary, #0A1684)" }}>{suffix || "BUILD"}</span>
    </span>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const location   = useLocation();
  const navigate   = useNavigate();
  const info       = useInfo();
  const [menuOpen, setMenuOpen] = useState(false);
  useThemeVars(info);

  const handleLogout = () => { logout(); navigate("/admin/login", { replace:true }); };
  const isActive = ({ to, exact }) => exact ? location.pathname === to : location.pathname.startsWith(to);

  const currentPage = NAV.find(n => isActive(n))?.label || "Admin";

  return (
    <div style={{ minHeight:"100vh", background:"#0a0c0f", color:"#fff", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:none; } }
        * { box-sizing:border-box; }
        .admin-nav-scroll::-webkit-scrollbar { display:none; }

        /* ── Mobile drawer ── */
        .mobile-menu {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
        }
        .mobile-menu.open { display: flex; }
        .mobile-drawer {
          width: 260px;
          background: #0d1014;
          border-right: 1px solid rgba(255,255,255,0.08);
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 0;
          animation: slideDown 0.2s ease;
          overflow-y: auto;
        }
        .mobile-drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 18px;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          color: #8e95a3;
          border-left: 3px solid transparent;
          transition: all 0.15s;
        }
        .mobile-nav-item.active {
          color: var(--color-primary, #0A1684);
          background: rgba(10,22,132,0.10);
          border-left-color: var(--color-primary, #0A1684);
        }
        .mobile-nav-item:hover:not(.active) { background: rgba(255,255,255,0.04); color: #ccc; }

        /* ── Desktop nav ── */
        .desktop-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: #080a0c;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .desktop-nav {
          display: flex;
          gap: 3px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .hamburger-btn {
          display: none;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #ccc;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .mobile-page-title {
          display: none;
          font-size: 13px;
          font-weight: 700;
          color: #8e95a3;
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .mobile-page-title { display: block !important; }
          .desktop-header { padding: 0 14px; height: 52px; }
          .admin-content { padding: 18px 14px !important; }
          .admin-page-header h1 { font-size: 20px !important; }
        }
      `}</style>

      {/* ── Mobile Drawer ── */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}>
        <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
          <div className="mobile-drawer-header">
            <AdminLogo info={info} />
            <button onClick={() => setMenuOpen(false)}
              style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#888", width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
              ✕
            </button>
          </div>

          <div style={{ padding:"10px 0", flex:1 }}>
            {NAV.map(item => {
              const active = isActive(item);
              return (
                <Link key={item.to} to={item.to} className={`mobile-nav-item ${active ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}>
                  <span style={{ fontSize:18, width:24, textAlign:"center" }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div style={{ padding:"14px 18px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column", gap:8 }}>
            <Link to="/" target="_blank" onClick={() => setMenuOpen(false)}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:13, color:"#555", border:"1px solid rgba(255,255,255,0.06)", justifyContent:"center" }}>
              ↗ Voir le site
            </Link>
            <button onClick={handleLogout}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:8, background:"rgba(239,68,68,0.10)", border:"1px solid rgba(239,68,68,0.20)", color:"#f87171", fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", justifyContent:"center", width:"100%" }}>
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="desktop-header">
        <div style={{ display:"flex", alignItems:"center", gap:12, flex:1, minWidth:0 }}>
          {/* Hamburger — visible mobile */}
          <button className="hamburger-btn" onClick={() => setMenuOpen(true)}>☰</button>

          {/* Logo */}
          <Link to="/admin" style={{ textDecoration:"none", flexShrink:0 }}>
            <AdminLogo info={info} />
          </Link>

          {/* Page courante sur mobile */}
          <span className="mobile-page-title">{currentPage}</span>

          {/* Séparateur + nav desktop */}
          <div style={{ width:1, height:18, background:"rgba(255,255,255,0.08)", flexShrink:0, marginLeft:4 }} className="desktop-nav-sep" />
          <nav className="desktop-nav admin-nav-scroll">
            {NAV.map(item => {
              const active = isActive(item);
              return (
                <Link key={item.to} to={item.to} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:12, color: active?"var(--color-primary, #0A1684)":"#8e95a3", background: active?"rgba(10,22,132,0.10)":"transparent", border: active?"1px solid rgba(10,22,132,0.20)":"1px solid transparent", transition:"all 0.15s", whiteSpace:"nowrap" }}>
                  <span style={{ fontSize:13 }}>{item.icon}</span>{item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions desktop */}
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <Link to="/" target="_blank" style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:12, color:"#555", border:"1px solid rgba(255,255,255,0.06)" }}>↗ Site</Link>
          <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:8, background:"rgba(239,68,68,0.10)", border:"1px solid rgba(239,68,68,0.20)", color:"#f87171", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            🚪 Déco
          </button>
        </div>
      </header>

      <main className="admin-content" style={{ maxWidth:1140, margin:"0 auto", padding:"28px 24px", animation:"fadeIn 0.3s ease" }}>
        <Outlet />
      </main>
    </div>
  );
}