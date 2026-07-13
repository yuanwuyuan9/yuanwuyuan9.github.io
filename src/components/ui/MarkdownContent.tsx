import type { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  compact?: boolean;
  className?: string;
}

const components = {
  h1: ({ children }: ComponentProps<'h1'>) => (
    <h1 className="editorial-heading mb-5 mt-10 text-3xl first:mt-0">{children}</h1>
  ),
  h2: ({ children }: ComponentProps<'h2'>) => (
    <h2 className="editorial-heading mb-4 mt-9 border-b border-neutral-200 pb-3 text-2xl first:mt-0 dark:border-neutral-800">{children}</h2>
  ),
  h3: ({ children }: ComponentProps<'h3'>) => (
    <h3 className="mb-3 mt-7 text-lg font-semibold text-primary first:mt-0">{children}</h3>
  ),
  p: ({ children }: ComponentProps<'p'>) => <p className="mb-4 last:mb-0">{children}</p>,
  ul: ({ children }: ComponentProps<'ul'>) => <ul className="mb-4 ml-5 list-disc space-y-1.5 marker:text-accent">{children}</ul>,
  ol: ({ children }: ComponentProps<'ol'>) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 marker:text-accent">{children}</ol>,
  li: ({ children }: ComponentProps<'li'>) => <li className="pl-1">{children}</li>,
  a: ({ ...props }: ComponentProps<'a'>) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent underline decoration-accent/35 underline-offset-4 transition-colors duration-200 hover:text-accent-dark hover:decoration-accent"
    />
  ),
  blockquote: ({ children }: ComponentProps<'blockquote'>) => (
    <blockquote className="my-5 border-l-2 border-accent/60 pl-4 font-serif text-lg italic text-neutral-600 dark:text-neutral-300">
      {children}
    </blockquote>
  ),
  strong: ({ children }: ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
  em: ({ children }: ComponentProps<'em'>) => <em className="italic text-neutral-600 dark:text-neutral-300">{children}</em>,
  code: ({ children }: ComponentProps<'code'>) => (
    <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-neutral-800">{children}</code>
  ),
};

export default function MarkdownContent({ content, compact = false, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'text-pretty text-neutral-700 dark:text-neutral-300',
        compact ? 'text-sm leading-7' : 'text-[15px] leading-7 sm:text-base sm:leading-8',
        className
      )}
    >
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
