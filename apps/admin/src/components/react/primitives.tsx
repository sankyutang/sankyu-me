/* Display primitives ported from components.jsx — Cover / Avatar / SocialRow / NowCard / SectionHeader */
import type { CSSProperties } from 'react'
import { Icon } from './icons'
import type { SocialLink } from '@/lib/data-source/types'

/* ---------- COVER ---------- */
const COVER_PALETTE = ['#c8553d', '#8b5e34', '#3a6b46', '#1e3a5f', '#a3823a', '#7a4f72']
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
      <div className={'relative overflow-hidden ' + className} style={{ aspectRatio: aspect, ...style }}>
        <img src={src} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        {kicker && (
          <span
            className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px]"
            style={{ background: 'rgba(245,241,232,0.92)', color: 'var(--ink-800)', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase' }}
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
        background: `linear-gradient(135deg, ${c}26, ${c}10), var(--paper-200)`,
        borderBottom: '1px solid var(--ink-300)',
        ...style,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(58,42,29,0.13) 1px, transparent 1px)',
          backgroundSize: compact ? '8px 8px' : '14px 14px',
          opacity: 0.55,
        }}
      />
      {!compact && kicker && (
        <span className="absolute top-3 left-3 kicker" style={{ color: c, fontSize: 10 }}>
          {kicker}
        </span>
      )}
      <div className="absolute inset-0 flex items-center justify-center select-none">
        <span
          style={{
            fontFamily: 'var(--font-serif-en)',
            fontStyle: 'italic',
            fontWeight: 500,
            lineHeight: 1,
            color: c,
            fontSize: compact ? '1.6em' : '5em',
            opacity: 0.85,
            textShadow: '0 1px 0 rgba(255,255,255,0.35)',
          }}
        >
          {glyph}
        </span>
      </div>
      {!compact && (
        <div
          className="absolute bottom-3 right-3 inline-flex items-center justify-center"
          style={{
            width: 28,
            height: 28,
            border: '1px solid ' + c,
            color: c,
            borderRadius: '50%',
            fontSize: 10,
            fontFamily: 'var(--font-serif-cn)',
            transform: 'rotate(-6deg)',
            background: 'rgba(245,241,232,0.5)',
          }}
        >
          印
        </div>
      )}
      {!compact && (
        <div
          className="absolute left-3 right-3 bottom-12 h-px"
          style={{
            backgroundImage: `linear-gradient(to right, ${c} 4px, transparent 4px)`,
            backgroundSize: '10px 1px',
          }}
        />
      )}
    </div>
  )
}

/* ---------- AVATAR ---------- */
interface AvatarProps {
  size?: number
  src?: string
  initial?: string
  className?: string
  noStamp?: boolean
}

export function Avatar({ size = 96, src, initial = 'S', className = '', noStamp = false }: AvatarProps) {
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
      {!noStamp && (
        <div
          style={{
            position: 'absolute',
            right: -size * 0.18,
            bottom: -size * 0.06,
            width: size * 0.42,
            height: size * 0.42,
            zIndex: 1,
          }}
          className="stamp"
        >
          印
        </div>
      )}
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
                border: '1px solid var(--ink-300)',
                borderRadius: 999,
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
