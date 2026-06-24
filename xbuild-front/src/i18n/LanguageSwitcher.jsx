import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

/* ── SVG flags — work on all OS including Windows ── */
function FlagFR({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ borderRadius: "50%", flexShrink: 0, display: "block" }}>
      <circle cx="10" cy="10" r="10" fill="#fff"/>
      <path d="M0 10 A10 10 0 0 1 6.67 0.55 L6.67 19.45 A10 10 0 0 1 0 10Z" fill="#002395"/>
      <path d="M13.33 0.55 A10 10 0 0 1 13.33 19.45 L13.33 0.55Z" fill="#fff"/>
      <path d="M13.33 0.55 A10 10 0 0 1 20 10 A10 10 0 0 1 13.33 19.45 L13.33 0.55Z" fill="#ED2939"/>
    </svg>
  );
}

function FlagGB({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ borderRadius: "50%", flexShrink: 0, display: "block" }}>
      <circle cx="10" cy="10" r="10" fill="#012169"/>
      {/* White diagonals */}
      <line x1="0" y1="0" x2="20" y2="20" stroke="#fff" strokeWidth="4"/>
      <line x1="20" y1="0" x2="0" y2="20" stroke="#fff" strokeWidth="4"/>
      {/* Red diagonals */}
      <line x1="0" y1="0" x2="20" y2="20" stroke="#C8102E" strokeWidth="2.4"/>
      <line x1="20" y1="0" x2="0" y2="20" stroke="#C8102E" strokeWidth="2.4"/>
      {/* White cross */}
      <rect x="8.5" y="0" width="3" height="20" fill="#fff"/>
      <rect x="0" y="8.5" width="20" height="3" fill="#fff"/>
      {/* Red cross */}
      <rect x="9" y="0" width="2" height="20" fill="#C8102E"/>
      <rect x="0" y="9" width="20" height="2" fill="#C8102E"/>
      <circle cx="10" cy="10" r="10" fill="none" stroke="#012169" strokeWidth="0"/>
    </svg>
  );
}

const LANGUAGES = [
  { code: "fr", Flag: FlagFR, name: "Français", short: "FR" },
  { code: "en", Flag: FlagGB, name: "English",  short: "EN" },
];

export default function LanguageSwitcher({ dark = true }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const change = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const textColor  = dark ? "#fff"                            : "var(--color-dark, #121315)";
  const dropBg     = dark ? "#1c1e23"                         : "#fff";
  const dropBorder = dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e8e8e8";
  const hoverBg    = dark ? "rgba(255,255,255,0.06)"          : "rgba(0,0,0,0.04)";

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 2000 }}>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .ls-trigger {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px; border-radius: 8px; cursor: pointer;
          border: 1.5px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)"};
          background: ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)"};
          color: ${textColor};
          font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13px;
          transition: background 0.2s, border-color 0.2s;
          user-select: none;
        }
        .ls-trigger:hover {
          background: ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)"};
          border-color: var(--color-primary, #0A1684);
        }
        .ls-chevron {
          width: 14px; height: 14px; flex-shrink: 0;
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          opacity: 0.6;
        }
        .ls-chevron.open { transform: rotate(180deg); }
        .ls-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: ${dropBg}; border: ${dropBorder};
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.1);
          min-width: 168px;
          animation: dropIn 0.18s cubic-bezier(0.4,0,0.2,1);
        }
        .ls-option {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 11px 14px; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          text-align: left; background: transparent;
          transition: background 0.15s;
          color: ${textColor};
          border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.05)" : "#f0f0f0"};
        }
        .ls-option:last-child { border-bottom: none; }
        .ls-option:hover { background: ${hoverBg}; }
        .ls-option.selected {
          background: rgba(245,91,31,0.10);
          color: var(--color-primary, #0A1684);
          font-weight: 700;
        }
        .ls-check {
          margin-left: auto; color: var(--color-primary, #0A1684);
          font-size: 13px; font-weight: 700;
        }
        .ls-name { font-size: 13px; font-weight: 500; }
      `}</style>

      {/* Trigger button */}
      <button className="ls-trigger" onClick={() => setOpen((o) => !o)}>
        <current.Flag size={20} />
        <span style={{ letterSpacing: 0.5 }}>{current.short}</span>
        <svg className={`ls-chevron${open ? " open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="ls-dropdown">
          <div style={{
            padding: "8px 14px 6px",
            fontSize: 10, fontWeight: 700, letterSpacing: 2,
            textTransform: "uppercase",
            color: dark ? "rgba(255,255,255,0.3)" : "#bbb",
            fontFamily: "'DM Sans', sans-serif",
            borderBottom: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f0f0f0",
          }}>
            Language
          </div>

          {LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                className={`ls-option${isSelected ? " selected" : ""}`}
                onClick={() => change(lang.code)}
              >
                <lang.Flag size={22} />
                <span className="ls-name">{lang.name}</span>
                {isSelected && <span className="ls-check">✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}