'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  MotionValue,
} from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

// ─── i18n ─────────────────────────────────────────────────────────────────────
// Drop-in translation hook — replace with your own context/i18n library.
// Usage: const t = useTranslations(); t('projects.title')
// If you already have useTranslations / useI18n in your project, swap this out.

type Lang = 'en' | 'id';

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  en: {
    'projects.title': 'Projects',
    'projects.subtitle':
      'Building modern digital experiences with scalable architecture, beautiful interfaces, and clean performance-focused systems.',
    'projects.autoplay': 'Autoplaying',
    'projects.completion': 'Completion',
    'projects.demo': 'Demo',
    'projects.code': 'Code',
    'projects.label': 'Project',
    'projects.prev': 'Previous project',
    'projects.next': 'Next project',

    'status.completed': 'Completed',
    'status.inProgress': 'In Progress',

    'project.ais.title': 'Academic Information System',
    'project.ais.description':
      'Full-stack web application for managing academic records, grades, and student information.',
    'project.inv.title': 'Inventory Management Dashboard',
    'project.inv.description':
      'Real-time inventory tracking system with analytics and reporting features.',
    'project.att.title': 'Employee Attendance System',
    'project.att.description':
      'Smart attendance tracking with biometric integration and automated reports.',
    'project.bank.title': 'UI/UX Banking App Concept',
    'project.bank.description':
      'Modern digital banking interface concept with seamless user experience.',
    'project.elearn.title': 'E-Learning Platform',
    'project.elearn.description':
      'Interactive learning platform with course management and student progress tracking.',
    'project.biz.title': 'Business Analytics Dashboard',
    'project.biz.description':
      'Data-driven dashboard for business intelligence and performance metrics.',
  },
  id: {
    'projects.title': 'Proyek',
    'projects.subtitle':
      'Membangun pengalaman digital modern dengan arsitektur yang skalabel, antarmuka yang indah, dan sistem yang berfokus pada performa.',
    'projects.autoplay': 'Putar Otomatis',
    'projects.completion': 'Penyelesaian',
    'projects.demo': 'Demo',
    'projects.code': 'Kode',
    'projects.label': 'Proyek',
    'projects.prev': 'Proyek sebelumnya',
    'projects.next': 'Proyek berikutnya',

    'status.completed': 'Selesai',
    'status.inProgress': 'Dalam Proses',

    'project.ais.title': 'Sistem Informasi Akademik',
    'project.ais.description':
      'Aplikasi web full-stack untuk mengelola catatan akademik, nilai, dan informasi mahasiswa.',
    'project.inv.title': 'Dasbor Manajemen Inventaris',
    'project.inv.description':
      'Sistem pelacakan inventaris real-time dengan fitur analitik dan pelaporan.',
    'project.att.title': 'Sistem Absensi Karyawan',
    'project.att.description':
      'Pelacakan kehadiran cerdas dengan integrasi biometrik dan laporan otomatis.',
    'project.bank.title': 'Konsep Aplikasi Perbankan UI/UX',
    'project.bank.description':
      'Konsep antarmuka perbankan digital modern dengan pengalaman pengguna yang mulus.',
    'project.elearn.title': 'Platform E-Learning',
    'project.elearn.description':
      'Platform pembelajaran interaktif dengan manajemen kursus dan pelacakan kemajuan siswa.',
    'project.biz.title': 'Dasbor Analitik Bisnis',
    'project.biz.description':
      'Dasbor berbasis data untuk intelijen bisnis dan metrik kinerja.',
  },
};

// Simple standalone hook — replace with your project's useTranslations if available
function useTranslations(lang: Lang) {
  return (key: string): string => TRANSLATIONS[lang][key] ?? key;
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
  titleKey: string;
  descriptionKey: string;
  technologies: string[];
  status: string;
  demoUrl: string;
  codeUrl: string;
  year: string;
  imagePattern: 'grid' | 'dots' | 'lines' | 'cross' | 'circuit' | 'wave';
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS_DATA: Project[] = [
  {
    titleKey: 'project.ais.title',
    descriptionKey: 'project.ais.description',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    status: 'completed',
    demoUrl: '#',
    codeUrl: '#',
    year: '2024',
    imagePattern: 'grid',
  },
  {
    titleKey: 'project.inv.title',
    descriptionKey: 'project.inv.description',
    technologies: ['Next.js', 'TypeScript', 'Chart.js', 'Supabase'],
    status: 'completed',
    demoUrl: '#',
    codeUrl: '#',
    year: '2024',
    imagePattern: 'dots',
  },
  {
    titleKey: 'project.att.title',
    descriptionKey: 'project.att.description',
    technologies: ['Laravel', 'Vue.js', 'MySQL', 'Bootstrap'],
    status: 'completed',
    demoUrl: '#',
    codeUrl: '#',
    year: '2023',
    imagePattern: 'lines',
  },
  {
    titleKey: 'project.bank.title',
    descriptionKey: 'project.bank.description',
    technologies: ['Figma', 'UI Design', 'Prototyping'],
    status: 'completed',
    demoUrl: '#',
    codeUrl: '#',
    year: '2023',
    imagePattern: 'cross',
  },
  {
    titleKey: 'project.elearn.title',
    descriptionKey: 'project.elearn.description',
    technologies: ['Next.js', 'React', 'Stripe', 'Supabase'],
    status: 'inProgress',
    demoUrl: '#',
    codeUrl: '#',
    year: '2024',
    imagePattern: 'circuit',
  },
  {
    titleKey: 'project.biz.title',
    descriptionKey: 'project.biz.description',
    technologies: ['React', 'D3.js', 'Python', 'MongoDB'],
    status: 'inProgress',
    demoUrl: '#',
    codeUrl: '#',
    year: '2024',
    imagePattern: 'wave',
  },
];

// ─── SVG Patterns ─────────────────────────────────────────────────────────────
// Stroke colour adapts via currentColor so it inherits the CSS variable.

const PatternGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="pg" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pg)" className="text-black/30 dark:text-white" />
  </svg>
);

const PatternDots = () => (
  <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-20" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="pd" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pd)" className="text-black/40 dark:text-white" />
  </svg>
);

const PatternLines = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="pl" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="20" y2="20" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pl)" className="text-black/40 dark:text-white" />
  </svg>
);

const PatternCross = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="pc" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <line x1="20" y1="8" x2="20" y2="32" stroke="currentColor" strokeWidth="0.7" />
        <line x1="8" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="0.7" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pc)" className="text-black/40 dark:text-white" />
  </svg>
);

const PatternCircuit = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="pci" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M10 30 L20 30 L20 10 L40 10 L40 30 L50 30" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="10" cy="30" r="2" fill="currentColor" />
        <circle cx="50" cy="30" r="2" fill="currentColor" />
        <circle cx="20" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <circle cx="40" cy="10" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.7" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pci)" className="text-black/40 dark:text-white" />
  </svg>
);

const PatternWave = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="pw" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
        <path d="M0 20 Q20 0 40 20 Q60 40 80 20" fill="none" stroke="currentColor" strokeWidth="0.7" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pw)" className="text-black/40 dark:text-white" />
  </svg>
);

const PATTERNS: Record<Project['imagePattern'], React.FC> = {
  grid: PatternGrid,
  dots: PatternDots,
  lines: PatternLines,
  cross: PatternCross,
  circuit: PatternCircuit,
  wave: PatternWave,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusStyle = (status: string) =>
  status === 'completed'
    ? 'bg-black/8 text-black/70 border-black/15 dark:bg-white/10 dark:text-white/80 dark:border-white/20'
    : 'bg-black/4 text-black/40 border-black/8 dark:bg-white/5 dark:text-white/50 dark:border-white/10';

const wrap = (idx: number, len: number) => ((idx % len) + len) % len;

// ─── Floating Orb ─────────────────────────────────────────────────────────────

const FloatingOrb = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={style}
    animate={{ y: [0, -30, 0], scale: [1, 1.08, 1], opacity: [0.12, 0.22, 0.12] }}
    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
  />
);

// ─── Ambient Glow ─────────────────────────────────────────────────────────────

interface AmbientGlowProps {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}

const AmbientGlow = ({ springX, springY }: AmbientGlowProps) => {
  const glowLeft = useTransform(springX, [-1, 1], [-60, 200]);
  const glowTop  = useTransform(springY, [-1, 1], [-60, 140]);

  return (
    <>
      {/* Static radial base */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.04),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]" />
      {/* Mouse-tracking highlight */}
      <motion.div
        className="absolute w-48 h-48 rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, var(--glow-color) 0%, transparent 70%)',
          x: glowLeft,
          y: glowTop,
          filter: 'blur(24px)',
        }}
      />
    </>
  );
};

// ─── Project Card ─────────────────────────────────────────────────────────────

interface CardProps {
  project: Project;
  isActive: boolean;
  isPrev: boolean;
  isNext: boolean;
  onClick: () => void;
  t: (key: string) => string;
}

const ProjectCard = ({ project, isActive, isPrev, isNext, onClick, t }: CardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 30 });
  const rotateX = useTransform(springY, [-1, 1], [4, -4]);
  const rotateY = useTransform(springX, [-1, 1], [-4, 4]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isActive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
      mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    },
    [isActive, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const PatternComp = PATTERNS[project.imagePattern];

  const scale   = isActive ? 1 : isPrev || isNext ? 0.87 : 0.72;
  const opacity = isActive ? 1 : isPrev || isNext ? 0.45 : 0;
  const rotate  = isPrev ? 6 : isNext ? -6 : 0;
  const blur    = isActive ? 0 : isPrev || isNext ? 2 : 8;
  const zIndex  = isActive ? 20 : isPrev || isNext ? 10 : 0;

  const completionPct = project.status === 'completed' ? '100%' : '78%';

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isActive ? rotateX : 0,
        rotateY: isActive ? rotateY : 0,
        perspective: 1000,
        zIndex,
        transformStyle: 'preserve-3d',
        // CSS custom property consumed by AmbientGlow
        ['--glow-color' as string]: 'rgba(255,255,255,0.12)',
      } as React.CSSProperties}
      animate={{ scale, opacity, rotate, filter: `blur(${blur}px)` }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="project-card relative mx-3 min-w-[340px] max-w-[340px] overflow-hidden rounded-[28px] cursor-pointer flex-shrink-0"
    >
      {/* Border ring — light: subtle gray, dark: subtle white */}
      <div
        className="absolute inset-0 rounded-[28px] z-10 pointer-events-none overflow-hidden border"
        style={{
          borderColor: isActive
            ? 'color-mix(in srgb, currentColor 18%, transparent)'
            : 'color-mix(in srgb, currentColor 7%, transparent)',
        }}
      />

      {/* Glass body */}
      <div className="relative w-full h-full rounded-[28px] overflow-hidden
                      bg-white/80 backdrop-blur-2xl shadow-[0_8px_48px_rgba(0,0,0,0.10)]
                      dark:bg-[#0a0a0a]/90 dark:shadow-none">

        {isActive && <AmbientGlow springX={springX} springY={springY} />}

        {/* IMAGE AREA */}
        <div className="relative h-52 overflow-hidden
                        border-b border-black/[0.07] dark:border-white/[0.07]">

          {/* Light: soft gray gradient; dark: original dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-br
                          from-black/4 via-transparent to-black/10
                          dark:from-white/8 dark:via-transparent dark:to-black/60" />

          <PatternComp />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center select-none">
              <motion.div
                className="text-7xl font-black tracking-tight
                           text-black/[0.07] dark:text-white/[0.08]"
                style={{
                  fontFamily: "'SF Pro Display','Helvetica Neue',sans-serif",
                  letterSpacing: '-0.04em',
                }}
                animate={isActive ? { opacity: [0.08, 0.16, 0.08] } : { opacity: 0.06 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                {project.year}
              </motion.div>
              <p className="mt-1 text-[10px] uppercase tracking-[0.4em] font-light
                            text-black/25 dark:text-white/25">
                {t('projects.label')}
              </p>
            </div>
          </div>

          {/* Scan line */}
          {isActive && (
            <motion.div
              className="absolute left-0 right-0 h-px pointer-events-none
                         bg-gradient-to-r from-transparent via-black/20 to-transparent
                         dark:via-white/30"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Corner dots */}
          <div className="absolute top-4 right-4 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/25"
                animate={isActive ? { opacity: [0.25, 0.7, 0.25] } : { opacity: 0.25 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
              />
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h3
              className="text-[1.3rem] font-bold leading-tight text-black/90 dark:text-white/90"
              style={{ fontFamily: "'SF Pro Display','Helvetica Neue',sans-serif", letterSpacing: '-0.02em' }}
            >
              {t(project.titleKey)}
            </h3>
            <span
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-semibold tracking-wide flex-shrink-0 ${getStatusStyle(project.status)}`}
            >
              {t(`status.${project.status}`)}
            </span>
          </div>

          <p className="text-sm leading-relaxed font-light text-black/45 dark:text-white/40"
            style={{ fontFamily: "'SF Pro Text','Helvetica Neue',sans-serif" }}>
            {t(project.descriptionKey)}
          </p>

          {/* Tech pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {project.technologies.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
                className="relative rounded-full border overflow-hidden
                           border-black/[0.12] bg-black/5 text-black/55
                           dark:border-white/[0.12] dark:bg-white/5 dark:text-white/60
                           px-3 py-1 text-[11px] font-medium"
              >
                {isActive && (
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-black/4 to-transparent dark:via-white/8"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 1, ease: 'linear' }}
                  />
                )}
                <span className="relative z-10">{tech}</span>
              </motion.span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-[11px]
                            text-black/30 dark:text-white/30">
              <span className="uppercase tracking-widest font-light">{t('projects.completion')}</span>
              <span>{completionPct}</span>
            </div>
            <div className="h-[3px] overflow-hidden rounded-full bg-black/[0.08] dark:bg-white/[0.08]">
              <motion.div
                initial={{ width: 0 }}
                animate={isActive ? { width: completionPct } : { width: '0%' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="h-full rounded-full
                           bg-gradient-to-r from-black/60 to-black/25
                           dark:from-white/70 dark:to-white/30"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <a
              href={project.demoUrl}
              onClick={(e) => e.stopPropagation()}
              aria-label={t('projects.demo')}
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all duration-300
                         border border-black/15 bg-black/8 text-black/70
                         hover:bg-black/14 hover:border-black/25 hover:text-black
                         dark:border-white/20 dark:bg-white/10 dark:text-white/80
                         dark:hover:bg-white/20 dark:hover:border-white/35 dark:hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span>{t('projects.demo')}</span>
            </a>
            <a
              href={project.codeUrl}
              onClick={(e) => e.stopPropagation()}
              aria-label={t('projects.code')}
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium backdrop-blur-md transition-all duration-300
                         border border-black/8 bg-transparent text-black/40
                         hover:border-black/18 hover:bg-black/5 hover:text-black/65
                         dark:border-white/10 dark:bg-transparent dark:text-white/50
                         dark:hover:border-white/25 dark:hover:bg-white/[0.08] dark:hover:text-white/80"
            >
              <Github className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
              <span>{t('projects.code')}</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

interface ProjectsGridProps {
  /** Pass your app's current locale here, e.g. from useRouter or a context */
  lang?: Lang;
}

export function ProjectsGrid({ lang = 'en' }: ProjectsGridProps) {
  const t = useTranslations(lang);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered]       = useState(false);
  const [isDragging, setIsDragging]     = useState(false);

  const trackRef      = useRef<HTMLDivElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const autoplayRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragStartX    = useRef(0);
  const dragVelocity  = useRef(0);
  const lastDragX     = useRef(0);
  const motionOffset  = useRef(0);
  const currentOffset = useRef(0);
  const isDraggingRef = useRef(false);

  const len        = PROJECTS_DATA.length;
  const CARD_WIDTH = 340;
  const CARD_GAP   = 24;
  const CARD_STEP  = CARD_WIDTH + CARD_GAP;

  const getTranslateX = useCallback(
    (idx: number) => {
      if (!containerRef.current) return 0;
      const cc = containerRef.current.offsetWidth / 2;
      return cc - CARD_WIDTH / 2 - idx * CARD_STEP;
    },
    [CARD_STEP]
  );

  const applyTransform = useCallback((x: number) => {
    if (trackRef.current) trackRef.current.style.transform = `translateX(${x}px)`;
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      const w = wrap(idx, len);
      setCurrentIndex(w);
      const tx = getTranslateX(w);
      currentOffset.current = tx;
      if (trackRef.current) {
        trackRef.current.style.transition = 'transform 0.75s cubic-bezier(0.22,1,0.36,1)';
        applyTransform(tx);
        setTimeout(() => { if (trackRef.current) trackRef.current.style.transition = ''; }, 780);
      }
    },
    [len, getTranslateX, applyTransform]
  );

  useEffect(() => {
    const tx = getTranslateX(0);
    currentOffset.current = tx;
    applyTransform(tx);
  }, [getTranslateX, applyTransform]);

  useEffect(() => {
    if (isHovered || isDragging) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = wrap(prev + 1, len);
        const tx = getTranslateX(next);
        currentOffset.current = tx;
        if (trackRef.current) {
          trackRef.current.style.transition = 'transform 0.8s cubic-bezier(0.22,1,0.36,1)';
          applyTransform(tx);
          setTimeout(() => { if (trackRef.current) trackRef.current.style.transition = ''; }, 820);
        }
        return next;
      });
    }, 4000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [isHovered, isDragging, len, getTranslateX, applyTransform]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentIndex + 1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(currentIndex - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentIndex, goTo]);

  useEffect(() => {
    const onResize = () => {
      const tx = getTranslateX(currentIndex);
      currentOffset.current = tx;
      applyTransform(tx);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [currentIndex, getTranslateX, applyTransform]);

  const onDragStart = useCallback((clientX: number) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartX.current   = clientX;
    lastDragX.current    = clientX;
    dragVelocity.current = 0;
    motionOffset.current = currentOffset.current;
    if (trackRef.current) trackRef.current.style.transition = 'none';
  }, []);

  const onDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    dragVelocity.current  = clientX - lastDragX.current;
    lastDragX.current     = clientX;
    const newX             = motionOffset.current + (clientX - dragStartX.current);
    currentOffset.current = newX;
    applyTransform(newX);
  }, [applyTransform]);

  const onDragEnd = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const delta    = clientX - dragStartX.current;
    const velocity = dragVelocity.current;

    setCurrentIndex((prev) => {
      let target = prev;
      if (Math.abs(velocity) > 5 || Math.abs(delta) > CARD_STEP / 3) {
        if (delta < 0 || velocity < -5) target = prev + 1;
        else if (delta > 0 || velocity > 5) target = prev - 1;
      }
      const w  = wrap(target, len);
      const tx = getTranslateX(w);
      currentOffset.current = tx;
      if (trackRef.current) {
        trackRef.current.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)';
        applyTransform(tx);
        setTimeout(() => { if (trackRef.current) trackRef.current.style.transition = ''; }, 670);
      }
      return w;
    });
  }, [len, CARD_STEP, getTranslateX, applyTransform]);

  const handleMouseDown  = (e: React.MouseEvent)  => onDragStart(e.clientX);
  const handleMouseMove  = (e: React.MouseEvent)  => onDragMove(e.clientX);
  const handleMouseUp    = (e: React.MouseEvent)  => onDragEnd(e.clientX);
  const handleMouseLeave = (e: React.MouseEvent)  => { if (isDraggingRef.current) onDragEnd(e.clientX); };
  const handleTouchStart = (e: React.TouchEvent)  => onDragStart(e.touches[0].clientX);
  const handleTouchMove  = (e: React.TouchEvent)  => onDragMove(e.touches[0].clientX);
  const handleTouchEnd   = (e: React.TouchEvent)  => onDragEnd(e.changedTouches[0].clientX);

  return (
    <section
      className="relative overflow-hidden py-28
                 bg-[#f5f5f7]
                 dark:bg-[#050505]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Backgrounds ───────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">

        {/* Light orbs: dark in light mode, white in dark mode */}
        <FloatingOrb style={{
          top: '10%', left: '15%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)',
        }} />
        <FloatingOrb style={{
          top: '40%', right: '10%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)',
        }} />
        <FloatingOrb style={{
          bottom: '5%', left: '40%', width: 600, height: 300,
          background: 'radial-gradient(circle, rgba(0,0,0,0.025) 0%, transparent 70%)',
        }} />

        {/* Grid texture — light: very subtle black, dark: very subtle white */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.35) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Dark mode overlay replaces the above */}
        <div
          className="absolute inset-0 opacity-0 dark:opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0
                        bg-[radial-gradient(ellipse_at_center,transparent_40%,#f5f5f7_100%)]
                        dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4">

        {/* ── Title ─────────────────────────────────────────────── */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <h1
            className="text-5xl font-black md:text-7xl
                       text-black dark:text-white"
            style={{ fontFamily: "'SF Pro Display','Helvetica Neue',sans-serif", letterSpacing: '-0.04em' }}
          >
            {t('projects.title')}
          </h1>

          <p
            className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed
                       text-black/40 dark:text-white/30"
            style={{ fontFamily: "'SF Pro Text','Helvetica Neue',sans-serif" }}
          >
            {t('projects.subtitle')}
          </p>
        </motion.div>

        {/* ── Carousel ──────────────────────────────────────────── */}
        <div
          ref={containerRef}
          className="relative overflow-hidden py-12 select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-32 z-30 pointer-events-none
                          bg-gradient-to-r from-[#f5f5f7] to-transparent
                          dark:from-[#050505] dark:to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-30 pointer-events-none
                          bg-gradient-to-l from-[#f5f5f7] to-transparent
                          dark:from-[#050505] dark:to-transparent" />

          {/* Centre glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none z-0"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Dark mode version */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none z-0 hidden dark:block"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div ref={trackRef} className="flex" style={{ willChange: 'transform' }}>
            {PROJECTS_DATA.map((project, index) => {
              const diff     = index - currentIndex;
              const isActive = diff === 0;
              const isPrev   = diff === -1;
              const isNext   = diff === 1;

              return (
                <ProjectCard
                  key={project.titleKey}
                  project={project}
                  isActive={isActive}
                  isPrev={isPrev}
                  isNext={isNext}
                  onClick={() => { if (!isDraggingRef.current) goTo(index); }}
                  t={t}
                />
              );
            })}
          </div>

          {/* Nav arrows */}
          {([-1, 1] as const).map((dir) => (
            <motion.button
              key={dir}
              onClick={() => goTo(currentIndex + dir)}
              aria-label={dir === -1 ? t('projects.prev') : t('projects.next')}
              className={`absolute ${dir === -1 ? 'left-4' : 'right-4'} top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full backdrop-blur-xl transition-all duration-300
                border border-black/12 bg-black/5 text-black/45
                hover:border-black/22 hover:bg-black/10 hover:text-black/75
                dark:border-white/15 dark:bg-white/5 dark:text-white/50
                dark:hover:border-white/30 dark:hover:bg-white/[0.12] dark:hover:text-white/80`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
            >
              <span className="text-base font-light">{dir === -1 ? '←' : '→'}</span>
            </motion.button>
          ))}
        </div>

        {/* ── Indicators ────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col items-center gap-5">
          <div className="flex items-center gap-4">
            <span
              className="text-[11px] font-light tabular-nums text-black/25 dark:text-white/20"
              style={{ fontFamily: 'monospace' }}
            >
              {String(currentIndex + 1).padStart(2, '0')}
            </span>

            <div className="flex gap-2">
              {PROJECTS_DATA.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goTo(index)}
                  className="relative overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
                  animate={{ width: currentIndex === index ? 32 : 6, height: 6 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {currentIndex === index && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-black/60 dark:bg-white/70"
                      layoutId="activeIndicator"
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <span
              className="text-[11px] font-light tabular-nums text-black/25 dark:text-white/20"
              style={{ fontFamily: 'monospace' }}
            >
              {String(PROJECTS_DATA.length).padStart(2, '0')}
            </span>
          </div>

          <AnimatePresence>
            {!isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-light
                           text-black/20 dark:text-white/15"
              >
                <motion.span
                  className="h-1 w-1 rounded-full bg-black/30 dark:bg-white/25"
                  animate={{ opacity: [0.25, 0.6, 0.25] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {t('projects.autoplay')}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}