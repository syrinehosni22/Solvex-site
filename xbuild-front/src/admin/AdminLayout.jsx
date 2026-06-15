import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInfo, useThemeVars } from "../features/xbuild/apiHooks";
// ...

const NAV = [
  { to:"/admin",               label:"Dashboard",     icon:"🏠", exact:true },
  { to:"/admin/info",          label:"Infos & Site",  icon:"⚙️" },
  { to:"/admin/about",         label:"À Propos",      icon:"📖" },
  { to:"/admin/services",      label:"Services",      icon:"🏗️" },
  { to:"/admin/projects",      label:"Projets",       icon:"📁" },
  { to:"/admin/process",       label:"Processus",     icon:"🔄" },
  { to:"/admin/stats",         label:"Statut",        icon:"📊" },
  { to:"/admin/testimonials",  label:"Témoignages",   icon:"⭐" },
  { to:"/admin/blog",          label:"Blog",          icon:"📰" },
  { to:"/admin/devis",         label:"Devis",         icon:"📩" },
];

function AdminLogo({ info }) {
  if (info.logoImage) {
    return <img src={info.logoImage} alt={info.companyName || "Logo"} style={{ height:32, width:"auto", objectFit:"contain" }} />;
  }
  const name = info.companyName || "XBuild";
  const match = name.match(/build/i);
  const prefix = match ? name.slice(0, match.index) : name;
  const suffix = match ? match[0] : "";
  return (
    <span style={{ fontSize:20, fontWeight:900, color:"#fff", letterSpacing:-0.5 }}>
      {prefix}<span style={{ color:"var(--color-primary, #0A1684)" }}>{suffix || "BUILD"}</span>
    </span>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const location   = useLocation();
  const navigate   = useNavigate();
  const info       = useInfo();
useThemeVars(info);
  const handleLogout = () => { logout(); navigate("/admin/login", { replace:true }); };
  const isActive = ({ to, exact }) => exact ? location.pathname===to : location.pathname.startsWith(to);

  return (
    <div style={{ minHeight:"100vh", background:"#0a0c0f", color:"#fff", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        * { box-sizing:border-box; }
        .admin-nav::-webkit-scrollbar { display:none; }
        @media (max-width:900px) {
          .admin-header { flex-direction:column!important; height:auto!important; padding:10px 16px!important; gap:8px; }
          .admin-nav { overflow-x:auto; scrollbar-width:none; }
          .admin-nav a { white-space:nowrap; font-size:11px!important; padding:5px 8px!important; }
          .admin-content { padding:20px 16px!important; }
        }
      `}</style>

      <header className="admin-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", height:60, borderBottom:"1px solid rgba(255,255,255,0.07)", background:"#080a0c", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, flex:1, minWidth:0 }}>
          <Link to="/admin" style={{ textDecoration:"none", flexShrink:0 }}>
            <AdminLogo info={info} />
          </Link>
          <div style={{ width:1, height:20, background:"rgba(255,255,255,0.08)", flexShrink:0 }} />
          <nav className="admin-nav" style={{ display:"flex", gap:3, overflowX:"auto", scrollbarWidth:"none" }}>
            {NAV.map(item => {
              const active = isActive(item);
              return (
                <Link key={item.to} to={item.to} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:12, color: active?"var(--color-primary, #0A1684)":"#8e95a3", background: active?"rgba(245,91,31,0.10)":"transparent", border: active?"1px solid rgba(245,91,31,0.20)":"1px solid transparent", transition:"all 0.15s", whiteSpace:"nowrap" }}>
                  <span style={{ fontSize:13 }}>{item.icon}</span>{item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <Link to="/" target="_blank" style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, textDecoration:"none", fontWeight:700, fontSize:12, color:"#555", border:"1px solid rgba(255,255,255,0.06)" }}>↗ Site</Link>
          <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:8, background:"rgba(239,68,68,0.10)", border:"1px solid rgba(239,68,68,0.20)", color:"#f87171", fontWeight:800, fontSize:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            🚪 Déco
          </button>
        </div>
      </header>

      <main className="admin-content" style={{ maxWidth:1140, margin:"0 auto", padding:"32px 24px", animation:"fadeIn 0.3s ease" }}>
        <Outlet />
      </main>
    </div>
  );
}