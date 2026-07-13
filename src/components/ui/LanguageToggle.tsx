'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocaleStore } from '@/lib/stores/localeStore';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface LanguageToggleProps {
  i18n: I18nRuntimeConfig;
}

export default function LanguageToggle({ i18n }: LanguageToggleProps) {
  const { locale, setLocale } = useLocaleStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!i18n.enabled || !i18n.switcher || i18n.locales.length <= 1) {
    return null;
  }

  if (!mounted) {
    return (
      <div className="flex h-9 w-14 items-center justify-center rounded-md border border-neutral-200/80 bg-background dark:border-neutral-800">
        <div className="w-6 h-4 rounded bg-neutral-300 animate-pulse" />
      </div>
    );
  }

  const currentLocale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;
  const currentLabel = i18n.labels[currentLocale] || currentLocale;

  return (
    <div className="relative">
      <motion.button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-9 items-center justify-center gap-1.5 rounded-md px-2.5',
          'border border-neutral-200/80 bg-background hover:bg-neutral-100',
          'dark:border-neutral-800 dark:hover:bg-neutral-900',
          'text-neutral-600 transition-colors duration-200 hover:text-primary dark:text-neutral-400'
        )}
        title={currentLabel}
      >
        <Languages className="h-4 w-4" />
        <span className="text-xs font-medium">{currentLabel}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className={cn(
            'absolute right-0 z-50 mt-2 w-36 rounded-md border shadow-md',
            'border-neutral-200 bg-surface dark:border-neutral-800'
          )}
        >
          <div className="py-1">
            {i18n.locales.map((localeOption) => (
              <button
                key={localeOption}
                onClick={() => {
                  setLocale(localeOption);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 text-sm',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-900',
                  'transition-colors duration-200',
                  currentLocale === localeOption
                    ? 'text-accent bg-accent/10'
                    : 'text-neutral-700 dark:text-neutral-300'
                )}
              >
                <span>{i18n.labels[localeOption] || localeOption}</span>
                <span className="text-xs opacity-70">{localeOption.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
