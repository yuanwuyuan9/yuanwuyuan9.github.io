'use client';

import { motion } from 'framer-motion';
import { CardPageConfig } from '@/types/page';
import MarkdownContent from '@/components/ui/MarkdownContent';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <header className={embedded ? 'mb-7' : 'mb-10 sm:mb-12'}>
        <h1 className={`editorial-heading ${embedded ? 'text-3xl' : 'text-4xl sm:text-[42px]'}`}>{config.title}</h1>
        {config.description && (
          <MarkdownContent
            content={config.description}
            compact={embedded}
            className={`mt-4 max-w-2xl ${embedded ? '' : 'text-neutral-600 dark:text-neutral-400'}`}
          />
        )}
      </header>

      <div className="overflow-hidden border-t border-neutral-200 dark:border-neutral-800">
        {config.items.map((item, index) => (
          <motion.article
            key={`${item.date || 'item'}-${item.title}-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.035 }}
            className={`grid border-b border-neutral-200 dark:border-neutral-800 ${embedded ? 'gap-2 py-5 sm:grid-cols-[8.5rem_1.25rem_minmax(0,1fr)] sm:gap-4' : 'gap-2 py-7 sm:grid-cols-[11.5rem_1.5rem_minmax(0,1fr)] sm:gap-5 sm:py-8'}`}
          >
            <div className="sm:pt-0.5 sm:text-right">
              {item.date && (
                <time className="whitespace-nowrap font-mono text-xs leading-5 tabular-nums text-accent sm:text-neutral-500 sm:dark:text-neutral-400">
                  {item.date}
                </time>
              )}
            </div>
            <div className="relative hidden justify-center sm:flex" aria-hidden="true">
              <span className="absolute -bottom-8 -top-8 left-1/2 w-px -translate-x-1/2 bg-neutral-200 dark:bg-neutral-800" />
              <span className="relative mt-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent ring-1 ring-accent/25" />
            </div>
            <div className="min-w-0">
              <h2 className={`${embedded ? 'text-lg' : 'text-xl sm:text-[22px]'} font-serif font-semibold leading-snug text-primary`}>
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="mt-1.5 text-sm font-semibold leading-6 text-accent">{item.subtitle}</p>
              )}
              {item.content && (
                <MarkdownContent content={item.content} compact className="mt-3" />
              )}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {item.tags.map((tag) => (
                    <span key={tag} className="before:mr-1.5 before:text-neutral-300 before:content-['/'] dark:before:text-neutral-700 first:before:hidden">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
