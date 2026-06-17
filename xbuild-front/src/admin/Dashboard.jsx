import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "./components/UI";

const CARDS = [
  { to:"/admin/info",         icon:"⚙️", title:"Infos & Site",       desc:"Hero, À propos, stats, coordonnées, réseaux sociaux.", color:"var(--color-primary, #0A1684)" },
  { to:"/admin/about",        icon:"📖", title:"À Propos",            desc:"Points forts, badges et visuels des sections d'identité.", color:"#a855f7" },
  { to:"/admin/services",     icon:"🏗️", title:"Services",            desc:"Ajouter, modifier ou supprimer les services.",           color:"#3b82f6" },
  { to:"/admin/projects",     icon:"📁", title:"Projets",             desc:"Portfolio : titres, catégories, années, images.",        color:"#8b5cf6" },
  { to:"/admin/process",      icon:"🔄", title:"Processus",           desc:"Étapes du processus affichées sur le site.",             color:"#f59e0b" },
  { to:"/admin/stats",        icon:"📊", title:"Statut Entreprise",   desc:"Chiffres clés, badges et section statistiques.",        color:"#0ea5e9" },
  { to:"/admin/testimonials", icon:"⭐", title:"Témoignages",         desc:"Avis clients affichés dans le carrousel.",               color:"#ec4899" },
  { to:"/admin/blog",         icon:"📰", title:"Blog / Actualités",   desc:"Créer et modifier les articles et actualités.",          color:"#10b981" },
  { to:"/admin/devis",        icon:"✉️", title:"Messages de contact", desc:"Messages reçus via le formulaire de contact.",           color:"#06b6d4" },
  { to:"/",                   icon:"🌐", title:"Voir le site",        desc:"Prévisualiser le site public.",                         color:"#22c55e", external:true },
];

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <style>{`
        .dash-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
          margin-bottom: 28px;
        }
        .dash-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 18px;
          transition: all 0.18s;
          cursor: pointer;
          text-decoration: none;
          display: block;
        }
        .dash-card:hover {
          transform: translateY(-2px);
        }
        .dash-tip {
          background: rgba(10,22,132,0.07);
          border: 1px solid rgba(10,22,132,0.18);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        @media (max-width: 480px) {
          .dash-grid {
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .dash-card { padding: 14px 12px; }
          .dash-card-desc { display: none; }
          .dash-card-icon { width: 34px !important; height: 34px !important; font-size: 16px !important; }
          .dash-card-title { font-size: 12px !important; }
          .dash-card-action { font-size: 10px !important; margin-top: 8px !important; }
          .dash-tip { flex-direction: column; gap: 6px; }
        }
      `}</style>

      <PageHeader icon="🏠" title="Tableau de bord"
        subtitle={`Bienvenue${user ? " dans l'administration" : ""}. Choisissez une section.`}
      />

      <div className="dash-grid">
        {CARDS.map(c => (
          <Link key={c.to} to={c.to} target={c.external ? "_blank" : undefined} className="dash-card"
            style={{ textDecoration:"none" }}
            onMouseEnter={e => { e.currentTarget.style.background=`${c.color}12`; e.currentTarget.style.borderColor=`${c.color}30`; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.035)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>
              <div className="dash-card-icon" style={{ width:38, height:38, borderRadius:9, background:`${c.color}18`, border:`1px solid ${c.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{c.icon}</div>
              <span className="dash-card-title" style={{ fontWeight:900, fontSize:13, color:"#fff", lineHeight:1.3 }}>{c.title}</span>
            </div>
            <p className="dash-card-desc" style={{ margin:0, color:"#555", fontSize:12, lineHeight:1.6 }}>{c.desc}</p>
            <div className="dash-card-action" style={{ marginTop:10, color:c.color, fontWeight:800, fontSize:11 }}>{c.external ? "Ouvrir ↗" : "Gérer →"}</div>
          </Link>
        ))}
      </div>

      <div className="dash-tip">
        <span style={{ fontSize:18, flexShrink:0 }}>💡</span>
        <p style={{ margin:0, color:"#666", fontSize:13, lineHeight:1.7 }}>
          Le numéro configuré dans <strong style={{ color:"#ccc" }}>Infos & Site → Téléphone</strong> alimente automatiquement le bouton d'appel du site. Les messages reçus via le formulaire sont visibles dans <strong style={{ color:"#ccc" }}>Messages de contact</strong>.
        </p>
      </div>
    </div>
  );
}