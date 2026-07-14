/* MediaList — the one interactive island (filter tabs). Ported from pages.jsx MediaList. */
import { useState, useEffect, useMemo } from 'react'
import { PodcastCard } from './podcast'
import { MediaVideoRow } from './video'
import { PLATFORM_COLORS } from './icons'
import type { MediaItem } from '@/lib/data-source/types'

interface Props {
  items: MediaItem[]
  initialFilter?: 'all' | 'podcasts' | 'videos'
}

function filterFromUrl(fallback: 'all' | 'podcasts' | 'videos') {
  if (typeof window === 'undefined') return fallback
  const f = new URLSearchParams(window.location.search).get('filter')
  return f === 'podcasts' || f === 'videos' ? f : fallback
}

export default function MediaList({ items: allItems, initialFilter = 'all' }: Props) {
  const [filter, setFilter] = useState<'all' | 'podcasts' | 'videos'>(() => filterFromUrl(initialFilter))

  useEffect(() => {
    setFilter(filterFromUrl(initialFilter))
  }, [initialFilter])

  const podcastCount = useMemo(() => allItems.filter((x) => x.kind === 'podcast').length, [allItems])
  const videoCount = useMemo(() => allItems.filter((x) => x.kind === 'video').length, [allItems])

  const items = useMemo(() => {
    if (filter === 'podcasts') return allItems.filter((x) => x.kind === 'podcast')
    if (filter === 'videos') return allItems.filter((x) => x.kind === 'video')
    return allItems
  }, [filter, allItems])

  const pickFilter = (next: 'all' | 'podcasts' | 'videos') => {
    setFilter(next)
    const map = { all: '/media', podcasts: '/media?filter=podcasts', videos: '/media?filter=videos' }
    const target = map[next]
    if (window.location.pathname + window.location.search !== target) {
      history.replaceState(null, '', target)
    }
  }

  const tabs = [
    { id: 'all' as const, zh: '全部', en: 'ALL', count: allItems.length },
    { id: 'podcasts' as const, zh: '播客', en: 'PODCASTS', count: podcastCount },
    { id: 'videos' as const, zh: '视频', en: 'VIDEOS', count: videoCount },
  ]

  return (
    <>
      {/* HERO STRIP */}
      <div className="mb-10 grid md:grid-cols-2 gap-5 md:gap-6 pb-8 border-b" style={{ borderColor: 'var(--ink-300)' }}>
        <div className="paper-card p-5" style={{ background: 'var(--paper-50)' }}>
          <div className="kicker mb-2">PODCAST · 播客</div>
          <div className="font-display italic leading-tight mb-2" style={{ color: 'var(--accent)', fontSize: 'clamp(24px, 2.6vw, 30px)' }}>
            半熟电波 · Half-Cooked Radio
          </div>
          <p className="text-[13.5px] mb-3" style={{ color: 'var(--ink-700)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)' }}>
            没有 jingle、没有广告、没有正式的开场白。两周一更,一次聊一件事。
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px]" style={{ color: 'var(--ink-700)' }}>
            <a href="#" className="hand-underline">小宇宙</a>
            <a href="#" className="hand-underline">Apple Podcasts</a>
            <a href="#" className="hand-underline">Spotify</a>
            <a href="/blog/rss.xml" className="hand-underline">RSS</a>
          </div>
        </div>
        <div className="paper-card p-5" style={{ background: 'var(--paper-50)' }}>
          <div className="kicker mb-2">VIDEO · 视频</div>
          <div className="font-display italic leading-tight mb-2" style={{ color: PLATFORM_COLORS['Bilibili'] || 'var(--accent-2)', fontSize: 'clamp(24px, 2.6vw, 30px)' }}>
            桌面、键盘、和一只猫
          </div>
          <p className="text-[13.5px] mb-3" style={{ color: 'var(--ink-700)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)' }}>
            在 Bilibili 和 YouTube 同步,主题围绕开发、桌面、生活和一些不太正经的随想。
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { p: 'Bilibili', n: '@三九Sankyu' },
              { p: 'YouTube', n: '@sankyu' },
            ].map((x) => (
              <a
                key={x.p}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px]"
                style={{ fontFamily: 'var(--font-mono)', color: PLATFORM_COLORS[x.p] || 'var(--accent)', border: '1px solid ' + (PLATFORM_COLORS[x.p] || 'var(--accent)'), background: 'var(--paper-50)' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, background: PLATFORM_COLORS[x.p] || 'var(--accent)' }}></span>
                {x.p} · {x.n}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((t) => {
            const active = filter === t.id
            return (
              <button
                key={t.id}
                onClick={() => pickFilter(t.id)}
                className="px-3 py-1.5 text-[13px] inline-flex items-baseline gap-1.5"
                style={{
                  fontFamily: 'var(--font-body)',
                  border: '1px solid ' + (active ? 'var(--accent)' : 'var(--ink-300)'),
                  color: active ? 'var(--accent)' : 'var(--ink-700)',
                  background: active ? 'rgba(200,85,61,0.06)' : 'transparent',
                  borderRadius: 2,
                }}
              >
                <span>{t.zh}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, opacity: 0.7 }}>· {t.en}</span>
                <span className="ml-1" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.7 }}>{String(t.count).padStart(2, '0')}</span>
              </button>
            )
          })}
        </div>
        <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>NEWEST FIRST · 按日期倒序</span>
      </div>

      {/* TIMELINE */}
      <div>
        {items.map((it, i) => (
          <div key={it.kind + '-' + it.id} className={i < items.length - 1 ? 'border-b' : ''} style={{ borderColor: 'var(--ink-300)' }}>
            {it.kind === 'podcast' ? <PodcastCard pod={it} idx={i} /> : <MediaVideoRow video={it} idx={i} />}
          </div>
        ))}
      </div>
    </>
  )
}
