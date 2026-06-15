import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useInfo } from "../features/xbuild/apiHooks";

export default function Login() {
  const { login, isAuth, checking } = useAuth();
  const info = useInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from?.pathname || "/admin";

  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [attempts, setAttempts] = useState(0);

  // Déjà connecté → rediriger
  if (!checking && isAuth) {
    return <Navigate to={from} replace />;
  }

  // Vérification en cours → spinner
  if (checking) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0b0d10" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width:36, height:36, border:"3px solid rgba(245,91,31,0.2)", borderTopColor:"var(--color-primary)", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      await login(password.trim());
      navigate(from, { replace: true });
    } catch (err) {
      setAttempts(a => a + 1);
      setError(err.message || "Mot de passe incorrect");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"#0b0d10", fontFamily:"'DM Sans',sans-serif",
      padding:20, position:"relative", overflow:"hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;800;900&display=swap');
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-7px)} 40%,80%{transform:translateX(7px)} }
        * { box-sizing:border-box; }
        input:-webkit-autofill { -webkit-box-shadow:0 0 0 30px #151719 inset!important; -webkit-text-fill-color:#fff!important; }
        .lbtn:not(:disabled):hover { background:var(--color-primary)!important; transform:translateY(-1px); }
      `}</style>

      {/* Glows */}
      <div style={{ position:"absolute", top:"-20%", left:"-10%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle, rgba(245,91,31,0.13), transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-25%", right:"-15%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(245,91,31,0.07), transparent 65%)", pointerEvents:"none" }} />
      {/* Grid */}
      <div style={{ position:"absolute", inset:0, opacity:0.03, pointerEvents:"none" }}>
        <svg width="100%" height="100%"><defs><pattern id="g" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0L0 0 0 50" fill="none" stroke="var(--color-primary)" strokeWidth="0.7"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>
      </div>

      <div style={{ width:"min(420px,100%)", position:"relative", zIndex:1, animation:"fadeIn 0.45s ease" }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <Link to="/" style={{ textDecoration:"none" }}>
            <div style={{ fontSize:40, fontWeight:900, color:"#fff", letterSpacing:-1.5 }}>
              {(() => {
                const name = info.companyName || "XBuild";
                const match = name.match(/build/i);
                if (match) {
                  return <>{name.slice(0, match.index)}<span style={{ color:"var(--color-primary)" }}>{match[0]}</span></>;
                }
                return <>{name.slice(0, -1)}<span style={{ color:"var(--color-primary)" }}>{name.slice(-1)}</span></>;
              })()}
            </div>
          </Link>
          <div style={{ color:"#3d4150", fontSize:11, letterSpacing:4, textTransform:"uppercase", fontWeight:700, marginTop:4 }}>
            Administration
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{
          background:"rgba(255,255,255,0.035)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:20, padding:"36px 32px 28px",
          boxShadow:"0 32px 64px rgba(0,0,0,0.5)",
          animation: attempts > 0 ? "shake 0.4s ease" : undefined,
        }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:22 }}>
            <div style={{ width:58, height:58, borderRadius:16, background:"rgba(245,91,31,0.10)", border:"1px solid rgba(245,91,31,0.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🔐</div>
          </div>

          <h2 style={{ margin:"0 0 6px", fontSize:21, fontWeight:900, color:"#fff" }}>Connexion</h2>
          {/* <p style={{ margin:"0 0 22px", color:"#555", fontSize:13, lineHeight:1.6 }}>
            Entrez le mot de passe défini dans{" "}
            <code style={{ background:"rgba(255,255,255,0.08)", padding:"1px 6px", borderRadius:4, fontSize:12, color:"var(--color-primary)" }}>.env</code>
            {" → "}
            <code style={{ background:"rgba(255,255,255,0.08)", padding:"1px 6px", borderRadius:4, fontSize:12, color:"#aaa" }}>ADMIN_PASSWORD</code>
          </p> */}

          {/* Erreur */}
          {error && (
            <div style={{ padding:"11px 14px", borderRadius:10, marginBottom:18, background:"rgba(239,68,68,0.10)", border:"1px solid rgba(239,68,68,0.25)", color:"#f87171", fontSize:13, fontWeight:600, display:"flex", gap:8, alignItems:"flex-start" }}>
              <span style={{ flexShrink:0 }}>⚠️</span>
              <span>{error}{attempts >= 3 ? <span style={{ opacity:0.5, marginLeft:6 }}>({attempts} essais)</span> : null}</span>
            </div>
          )}

          {/* Champ mot de passe */}
          <label style={{ display:"block", color:"#8e95a3", fontSize:11, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>
            Mot de passe
          </label>
          <div style={{ position:"relative", marginBottom:22 }}>
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••••••"
              autoComplete="current-password"
              autoFocus
              style={{
                width:"100%", padding:"13px 48px 13px 16px",
                borderRadius:10, fontSize:15,
                border: error ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.10)",
                background:"rgba(0,0,0,0.30)", color:"#fff",
                outline:"none", boxSizing:"border-box",
                letterSpacing: showPwd ? 1 : 6,
                transition:"border 0.2s",
                fontFamily:"'DM Sans',sans-serif",
              }}
            />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#666", fontSize:18, padding:0, lineHeight:1 }}>
              {showPwd ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Bouton connexion */}
          <button type="submit" className="lbtn" disabled={!password.trim() || loading}
            style={{
              width:"100%", padding:"14px", borderRadius:10, border:"none",
              cursor: !password.trim() || loading ? "not-allowed" : "pointer",
              fontWeight:900, fontSize:15,
              background: !password.trim() || loading ? "rgba(245,91,31,0.28)" : "var(--color-primary)",
              color:"#fff", fontFamily:"'DM Sans',sans-serif",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
              transition:"background 0.2s, transform 0.15s",
            }}>
            {loading
              ? <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> Vérification…</>
              : "Accéder au dashboard →"
            }
          </button>
        </form>

        <div style={{ textAlign:"center", marginTop:18 }}>
          <Link to="/" style={{ color:"#444", textDecoration:"none", fontSize:13, fontWeight:600 }}>
            ← Retour au site public
          </Link>
        </div>
      </div>
    </div>
  );
}
