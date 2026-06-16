'use client';

import { useLanguage } from '@/contexts/language-context';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="
        flex items-center gap-1
        rounded-full border border-border/50
        bg-background/60 p-1
        backdrop-blur-md
      "
    >
      <div className="px-2 text-muted-foreground">
        <Globe size={16} />
      </div>

      <button
        onClick={() => setLanguage('en')}
        className={`
          rounded-full px-3 py-1.5
          text-sm font-medium
          transition-all duration-300
          ${
            language === 'en'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }
        `}
        aria-label="Switch to English"
      >
        EN
      </button>

      <button
        onClick={() => setLanguage('id')}
        className={`
          rounded-full px-3 py-1.5
          text-sm font-medium
          transition-all duration-300
          ${
            language === 'id'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }
        `}
        aria-label="Switch to Indonesian"
      >
        ID
      </button>
    </div>
  );
}