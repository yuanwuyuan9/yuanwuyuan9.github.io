'use client';

import { motion } from 'framer-motion';
import { useMessages } from '@/lib/i18n/useMessages';
import MarkdownContent from '@/components/ui/MarkdownContent';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;

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
            <MarkdownContent content={content} />
        </motion.section>
    );
}
