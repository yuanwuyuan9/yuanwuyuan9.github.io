'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useThemeStore, type Theme } from '@/lib/stores/themeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import { cn } from '@/lib/utils';

interface ThemeOption {
  value: Theme;
  label: string;
  icon: ReactNode;
}

function useThemeOptions(): ThemeOption[] {
  const messages = useMessages();

  return [
    {
      value: 'system',
      label: messages.theme.system,
      icon: <Monitor className="h-4 w-4" />,
    },
    {
      value: 'light',
      label: messages.theme.light,
      icon: <Sun className="h-4 w-4" />,
    },
    {
      value: 'dark',
      label: messages.theme.dark,
      icon: <Moon className="h-4 w-4" />,
    },
  ];
}

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const messages = useMessages();
  const themes = useThemeOptions();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200/80 bg-background dark:border-neutral-800">
        <div className="w-4 h-4 rounded-full bg-neutral-300 animate-pulse" />
      </div>
    );
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          const order: Theme[] = ['system', 'light', 'dark'];
          const index = order.indexOf(theme);
          const next = order[(index + 1) % order.length];
          setTheme(next);
        }}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-md',
          'border border-neutral-200/80 bg-background hover:bg-neutral-100',
          'dark:border-neutral-800 dark:hover:bg-neutral-900',
          'text-neutral-600 transition-colors duration-200 hover:text-primary dark:text-neutral-400'
        )}
        title={`${messages.theme.currentTheme}: ${currentTheme.label}. ${messages.theme.cycleTheme}.`}
      >
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
        >
          {theme === 'system' ? (
            <Monitor className="h-4 w-4" />
          ) : theme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}

export function ThemeToggleDropdown() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messages = useMessages();
  const themes = useThemeOptions();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200/80 bg-background dark:border-neutral-800">
        <div className="w-4 h-4 rounded-full bg-neutral-300 animate-pulse" />
      </div>
    );
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];

  return (
    <div className="relative">
      <motion.button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-md',
          'border border-neutral-200/80 bg-background hover:bg-neutral-100',
          'dark:border-neutral-800 dark:hover:bg-neutral-900',
          'text-neutral-600 transition-colors duration-200 hover:text-primary dark:text-neutral-400'
        )}
        title={`${messages.theme.currentTheme}: ${currentTheme.label}`}
      >
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18 }}
        >
          {currentTheme.icon}
        </motion.div>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className={cn(
            'absolute right-0 z-50 mt-2 w-32 rounded-md border shadow-md',
            'border-neutral-200 bg-surface dark:border-neutral-800'
          )}
        >
          <div className="py-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center w-full px-3 py-2 text-sm',
                  'hover:bg-neutral-100 dark:hover:bg-neutral-900',
                  'transition-colors duration-200',
                  theme === themeOption.value
                    ? 'text-accent bg-accent/10'
                    : 'text-neutral-700 dark:text-neutral-300'
                )}
              >
                <span className="mr-2">{themeOption.icon}</span>
                {themeOption.label}
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
