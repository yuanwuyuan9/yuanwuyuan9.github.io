'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import { ArrowRight } from 'lucide-react';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
        >
            <div className="mb-7 flex items-center gap-4">
                <h2 className="editorial-heading text-[28px] sm:text-3xl">{resolvedTitle}</h2>
                <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-accent transition-colors duration-200 hover:text-accent-dark"
                >
                    {messages.home.viewAll}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.04 * index }}
                        className="py-5"
                    >
                        <h3 className="mb-2 font-serif text-lg font-semibold leading-snug text-primary sm:text-xl">
                            <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                        </h3>
                        <p className="mb-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                            {pub.authors.map((author, idx) => (
                                <span key={idx}>
                                    <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                        {author.name}
                                    </span>
                                    {author.isCorresponding && (
                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>†</sup>
                                    )}
                                    {idx < pub.authors.length - 1 && ', '}
                                </span>
                            ))}
                        </p>
                        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            {pub.journal || pub.conference}
                        </p>
                        {pub.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                                {pub.description}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
