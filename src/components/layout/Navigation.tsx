'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import type { SiteConfig } from '@/lib/config';
import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';
import type { I18nRuntimeConfig } from '@/types/i18n';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
  enableOnePageMode?: boolean;
  i18n: I18nRuntimeConfig;
  itemsByLocale?: Record<string, SiteConfig['navigation']>;
  siteTitleByLocale?: Record<string, string>;
}

export default function Navigation({
  items,
  siteTitle,
  enableOnePageMode,
  i18n,
  itemsByLocale,
  siteTitleByLocale,
}: NavigationProps) {
  const pathname = usePathname();
  const locale = useLocaleStore((state) => state.locale);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const messages = useMessages();
  const resolvedLocale = i18n.enabled ? locale : i18n.defaultLocale;

  const effectiveItems = useMemo(() => {
    return itemsByLocale?.[resolvedLocale] || itemsByLocale?.[i18n.defaultLocale] || items;
  }, [i18n.defaultLocale, items, itemsByLocale, resolvedLocale]);

  const effectiveSiteTitle = useMemo(() => {
    return siteTitleByLocale?.[resolvedLocale] || siteTitleByLocale?.[i18n.defaultLocale] || siteTitle;
  }, [i18n.defaultLocale, resolvedLocale, siteTitle, siteTitleByLocale]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleSections = useRef(new Set<string>());

  useEffect(() => {
    if (enableOnePageMode) {
      setActiveHash(window.location.hash);
      const handleHashChange = () => setActiveHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);

      visibleSections.current.clear();

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.current.add(entry.target.id);
          } else {
            visibleSections.current.delete(entry.target.id);
          }
        });

        const firstVisible = effectiveItems.find(
          (item) => item.type === 'page' && visibleSections.current.has(item.target)
        );
        if (firstVisible) {
          setActiveHash(firstVisible.target === 'about' ? '' : `#${firstVisible.target}`);
        }
      };

      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);

      effectiveItems.forEach((item) => {
        if (item.type === 'page') {
          const element = document.getElementById(item.target);
          if (element) observer.observe(element);
        }
      });

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
        observer.disconnect();
      };
    }
  }, [enableOnePageMode, effectiveItems]);

  const isDesktopItemActive = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode
      ? activeHash === `#${item.target}` || (!activeHash && item.target === 'about')
      : (item.href === '/'
        ? pathname === '/'
        : pathname.startsWith(item.href));

  const getDesktopItemHref = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode ? `/#${item.target}` : item.href;

  return (
    <Disclosure as="nav" className="fixed top-0 left-0 right-0 z-50">
      {({ open }) => (
        <>
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={cn(
              'border-b transition-colors duration-200',
              scrolled
                ? 'border-neutral-200/80 bg-background/92 shadow-sm backdrop-blur-xl dark:border-neutral-800'
                : 'border-transparent bg-background/80 backdrop-blur-md'
            )}
          >
            <div className="site-shell">
              <div className="flex h-16 items-center justify-between">
                <div className="flex-shrink-0">
                  <Link
                    href="/"
                    className="font-serif text-xl font-semibold text-primary transition-colors duration-200 hover:text-accent"
                  >
                    {effectiveSiteTitle}
                  </Link>
                </div>

                <div className="hidden lg:block">
                  <div className="ml-10 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {effectiveItems.map((item) => {
                        const isActive = isDesktopItemActive(item);
                        const href = getDesktopItemHref(item);

                        return (
                          <Link
                            key={item.target}
                            href={href}
                            data-nav-href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(`#${item.target}`)}
                            className={cn(
                              'relative rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-200',
                              isActive
                                ? 'text-primary'
                                : 'text-neutral-500 hover:text-primary dark:text-neutral-400'
                            )}
                          >
                            {item.title}
                            {isActive && (
                              <motion.span
                                layoutId="nav-active-line"
                                className="absolute inset-x-3 bottom-0 h-px bg-accent"
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                    <LanguageToggle i18n={i18n} />
                    <ThemeToggle />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 lg:hidden">
                  <LanguageToggle i18n={i18n} />
                  <ThemeToggle />
                  <Disclosure.Button className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200/80 text-neutral-600 transition-colors duration-200 hover:bg-neutral-100 hover:text-primary dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900">
                    <span className="sr-only">{messages.navigation.openMainMenu}</span>
                    {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {open && (
              <Disclosure.Panel static>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="border-b border-neutral-200/80 bg-background/96 backdrop-blur-xl lg:hidden dark:border-neutral-800"
                >
                  <div className="site-shell space-y-1 py-3">
                    {effectiveItems.map((item, index) => {
                      const isActive = enableOnePageMode
                        ? (item.href === '/' ? pathname === '/' && !activeHash : activeHash === `#${item.target}`)
                        : (item.href === '/'
                          ? pathname === '/'
                          : pathname.startsWith(item.href));

                      const href = enableOnePageMode
                        ? (item.href === '/' ? '/' : `/#${item.target}`)
                        : item.href;

                      return (
                        <motion.div
                          key={item.target}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.18, delay: index * 0.025 }}
                        >
                          <Disclosure.Button
                            as={Link}
                            href={href}
                            prefetch={true}
                            onClick={() => enableOnePageMode && setActiveHash(item.href === '/' ? '' : `#${item.target}`)}
                            className={cn(
                              'block rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                              isActive
                                ? 'bg-accent/8 text-accent'
                                : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary dark:text-neutral-400 dark:hover:bg-neutral-900'
                            )}
                          >
                            {item.title}
                          </Disclosure.Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
}
