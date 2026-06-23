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
   CLASSICAL CANVAS BACKGROUND
   — transparent base, adapts to light/dark
───────────────────────────────────────── */
function ClassicalBackground({ isDark }: { isDark: boolean }) {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const tpRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    W: 0, H: 0,
    mx: 0.5, my: 0.5, rmx: 0.5, rmy: 0.5,
    pmx: 0.5, pmy: 0.5, mvx: 0, mvy: 0,
    clickImpulse: 0, isDragging: false, dragEnergy: 0,
    clickRipples: [] as { x: number; y: number; t: number; strength: number }[],
    wavePhase: 0,
    rafId: 0,
    smoothRafId: 0,
    last: 0,
  });
  // Keep isDark accessible inside the draw loop via ref
  const isDarkRef = useRef(isDark);
  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  function RNG(seed: number) {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  const NOTES_PER_STAVE = 16;
  const NOTE_DATA = Array.from({ length: 4 }, (_, si) =>
    Array.from({ length: NOTES_PER_STAVE }, (_, ni) => {
      const r = RNG(si * 100 + ni * 7);
      return { pos: Math.floor(r() * 9) - 4, type: Math.floor(r() * 3), rest: r() > 0.82 };
    })
  );

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
      S.pmx = S.mx; S.pmy = S.my;
      S.mx = x / S.W; S.my = y / S.H;
      S.mvx = (S.mx - S.pmx) * 60; S.mvy = (S.my - S.pmy) * 60;
      if (S.isDragging) {
        S.dragEnergy = Math.min(S.dragEnergy + Math.sqrt(S.mvx ** 2 + S.mvy ** 2) * 0.04, 1.5);
        if (Math.random() < 0.08) {
          S.clickRipples.push({ x: S.mx, y: S.my, t: 0, strength: 0.4 + S.dragEnergy * 0.3 });
          if (S.clickRipples.length > 8) S.clickRipples.shift();
        }
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

    function draw(ts: number) {
      const { W, H, rmx, rmy, mvx, mvy, dragEnergy, clickImpulse, clickRipples } = S;
      S.last = ts;
      const dark = isDarkRef.current;

      // Gentle idle pulse
      const bs = 0.18 * (0.5 + 0.5 * Math.sin(ts * 0.00068));

      bgX.clearRect(0, 0, W, H);
      fxX.clearRect(0, 0, W, H);
      tpX.clearRect(0, 0, W, H);

      // ── Theme-adaptive colors ──
      // In dark mode: lines are white-ish, accent is blue-white glow
      // In light mode: lines are dark, accent is dark ink
      const lineColor   = dark ? '220,220,220' : '40,20,10';
      const clefColor   = dark ? '200,200,200' : '60,25,10';
      const barColor    = dark ? '180,180,180' : '55,18,8';
      const noteColor   = dark ? '230,230,230' : '50,18,8';
      const activeNote  = dark ? '150,180,255' : '140,10,30';  // blue highlight in dark, red in light
      const waveInk     = dark ? '180,200,255' : '60,20,10';   // ink waves
      const waveAccent  = dark ? '120,160,255' : '180,18,45';  // main red/blue wave
      const accentA     = dark ? '100,140,255' : '230,100,130';
      const accentB     = dark ? '80,120,240'  : '200,30,60';
      const accentC     = dark ? '60,100,220'  : '180,18,45';
      const accentD     = dark ? '140,170,255' : '240,130,160';
      const mouseSpot   = dark ? '120,150,255' : '200,140,80';
      const rippleCol   = dark ? '100,130,255' : '180,60,50';

      // ── Subtle mouse glow (no parchment fill — transparent bg) ──
      const ms = bgX.createRadialGradient(W * rmx, H * rmy, 0, W * rmx, H * rmy, W * (0.28 + dragEnergy * 0.06));
      ms.addColorStop(0, `rgba(${mouseSpot},${0.06 + dragEnergy * 0.04})`);
      ms.addColorStop(1, 'transparent');
      bgX.fillStyle = ms; bgX.fillRect(0, 0, W, H);

      // Click ripple glow
      clickRipples.forEach(r => {
        const g = bgX.createRadialGradient(r.x * W, r.y * H, 0, r.x * W, r.y * H, W * 0.15 * r.strength);
        g.addColorStop(0, `rgba(${rippleCol},${r.strength * 0.05 * Math.exp(-r.t * 1.5)})`);
        g.addColorStop(1, 'transparent');
        bgX.fillStyle = g; bgX.fillRect(0, 0, W, H);
      });

      // ── Sheet music staves ──
      const staveY = [H * 0.2, H * 0.38, H * 0.56, H * 0.74];
      const stavePeriod = 8;
      const activeStave = Math.floor(((ts * 0.001) / stavePeriod) % 4);
      const notePlayPos = (((ts * 0.001) / stavePeriod) % 1) * NOTES_PER_STAVE;

      for (let s = 0; s < 4; s++) {
        const baseY = staveY[s], scrollX = (ts * 0.021 * (1 + s * 0.42)) % W;

        // Staff lines — fade at edges
        for (let line = 0; line < 5; line++) {
          const ly = baseY + line * 9;
          const lg = bgX.createLinearGradient(0, 0, W, 0);
          lg.addColorStop(0, 'transparent');
          lg.addColorStop(0.04, `rgba(${lineColor},${0.12 + bs * 0.05})`);
          lg.addColorStop(0.96, `rgba(${lineColor},${0.12 + bs * 0.05})`);
          lg.addColorStop(1, 'transparent');
          bgX.strokeStyle = lg; bgX.lineWidth = 0.7;
          bgX.beginPath(); bgX.moveTo(0, ly); bgX.lineTo(W, ly); bgX.stroke();
        }

        // Treble clef
        bgX.font = `${34 + s * 2}px serif`;
        bgX.fillStyle = `rgba(${clefColor},${0.18 + bs * 0.08})`;
        bgX.fillText('𝄞', Math.max(18, 40 - scrollX * 0.03), baseY + 26);

        // Bar lines
        for (let b = 0; b < 6; b++) {
          const bx = (b * (W / 5.5) + W - scrollX) % W;
          if (bx > 58 && bx < W - 10) {
            bgX.beginPath(); bgX.moveTo(bx, baseY - 2); bgX.lineTo(bx, baseY + 38);
            bgX.strokeStyle = `rgba(${barColor},${0.10 + bs * 0.04})`; bgX.lineWidth = 1.1; bgX.stroke();
          }
        }

        // Notes
        NOTE_DATA[s].forEach((nd, ni) => {
          const nx = (ni * (W / NOTES_PER_STAVE) + W - scrollX * 1.85) % W;
          if (nx < 58 || nx > W - 10) return;
          const ny = baseY + nd.pos * 4.5 + 18;
          const isNear = s === activeStave && Math.abs(ni - notePlayPos) < 1.2;
          const na = isNear ? 0.22 + bs * 0.18 : 0.12 + bs * 0.1;
          const col = isNear ? `rgba(${activeNote},${na + 0.08})` : `rgba(${noteColor},${na})`;
          if (nd.rest) {
            bgX.strokeStyle = `rgba(${noteColor},${na * 0.8})`; bgX.lineWidth = 1.4;
            bgX.beginPath(); bgX.moveTo(nx - 6, ny - 6); bgX.lineTo(nx + 6, ny - 6); bgX.stroke(); return;
          }
          const vib = Math.sin(ts * 0.003 + ni * 1.2) * bs * 2.5 + (rmx - 0.5) * bs * 3 + mvx * 0.4 * Math.sin(ni * 0.3);
          bgX.beginPath(); bgX.ellipse(nx + vib, ny, 5.5, 4.2, -0.2, 0, Math.PI * 2);
          bgX.fillStyle = col; bgX.fill();
          const sd = nd.pos < 0 ? 1 : -1;
          bgX.beginPath(); bgX.moveTo(nx + vib + 4.5, ny); bgX.lineTo(nx + vib + 4.5, ny - 28 * sd);
          bgX.strokeStyle = col; bgX.lineWidth = 1.1; bgX.stroke();
          if (nd.type === 2) {
            bgX.beginPath();
            bgX.moveTo(nx + vib + 4.5, ny - 28 * sd);
            bgX.quadraticCurveTo(nx + vib + 22, ny - 20 * sd, nx + vib + 18, ny - 10 * sd);
            bgX.strokeStyle = `rgba(${noteColor},${na * 0.7})`; bgX.lineWidth = 1; bgX.stroke();
          }
          if (nd.pos > 4 || nd.pos < -4) {
            bgX.beginPath(); bgX.moveTo(nx - 7, ny); bgX.lineTo(nx + 12, ny);
            bgX.strokeStyle = `rgba(${noteColor},${na * 0.65})`; bgX.lineWidth = 0.75; bgX.stroke();
          }
        });
      }

      // ── Ink waves (mouse-reactive) ──
      const mxB = rmx - 0.5, myB = rmy - 0.5;
      ([[0.72, 22, 0.62, 0.000038, 0.13, 1.8], [0.65, 17, 0.98, 0.00005, 0.10, 1.4],
        [0.79, 15, 0.43, 0.000027, 0.09, 2.0], [0.59, 11, 1.52, 0.000063, 0.07, 1.0]] as number[][])
        .forEach(([yc, a, fm, sp, op, w], i) => {
          const yB = H * yc + myB * H * 0.1 * (1 - i * 0.1);
          const boost = 1 + Math.abs(mxB) * 2.2 + dragEnergy * 1.5 + Math.abs(myB) * 0.9;
          const amp = a * (0.48 + 0.52 * bs) * boost;
          const fmM = fm * (1 + mxB * 0.5 + mvx * 0.045);
          const ph = ts * sp;
          fxX.beginPath();
          for (let x = 0; x <= W; x += 4) {
            const nx = x / W;
            let y = yB + Math.sin(nx * Math.PI * 2 * fmM + ph * 5 + mxB * nx * 4.5) * amp
              + mxB * amp * 0.55 * Math.sin(nx * Math.PI * 2.5 + i)
              + Math.sin(nx * Math.PI * 3 * fmM * 0.7 + ph * 3.5 + i) * amp * 0.42
              + mvx * amp * 0.09 * Math.sin(nx * Math.PI * 2.2)
              + mvy * amp * 0.06 * Math.cos(nx * Math.PI * 1.8 + i);
            for (const r of clickRipples) {
              const dx = nx - r.x, age = r.t, wf = age * 0.5, sp2 = 0.1 + age * 0.15;
              y += r.strength * amp * 0.24 * Math.exp(-((Math.abs(dx) - wf) ** 2) / (sp2 ** 2)) * Math.exp(-age) * Math.sin((Math.abs(dx) - wf) * 18);
            }
            x === 0 ? fxX.moveTo(0, y) : fxX.lineTo(x, y);
          }
          const prox = Math.exp(-Math.abs(rmy - yc) * 3.5) * 0.4;
          fxX.strokeStyle = `rgba(${waveInk},${(op + prox) * (0.38 + 0.62 * bs)})`;
          fxX.lineWidth = w * (1 + prox * 1.6); fxX.stroke();
        });

      // ── Main accent wave (red in light / blue in dark) ──
      const scrollSync = notePlayPos / NOTES_PER_STAVE;
      S.wavePhase += 0.0008;
      ([[0.5, 0.038, 1.6, 3.0, 0.48 + bs * 0.28], [0.5, 0.062, 1.6, 9.0, 0.12 + bs * 0.16], [0.5, 0.028, 3.2, 1.5, 0.32 + bs * 0.22]] as number[][])
        .forEach(([yFrac, ampFrac, freq, lineW, alpha], li) => {
          const wY = H * (yFrac + (rmy - 0.5) * 0.22);
          const wAmp = H * ampFrac * (0.5 + bs * 0.7) * (1 + Math.abs(rmx - 0.5) * 1.8 + dragEnergy * 1.2 + Math.abs(rmy - 0.5) * 0.6);
          const freqM = freq * (1 + (rmx - 0.5) * 0.5 + mvx * 0.04);
          const ph = S.wavePhase * 5.5 + scrollSync * Math.PI * 4 + (rmx - 0.5) * 2.5;
          tpX.beginPath();
          for (let x = 0; x <= W; x += 3) {
            const nx = x / W;
            let y = wY + Math.sin(nx * Math.PI * 2 * freqM + ph) * wAmp
              + Math.sin(nx * Math.PI * 3.5 * freqM + ph * 0.72) * wAmp * 0.4
              + Math.sin(nx * Math.PI * 1.1 + ph * 0.4) * wAmp * 0.24
              + (rmx - 0.5) * wAmp * 1.0 * Math.sin(nx * Math.PI * 2 + li)
              + mvx * wAmp * 0.1 * Math.sin(nx * Math.PI * 3.5)
              + mvy * wAmp * 0.06 * Math.cos(nx * Math.PI * 2.2 + li);
            if (dragEnergy > 0.1) y += dragEnergy * wAmp * 0.6 * Math.sin(nx * Math.PI * 5.5 + ph * 1.3);
            for (const r of clickRipples) {
              const dx = nx - r.x, age = r.t, wf = age * 0.5, sp2 = 0.09 + age * 0.13;
              y += r.strength * wAmp * 0.45 * Math.exp(-((Math.abs(dx) - wf) ** 2) / (sp2 ** 2)) * Math.exp(-age * 0.8) * Math.sin((Math.abs(dx) - wf) * 22);
            }
            x === 0 ? tpX.moveTo(0, y) : tpX.lineTo(x, y);
          }
          const grad = tpX.createLinearGradient(0, wY - wAmp * 1.5, 0, wY + wAmp * 1.5);
          grad.addColorStop(0, `rgba(${accentA},${alpha * 0.4})`);
          grad.addColorStop(0.4, `rgba(${accentB},${alpha})`);
          grad.addColorStop(0.6, `rgba(${accentC},${alpha})`);
          grad.addColorStop(1, `rgba(${accentD},${alpha * 0.3})`);
          tpX.strokeStyle = grad; tpX.lineWidth = lineW * (1 + dragEnergy * 0.4); tpX.stroke();
        });

      // ── Subtle accent ink lines ──
      const rph = ts * 0.000027;
      for (let r = 0; r < 3; r++) {
        const yoff = H * (0.5 + r * 0.042);
        fxX.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const nx = x / W;
          const y = yoff + Math.sin(nx * Math.PI * 2 * 0.6 + rph * (4.5 + r)) * (18 + bs * 13) * (0.3 + r * 0.2)
            + Math.sin(nx * Math.PI * 1.4 + rph * (3 + r)) * 8
            + (rmx - 0.5) * 12 * Math.sin(nx * Math.PI * 1.2) + mvx * 5 * Math.sin(nx * Math.PI * 2);
          x === 0 ? fxX.moveTo(0, y) : fxX.lineTo(x, y);
        }
        fxX.strokeStyle = `rgba(${waveAccent},${(0.09 + bs * 0.15) * (1 - r * 0.25)})`;
        fxX.lineWidth = 1.6 - r * 0.3; fxX.stroke();
      }

      // ── Mouse-reactive overlay wave ──
      const yBase = H * (0.3 + rmy * 0.4);
      const wAmp2 = H * (0.03 + bs * 0.05) * (1 + rmx * 0.8 + Math.abs(rmy - 0.5) * 0.6) * (1 + dragEnergy * 0.8);
      for (let layer = 0; layer < 4; layer++) {
        const phOff = layer * 1.1;
        tpX.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const nx = x / W;
          let y = yBase + Math.sin(nx * Math.PI * 2 * (1 + rmx * 0.8) + ts * 0.000315 + phOff) * wAmp2
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
        tpX.strokeStyle = `rgba(${waveAccent},${(0.10 - 0.01 * layer) * (0.45 + bs * 0.65 + clickImpulse * 0.35)})`;
        tpX.lineWidth = 1.3 - layer * 0.25; tpX.stroke();
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
      {/* Film grain */}
      <div style={{
        position: 'absolute', inset: '-200%', width: '400%', height: '400%',
        zIndex: 4, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.025,
        animation: 'classicalGrain 0.1s steps(1) infinite',
      }} />
      <style>{`
        @keyframes classicalGrain {
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
  { icon: GithubIcon,    href: '#',                        label: 'GitHub'    },
  { icon: LinkedinIcon,  href: '#',                        label: 'LinkedIn'  },
  { icon: InstagramIcon, href: '#',                        label: 'Instagram' },
  { icon: Mail,          href: 'mailto:contact@example.com', label: 'Email'  },
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
      <ClassicalBackground isDark={isDark} />

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