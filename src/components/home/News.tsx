'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;

    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            <div className="mb-7 flex items-center gap-4">
                <h2 className="editorial-heading text-[28px] sm:text-3xl">{resolvedTitle}</h2>
                <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
            </div>
            <div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-3.5 sm:grid-cols-[6.5rem_minmax(0,1fr)]">
                        <time className="pt-0.5 font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">{item.date}</time>
                        <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">{item.content}</p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
