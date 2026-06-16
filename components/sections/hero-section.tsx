'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
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

import { motion } from 'framer-motion';

import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const SOCIAL_LINKS = [
  { icon: GithubIcon, href: '#', label: 'GitHub' },
  { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
  { icon: InstagramIcon, href: '#', label: 'Instagram' },
  { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' },
];

function LoadingScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [progress, setProgress] =
    useState(0);

  useEffect(() => {
    const timer =
      setInterval(() => {
        setProgress(
          (prev) => {
            if (
              prev >= 100
            ) {
              clearInterval(
                timer
              );

              setTimeout(
                () =>
                  onFinish(),
                400
              );

              return 100;
            }

            return prev + 2;
          }
        );
      }, 35);

    return () =>
      clearInterval(
        timer
      );
  }, [onFinish]);

  return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="
      fixed
      inset-0
      z-[999]
      bg-background
      flex
      items-center
      justify-center
    "
  >
    <div className="w-[320px]">
      {/* ICONS */}
      <div className="relative h-40 flex items-center justify-center mb-6">

  {/* CENTER CPU */}
  <motion.div
    animate={{
      rotate: 360,
      scale: [1, 1.08, 1],
    }}
    transition={{
      rotate: {
        repeat: Infinity,
        duration: 12,
        ease: 'linear',
      },
      scale: {
        repeat: Infinity,
        duration: 3,
      },
    }}
  >
    <Cpu
      className="
        w-20
        h-20
        text-primary
        drop-shadow-[0_0_25px_rgba(59,130,246,0.9)]
      "
    />
  </motion.div>

  {/* TOP LEFT */}
  <motion.div
    className="absolute left-10 top-0"
    animate={{
      rotate: -360,
      y: [0, -6, 0],
    }}
    transition={{
      repeat: Infinity,
      duration: 7,
    }}
  >
    <Code2 className="w-8 h-8 text-primary/70" />
  </motion.div>

  {/* TOP RIGHT */}
  <motion.div
    className="absolute right-8 top-4"
    animate={{
      y: [0, 10, 0],
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      repeat: Infinity,
      duration: 3,
    }}
  >
    <Database className="w-10 h-10 text-primary/60" />
  </motion.div>

  {/* LEFT */}
  <motion.div
    className="absolute left-0 top-16"
    animate={{
      rotate: 360,
    }}
    transition={{
      repeat: Infinity,
      duration: 8,
      ease: 'linear',
    }}
  >
    <Terminal className="w-9 h-9 text-primary/50" />
  </motion.div>

  {/* RIGHT */}
  <motion.div
    className="absolute right-0 top-20"
    animate={{
      rotate: -360,
    }}
    transition={{
      repeat: Infinity,
      duration: 10,
      ease: 'linear',
    }}
  >
    <Server className="w-9 h-9 text-primary/50" />
  </motion.div>

  {/* BOTTOM LEFT */}
  <motion.div
    className="absolute left-8 bottom-2"
    animate={{
      x: [0, 8, 0],
      opacity: [0.3, 1, 0.3],
    }}
    transition={{
      repeat: Infinity,
      duration: 4,
    }}
  >
    <Globe className="w-8 h-8 text-primary/60" />
  </motion.div>

  {/* BOTTOM RIGHT */}
  <motion.div
    className="absolute right-8 bottom-0"
    animate={{
      y: [0, -8, 0],
    }}
    transition={{
      repeat: Infinity,
      duration: 5,
    }}
  >
    <Shield className="w-8 h-8 text-primary/70" />
  </motion.div>
        
        {/* CPU */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.08, 1],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 10,
              ease: 'linear',
            },
            scale: {
              repeat: Infinity,
              duration: 2,
            },
          }}
          className="absolute"
        >
          <Cpu
            className="
              w-20
              h-20
              text-primary
              drop-shadow-[0_0_25px_rgba(59,130,246,0.9)]
            "
          />
        </motion.div>

        {/* CODE */}
        <motion.div
          animate={{
            rotate: -360,
            y: [0, -4, 0],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 6,
              ease: 'linear',
            },
            y: {
              repeat: Infinity,
              duration: 2,
            },
          }}
          className="
            absolute
            -left-1
            top-12
          "
        >
          <Code2
            className="
              w-10
              h-10
              text-primary/70
            "
          />
        </motion.div>

        {/* DATABASE */}
        <motion.div
          animate={{
            rotate: 360,
            y: [0, 4, 0],
          }}
          transition={{
            rotate: {
              repeat: Infinity,
              duration: 7,
              ease: 'linear',
            },
            y: {
              repeat: Infinity,
              duration: 1.8,
            },
          }}
          className="
            absolute
            left-[58%]
            top-2
          "
        >
          <Database
            className="
              w-12
              h-12
              text-primary/80
            "
          />
        </motion.div>
      </div>

      {/* NAME */}
      <motion.h1
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          text-center
          text-4xl
          font-bold
          mb-3
        "
      >
        Rizqi{' '}
        <span className="text-primary">
          Fauzi
        </span>
      </motion.h1>

      {/* DYNAMIC TEXT */}
      <p
        className="
          text-center
          text-muted-foreground
          mb-8
          h-6
        "
      >
        {progress < 25 &&
          'Initializing System...'}

        {progress >= 25 &&
          progress < 50 &&
          'Loading Components...'}

        {progress >= 50 &&
          progress < 75 &&
          'Compiling Experience...'}

        {progress >= 75 &&
          progress < 100 &&
          'Launching Portfolio...'}

        {progress === 100 &&
          'Ready!'}
      </p>

      {/* PROGRESS BAR */}
      <div
        className="
          h-[5px]
          bg-muted
          rounded-full
          overflow-hidden
        "
      >
        <motion.div
          className="
            h-full
            bg-primary
          "
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            ease: 'linear',
          }}
        />
      </div>

      {/* INFO */}
      <div
        className="
          flex
          justify-between
          mt-3
          text-xs
          text-muted-foreground
        "
      >
        <span>
          System Booting...
        </span>

        <span>
          {progress}%
        </span>
      </div>
    </div>
  </motion.div>
);
}

export function HeroSection() {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [displayedRole, setDisplayedRole] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const roles = t('Full Stack Developer,Frontend Engineer,UI/UX Enthusiast,Creative Technologist')
    .split(',')
    .map((r: string) => r.trim());

  useEffect(() => {
    if (!roles.length) return;

    const currentRole = roles[roleIndex];

    const typingDelay = setTimeout(() => {
      if (charIndex < currentRole.length) {
        setDisplayedRole(currentRole.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (roleIndex < roles.length - 1) {
        setTimeout(() => {
          setRoleIndex(roleIndex + 1);
          setCharIndex(0);
          setDisplayedRole('');
        }, 2000);
      } else {
        setTimeout(() => {
          setRoleIndex(0);
          setCharIndex(0);
          setDisplayedRole('');
        }, 2000);
      }
    }, 100);

    return () => clearTimeout(typingDelay);
  }, [charIndex, roleIndex, roles]);

  const particlesInit = useCallback(async (engine: any) => {
    await loadSlim(engine);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const particleColor = isDark
    ? '#ffffff'
    : '#000000';

  const particleOpacity = isDark
    ? 0.45
    : 0.75;

  const linkOpacity = isDark
    ? 0.35
    : 0.55;

  const particlesOptions = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },

      background: {
        color: {
          value: 'transparent',
        },
      },

      fpsLimit: 120,

      detectRetina: true,

      particles: {
        number: {
          value: 45,
          density: {
            enable: true,
            area: 1000,
          },
        },

        color: {
          value: particleColor,
        },

        shape: {
          type: 'circle',
        },

        opacity: {
          value: particleOpacity,
          random: true,
          animation: {
            enable: true,
            speed: 0.3,
            minimumValue: 0.05,
            sync: false,
          },
        },

        size: {
          value: { min: 1, max: 3 },
          random: true,
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.5,
            sync: false,
          },
        },

        links: {
          enable: true,
          distance: 140,
          color: particleColor,
          opacity: linkOpacity,
          width: 1,
        },

        move: {
          enable: true,
          speed: 0.5,
          direction: 'none' as const,
          random: false,
          straight: false,
          outModes: {
            default: 'out' as const,
          },
        },
      },

      interactivity: {
        detectsOn: 'window',

        events: {
          onHover: {
            enable: true,
            mode: 'grab',
          },

          resize: true,
        },

        modes: {
          grab: {
            distance: 180,

            links: {
              opacity: isDark ? 0.35 : 0.45,
            },
          },
        },
      },
    }),
    [particleColor, particleOpacity, linkOpacity, isDark]
  );

  const containerVariants = {
    hidden: { opacity: 0 },

    visible: {
      opacity: 1,

      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.8,
      },
    },
  };

 if (loading) {
  return (
    <LoadingScreen
      onFinish={() =>
        setLoading(false)
      }
    />
  );
}

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 -z-10">
        {/* Soft Glow */}
        <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-black/[0.04] dark:bg-white/[0.05] blur-3xl" />

        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-black/[0.04] dark:bg-white/[0.05] blur-3xl" />

        {/* Particles */}
        {/* Particles types may not include the `init` prop in some versions — cast to any to avoid type issues */}
        {(() => {
          const ParticlesAny = Particles as unknown as any;
          return (
            <ParticlesAny
              id="hero-particles"
              init={particlesInit}
              options={particlesOptions}
              className="absolute inset-0"
            />
          );
        })()}
      </div>

      {/* Content */}
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
            <span className="text-primary">
              Rizqi Fauzi
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-4"
        >
          {t('home.subtitle')}
        </motion.h2>

        {/* Typing Animation */}
        <motion.div
          variants={itemVariants}
          className="text-xl md:text-2xl font-medium text-foreground mb-8 h-12 flex items-center justify-center"
        >
          <span>{displayedRole}</span>
          <span className="animate-pulse">|</span>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          {t('home.description')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
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
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-4"
        >
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