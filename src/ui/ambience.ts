import { $ } from "./dom";
export function startAmbience() {
  const cvs = $("sky"),
    ctx = cvs.getContext("2d", {
      alpha: true,
    });
  if (!ctx) return;
  let w = 0,
    h = 0,
    particles: {
      x: number;
      y: number;
      r: number;
      v: number;
      phase: number;
    }[] = [],
    prev = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    cvs.width = Math.round(w * ratio);
    cvs.height = Math.round(h * ratio);
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from(
      {
        length: w < 650 ? 22 : 45,
      },
      () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.65,
        v: 0.05 + Math.random() * 0.22,
        phase: Math.random() * 6.28,
      }),
    );
  }
  resize();
  addEventListener("resize", resize, {
    passive: true,
  });
  function draw(t: number) {
    requestAnimationFrame(draw);
    if (document.hidden || t - prev < 33) return;
    const delta = Math.min(t - prev, 80);
    prev = t;
    ctx!.clearRect(0, 0, w, h);
    const light = document.documentElement.dataset.theme === "light";
    for (const p of particles) {
      p.y -= p.v * delta * 0.048;
      if (p.y < -10) {
        p.y = h + 5;
        p.x = Math.random() * w;
      }
      p.x += Math.sin(t * 0.0003 + p.phase) * 0.032;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx!.fillStyle = light ? "rgba(135,118,67,.22)" : "rgba(176,229,195,.35)";
      ctx!.fill();
    }
  }
  if (!reduce) requestAnimationFrame(draw);
}
