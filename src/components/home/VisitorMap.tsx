import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const VISITOR_STATS_URL = 'https://mapmyvisitors.com/web/1c6i3';
const VISITOR_MAP_URL =
  'https://mapmyvisitors.com/map.png?cl=e6e6e1&w=300&t=tt&d=viPvVRE7WxZxwwTgPBN3ZtvhE1w8iU429KHNIHiA-ec&co=fafaf8&ct=5c5c58';

interface VisitorMapProps {
  title: string;
}

export default function VisitorMap({ title }: VisitorMapProps) {
  return (
    <div className="mx-auto mt-7 max-w-[19rem] border-t border-neutral-200 pt-6 text-center lg:mx-0 lg:text-left dark:border-neutral-800">
      <h2 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{title}</h2>
      <div className="group relative mt-3 overflow-hidden rounded-md bg-[#fafaf8] shadow-sm transition-shadow duration-200 hover:shadow-md dark:bg-[#151514]">
        <a
          href={VISITOR_STATS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={title}
          referrerPolicy="strict-origin-when-cross-origin"
          className="block"
        >
          <Image
            src={VISITOR_MAP_URL}
            alt={title}
            width={300}
            height={180}
            loading="eager"
            referrerPolicy="strict-origin-when-cross-origin"
            unoptimized
            className="visitor-map-image block h-auto w-full transition-opacity duration-200 group-hover:opacity-95"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300/70 bg-[#fafaf8]/85 text-neutral-600 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 dark:border-neutral-700 dark:bg-[#242422]/90 dark:text-neutral-300"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </a>
      </div>
    </div>
  );
}
