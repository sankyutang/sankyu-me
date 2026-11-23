/* Display primitives ported from components.jsx — Cover / Avatar / SocialRow / NowCard / SectionHeader */
import type { CSSProperties } from 'react'
import { Icon } from './icons'
import type { SocialLink } from '@/lib/data-source/types'

/* ---------- COVER ---------- */
const COVER_PALETTE = ['#c41e1e', '#5a5a5a', '#3a6b46', '#1e3a5f', '#6b5a3a', '#5a4f72']
function pickCoverColor(seed?: string) {
  let h = 0
  for (const c of String(seed || '?')) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return COVER_PALETTE[h % COVER_PALETTE.length]
}

interface CoverProps {
  src?: string
  glyph?: string
  color?: string
  kicker?: string
  seed?: string
  aspect?: string
  className?: string
  style?: CSSProperties
  compact?: boolean
}

export function Cover({
  src,
  glyph = '·',
  color,
  kicker,
  seed,
  aspect = '16/9',
  className = '',
  style = {},
  compact = false,
}: CoverProps) {
  const c = color || pickCoverColor(seed || glyph)

  if (src) {
    return (
      <div
        className={'relative overflow-hidden ' + className}
        style={{ aspectRatio: aspect, border: '1px solid var(--paper-300)', ...style }}
      >
        <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        {kicker && (
          <span
            className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px]"
            style={{
              background: 'rgba(255,255,255,0.92)',
              color: 'var(--ink-800)',
              fontFamily: 'var(--font-en)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {kicker}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={'relative overflow-hidden ' + className}
      style={{
        aspectRatio: aspect,
        background: 'var(--paper-200)',
        border: '1px solid var(--paper-300)',
        ...style,
      }}
    >
      {!compact && kicker && (
        <span className="absolute top-3 left-3 kicker" style={{ color: c, fontSize: 10 }}>
          {kicker}
        </span>
      )}
      <div className="absolute inset-0 flex items-center justify-center select-none">
        <span
          style={{
            fontFamily: 'var(--font-en)',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: 1,
            color: c,
            fontSize: compact ? '1.4em' : '3.5em',
            opacity: 0.7,
          }}
        >
          {glyph}
        </span>
      </div>
    </div>
  )
}

/* ---------- AVATAR ---------- */
interface AvatarProps {
  size?: number
  src?: string
  initial?: string
  className?: string
  /** @deprecated stamps removed from editorial UI; ignored */
  noStamp?: boolean
}

export function Avatar({ size = 96, src, initial = 'S', className = '' }: AvatarProps) {
  return (
    <div className={'relative ' + className} style={{ width: size, height: size }} aria-hidden="true">
      <div
        className="avatar-mark"
        style={{
          fontSize: size * 0.42,
          backgroundImage: src ? `url("${src}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: src ? 'transparent' : undefined,
        }}
      >
        {src ? '' : initial}
      </div>
    </div>
  )
}

/* ---------- SOCIAL ROW ---------- */
interface SocialRowProps {
  items: SocialLink[]
  compact?: boolean
  size?: number
}

export function SocialRow({ items, compact = false, size = 36 }: SocialRowProps) {
  return (
    <ul className={'flex flex-wrap ' + (compact ? 'gap-2' : 'gap-2.5')}>
      {items.map((s) => {
        const Glyph = (Icon as Record<string, ((p: any) => JSX.Element) | undefined>)[s.id]
        return (
          <li key={s.id}>
            <a
              href={s.url}
              title={s.label + (s.handle ? ' · ' + s.handle : '')}
              aria-label={s.label}
              className="social-pill inline-flex items-center justify-center transition-colors group"
              style={{
                width: size,
                height: size,
                color: 'var(--ink-700)',
                background: 'var(--paper-50)',
                border: '1px solid var(--paper-300)',
                borderRadius: 2,
              }}
            >
              {Glyph ? (
                <Glyph width={size * 0.48} height={size * 0.48} />
              ) : (
                <span style={{ fontSize: size * 0.4, fontFamily: 'var(--font-serif-en)', fontStyle: 'italic' }}>{s.label[0]}</span>
              )}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- NOW CARD ---------- */
export function NowCard({ now }: { now: string }) {
  return (
    <div className="paper-card relative p-5 md:p-6" style={{ background: 'var(--paper-50)' }}>
      <span className="tape" style={{ top: -10, left: 24, transform: 'rotate(-3deg)' }}></span>
      <span className="tape" style={{ top: -10, right: 32, transform: 'rotate(4deg)' }}></span>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="kicker" style={{ color: 'var(--accent)' }}>NOW · 此刻</span>
        <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
          {new Date().toLocaleDateString('zh-CN')}
        </span>
      </div>
      <p className="text-[15px] md:text-[16px] leading-[1.75]" style={{ color: 'var(--ink-800)' }}>
        {now}
      </p>
    </div>
  )
}

/* ---------- SECTION HEADER ---------- */
interface SectionHeaderProps {
  en: string
  kicker?: string
  action?: string
  actionHref?: string
}

export function SectionHeader({ en, kicker, action, actionHref }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6 md:mb-8 gap-4">
      <div className="min-w-0">
        {kicker && <div className="kicker mb-2 whitespace-nowrap">{kicker}</div>}
        <h2 className="font-display text-[36px] md:text-[52px] leading-[1.02] tracking-tight" style={{ color: 'var(--ink-900)' }}>
          {en}
        </h2>
      </div>
      {action && actionHref && (
        <a
          href={actionHref}
          className="hidden md:inline-flex shrink-0 items-center gap-1.5 text-[13px] hand-underline whitespace-nowrap pb-2"
          style={{ color: 'var(--ink-700)' }}
        >
          {action} <Icon.arrow />
        </a>
      )}
    </div>
  )
}
