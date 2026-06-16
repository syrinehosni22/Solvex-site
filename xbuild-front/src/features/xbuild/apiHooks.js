import { useEffect, useState } from "react";
import { hexToRgb, darkenHex } from "./helpers";

export function useApiList(path, fallback) {
  const [data, setData] = useState(fallback);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(path);
        if (!res.ok) return;
        const json = await res.json();
        if (!cancelled && Array.isArray(json) && json.length) setData(json);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [path]);
  return data;
}

// Fetches a single resource by id, e.g. useApiItem("/api/blog", "abc123")
// Returns { data, loading, error }
export function useApiItem(basePath, id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true); setError("");
    (async () => {
      try {
        const res = await fetch(`${basePath}/${id}`);
        if (!res.ok) throw new Error("not found");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e.message || "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [basePath, id]);
  return { data, loading, error };
}

export const INFO_DEFAULT = {
  companyName: "",
  logoImage: "",           // URL image logo (si vide → texte stylisé)
  // ── Couleurs du thème (paramétrables, voir useThemeVars) ──
  primaryColor: "#0A1684", // couleur d'accent principale (boutons, liens, badges…)
  darkColor: "#121315",    // couleur sombre secondaire (fonds foncés, textes)
  tagline_fr: "Nous Construisons & Gérons Vos Chantiers",
  tagline_en: "We Build & Construction Site Management",
  about_fr: "Nous fournissons des services de construction et d'ingénierie de premier plan depuis plus de 25 ans.",
  about_en: "We provide premium construction and engineering services for over 25 years.",
  footerAbout_fr: "Votre partenaire de confiance pour tous vos projets de construction.",
  footerAbout_en: "Your trusted partner for all construction projects.",
  heroDesc_fr: "Des solutions de construction innovantes pour vos projets les plus ambitieux.",
  heroDesc_en: "Innovative construction solutions for your most ambitious projects.",
  heroStats: { projects: "45K+", clients: "25K+", engineers: "120+" },
  heroImage:  "",
  aboutImage: "",
  statsImage: "",
  yearsExperience: 25,
  ceoName: "Shikhon Islam",
  address: "4648 Rocky, New York",
  email: "example@gmail.com",
  phone: "+88 0123 654 99",
  workingHours: "Mon-Fri, 09am - 05pm",
  socialFacebook: "#",  socialFacebookActive: true,
  socialTwitter:  "#",  socialTwitterActive:  true,
  socialYoutube:  "#",  socialYoutubeActive:  true,
  socialLinkedin: "#",  socialLinkedinActive: true,

  // ── Section "À propos" (Qui sommes-nous) ──
  aboutTag_fr: "À Propos de Notre Entreprise",
  aboutTag_en: "About Our Company",
  aboutTitle_fr: "Nous Offrons la Qualité Sans Compromis",
  aboutTitle_en: "We Offer Quality Without Compromise",
  aboutHighlights: [
    { icon: "🏅", title_fr: "Haute Qualité", title_en: "High Quality", subtitle_fr: "Services Fiables", subtitle_en: "Reliable Services" },
    { icon: "⚡", title_fr: "Rapide & Flexible", title_en: "Fast & Flexible", subtitle_fr: "Livraison de Projet", subtitle_en: "Project Delivery" },
  ],
  awardTitle_fr: "Primé", awardTitle_en: "Award Winning",
  awardSub_fr: "Meilleur Constructeur Industriel", awardSub_en: "Best Industrial Builder",
  consultTitle_fr: "Planifiez votre consultation gratuite dès aujourd'hui !",
  consultTitle_en: "Plan your free consultation today!",
  consultCta_fr: "Contactez-nous", consultCta_en: "Contact Us",

  // ── Section "Pourquoi nous choisir" ──
  whyTag_fr: "Pourquoi Nous Choisir",
  whyTag_en: "Why Choose Us",
  whyTitle_fr: "Pourquoi Nous Choisir ?",
  whyTitle_en: "Why Choose Us?",
  whyDesc_fr: "Chez XBuild, nous sommes animés par l'excellence, l'innovation et une compréhension approfondie des enjeux de la construction. Forts de plus de 25 ans d'expertise, nous concevons et livrons des solutions performantes adaptées à vos besoins opérationnels. Notre engagement envers la qualité, la sécurité et la satisfaction client garantit la réussite durable de chaque projet.",
  whyDesc_en: "At XBuild, we are driven by excellence, innovation and a deep understanding of construction challenges. With over 25 years of expertise, we design and deliver high-performance solutions tailored to your operational needs. Our commitment to quality, safety and client satisfaction ensures the lasting success of every project.",
  whyImage: "",
  whyItems: [
    { icon: "🏆", title_fr: "Expertise Reconnue", title_en: "Proven Expertise", desc_fr: "Plus de 25 ans d'expérience dans la construction, avec des solutions d'ingénierie éprouvées et fiables.", desc_en: "Over 25 years of experience in construction, delivering proven and reliable engineering solutions." },
    { icon: "📋", title_fr: "Solutions Complètes", title_en: "Comprehensive Solutions", desc_fr: "De la planification à l'exécution, nous assurons une gestion complète de vos projets de construction.", desc_en: "From planning to execution, we provide complete management of your construction projects." },
    { icon: "🎯", title_fr: "Approche Sur Mesure", title_en: "Tailored Approach", desc_fr: "Chaque solution est adaptée à vos besoins spécifiques, pour une efficacité et une satisfaction client maximales.", desc_en: "Every solution is adapted to your specific needs, maximizing efficiency and client satisfaction." },
  ],
};

export function useInfo() {
  const [info, setInfo] = useState(INFO_DEFAULT);
  useEffect(() => {
    fetch("/api/info")
      .then(r => r.json())
      .then(d => setInfo({
        ...INFO_DEFAULT, ...d,
        heroStats: { ...INFO_DEFAULT.heroStats, ...(d.heroStats || {}) },
      }))
      .catch(() => {});
  }, []);
  return info;
}

// Applique les couleurs du thème (depuis /api/info) comme variables CSS globales
// sur <html>, afin que tout le design (site + admin) reste cohérent et que la
// couleur principale soit modifiable depuis l'admin sans toucher au code.
export function useThemeVars(info) {
  useEffect(() => {
    const root = document.documentElement;
    const primary = info?.primaryColor || INFO_DEFAULT.primaryColor;
    const dark = info?.darkColor || INFO_DEFAULT.darkColor;
    root.style.setProperty("--color-primary", primary);
    root.style.setProperty("--color-primary-rgb", hexToRgb(primary));
    root.style.setProperty("--color-primary-dark", darkenHex(primary, 0.12));
    root.style.setProperty("--color-dark", dark);
    root.style.setProperty("--color-dark-rgb", hexToRgb(dark));
  }, [info?.primaryColor, info?.darkColor]);
}