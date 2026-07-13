'use client';

import { useLocaleStore } from '@/lib/stores/localeStore';
import { useMessages } from '@/lib/i18n/useMessages';

interface FooterProps {
  lastUpdated?: string;
  lastUpdatedByLocale?: Record<string, string | undefined>;
  defaultLocale?: string;
}

export default function Footer({ lastUpdated, lastUpdatedByLocale, defaultLocale = 'en' }: FooterProps) {
  const locale = useLocaleStore((state) => state.locale);
  const messages = useMessages();

  const resolvedLastUpdated =
    lastUpdatedByLocale?.[locale] ||
    (defaultLocale ? lastUpdatedByLocale?.[defaultLocale] : undefined) ||
    lastUpdated ||
    new Date().toLocaleDateString(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <footer className="mt-12 border-t border-neutral-200/80 dark:border-neutral-800">
      <div className="site-shell py-7 sm:py-8">
        <div className="flex items-center justify-center sm:justify-end">
          <p className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
            {messages.footer.lastUpdated}: {resolvedLastUpdated}
          </p>
        </div>
      </div>
    </footer>
  );
}
