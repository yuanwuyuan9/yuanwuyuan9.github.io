'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, GraduationCap, Heart, Linkedin, Mail, MapPin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { useMessages } from '@/lib/i18n/useMessages';

const OrcidIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
  </svg>
);

interface ProfileProps {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  researchInterests?: string[];
}

export default function Profile({ author, social, features, researchInterests }: ProfileProps) {
  const messages = useMessages();
  const [hasLiked, setHasLiked] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [openPopover, setOpenPopover] = useState<'email' | 'location' | null>(null);

  useEffect(() => {
    if (features.enable_likes) {
      setHasLiked(localStorage.getItem('jiale-website-user-liked') === 'true');
    }
  }, [features.enable_likes]);

  const handleLike = () => {
    const next = !hasLiked;
    setHasLiked(next);
    if (next) {
      localStorage.setItem('jiale-website-user-liked', 'true');
      setShowThanks(true);
      window.setTimeout(() => setShowThanks(false), 1800);
    } else {
      localStorage.removeItem('jiale-website-user-liked');
      setShowThanks(false);
    }
  };

  const externalLinks = [
    social.google_scholar && { name: 'Google Scholar', href: social.google_scholar, icon: GraduationCap },
    social.orcid && { name: 'ORCID', href: social.orcid, icon: OrcidIcon },
    social.github && { name: 'GitHub', href: social.github, icon: Github },
    social.linkedin && { name: 'LinkedIn', href: social.linkedin, icon: Linkedin },
  ].filter(Boolean) as Array<{ name: string; href: string; icon: typeof Github }>;

  const iconClass = 'flex h-9 w-9 items-center justify-center rounded-md border border-neutral-200/80 text-neutral-500 transition-colors duration-200 hover:border-neutral-300 hover:bg-surface hover:text-accent dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="lg:sticky lg:top-24"
    >
      <div className="mx-auto aspect-square w-full max-w-[13rem] overflow-hidden rounded-lg border border-neutral-200 bg-surface sm:max-w-[14rem] lg:mx-0 lg:max-w-none dark:border-neutral-800">
        <Image
          src={author.avatar}
          alt={author.name}
          width={320}
          height={320}
          className="h-full w-full object-cover object-[32%_center]"
          priority
        />
      </div>

      <div className="mt-6 text-center lg:text-left">
        <h1 className="editorial-heading text-4xl sm:text-[42px] lg:text-4xl">{author.name}</h1>
        <p className="mt-3 text-sm font-semibold text-accent">{author.title}</p>
        <p className="mx-auto mt-1.5 max-w-xs text-sm leading-6 text-neutral-600 lg:mx-0 dark:text-neutral-400">
          {author.institution}
        </p>
      </div>

      <div className="relative mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
        {social.email && (
          <button
            type="button"
            className={iconClass}
            onClick={() => setOpenPopover(openPopover === 'email' ? null : 'email')}
            aria-label={messages.profile.email}
            title={messages.profile.email}
          >
            <Mail className="h-4 w-4" />
          </button>
        )}
        {(social.location || social.location_details) && (
          <button
            type="button"
            className={iconClass}
            onClick={() => setOpenPopover(openPopover === 'location' ? null : 'location')}
            aria-label={messages.profile.location}
            title={messages.profile.location}
          >
            <MapPin className="h-4 w-4" />
          </button>
        )}
        {externalLinks.map((link) => {
          const Icon = link.icon;
          return (
            <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className={iconClass} aria-label={link.name} title={link.name}>
              <Icon className="h-4 w-4" />
            </a>
          );
        })}

        <AnimatePresence>
          {openPopover && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="absolute left-1/2 top-12 z-20 w-max max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md border border-neutral-200 bg-surface p-3 text-center text-xs leading-5 text-neutral-600 shadow-md lg:left-0 lg:translate-x-0 dark:border-neutral-800 dark:text-neutral-300"
            >
              {openPopover === 'email' ? (
                <a href={`mailto:${social.email}`} className="font-medium text-accent hover:text-accent-dark">
                  {social.email}
                </a>
              ) : (
                <>
                  {social.location_details?.map((line) => <div key={line}>{line}</div>)}
                  {social.location_url && (
                    <a href={social.location_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block font-medium text-accent hover:text-accent-dark">
                      {messages.profile.googleMap}
                    </a>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {researchInterests && researchInterests.length > 0 && (
        <div className="mt-7 border-t border-neutral-200 pt-6 text-center lg:text-left dark:border-neutral-800">
          <h2 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{messages.profile.researchInterests}</h2>
          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
            {researchInterests.map((interest) => <li key={interest}>{interest}</li>)}
          </ul>
        </div>
      )}

      {features.enable_likes && (
        <div className="relative mt-6 flex justify-center lg:justify-start">
          <button
            type="button"
            onClick={handleLike}
            className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-medium transition-colors duration-200 ${hasLiked ? 'border-accent/30 bg-accent/8 text-accent' : 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-accent dark:border-neutral-800 dark:text-neutral-400'}`}
          >
            <Heart className={`h-3.5 w-3.5 ${hasLiked ? 'fill-current' : ''}`} />
            {hasLiked ? messages.profile.liked : messages.profile.like}
          </button>
          <AnimatePresence>
            {showThanks && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-11 rounded-md bg-primary px-3 py-1.5 text-xs text-background shadow-md"
              >
                {messages.profile.thanks}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
