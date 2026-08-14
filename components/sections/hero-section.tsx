'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from 'next-themes';

import {
  Github as GithubIcon,
  Linkedin as LinkedinIcon,
  Instagram as InstagramIcon,
  Mail,
  Download,
  ArrowRight,
  Cpu,
  Code2,
  Database,
  Terminal,
  Server,
  Globe,
  Shield,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, SkipForward, Play, Pause } from 'lucide-react';


const TRACKS = [
  {
    src: "/music/moonlight-sonata.mp3",
    name: "Beethoven — Moonlight Sonata",
  }
];


function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAutoStarted = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [showName, setShowName] = useState(true);

  useEffect(() => {
    const audio = new Audio('/music/moonlight-sonata.mp3');

    audio.volume = volume;
    audio.preload = 'auto';
    audio.loop = true; // only 1 track, so loop it instead of stopping after one play

    audioRef.current = audio;

    const handleEnded = () => {
      setPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  // Browsers block autoplay-with-sound until the user interacts with the
  // page at least once. We listen for the first interaction anywhere on
  // the page and use that moment to auto-start playback.
  useEffect(() => {
    const tryAutoStart = () => {
      if (hasAutoStarted.current) return;
      hasAutoStarted.current = true;

      const audio = audioRef.current;
      if (!audio) return;

      audio.play()
        .then(() => {
          setPlaying(true);
          setShowName(true);
          setTimeout(() => setShowName(false), 3000);
        })
        .catch((err) => {
          // Autoplay still blocked (some mobile browsers need a tap
          // directly on the player) — user can press play manually.
          console.error('AUTOPLAY BLOCKED:', err);
        });
    };

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, tryAutoStart, { once: true }));

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, tryAutoStart));
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;

    console.log('PLAY CLICKED');
    console.log(audio);

    if (!audio) return;

    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        console.log('SUCCESS');
        hasAutoStarted.current = true; // manual start counts as "started"
        setPlaying(true);

        setShowName(true);

        setTimeout(() => {
          setShowName(false);
        }, 3000);
      }
    } catch (err) {
      console.error('PLAY ERROR:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {showName && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur border border-border text-xs text-muted-foreground max-w-[220px]"
          >
            <Music className="w-3 h-3 shrink-0 text-primary" />
            <span className="truncate">
              Beethoven — Moonlight Sonata
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-1 px-2 py-2 rounded-2xl bg-background/80 backdrop-blur border border-border shadow-lg">
        <button
          onClick={togglePlay}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-foreground"
        >
          {playing ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            setMuted(false);
          }}
          className="w-16 h-1 accent-primary cursor-pointer"
        />

        <button
          onClick={() => setMuted((m) => !m)}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-foreground"
        >
          {muted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MEDITATIVE (NEBULA) BACKGROUND
   — transparent base, adapts to light/dark,
     accent color follows your theme's primary
───────────────────────────────────────── */
function MeditativeBackground({ isDark }: { isDark: boolean }) {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const tpRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    W: 0, H: 0,
    mx: 0.5, my: 0.5, rmx: 0.5, rmy: 0.5,
    mvx: 0, mvy: 0,
    clickImpulse: 0, isDragging: false, dragEnergy: 0,
    clickRipples: [] as { x: number; y: number; t: number; strength: number }[],
    rafId: 0,
    smoothRafId: 0,
  });
  const isDarkRef = useRef(isDark);
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const bg = bgRef.current!;
    const fx = fxRef.current!;
    const tp = tpRef.current!;
    const bgX = bg.getContext('2d')!;
    const fxX = fx.getContext('2d')!;
    const tpX = tp.getContext('2d')!;
    const S = state.current;

    function resize() {
      S.W = bg.width = fx.width = tp.width = bg.offsetWidth;
      S.H = bg.height = fx.height = tp.height = bg.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(bg);

    const getRect = () => bg.getBoundingClientRect();
    const onDown = (x: number, y: number) => {
      S.isDragging = true; S.clickImpulse = 1.0;
      S.clickRipples.push({ x: x / S.W, y: y / S.H, t: 0, strength: 1.0 });
      if (S.clickRipples.length > 6) S.clickRipples.shift();
    };
    const onUp = () => { S.isDragging = false; };
    const onMove = (x: number, y: number) => {
      const pmx = S.mx, pmy = S.my;
      S.mx = x / S.W; S.my = y / S.H;
      S.mvx = (S.mx - pmx) * 60; S.mvy = (S.my - pmy) * 60;
      if (S.isDragging) {
        S.dragEnergy = Math.min(S.dragEnergy + Math.sqrt(S.mvx ** 2 + S.mvy ** 2) * 0.04, 1.5);
      }
    };
    const md = (e: MouseEvent) => { const r = getRect(); onDown(e.clientX - r.left, e.clientY - r.top); };
    const mu = () => onUp();
    const mm = (e: MouseEvent) => { const r = getRect(); onMove(e.clientX - r.left, e.clientY - r.top); };
    const td = (e: TouchEvent) => { const t = e.touches[0]; const r = getRect(); onDown(t.clientX - r.left, t.clientY - r.top); };
    const tm = (e: TouchEvent) => { const t = e.touches[0]; const r = getRect(); onMove(t.clientX - r.left, t.clientY - r.top); };

    bg.addEventListener('mousedown', md);
    window.addEventListener('mouseup', mu);
    window.addEventListener('mousemove', mm);
    bg.addEventListener('touchstart', td, { passive: true });
    window.addEventListener('touchend', mu);
    bg.addEventListener('touchmove', tm, { passive: true });

    const smooth = () => {
      S.rmx += (S.mx - S.rmx) * 0.04; S.rmy += (S.my - S.rmy) * 0.04;
      S.clickImpulse *= 0.94; S.dragEnergy *= 0.97; S.mvx *= 0.88; S.mvy *= 0.88;
      for (let i = S.clickRipples.length - 1; i >= 0; i--) {
        S.clickRipples[i].t += 0.016;
        if (S.clickRipples[i].t > 2.5) S.clickRipples.splice(i, 1);
      }
      S.smoothRafId = requestAnimationFrame(smooth);
    };
    smooth();

    const STAR_COUNT = 150;
    const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
      const rnd = (seed: number) => { const v = Math.sin(seed * 999) * 43758.5453; return v - Math.floor(v); };
      return {
        x: rnd(i * 12.9898),
        y: rnd(i * 78.233) * 0.85,
        r: 0.3 + rnd(i * 37.5) * 0.9,
        phase: rnd(i * 4.31) * Math.PI * 2,
      };
    });

    function draw(ts: number) {
      const { W, H, rmx, rmy, mvx, mvy, dragEnergy, clickRipples, clickImpulse } = S;
      const dark = isDarkRef.current;

      const bs = 0.18 * (0.5 + 0.5 * Math.sin(ts * 0.00068));

      bgX.clearRect(0, 0, W, H);
      fxX.clearRect(0, 0, W, H);
      tpX.clearRect(0, 0, W, H);

      // ── ONE ink color for everything: white in dark mode, black in light mode ──
      const [ar, ag, ab] = dark ? [255, 255, 255] : [10, 10, 10];
      // Multiplier bumps light-mode alpha up since black-on-white reads lighter than white-on-black
      const k = dark ? 1 : 1.55;

      // ── Central nebula glow ──
      const aox = (rmx - 0.5) * W * 0.12 + mvx * W * 0.018;
      const aoy = (rmy - 0.5) * H * 0.09 + mvy * H * 0.015;
      const ng = bgX.createRadialGradient(W * 0.5 + aox, H * 0.46 + aoy, 0, W * 0.5 + aox, H * 0.46 + aoy, W * (0.9 + dragEnergy * 0.15));
      ng.addColorStop(0, `rgba(${ar},${ag},${ab},${(0.09 + bs * 0.20 + dragEnergy * 0.05) * k})`);
      ng.addColorStop(0.38, `rgba(${ar},${ag},${ab},${(0.05 + bs * 0.09) * k})`);
      ng.addColorStop(0.72, `rgba(${ar},${ag},${ab},${(0.035 + bs * 0.045) * k})`);
      ng.addColorStop(1, 'transparent');
      bgX.fillStyle = ng; bgX.fillRect(0, 0, W, H);

      const ng2 = bgX.createRadialGradient(W * 0.2, H * 0.38, 0, W * 0.2, H * 0.38, W * 0.46);
      ng2.addColorStop(0, `rgba(${ar},${ag},${ab},${(0.05 + bs * 0.08) * k})`);
      ng2.addColorStop(1, 'transparent');
      bgX.fillStyle = ng2; bgX.fillRect(0, 0, W, H);

      const ng3 = bgX.createRadialGradient(W * 0.82, H * 0.35, 0, W * 0.82, H * 0.35, W * 0.38);
      ng3.addColorStop(0, `rgba(${ar},${ag},${ab},${(0.04 + bs * 0.06) * k})`);
      ng3.addColorStop(1, 'transparent');
      bgX.fillStyle = ng3; bgX.fillRect(0, 0, W, H);

      clickRipples.forEach((r) => {
        const g2 = bgX.createRadialGradient(r.x * W, r.y * H, 0, r.x * W, r.y * H, W * 0.2 * r.strength);
        g2.addColorStop(0, `rgba(${ar},${ag},${ab},${r.strength * 0.06 * Math.exp(-r.t * 1.2) * k})`);
        g2.addColorStop(1, 'transparent');
        bgX.fillStyle = g2; bgX.fillRect(0, 0, W, H);
      });

      // ── Soft nebula bands ──
      const bands: [number, number, number, number][] = [
        [0.74, 52, 0.52, 0.000038], [0.66, 40, 0.7, 0.000055], [0.59, 32, 0.92, 0.000072],
        [0.52, 25, 1.18, 0.000092], [0.46, 19, 1.52, 0.000115], [0.41, 13, 1.98, 0.000145],
      ];
      bands.forEach(([yc, a, fm, sp], i) => {
        const amp = a * (0.58 + 0.42 * bs);
        const ph = ts * sp;
        bgX.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const nx = x / W;
          let y = H * yc
            + Math.sin(nx * Math.PI * 2 * fm + ph * 7) * amp
            + Math.sin(nx * Math.PI * 3 * fm * 0.73 + ph * 5.2 + i) * amp * 0.4
            + (rmx - 0.5) * amp * 0.5 * Math.sin(nx * Math.PI * 2 + 0.5)
            + dragEnergy * amp * 0.3 * Math.sin(nx * Math.PI * 3 + ts * 0.003 + (rmx - 0.5) * 4);
          for (const r of clickRipples) {
            const dx = nx - r.x, age = r.t, wf = age * 0.6, spr = 0.12 + age * 0.2;
            y += r.strength * amp * 0.22 * Math.exp(-((Math.abs(dx) - wf) ** 2) / (spr ** 2)) * Math.exp(-age * 0.9) * Math.sin((Math.abs(dx) - wf) * 18);
          }
          x === 0 ? bgX.moveTo(0, y) : bgX.lineTo(x, y);
        }
        bgX.lineTo(W, H); bgX.lineTo(0, H); bgX.closePath();
        bgX.fillStyle = `rgba(${ar},${ag},${ab},${(0.045 + i * 0.008 + bs * 0.045) * k})`;
        bgX.fill();
      });

      // ── Starfield ──
      const starCount = dark ? stars.length : Math.round(stars.length * 0.45);
      for (let i = 0; i < starCount; i++) {
        const s = stars[i];
        const sx = s.x * W + mvx * s.r * 0.8;
        const sy = s.y * H + mvy * s.r * 0.5;
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(ts * 0.0014 + s.phase));
        bgX.beginPath();
        bgX.arc(sx, sy, s.r, 0, Math.PI * 2);
        bgX.fillStyle = `rgba(${ar},${ag},${ab},${(0.08 + bs * 0.12) * tw * k})`;
        bgX.fill();
        if (tw > 0.85 && s.r > 0.7) {
          const sg = bgX.createRadialGradient(sx, sy, 0, sx, sy, 5);
          sg.addColorStop(0, `rgba(${ar},${ag},${ab},${0.12 * tw * k})`);
          sg.addColorStop(1, 'transparent');
          bgX.fillStyle = sg;
          bgX.beginPath(); bgX.arc(sx, sy, 5, 0, Math.PI * 2); bgX.fill();
        }
      }

      // ── Flowing mouse-reactive lines ──
      const mxB = rmx - 0.5, myB = rmy - 0.5;
      const lines: [number, number, number, number, number, number][] = [
        [0.52, 0.033, 1.8, 0.000029, 0.16, 0.6], [0.43, 0.02, 2.9, 0.000043, 0.11, 0.4],
        [0.62, 0.027, 1.3, 0.000024, 0.13, 0.5], [0.47, 0.017, 3.5, 0.000052, 0.09, 0.4],
        [0.57, 0.038, 0.88, 0.000021, 0.15, 0.7],
      ];
      lines.forEach(([yc, a, fm, sp, op, w], li) => {
        const yB = H * yc + myB * H * 0.16 * (1 - li * 0.08);
        const ampBoost = 1 + Math.abs(mxB) * 2.0 + dragEnergy * 1.3 + Math.abs(myB) * 0.7;
        const amp = H * a * (0.48 + 0.52 * bs) * ampBoost;
        const fmMod = fm * (1 + mxB * 0.55 + mvx * 0.035);
        const ph = ts * sp;
        fxX.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const nx = x / W;
          let y = yB
            + Math.sin(nx * Math.PI * 2 * fmMod + ph * 5 + mxB * nx * 3.5) * amp
            + Math.sin(nx * Math.PI * 3 * fmMod * 0.7 + ph * 3) * amp * 0.38
            + mxB * amp * 0.6 * Math.sin(nx * Math.PI * 1.8 + li)
            + mvx * amp * 0.05 * Math.sin(nx * Math.PI * 2 + ph)
            + mvy * amp * 0.04 * Math.cos(nx * Math.PI * 1.5 + li);
          for (const r of clickRipples) {
            const dx = nx - r.x, age = r.t, wf = age * 0.55, sp2 = 0.1 + age * 0.15;
            y += r.strength * amp * 0.25 * Math.exp(-((Math.abs(dx) - wf) ** 2) / (sp2 ** 2)) * Math.exp(-age) * Math.sin((Math.abs(dx) - wf) * 18);
          }
          x === 0 ? fxX.moveTo(0, y) : fxX.lineTo(x, y);
        }
        const proximityBoost = Math.exp(-Math.abs(rmy - yc) * 3.5) * 0.5;
        fxX.strokeStyle = `rgba(${ar},${ag},${ab},${(op + proximityBoost) * (0.42 + 0.58 * bs) * k})`;
        fxX.lineWidth = w * (1 + proximityBoost * 1.8);
        fxX.stroke();
      });

      // ── Top overlay wave ──
      const yBase = H * (0.3 + rmy * 0.4);
      const wAmp2 = H * (0.03 + bs * 0.05) * (1 + rmx * 0.8 + Math.abs(rmy - 0.5) * 0.6) * (1 + dragEnergy * 0.8);
      for (let layer = 0; layer < 4; layer++) {
        const phOff = layer * 1.1;
        tpX.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const nx = x / W;
          let y = yBase
            + Math.sin(nx * Math.PI * 2 * (1 + rmx * 0.8) + ts * 0.000315 + phOff) * wAmp2
            + Math.sin(nx * Math.PI * 3.7 + ts * 0.000196 + phOff) * wAmp2 * 0.38
            + (rmx - 0.5) * H * 0.06 * Math.sin(nx * Math.PI + layer)
            + mvx * wAmp2 * 0.08 * Math.sin(nx * Math.PI * 3 + phOff)
            + mvy * wAmp2 * 0.05 * Math.cos(nx * Math.PI * 2 + layer);
          for (const r of clickRipples) {
            const dx = nx - r.x, age = r.t, wf = age * 0.55, sp = 0.1 + age * 0.15;
            y += r.strength * H * 0.016 * Math.exp(-((Math.abs(dx) - wf) ** 2) / (sp ** 2)) * Math.exp(-age) * Math.sin((Math.abs(dx) - wf) * 22);
          }
          x === 0 ? tpX.moveTo(0, y) : tpX.lineTo(x, y);
        }
        tpX.strokeStyle = `rgba(${ar},${ag},${ab},${(0.09 - 0.01 * layer) * (0.45 + bs * 0.65 + clickImpulse * 0.35) * k})`;
        tpX.lineWidth = 1.3 - layer * 0.25;
        tpX.stroke();
      }

      S.rafId = requestAnimationFrame(draw);
    }

    S.rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(S.rafId);
      cancelAnimationFrame(S.smoothRafId);
      ro.disconnect();
      bg.removeEventListener('mousedown', md);
      window.removeEventListener('mouseup', mu);
      window.removeEventListener('mousemove', mm);
      bg.removeEventListener('touchstart', td);
      window.removeEventListener('touchend', mu);
      bg.removeEventListener('touchmove', tm);
    };
  }, []);

  const base: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' };
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <canvas ref={bgRef} style={{ ...base, zIndex: 1 }} />
      <canvas ref={fxRef} style={{ ...base, zIndex: 2 }} />
      <canvas ref={tpRef} style={{ ...base, zIndex: 3, pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', inset: '-200%', width: '400%', height: '400%',
        zIndex: 4, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.02,
        animation: 'meditativeGrain 0.1s steps(1) infinite',
      }} />
      <style>{`
        @keyframes meditativeGrain {
          0%{transform:translate(0,0)}10%{transform:translate(-4%,-3%)}
          20%{transform:translate(3%,5%)}30%{transform:translate(-2%,4%)}
          40%{transform:translate(6%,-2%)}50%{transform:translate(-3%,2%)}
          60%{transform:translate(2%,6%)}70%{transform:translate(-5%,-1%)}
          80%{transform:translate(1%,3%)}90%{transform:translate(-2%,-4%)}
          100%{transform:translate(4%,2%)}
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────── */
function LoadingScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timer); setTimeout(() => onFinish(), 400); return 100; }
        return prev + 2;
      });
    }, 35);
    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[999] bg-background flex items-center justify-center"
    >
      <div className="w-[320px]">
        <div className="relative h-40 flex items-center justify-center mb-6">
          <motion.div animate={{ rotate: 360, scale: [1, 1.08, 1] }} transition={{ rotate: { repeat: Infinity, duration: 12, ease: 'linear' }, scale: { repeat: Infinity, duration: 3 } }}>
            <Cpu className="w-20 h-20 text-primary drop-shadow-[0_0_25px_rgba(59,130,246,0.9)]" />
          </motion.div>
          <motion.div className="absolute left-10 top-0" animate={{ rotate: -360, y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 7 }}>
            <Code2 className="w-8 h-8 text-primary/70" />
          </motion.div>
          <motion.div className="absolute right-8 top-4" animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3 }}>
            <Database className="w-10 h-10 text-primary/60" />
          </motion.div>
          <motion.div className="absolute left-0 top-16" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}>
            <Terminal className="w-9 h-9 text-primary/50" />
          </motion.div>
          <motion.div className="absolute right-0 top-20" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}>
            <Server className="w-9 h-9 text-primary/50" />
          </motion.div>
          <motion.div className="absolute left-8 bottom-2" animate={{ x: [0, 8, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 4 }}>
            <Globe className="w-8 h-8 text-primary/60" />
          </motion.div>
          <motion.div className="absolute right-8 bottom-0" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
            <Shield className="w-8 h-8 text-primary/70" />
          </motion.div>
        </div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-4xl font-bold mb-3">
          Rizqi <span className="text-primary">Fauzi</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8 h-6">
          {progress < 25 && 'Initializing System...'}
          {progress >= 25 && progress < 50 && 'Loading Components...'}
          {progress >= 50 && progress < 75 && 'Compiling Experience...'}
          {progress >= 75 && progress < 100 && 'Launching Portfolio...'}
          {progress === 100 && 'Ready!'}
        </p>
        <div className="h-[5px] bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ ease: 'linear' }} />
        </div>
        <div className="flex justify-between mt-3 text-xs text-muted-foreground">
          <span>System Booting...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SOCIAL LINKS
───────────────────────────────────────── */
const SOCIAL_LINKS = [
  { icon: GithubIcon,    href: 'https://github.com/RizqiFauu',                        label: 'GitHub'    },
  { icon: LinkedinIcon,  href: 'https://www.linkedin.com/in/rizqi-fauzi-417575336',                        label: 'LinkedIn'  },
  { icon: InstagramIcon, href: 'https://www.instagram.com/rizqifauu',                        label: 'Instagram' },
  { icon: Mail,          href: 'mailto:rizqifauzi.co@gmail.com', label: 'Email'  },
];

/* ─────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────── */
export function HeroSection() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();

  const [mounted,       setMounted]       = useState(false);
  const [loading,       setLoading]       = useState(true);
  const [displayedRole, setDisplayedRole] = useState('');
  const [roleIndex,     setRoleIndex]     = useState(0);
  const [charIndex,     setCharIndex]     = useState(0);

  useEffect(() => { setMounted(true); }, []);
  const handleFinish = useCallback(() => setLoading(false), []);

  const isDark = mounted && resolvedTheme === 'dark';

  const roles = t('Full Stack Developer,Frontend Engineer,UI/UX Enthusiast,Creative Technologist')
    .split(',').map((r: string) => r.trim());

  useEffect(() => {
    if (!roles.length) return;
    const currentRole = roles[roleIndex];
    const delay = setTimeout(() => {
      if (charIndex < currentRole.length) {
        setDisplayedRole(currentRole.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (roleIndex < roles.length - 1) {
        setTimeout(() => { setRoleIndex(roleIndex + 1); setCharIndex(0); setDisplayedRole(''); }, 2000);
      } else {
        setTimeout(() => { setRoleIndex(0); setCharIndex(0); setDisplayedRole(''); }, 2000);
      }
    }, 100);
    return () => clearTimeout(delay);
  }, [charIndex, roleIndex, roles]);

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  if (loading) return <LoadingScreen onFinish={handleFinish} />;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">

      {/* Classical animated background — transparent, theme-aware colors */}
      <MeditativeBackground isDark={isDark} />

      {/* Music player — fixed floating control, bottom-right */}
      <MusicPlayer />

      {/* Content — pure Tailwind theme classes, exactly like original */}
      <motion.div
        className="relative z-10 max-w-4xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Title */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
            {t('home.title')}{' '}
            <span className="text-primary">Rizqi Fauzi</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-4">
          {t('home.subtitle')}
        </motion.h2>

        {/* Typing */}
        <motion.div variants={itemVariants} className="text-xl md:text-2xl font-medium text-foreground mb-8 h-12 flex items-center justify-center">
          <span>{displayedRole}</span>
          <span className="animate-pulse">|</span>
        </motion.div>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t('home.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Download className="w-5 h-5" />
            {t('home.cta.downloadCV')}
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
          >
            {t('home.cta.contactMe')}
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted/50 transition-colors"
          >
            {t('home.cta.viewProjects')}
          </Link>
        </motion.div>

        {/* Social Links */}
        <motion.div variants={itemVariants} className="flex justify-center gap-4">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}