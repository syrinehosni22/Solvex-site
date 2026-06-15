import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageHeader } from "./components/UI";

const CARDS = [
  { to:"/admin/info",         icon:"⚙️", title:"Infos & Site",       desc:"Hero section, À propos, stats, coordonnées, réseaux sociaux avec toggle.", color:"var(--color-primary, #0A1684)" },
  { to:"/admin/about",        icon:"📖", title:"À Propos & Pourquoi Nous Choisir", desc:"Points forts, badges, atouts et visuels des sections « Qui sommes-nous » et « Pourquoi nous choisir ».", color:"#a855f7" },
  { to:"/admin/services",     icon:"🏗️", title:"Services",           desc:"Ajouter, modifier ou supprimer les services avec image.",                  color:"#3b82f6" },
  { to:"/admin/projects",     icon:"📁", title:"Projets",            desc:"Gérer le portfolio : titres, catégories, années, images.",                 color:"#8b5cf6" },
  { to:"/admin/process",      icon:"🔄", title:"Processus",          desc:"Gérer les étapes du processus affichées sur le site.",                     color:"#f59e0b" },
  { to:"/admin/stats",         icon:"📊", title:"Statut Entreprise",    desc:"Chiffres clés, badges de certification, titre et description de la section.", color:"#0ea5e9" },
  { to:"/admin/testimonials", icon:"⭐", title:"Témoignages",        desc:"Créer et modifier les avis clients affichés dans le carrousel.",           color:"#ec4899" },
  { to:"/admin/blog",         icon:"📰", title:"Blog / Actualités",  desc:"Créer et modifier les articles de la section actualités.",                 color:"#10b981" },
  { to:"/admin/devis",        icon:"📩", title:"Demandes de devis",  desc:"Consulter les demandes de devis reçues via le formulaire de contact.",    color:"#06b6d4" },
  { to:"/",                   icon:"🌐", title:"Voir le site",       desc:"Prévisualiser le site public dans un nouvel onglet.",                      color:"#22c55e", external:true },
];

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div>
      <PageHeader icon="🏠" title="Tableau de bord"
        subtitle={`Bienvenue${user?" dans l'administration XBuild":""}. Choisissez une section à gérer.`}
      />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:14, marginBottom:32 }}>
        {CARDS.map(c => (
          <Link key={c.to} to={c.to} target={c.external?"_blank":undefined} style={{ textDecoration:"none" }}>
            <div style={{ background:"rgba(255,255,255,0.035)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"20px 20px 18px", transition:"all 0.18s", cursor:"pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background=`${c.color}12`; e.currentTarget.style.border=`1px solid ${c.color}30`; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.035)"; e.currentTarget.style.border="1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.transform="none"; }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:`${c.color}18`, border:`1px solid ${c.color}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{c.icon}</div>
                <span style={{ fontWeight:900, fontSize:14, color:"#fff" }}>{c.title}</span>
              </div>
              <p style={{ margin:0, color:"#555", fontSize:12, lineHeight:1.6 }}>{c.desc}</p>
              <div style={{ marginTop:12, color:c.color, fontWeight:800, fontSize:11 }}>{c.external?"Ouvrir ↗":"Gérer →"}</div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ background:"rgba(245,91,31,0.06)", border:"1px solid rgba(245,91,31,0.15)", borderRadius:12, padding:"16px 18px", display:"flex", gap:12, alignItems:"flex-start" }}>
        <span style={{ fontSize:18, flexShrink:0 }}>💡</span>
        <p style={{ margin:0, color:"#666", fontSize:13, lineHeight:1.7 }}>
          Le bouton <strong style={{ color:"#ccc" }}>« Appelez-nous »</strong> sur le site utilise automatiquement le numéro configuré dans <strong style={{ color:"#ccc" }}>Infos & Site → Téléphone</strong>. Les demandes de devis soumises via le formulaire sont visibles dans <strong style={{ color:"#ccc" }}>Demandes de devis</strong>.
        </p>
      </div>
    </div>
  );
}