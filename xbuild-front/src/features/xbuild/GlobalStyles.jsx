export default function GlobalStyles() {
  return (
    <style>{`
      :root {
        --color-primary: #323F7C;
        --color-primary-rgb: 50, 63, 124;
        --color-primary-dark: #2C376D;
        --color-secondary: #EFAB02;
        --color-secondary-rgb: 239, 171, 2;
        --color-secondary-dark: #CB9102;
        --color-dark: #121315;
        --color-dark-rgb: 18, 19, 21;
      }
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { overflow-x: hidden; max-width: 100vw; }
      #root { overflow-x: hidden; }

      @keyframes pulse { from { opacity: 0.5 } to { opacity: 1 } }
      @keyframes loader { 0% { transform: translateX(-100%) } 100% { transform: translateX(400%) } }
      @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
      @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
      input::placeholder, textarea::placeholder { color: #aaa; }

      @media (max-width: 800px) {
        .hero-content { padding: 140px 20px 80px 20px !important; }
        .hero-stats-bar { padding: 0 !important; flex-wrap: wrap !important; }
        .hero-stat-card { min-width: 50% !important; flex: none !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,.2) !important; }
        .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .about-highlights-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        .service-row { grid-template-columns: 1fr !important; gap: 32px !important; }
        .service-row > div { order: initial !important; }
        .service-features-grid { grid-template-columns: 1fr !important; }
        .projects-grid { grid-template-columns: 1fr !important; grid-auto-rows: 200px !important; }
        .projects-grid > div { grid-column: auto !important; }
        .process-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .process-steps-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        .process-line { display: none !important; }
        .stats-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .contact-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .footer-top-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
        .footer-bottom-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        .news-grid { grid-template-columns: 1fr !important; }
        .section-padding { padding: 64px 0 !important; }
      }

      @media (max-width: 480px) {
        .footer-bottom-grid { grid-template-columns: 1fr !important; }
        .about-features-grid { grid-template-columns: 1fr !important; }
        .stats-counts { flex-direction: column !important; gap: 24px !important; }
        .hero-btns { flex-direction: column !important; gap: 12px !important; }
        .hero-btns button, .hero-btns a { width: 100% !important; clip-path: none !important; text-align: center !important; justify-content: center !important; }
        .hero-stat-card { min-width: 100% !important; }
      }
    `}</style>
  );
}