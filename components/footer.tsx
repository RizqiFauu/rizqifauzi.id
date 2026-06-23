'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { Github, Linkedin, Mail, Instagram, Heart } from 'lucide-react';

const SOCIAL_LINKS = [
  { icon: Github,    href: 'https://github.com/RizqiFauu',                        label: 'GitHub'    },
  { icon: Linkedin,  href: 'https://www.linkedin.com/in/rizqi-fauzi-417575336',                        label: 'LinkedIn'  },
  { icon: Instagram, href: 'https://www.instagram.com/rizqifauu',                        label: 'Instagram' },
  { icon: Mail,      href: 'mailto:rizqifauzi.co@gmail.com', label: 'Email'  },
];

const FOOTER_LINKS = [
  { label: 'nav.home', href: '/' },
  { label: 'nav.about', href: '/about' },
  { label: 'nav.skills', href: '/skills' },
  { label: 'nav.projects', href: '/projects' },
  { label: 'nav.blog', href: '/blog' },
  { label: 'nav.contact', href: '/contact' },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-muted border-t border-border/50 overflow-hidden">
      {/* signature accent line, gantinya footer_bg di referensi */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-3">Rizqi Fauzi</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Building elegant digital solutions with passion and precision.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-5">
              Explore
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground mb-5">
              {t('common.language')}
            </h4>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Rizqi Fauzi. Available for freelance projects.</span>
          <span className="flex items-center gap-1">
            {t('RizqiFauzi')}
            <Heart className="w-3.5 h-3.5 text-white-500" />
          </span>
        </div>
      </div>
    </footer>
  );
}