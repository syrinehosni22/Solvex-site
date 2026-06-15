export const NAV_LINKS_KEYS = [
  { key: "home",     href: "#home" },
  { key: "about",    href: "#about" },
  { key: "services", href: "#services" },
  { key: "projects", href: "#projects" },
  { key: "process",  href: "#process" },
  { key: "blog",     href: "#news" },
  { key: "contact",  href: "#contact" },
];

// Données statiques fallback (utilisées si l'API est vide)
// Les titres/catégories sont traduits via les fichiers i18n (services.items / projects.items)
export const STATIC_PROJECTS = [
  { year: "2024", bg: "#1a1a2e" },
  { year: "2024", bg: "#16213e" },
  { year: "2023", bg: "#0f3460" },
  { year: "2023", bg: "#533483" },
  { year: "2024", bg: "#1a1a2e" },
  { year: "2023", bg: "#16213e" },
];

export const STATIC_STATS = [
  { value: 45,  suffix: "k+" },
  { value: 25,  suffix: "k+" },
  { value: 2.4, suffix: "k+" },
];

// Meta non-traduisibles des témoignages (noms propres, entreprises, étoiles)
// Le texte est traduit via testimonials.items.N.text dans les fichiers i18n
export const TESTIMONIALS_META = [
  { name: "Shikhon Islam", role: "Web Developer",   company: "Amazon",  stars: 5 },
  { name: "Rony Ahmed",    role: "Project Manager", company: "Envato",  stars: 5 },
  { name: "Maria Johnson", role: "CEO",             company: "TechCorp",stars: 5 },
];
