/* Inline SVG icon set + platform palette — ported from components.jsx / video-card.jsx */
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

export const Icon = {
  x: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...p}>
      <path d="M18.244 2H21l-6.49 7.41L22 22h-6.78l-4.71-6.18L4.8 22H2l6.94-7.93L1.5 2h6.9l4.27 5.66L18.244 2Zm-1.18 18.2h1.86L7.05 3.7H5.05l12.014 16.5Z" />
    </svg>
  ),
  github: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...p}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.42.36.8 1.07.8 2.16v3.2c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
  rss: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...p}>
      <path d="M4 11v3a7 7 0 0 1 7 7h3A10 10 0 0 0 4 11Zm0-7v3a14 14 0 0 1 14 14h3A17 17 0 0 0 4 4Zm2.5 13.5A2.5 2.5 0 1 1 4 20a2.5 2.5 0 0 1 2.5-2.5Z" />
    </svg>
  ),
  mail: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  arrow: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14" {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  dot: (p: P) => (
    <svg viewBox="0 0 8 8" fill="currentColor" width="6" height="6" {...p}>
      <circle cx="4" cy="4" r="3" />
    </svg>
  ),
  play: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" {...p}>
      <path d="M7 5v14l12-7L7 5Z" />
    </svg>
  ),
  wave: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" width="14" height="14" {...p}>
      <path d="M3 12h2M7 9v6M11 6v12M15 9v6M19 12h2" />
    </svg>
  ),
  pen: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="14" height="14" {...p}>
      <path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z" />
    </svg>
  ),
  cube: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14" {...p}>
      <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" />
      <path d="m3 7.5 9 4.5m0 0 9-4.5M12 12v9" />
    </svg>
  ),
  weibo: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M10.7 19.6c-3.6 0-6.7-1.8-6.7-4.7 0-1.5.95-3.27 2.6-4.9C8.9 7.85 11.5 6.85 12.7 8c.55.52.6 1.4.3 2.4-.15.5.5.27.85.13 2.3-.96 4.36-1.02 5.12.07.4.6.36 1.36-.03 2.2.45.1.94.5 1.06 1.27.36 2.4-3.1 5.5-9.3 5.5Zm.85-1.5c2.45-.24 4.3-1.74 4.13-3.36-.16-1.6-2.27-2.72-4.72-2.5-2.46.24-4.3 1.74-4.14 3.36.16 1.62 2.27 2.74 4.73 2.5Zm-.46-1.18c-1.18.15-2.27-.4-2.43-1.25-.16-.84.66-1.65 1.85-1.8 1.2-.16 2.3.4 2.45 1.24.16.85-.67 1.65-1.87 1.8Zm.62-1.07c.16-.05.34-.04.42.1.07.13 0 .3-.17.36-.16.06-.34.02-.42-.1-.07-.14 0-.3.17-.36Zm-.96-.6c.07-.13.27-.18.45-.12.18.07.27.24.2.37-.07.13-.27.18-.45.12-.18-.07-.27-.24-.2-.37Zm6.94-7.36c-1.13-1.25-2.84-1.7-4.4-1.34-.36.1-.7-.16-.76-.55-.07-.4.18-.78.54-.87 2.05-.47 4.3.12 5.78 1.77 1.48 1.64 1.83 3.9 1.06 5.83-.13.36-.55.55-.92.4-.36-.13-.54-.55-.4-.92.58-1.45.3-3.12-.9-4.32Zm-2.13 1.94c-.55-.6-1.37-.83-2.13-.65-.32.08-.62-.13-.68-.46-.06-.32.14-.64.45-.72 1.2-.3 2.5.07 3.36 1.04.87.97 1.07 2.32.62 3.45-.12.3-.46.45-.76.33-.3-.13-.45-.46-.33-.78.3-.7.16-1.55-.4-2.2Z" />
    </svg>
  ),
  xhs: (p: P) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" />
      <text x="12" y="16.5" textAnchor="middle" fontFamily="ui-serif, Georgia" fontSize="13" fontWeight="700" fill="var(--paper-50, #f5f1e8)">h</text>
    </svg>
  ),
  wechat: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M8.7 4.3c-3.7 0-6.7 2.4-6.7 5.5 0 1.7.95 3.25 2.4 4.3l-.7 2.1 2.5-1.35c.7.2 1.45.3 2.2.32-.06-.3-.1-.6-.1-.92 0-3.05 2.9-5.5 6.45-5.5.43 0 .85.03 1.25.1C15.1 6.1 12.2 4.3 8.7 4.3Zm-2.6 2.65a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9Zm5.5 0a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9Zm3 2.95c-3.1 0-5.6 2.05-5.6 4.6 0 2.55 2.5 4.6 5.6 4.6.7 0 1.36-.1 1.98-.3l2.1 1.15-.55-1.8c1.27-.9 2.07-2.22 2.07-3.65 0-2.55-2.5-4.6-5.6-4.6Zm-1.85 2.2a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm3.8 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z" />
    </svg>
  ),
  bilibili: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M7.17 3.27a1 1 0 0 1 1.42 0L10.83 5.5h2.34l2.24-2.24a1 1 0 1 1 1.42 1.42L15.59 5.5H17a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-7a4 4 0 0 1 4-4h1.42L7.17 4.7a1 1 0 0 1 0-1.42ZM7 7.5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H7Zm1.5 3.25a1 1 0 0 1 1 1V14a1 1 0 1 1-2 0v-2.25a1 1 0 0 1 1-1Zm7 0a1 1 0 0 1 1 1V14a1 1 0 1 1-2 0v-2.25a1 1 0 0 1 1-1Z" />
    </svg>
  ),
  youtube: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M23 12s0-3.3-.42-4.88a2.55 2.55 0 0 0-1.8-1.8C19.18 5 12 5 12 5s-7.18 0-8.78.32a2.55 2.55 0 0 0-1.8 1.8C1 8.7 1 12 1 12s0 3.3.42 4.88c.23.87.92 1.55 1.8 1.78C4.82 19 12 19 12 19s7.18 0 8.78-.34a2.55 2.55 0 0 0 1.8-1.78C23 15.3 23 12 23 12Zm-13.32 3.27V8.72L15.55 12l-5.87 3.27Z" />
    </svg>
  ),
  facebook: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M13.5 22v-8h2.7l.4-3.13H13.5V8.85c0-.9.25-1.52 1.55-1.52h1.65V4.55c-.28-.04-1.26-.13-2.4-.13-2.4 0-4 1.46-4 4.13v2.3H7.6V14h2.7v8h3.2Z" />
    </svg>
  ),
  xiaoyuzhou: (p: P) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18" {...p}>
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-20 12 12)" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  apple: (p: P) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...p}>
      <path d="M16.4 11.4c0-2.4 2-3.55 2.07-3.6-1.13-1.65-2.9-1.88-3.53-1.9-1.5-.15-2.93.88-3.7.88-.76 0-1.93-.86-3.18-.84-1.63.03-3.15.95-4 2.4-1.7 2.94-.44 7.3 1.22 9.7.81 1.17 1.77 2.49 3.04 2.44 1.22-.05 1.68-.79 3.16-.79 1.47 0 1.9.79 3.18.77 1.32-.02 2.15-1.19 2.95-2.37.93-1.36 1.32-2.7 1.34-2.77-.03-.01-2.57-.99-2.6-3.92Zm-2.41-7.2c.67-.82 1.13-1.95 1-3.1-.97.04-2.15.65-2.85 1.46-.63.72-1.18 1.88-1.03 2.98 1.08.08 2.2-.55 2.88-1.34Z" />
    </svg>
  ),
} as const

export type IconName = keyof typeof Icon

export const PLATFORM_COLORS: Record<string, string> = {
  YouTube: '#cc0000',
  Bilibili: '#fb7299',
}

export function platformBadgeStyle(name: string) {
  const bg = PLATFORM_COLORS[name] || 'var(--accent)'
  return { background: bg, color: '#fff' }
}
