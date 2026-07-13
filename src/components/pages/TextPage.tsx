'use client';

import { motion } from 'framer-motion';
import { TextPageConfig } from '@/types/page';
import MarkdownContent from '@/components/ui/MarkdownContent';

interface TextPageProps {
  config: TextPageConfig;
  content: string;
  embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={embedded ? '' : 'mx-auto max-w-3xl'}
    >
      <header className={embedded ? 'mb-7' : 'mb-10 sm:mb-12'}>
        <h1 className={`editorial-heading ${embedded ? 'text-3xl' : 'text-4xl sm:text-[42px]'}`}>{config.title}</h1>
        {config.description && (
          <p className={`mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400 ${embedded ? 'text-sm leading-7' : 'text-base leading-8'}`}>
            {config.description}
          </p>
        )}
      </header>
      <MarkdownContent content={content} />
    </motion.div>
  );
}
