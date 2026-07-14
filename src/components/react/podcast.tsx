/* Cassette-tape podcast components ported from podcast-card.jsx — nav → <a href>. */
import { Icon } from './icons'
import { podcastHref } from '@/lib/links'
import type { Podcast } from '@/lib/data-source/types'

export function Reel({ size = 32, color = '#c8553d', spinning = false }: { size?: number; color?: string; spinning?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} style={spinning ? { animation: 'podreel-spin 8s linear infinite' } : undefined}>
      <circle cx="20" cy="20" r="18" fill="#1c1814" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <rect key={deg} x="18.5" y="4" width="3" height="6" rx="1" fill={color} opacity="0.55" transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="7" fill="#faf6ec" stroke="#1c1814" strokeWidth="1" />
      <rect x="18" y="17.2" width="4" height="5.6" rx="0.5" fill="#1c1814" />
    </svg>
  )
}

export function CassetteTape({
  ep,
  color = '#c8553d',
  width = 220,
  label = 'HALF-COOKED RADIO',
  spinning = false,
}: {
  ep: string
  color?: string
  width?: number
  label?: string
  spinning?: boolean
}) {
  const h = Math.round(width * 0.62)
  return (
    <div
      className="relative"
      style={{
        width,
        height: h,
        background: `linear-gradient(180deg, ${color} 0%, ${color}cc 65%, ${color}99 100%)`,
        borderRadius: 5,
        padding: 7,
        boxShadow: '0 14px 24px -12px rgba(58,42,29,0.55), inset 0 -2px 0 rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
    >
      <div className="relative h-full" style={{ background: 'var(--paper-50)', border: '1px solid var(--ink-300)', borderRadius: 2, padding: '10px 12px 0' }}>
        <span className="absolute top-1.5 right-2 text-[8px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
          C-60 · TYPE II
        </span>

        <div className="flex items-center gap-2.5 mt-2 mb-3">
          <Reel size={Math.round(width * 0.16)} color={color} spinning={spinning} />
          <div className="flex-1 relative" style={{ height: Math.round(width * 0.07), background: '#1c1814', borderRadius: 1.5 }}>
            <div className="absolute inset-y-1 left-0 right-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 5px, rgba(255,255,255,0.06) 5px 6px)' }}></div>
          </div>
          <Reel size={Math.round(width * 0.16)} color={color} spinning={spinning} />
        </div>

        <div style={{ borderTop: '1px dashed var(--ink-300)', paddingTop: 8 }}>
          <div className="text-[8.5px] mb-1" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', letterSpacing: '0.18em' }}>
            {label}
          </div>
          <div className="font-display italic leading-none" style={{ color, fontSize: Math.round(width * 0.135) }}>
            {ep}
          </div>
        </div>

        <div className="absolute bottom-1.5 left-3 right-3 flex justify-between">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(40,30,20,0.45)', boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.4)' }}></span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function WaveBars({ seed = '', count = 36, color = 'currentColor', height = 28 }: { seed?: string; count?: number; color?: string; height?: number }) {
  let h = 0
  const arr: number[] = []
  const str = String(seed) + 'wf'
  for (let i = 0; i < count; i++) {
    h = (h * 31 + str.charCodeAt(i % str.length) + i * 7) >>> 0
    arr.push(0.25 + ((h % 100) / 100) * 0.75)
  }
  return (
    <div className="flex items-end gap-[2px] w-full" style={{ height }}>
      {arr.map((v, i) => (
        <div key={i} className="flex-1" style={{ height: v * 100 + '%', background: color, opacity: 0.5 + v * 0.5, borderRadius: 1 }}></div>
      ))}
    </div>
  )
}

/* =============== PodcastCard — LIST PAGE ITEM =========== */
export function PodcastCard({ pod, idx }: { pod: Podcast; idx: number }) {
  const color = pod.cover_color || 'var(--accent)'
  const num = String(idx + 1).padStart(2, '0')

  return (
    <a href={podcastHref(pod.id)} className="reveal group grid md:grid-cols-[240px_1fr] gap-6 md:gap-8 py-8 md:py-10 cursor-pointer">
      {/* LEFT — cassette + meta */}
      <div>
        <div style={{ transform: 'rotate(-1.2deg)' }} className="transition-transform group-hover:rotate-0">
          <CassetteTape ep={pod.ep} color={color} width={224} />
        </div>
        <div className="mt-4 flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center shrink-0" style={{ width: 36, height: 36, borderRadius: 999, background: color, color: 'var(--paper-50)' }}>
            <Icon.play />
          </span>
          <div className="flex-1 min-w-0">
            <WaveBars seed={pod.id} count={28} color={color} height={20} />
          </div>
          <span className="shrink-0 text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{pod.duration}</span>
        </div>
      </div>

      {/* RIGHT — copy + chapters */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <span className="num-stamp text-[28px]" style={{ color }}>{num}</span>
          <span className="kicker">半熟电波 · {pod.ep}</span>
          <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{pod.date} · {pod.duration}</span>
        </div>

        <h3 className="font-display leading-[1.05] tracking-tight mb-1.5 group-hover:text-[color:var(--accent)] transition-colors" style={{ color: 'var(--ink-900)', fontSize: 'clamp(26px, 3vw, 36px)' }}>
          {pod.title}
        </h3>

        <p className="text-[13px] mb-3" style={{ color, fontFamily: 'var(--font-wenkai)' }}>
          {pod.guest === '独白' ? '独白 · 一个人' : pod.guest}
        </p>

        <p className="text-[14.5px] md:text-[15px] mb-5 max-w-[58ch]" style={{ color: 'var(--ink-700)', lineHeight: 1.75, fontFamily: 'var(--font-wenkai)' }}>
          {pod.desc}
        </p>

        {pod.chapters && pod.chapters.length > 0 && (
          <div className="mb-5">
            <div className="kicker mb-2">章节 · CHAPTERS</div>
            <ol className="space-y-1.5">
              {pod.chapters.map((c, i) => (
                <li key={i} className="flex items-baseline gap-3 text-[13.5px]" style={{ color: 'var(--ink-800)' }}>
                  <span className="shrink-0 text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', minWidth: 42 }}>{c.time}</span>
                  <span style={{ color: 'var(--ink-300)' }}>—</span>
                  <span className="truncate">{c.title}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--ink-300)' }}>
          <span className="kicker mr-1">收听 · LISTEN</span>
          {['小宇宙', 'Apple', 'Spotify', 'RSS'].map((p) => (
            <span key={p} className="text-[11px] px-2 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-700)', background: 'var(--paper-200)', border: '1px solid var(--ink-300)' }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}

/* =============== PodcastFeatureCard — HOMEPAGE 3-COL ==== */
export function PodcastFeatureCard({ pod }: { pod: Podcast }) {
  const color = pod.cover_color || 'var(--accent)'
  return (
    <a href={podcastHref(pod.id)} className="reveal group cursor-pointer flex flex-col h-full">
      <div className="flex items-end justify-center pb-3 pt-2 mb-4 relative" style={{ minHeight: 170 }}>
        <div style={{ transform: 'rotate(-2deg)' }} className="transition-transform duration-300 group-hover:rotate-0 group-hover:-translate-y-1">
          <CassetteTape ep={pod.ep} color={color} width={200} />
        </div>
        <span
          className="absolute opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 48, height: 48, borderRadius: 999, background: 'var(--paper-50)', color, border: '2px solid ' + color, boxShadow: '0 4px 12px rgba(58,42,29,0.25)' }}
        >
          <Icon.play />
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="kicker" style={{ color }}>{pod.ep}</span>
        <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{pod.duration}</span>
      </div>

      <h4 className="font-display leading-tight mb-2 group-hover:text-[color:var(--accent)] transition-colors" style={{ color: 'var(--ink-900)', fontSize: 20 }}>
        {pod.title}
      </h4>

      <p className="text-[13px] mb-2.5" style={{ color: 'var(--ink-700)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)' }}>
        {pod.desc}
      </p>

      <div className="mt-auto pt-3 flex items-center justify-between border-t" style={{ borderColor: 'var(--ink-300)' }}>
        <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{pod.date}</span>
        <span className="text-[11px] inline-flex items-center gap-1 hand-underline" style={{ color }}>
          收听 <Icon.arrow />
        </span>
      </div>
    </a>
  )
}
