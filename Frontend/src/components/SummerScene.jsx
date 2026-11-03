import { useEffect, useRef } from 'react';

const BookmarkGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="scene__glyph">
    <path
      d="M6 2.75h12c.69 0 1.25.56 1.25 1.25v17.25L12 17.4l-7.25 3.85V4c0-.69.56-1.25 1.25-1.25Z"
      fill="currentColor"
    />
  </svg>
);

const SunGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="scene__glyph">
    <circle cx="12" cy="12" r="4.2" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
    </g>
  </svg>
);

const PalmLeaf = ({ className }) => (
  <svg className={className} viewBox="0 0 240 160" fill="none" aria-hidden="true">
    <path
      d="M6 152C60 118 120 86 232 60"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path d="M38 132C46 102 74 76 108 62C92 90 72 110 38 132Z" fill="currentColor" opacity=".8" />
    <path d="M66 118C82 88 112 68 148 58C126 84 100 104 66 118Z" fill="currentColor" opacity=".95" />
    <path d="M98 104C120 80 152 66 188 60C160 82 132 96 98 104Z" fill="currentColor" opacity=".7" />
    <path d="M134 92C158 76 188 68 220 66C192 82 164 90 134 92Z" fill="currentColor" opacity=".85" />
    <path d="M52 126C48 96 40 72 24 50C52 62 70 88 76 118Z" fill="currentColor" opacity=".6" />
  </svg>
);

export default function SummerScene() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = sceneRef.current;
    if (!canvas || !host) return undefined;

    const context = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let frameId = 0;
    let width = 0;
    let height = 0;
    let particles = [];

    const makeParticle = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 2.2,
      speed: 0.15 + Math.random() * 0.55,
      sway: 0.35 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      tone: Math.random() > 0.45 ? '255, 218, 138' : '132, 238, 243',
      alpha: 0.22 + Math.random() * 0.5,
    });

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.max(18, Math.round(width / 12)));
      particles = Array.from({ length: count }, makeParticle);
    };

    const paint = (time) => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!reduceMotion) {
          particle.y -= particle.speed;
          particle.x += Math.sin(time / 1500 + particle.phase) * 0.25 * particle.sway;

          if (particle.y < -8) {
            particle.y = height + 8;
            particle.x = Math.random() * width;
          }
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
        }

        context.beginPath();
        context.fillStyle = `rgba(${particle.tone}, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      if (!reduceMotion) frameId = window.requestAnimationFrame(paint);
    };

    resize();
    paint(0);

    const observer = new ResizeObserver(resize);
    observer.observe(host);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const host = sceneRef.current;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    host.style.setProperty('--shift-x', `${px * 20}px`);
    host.style.setProperty('--shift-y', `${py * 16}px`);
    host.style.setProperty('--tilt-x', `${-py * 8}deg`);
    host.style.setProperty('--tilt-y', `${px * 11}deg`);
  };

  const handlePointerLeave = () => {
    const host = sceneRef.current;
    if (!host) return;

    host.style.setProperty('--shift-x', '0px');
    host.style.setProperty('--shift-y', '0px');
    host.style.setProperty('--tilt-x', '0deg');
    host.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      className="scene"
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      <canvas className="scene__particles" ref={canvasRef} />

      <div className="scene__parallax">
        <div className="scene__sun">
          <span className="scene__sun-rays" />
          <span className="scene__sun-core" />
        </div>

        <div className="scene__ring scene__ring--a" />
        <div className="scene__ring scene__ring--b" />

        <div className="scene__chip scene__chip--a">beach reads</div>
        <div className="scene__chip scene__chip--b">travel</div>
        <div className="scene__chip scene__chip--c">chill</div>

        <div className="scene__card">
          <div className="scene__card-inner">
            <div className="scene__face scene__face--front">
              <BookmarkGlyph />
              <span className="scene__face-title">VIP</span>
              <span className="scene__face-sub">Summer ’26</span>
            </div>
            <div className="scene__face scene__face--back">
              <SunGlyph />
              <span className="scene__face-title">Saved</span>
              <span className="scene__face-sub">with sunshine</span>
            </div>
          </div>
        </div>
      </div>

      <PalmLeaf className="scene__palm scene__palm--left" />
      <PalmLeaf className="scene__palm scene__palm--right" />

      <span className="scene__caption">live 3d · summer vip</span>
    </div>
  );
}
