'use client';

import { useLanguage } from '@/contexts/language-context';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const BLOG_POSTS = [
  {
    title: 'Building Modern Web Applications with Next.js 15',
    excerpt:
      'Explore the latest features of Next.js 15 — partial pre-rendering, improved server actions, and how to build truly performant web applications at scale.',
    category: 'Development',
    date: '2025-04-10',
    readingTime: 8,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80',
    href: 'https://nextjs.org/blog',
  },
  {
    title: 'The Future of UI/UX Design: Trends to Watch in 2025',
    excerpt:
      'From spatial computing interfaces to AI-assisted design workflows — discover the emerging trends reshaping how we design and experience digital products.',
    category: 'Design',
    date: '2025-03-28',
    readingTime: 6,
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&q=80',
    href: 'https://uxdesign.cc',
  },
  {
    title: 'Database Optimization Techniques for High-Traffic Apps',
    excerpt:
      'Learn proven strategies for indexing, query planning, connection pooling, and caching that help your database handle millions of requests without breaking a sweat.',
    category: 'Database',
    date: '2025-03-15',
    readingTime: 10,
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80',
    href: 'https://planetscale.com/blog',
  },
  {
    title: 'Understanding Artificial Intelligence in Business',
    excerpt:
      'How modern AI — from LLMs to computer vision — is transforming business operations, automating workflows, and opening up opportunities that simply did not exist before.',
    category: 'Technology',
    date: '2025-02-25',
    readingTime: 7,
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80',
    href: 'https://hbr.org/topic/subject/artificial-intelligence',
  },
  {
    title: 'Mastering React Hooks: Beyond the Basics',
    excerpt:
      'A deep dive into advanced Hook patterns — useOptimistic, useFormStatus, custom hooks for data fetching, and composing reusable logic without over-engineering.',
    category: 'Development',
    date: '2025-02-10',
    readingTime: 9,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80',
    href: 'https://react.dev/reference/react',
  },
  {
    title: 'Digital Transformation: A Practical Playbook',
    excerpt:
      'A no-nonsense guide to modernizing your business — covering infrastructure, team culture, tooling choices, and how to measure whether your transformation is actually working.',
    category: 'Business',
    date: '2025-01-30',
    readingTime: 12,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    href: 'https://hbr.org/topic/subject/digital-transformation',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeBlurIn = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const imageSwap: Variants = {
  enter: { opacity: 0, filter: 'blur(16px)', scale: 1.04 },
  center: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    filter: 'blur(16px)',
    scale: 0.97,
    transition: { duration: 0.5, ease: 'easeIn' },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function BlogList() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredIdx, setHoveredIdx] = useState(0);

  const filtered =
    activeCategory === 'All'
      ? BLOG_POSTS
      : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const activePost = filtered[hoveredIdx] ?? filtered[0];

  return (
    <section className="relative flex min-h-screen flex-col md:flex-row">
      {/* LEFT IMAGE PANEL */}
      <div className="relative z-0 h-64 shrink-0 overflow-hidden bg-black md:sticky md:top-0 md:h-screen md:w-[45%]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activePost.image}
            src={activePost.image}
            alt={activePost.title}
            className="absolute inset-0 h-full w-full object-cover"
            variants={imageSwap}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-black/50" />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1 }}
        >
          <span className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-white/60">
            Welcome to
          </span>

          <h1 className="font-mono text-5xl font-bold tracking-tight text-white md:text-6xl">
            {t('blog.title')}
          </h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={activePost.title}
              className="mt-6 max-w-xs font-mono text-sm text-white/70"
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.5 }}
            >
              {activePost.title}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="relative z-10 flex flex-1 flex-col md:w-[55%]">
        {/* CATEGORY TABS */}
        <header className="sticky top-0 z-30 shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-md">
          <nav className="flex gap-1 overflow-x-auto px-6 py-4 md:px-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setHoveredIdx(0);
                }}
                className={[
                  'relative shrink-0 rounded-none px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-200',
                  activeCategory === cat
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
              >
                {cat}

                {activeCategory === cat && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground"
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            ))}
          </nav>
        </header>

        {/* POSTS */}
        <ul className="flex-1 divide-y divide-border/40 pb-20">
          <AnimatePresence mode="popLayout">
            {filtered.map((post, idx) => (
              <motion.li
                key={post.title}
                custom={idx}
                variants={fadeBlurIn}
                initial="hidden"
                animate="visible"
                exit={{
                  opacity: 0,
                  filter: 'blur(8px)',
                  transition: { duration: 0.3 },
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                className={[
                  'group transition-colors duration-200',
                  hoveredIdx === idx ? 'bg-muted' : 'bg-background',
                ].join(' ')}
              >
                <a
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-6 py-8 md:px-10 md:py-10"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-none border border-foreground/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {post.category}
                    </span>

                    <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.date)}
                    </span>

                    <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} {t('blog.readingTime')}
                    </span>
                  </div>

                  <h2 className="mb-3 font-mono text-xl font-bold leading-snug text-foreground transition-colors duration-200 group-hover:text-foreground/70 md:text-2xl">
                    {post.title}
                  </h2>

                  <p className="mb-6 font-mono text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <span
                    className={[
                      'inline-flex items-center gap-2 border border-foreground px-4 py-2',
                      'font-mono text-xs uppercase tracking-widest text-foreground',
                      'transition-all duration-300',
                      'group-hover:bg-foreground group-hover:text-background',
                    ].join(' ')}
                  >
                    {t('blog.readMore')}
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </a>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* FOOTER */}
        <footer className="relative z-20 shrink-0 border-t border-border/40 bg-background px-6 py-8 md:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {filtered.length} Article
            {filtered.length !== 1 ? 's' : ''} &mdash; {activeCategory}
          </p>
        </footer>
      </div>
    </section>
  );
}