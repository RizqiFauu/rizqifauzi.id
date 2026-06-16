'use client';

import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';

const SKILL_CATEGORIES = [
  {
    label: 'skills.frontend',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
  },
  {
    label: 'skills.backend',
    skills: ['Node.js', 'Express.js', 'Laravel', 'Python', 'REST API', 'GraphQL'],
  },
  {
    label: 'skills.database',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Supabase'],
  },
  {
    label: 'skills.design',
    skills: ['Figma', 'UI Design', 'UX Principles', 'Responsive Design', 'Prototyping'],
  },
  {
    label: 'skills.tools',
    skills: ['Git', 'GitHub', 'VS Code', 'Linux', 'Docker', 'Vercel'],
  },
  {
    label: 'skills.other',
    skills: [
      'Data Analysis',
      'Business Analysis',
      'Project Management',
      'Technical Writing',
    ],
  },
];

export function SkillsGrid() {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section className="relative overflow-hidden min-h-screen px-4 py-24">

      {/* BACKGROUND */}
      <motion.div
        className="
          absolute
          top-20
          left-0
          w-72
          h-72
          bg-primary/5
          blur-[120px]
        "
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="
          absolute
          right-0
          bottom-0
          w-[420px]
          h-[420px]
          bg-primary/5
          blur-[180px]
        "
        animate={{
          x: [0, -40, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* TITLE */}
        <motion.div
          className="text-center mb-20"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            {t('skills.title')}
          </h1>

          <motion.div
            className="
              mt-5
              mx-auto
              h-[2px]
              rounded-full
              bg-primary
            "
            initial={{
              width: 0,
            }}
            whileInView={{
              width: 96,
            }}
            transition={{
              duration: 1,
            }}
          />
        </motion.div>

        {/* GRID */}
        <motion.div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          "
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {SKILL_CATEGORIES.map((category, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{
                y: -6,
                scale: 1.01,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-border/40
                bg-muted/50
                backdrop-blur-xl
                p-6
                transition-all
                duration-500
                hover:border-primary/20
              "
            >

              {/* SOFT LIGHT */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                  pointer-events-none
                "
              >
                <div
                  className="
                    absolute
                    left-1/2
                    -translate-x-1/2
                    -top-24
                    w-[260px]
                    h-[180px]
                    rounded-full
                    bg-primary/[0.08]
                    blur-3xl
                  "
                />
              </div>

              {/* OVERLAY */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  group-hover:opacity-100
                  transition
                  duration-700
                  bg-gradient-to-br
                  from-primary/[0.04]
                  to-transparent
                "
              />

              <h3 className="relative text-xl font-bold mb-6">
                {t(category.label)}
              </h3>

              <div className="space-y-3">

                {category.skills.map((skill, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      filter: 'blur(8px)',
                    }}
                    whileInView={{
                      opacity: 1,
                      filter: 'blur(0px)',
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: i * 0.06,
                    }}
                    whileHover={{
                      x: 4,
                    }}
                    className="
                      relative
                      rounded-2xl
                      bg-background/70
                      p-3
                    "
                  >
                    <div className="flex justify-between items-center">

                      <span className="font-medium">
                        {skill}
                      </span>

                      <div
                        className="
                          relative
                          w-16
                          h-1.5
                          rounded-full
                          overflow-hidden
                          bg-primary/10
                        "
                      >
                        <motion.div
                          className="
                            absolute
                            left-0
                            top-0
                            h-full
                            rounded-full
                            bg-primary
                          "
                          initial={{
                            width: 0,
                          }}
                          whileInView={{
                            width: `${80 + i * 3}%`,
                          }}
                          transition={{
                            duration: 1,
                            delay: i * 0.05,
                          }}
                          viewport={{ once: true }}
                        />
                      </div>

                    </div>
                  </motion.div>
                ))}

              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}