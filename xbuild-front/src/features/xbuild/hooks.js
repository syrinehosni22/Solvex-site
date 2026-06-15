// Hooks extraits de XBuild-React.jsx
// NB: généré automatiquement via transform_xbuild.py

import { useEffect, useRef, useState } from "react";

export function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(parseFloat(current.toFixed(1)));
    }, 16);
    return () => clearInterval(timer);
  }, [start, target, duration]);
  return count;
}

export function useIntersect(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// Cycles through indices [0..length-1] automatically every `intervalMs`.
// Pass `paused` to temporarily stop the rotation (e.g. on hover).
export function useCarousel(length, intervalMs = 4000, paused = false) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (length <= 1 || paused) return;
    const timer = setInterval(() => setIndex(i => (i + 1) % length), intervalMs);
    return () => clearInterval(timer);
  }, [length, intervalMs, paused]);
  // Clamp in case the underlying images array shrinks
  return length > 0 ? index % length : 0;
}