'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type NavLink = {
  href: string;
  label: string;
};

type NavGroup = {
  label: string;
  children: NavLink[];
};

type NavItem = NavLink | NavGroup;

function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

const NAV_LINKS: NavItem[] = [
  { href: '/', label: 'nav.home' },
  { href: '/about', label: 'nav.about' },
  {
    label: 'Portfolio',
    children: [
      { href: '/skills', label: 'nav.skills' },
      { href: '/projects', label: 'nav.projects' },
    ],
  },
  { href: '/blog', label: 'nav.blog' },
  { href: '/contact', label: 'nav.contact' },
];

export function Navbar() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobilePortfolioOpen, setMobilePortfolioOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      if (currentScrollY < 80) {
        // masih deket atas, jangan disembunyiin
        setIsHidden(false);
      } else if (currentScrollY > lastScrollY) {
        // scroll ke bawah -> sembunyikan navbar
        setIsHidden(true);
      } else {
        // scroll ke atas -> munculin lagi
        setIsHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobilePortfolioOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: isHidden && !isOpen ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary flex-shrink-0">
            Rizqi Fauzi
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) => {
              if (isNavGroup(item)) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setDesktopDropdownOpen(true)}
                    onMouseLeave={() => setDesktopDropdownOpen(false)}
                  >
                    <button
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                      aria-haspopup="true"
                      aria-expanded={desktopDropdownOpen}
                    >
                      {t(item.label)}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          desktopDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {desktopDropdownOpen && (
                        <motion.div
                          className="absolute top-full left-0 pt-2 min-w-[180px]"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="bg-background border border-border/50 rounded-lg shadow-lg overflow-hidden">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                              >
                                {t(child.label)}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden pb-4 border-t border-border/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {NAV_LINKS.map((item) => {
              if (isNavGroup(item)) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => setMobilePortfolioOpen(!mobilePortfolioOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {t(item.label)}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobilePortfolioOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {mobilePortfolioOpen && (
                        <motion.div
                          className="pl-3 overflow-hidden"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                              onClick={closeMobileMenu}
                            >
                              {t(child.label)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
                  onClick={closeMobileMenu}
                >
                  {t(item.label)}
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}