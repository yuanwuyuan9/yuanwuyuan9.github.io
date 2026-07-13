'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  CalendarDays,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from './FormattedBibTeXText';

interface PublicationsListProps {
  config: PublicationPageConfig;
  publications: Publication[];
  embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
  const messages = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

  const years = useMemo(
    () => Array.from(new Set(publications.map((publication) => publication.year))).sort((a, b) => b - a),
    [publications]
  );

  const types = useMemo(
    () => Array.from(new Set(publications.map((publication) => publication.type))).sort(),
    [publications]
  );

  const filteredPublications = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return publications.filter((publication) => {
      const matchesSearch =
        publication.title.toLowerCase().includes(query) ||
        publication.authors.some((author) => author.name.toLowerCase().includes(query)) ||
        publication.journal?.toLowerCase().includes(query) ||
        publication.conference?.toLowerCase().includes(query);
      const matchesYear = selectedYear === 'all' || publication.year === selectedYear;
      const matchesType = selectedType === 'all' || publication.type === selectedType;
      return matchesSearch && matchesYear && matchesType;
    });
  }, [publications, searchQuery, selectedType, selectedYear]);

  const actionClass =
    'inline-flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-transparent px-2.5 text-xs font-medium text-neutral-600 transition-colors duration-200 hover:border-neutral-300 hover:bg-surface hover:text-accent dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900';
  const filterClass =
    'rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors duration-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <header className={embedded ? 'mb-7' : 'mb-10 sm:mb-12'}>
        <h1 className={`editorial-heading ${embedded ? 'text-3xl' : 'text-4xl sm:text-[42px]'}`}>{config.title}</h1>
        {config.description && (
          <p className={`mt-4 max-w-2xl text-neutral-600 dark:text-neutral-400 ${embedded ? 'text-sm leading-7' : 'text-base leading-8'}`}>
            {config.description}
          </p>
        )}
      </header>

      <div className="mb-8 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder={messages.publications.searchPlaceholder}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-md border border-neutral-200 bg-surface pl-10 pr-4 text-sm text-primary transition-colors duration-200 placeholder:text-neutral-400 focus:border-accent dark:border-neutral-800"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className={cn(
              'inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors duration-200',
              showFilters
                ? 'border-accent bg-accent text-white'
                : 'border-neutral-200 bg-surface text-neutral-600 hover:border-neutral-300 hover:text-primary dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {messages.publications.filters}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid gap-5 rounded-md border border-neutral-200 bg-surface-muted p-4 sm:grid-cols-2 dark:border-neutral-800">
                <div>
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {messages.publications.year}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedYear('all')}
                      className={cn(filterClass, selectedYear === 'all' ? 'border-accent bg-accent text-white' : 'border-neutral-200 bg-surface text-neutral-600 hover:text-primary dark:border-neutral-700 dark:text-neutral-300')}
                    >
                      {messages.common.all}
                    </button>
                    {years.map((year) => (
                      <button
                        type="button"
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={cn(filterClass, selectedYear === year ? 'border-accent bg-accent text-white' : 'border-neutral-200 bg-surface text-neutral-600 hover:text-primary dark:border-neutral-700 dark:text-neutral-300')}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                    <BookOpen className="h-3.5 w-3.5" />
                    {messages.publications.type}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedType('all')}
                      className={cn(filterClass, selectedType === 'all' ? 'border-accent bg-accent text-white' : 'border-neutral-200 bg-surface text-neutral-600 hover:text-primary dark:border-neutral-700 dark:text-neutral-300')}
                    >
                      {messages.common.all}
                    </button>
                    {types.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={cn(filterClass, 'capitalize', selectedType === type ? 'border-accent bg-accent text-white' : 'border-neutral-200 bg-surface text-neutral-600 hover:text-primary dark:border-neutral-700 dark:text-neutral-300')}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800">
        {filteredPublications.length === 0 ? (
          <div className="border-b border-neutral-200 py-14 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            {messages.publications.noResults}
          </div>
        ) : (
          filteredPublications.map((publication, index) => (
            <motion.article
              key={publication.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.035 }}
              className="border-b border-neutral-200 py-7 sm:py-8 dark:border-neutral-800"
            >
              <div className={cn('grid gap-5', publication.preview && 'md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-7')}>
                {publication.preview && (
                  <div className="relative aspect-video overflow-hidden rounded-md border border-neutral-200 bg-white dark:border-neutral-800">
                    <Image
                      src={`/papers/${publication.preview}`}
                      alt={publication.title}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 768px) 100vw, 216px"
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className={`${embedded ? 'text-lg' : 'text-xl sm:text-[22px]'} font-serif font-semibold leading-snug text-primary`}>
                    <FormattedBibTeXText nodes={publication.titleNodes} fallback={publication.title} />
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {publication.authors.map((author, authorIndex) => (
                      <span key={`${publication.id}-${author.name}-${authorIndex}`}>
                        <span className={cn(author.isHighlighted && 'font-semibold text-accent', author.isCoAuthor && `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}`)}>
                          {author.name}
                        </span>
                        {author.isCorresponding && <sup className={author.isHighlighted ? 'text-accent' : ''}>†</sup>}
                        {authorIndex < publication.authors.length - 1 && ', '}
                      </span>
                    ))}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-accent">
                    {publication.journal || publication.conference} <span className="font-normal text-neutral-500 dark:text-neutral-400">{publication.year}</span>
                  </p>

                  {publication.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{publication.description}</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {publication.pdfUrl && (
                      <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>
                        <Download className="h-3.5 w-3.5" /> {messages.publications.pdf}
                      </a>
                    )}
                    {publication.arxivId && (
                      <a
                        href={publication.arxivId.startsWith('http') ? publication.arxivId : `https://arxiv.org/abs/${publication.arxivId.replace(/^arXiv:/i, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={actionClass}
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> {messages.publications.arxiv}
                      </a>
                    )}
                    {publication.doi && (
                      <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className={actionClass}>
                        <ExternalLink className="h-3.5 w-3.5" /> DOI
                      </a>
                    )}
                    {publication.code && (
                      <a href={publication.code} target="_blank" rel="noopener noreferrer" className={actionClass}>
                        <Code2 className="h-3.5 w-3.5" /> {messages.publications.code}
                      </a>
                    )}
                    {publication.abstract && (
                      <button
                        type="button"
                        onClick={() => setExpandedAbstractId(expandedAbstractId === publication.id ? null : publication.id)}
                        className={cn(actionClass, expandedAbstractId === publication.id && 'border-accent bg-accent text-white hover:bg-accent hover:text-white')}
                      >
                        <FileText className="h-3.5 w-3.5" /> {messages.publications.abstract}
                      </button>
                    )}
                    {publication.bibtex && (
                      <button
                        type="button"
                        onClick={() => setExpandedBibtexId(expandedBibtexId === publication.id ? null : publication.id)}
                        className={cn(actionClass, expandedBibtexId === publication.id && 'border-accent bg-accent text-white hover:bg-accent hover:text-white')}
                      >
                        <BookOpen className="h-3.5 w-3.5" /> {messages.publications.bibtex}
                      </button>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {expandedAbstractId === publication.id && publication.abstract && (
                      <motion.div
                        key="abstract"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="border-l-2 border-accent/60 bg-surface-muted px-4 py-3 text-sm leading-7 text-neutral-600 dark:text-neutral-300">
                          {publication.abstract}
                        </div>
                      </motion.div>
                    )}
                    {expandedBibtexId === publication.id && publication.bibtex && (
                      <motion.div
                        key="bibtex"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div className="relative rounded-md border border-neutral-200 bg-surface-muted p-4 dark:border-neutral-800">
                          <pre className="overflow-x-auto whitespace-pre-wrap pr-8 font-mono text-xs leading-6 text-neutral-600 dark:text-neutral-300">
                            {publication.bibtex}
                          </pre>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(publication.bibtex || '')}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-surface text-neutral-500 transition-colors duration-200 hover:text-accent dark:border-neutral-700 dark:text-neutral-400"
                            title={messages.common.copyToClipboard}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </motion.div>
  );
}
