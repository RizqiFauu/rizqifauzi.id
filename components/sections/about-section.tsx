'use client';

import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const { t } = useLanguage();

  const softSkills = t('about.softSkills') || [];
  const interests = t('about.interests') || [];

  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // IMAGE PARALLAX
      gsap.fromTo(
        '.about-image',
        {
          y: 80,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-image',
            start: 'top 85%',
          },
        }
      );

      // CONTENT FADE
      gsap.fromTo(
        '.about-content',
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-content',
            start: 'top 85%',
          },
        }
      );

      // CARDS STAGGER
      gsap.fromTo(
        '.about-card',
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-cards-wrapper',
            start: 'top 85%',
          },
        }
      );

      // SKILLS FLOAT IN
      gsap.fromTo(
        '.skill-item',
        {
          opacity: 0,
          y: 20,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.04,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 90%',
          },
        }
      );

      // QUOTE REVEAL
      gsap.fromTo(
        '.quote-box',
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.quote-box',
            start: 'top 90%',
          },
        }
      );

      // BACKGROUND FLOATING
      gsap.to('.bg-orb-1', {
        y: 40,
        x: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.bg-orb-2', {
        y: -30,
        x: -20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-24"
    >
      {/* background */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-orb-1 absolute left-[-120px] top-[-120px] h-[280px] w-[280px] rounded-full bg-primary/10 blur-3xl" />

        <div className="bg-orb-2 absolute bottom-[-120px] right-[-120px] h-[280px] w-[280px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-[420px_1fr]">

        {/* IMAGE */}
        <motion.div
          className="about-image relative mx-auto w-full max-w-[420px]"
        >
          <div className="absolute inset-0 rounded-[40px] bg-primary/15 blur-3xl" />

          <div
            className="
              relative overflow-hidden rounded-[36px]
              border border-zinc-200
              bg-white
              shadow-xl

              dark:border-white/10
              dark:bg-white/[0.03]
              dark:shadow-[0_20px_80px_rgba(0,0,0,0.35)]
            "
          >
            <Image
              src="/myfoto.png"
              alt="Profile"
              width={500}
              height={650}
              priority
              className="
                h-auto w-full object-cover
                transition duration-700
                hover:scale-[1.03]
              "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 w-full p-6">
              <div
                className="
                  inline-flex rounded-full
                  border border-white/20
                  bg-black/40
                  px-3 py-1
                  text-xs text-white
                  backdrop-blur-md
                "
              >
                Developer • Designer • Builder
              </div>

              <h3 className="mt-3 text-2xl font-semibold text-white">
                {t('about.careerGoalsDesc')}
              </h3>
            </div>
          </div>
        </motion.div>

        {/* CONTENT */}
        <div className="about-content space-y-10">
          <div className="space-y-6">
            <span className="text-xl font-semibold text-primary">
              {t('about.label')}
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-bold text-foreground md:text-6xl">
                {t('about.title')}
              </h1>

              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {t('about.intro')}
              </p>
            </div>
          </div>

          <div className="about-cards-wrapper space-y-6">

            {/* BACKGROUND */}
            <div
              className="
                about-card
                rounded-[28px]
                border border-zinc-200
                bg-white
                p-7
                shadow-sm

                dark:border-white/5
                dark:bg-white/[0.03]
                dark:backdrop-blur-xl
              "
            >
              <h3 className="mb-4 text-xl font-semibold">
                {t('about.academicBg')}
              </h3>

              <p className="leading-relaxed text-muted-foreground">
                {t('about.academicBgDesc')}
              </p>
            </div>

            {/* SKILLS */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* SOFT */}
              <div
                className="
                  about-card
                  rounded-[28px]
                  border border-zinc-200
                  bg-white
                  p-7
                  shadow-sm

                  dark:border-white/5
                  dark:bg-white/[0.03]
                  dark:backdrop-blur-xl
                "
              >
                <h3 className="mb-6 text-xl font-semibold">
                  {t('about.softSkillsTitle')}
                </h3>

                <div className="skills-grid grid grid-cols-2 gap-3">
                  {softSkills.map((skill: string, i: number) => (
                    <div
                      key={i}
                      className="
                        skill-item
                        flex min-h-[56px]
                        items-center justify-center
                        rounded-2xl
                        border border-zinc-200
                        bg-zinc-50
                        px-4 py-3
                        text-center
                        text-sm
                        font-medium
                        text-zinc-700

                        hover:border-primary/40
                        hover:bg-primary/10

                        dark:border-white/5
                        dark:bg-white/[0.04]
                        dark:text-foreground/80

                        transition-all duration-300
                        hover:-translate-y-1
                      "
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* SPECIALIZATION */}
              <div
                className="
                  about-card
                  rounded-[28px]
                  border border-zinc-200
                  bg-white
                  p-7
                  shadow-sm

                  dark:border-white/5
                  dark:bg-white/[0.03]
                  dark:backdrop-blur-xl
                "
              >
                <h3 className="mb-6 text-xl font-semibold">
                  {t('about.specialization')}
                </h3>

                <div className="skills-grid grid grid-cols-2 gap-3">
                  {interests.map((interest: string, i: number) => (
                    <div
                      key={i}
                      className="
                        skill-item
                        flex min-h-[56px]
                        items-center justify-center
                        rounded-2xl
                        border border-zinc-200
                        bg-zinc-50
                        px-4 py-3
                        text-center
                        text-sm
                        font-medium
                        text-zinc-700

                        hover:border-primary/40
                        hover:bg-primary/10

                        dark:border-white/5
                        dark:bg-white/[0.04]
                        dark:text-foreground/80

                        transition-all duration-300
                        hover:-translate-y-1
                      "
                    >
                      {interest}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* QUOTE */}
          <div
            className="
              quote-box
              relative overflow-hidden
              rounded-[30px]
              border border-primary/10
              bg-gradient-to-br
              from-primary/10
              to-transparent
              p-8
            "
          >
            <div className="absolute right-6 top-0 text-7xl text-primary/10">
              ”
            </div>

            <p className="relative z-10 text-xl leading-relaxed text-foreground/90">
              {t('about.quote')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}