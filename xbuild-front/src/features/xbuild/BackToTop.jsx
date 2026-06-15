import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return show ? (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position: "fixed", bottom: 32, right: 32, zIndex: 999, width: 48, height: 48, borderRadius: "50%", background: "var(--color-primary, #0A1684)", border: "none", color: "#fff", cursor: "pointer", fontSize: 20, boxShadow: "0 4px 20px rgba(245,91,31,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
  ) : null;
}
