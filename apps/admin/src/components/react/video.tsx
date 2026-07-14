/* Video components ported from video-card.jsx + MediaVideoRow (pages.jsx) — nav → <a href>. */
import { PLATFORM_COLORS, platformBadgeStyle } from './icons'
import { videoHref } from '@/lib/links'
import type { Video } from '@/lib/data-source/types'

export function VideoThumbnail({
  video,
  aspect = '16/9',
  showPlay = true,
  big = false,
  hoverable = true,
}: {
  video: Video
  aspect?: string
  showPlay?: boolean
  big?: boolean
  hoverable?: boolean
}) {
  const c = video.cover_color || 'var(--accent)'
  return (
    <div
      className={'relative overflow-hidden group/thumb' + (hoverable ? ' cursor-pointer' : '')}
      style={{ aspectRatio: aspect, background: `linear-gradient(135deg, ${c}24, ${c}10), var(--paper-200)`, borderBottom: '1px solid var(--ink-300)' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(58,42,29,0.13) 1px, transparent 1px)', backgroundSize: '14px 14px', opacity: 0.55 }}></div>

      <div className="absolute top-0 left-0 right-0 flex justify-around" style={{ height: 14, background: 'rgba(28,24,20,0.85)' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ width: 8, height: 6, borderRadius: 1, background: 'var(--paper-100)', alignSelf: 'center' }}></span>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-around" style={{ height: 14, background: 'rgba(28,24,20,0.85)' }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ width: 8, height: 6, borderRadius: 1, background: 'var(--paper-100)', alignSelf: 'center' }}></span>
        ))}
      </div>

      {showPlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={'inline-flex items-center justify-center transition-all duration-300 ' + (hoverable ? 'group-hover/thumb:scale-110' : '')}
            style={{ width: big ? 88 : 64, height: big ? 88 : 64, borderRadius: 999, background: 'rgba(245,241,232,0.9)', border: '2px solid ' + c, color: c, boxShadow: '0 4px 14px rgba(58,42,29,0.25)' }}
          >
            <svg viewBox="0 0 24 24" width={big ? 32 : 22} height={big ? 32 : 22} fill="currentColor">
              <path d="M8 5v14l11-7L8 5Z" />
            </svg>
          </div>
        </div>
      )}

      <span className="absolute" style={{ top: 22, left: 10, ...platformBadgeStyle(video.platform), fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 6px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {video.platform}
      </span>

      <span className="absolute" style={{ bottom: 22, right: 10, background: 'rgba(28,24,20,0.85)', color: 'var(--paper-50)', fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: 2, letterSpacing: '0.04em' }}>
        {video.duration}
      </span>

      {big && (
        <div className="absolute inset-x-0" style={{ bottom: 14, padding: '8px 14px', background: 'linear-gradient(to top, rgba(28,24,20,0.85), transparent)', color: 'var(--paper-50)' }}>
          <div className="text-[11px]" style={{ fontFamily: 'var(--font-mono)', opacity: 0.85 }}>
            {video.views} views · {video.date}
          </div>
        </div>
      )}
    </div>
  )
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <a href={videoHref(video.id)} className="reveal group cursor-pointer flex flex-col h-full">
      <VideoThumbnail video={video} />
      <div className="pt-3.5">
        <h3 className="font-display leading-[1.25] mb-2 line-clamp-2 group-hover:text-[color:var(--accent)] transition-colors" style={{ color: 'var(--ink-900)', fontSize: 18 }}>
          {video.title}
        </h3>
        <div className="flex items-baseline gap-2 text-[12px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: video.cover_color || 'var(--accent)' }}>{video.platform}</span>
          <span style={{ color: 'var(--ink-300)' }}>·</span>
          <span>{video.views} views</span>
          <span style={{ color: 'var(--ink-300)' }}>·</span>
          <span>{video.date}</span>
        </div>
        {video.tags && video.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {video.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-700)', background: 'var(--paper-200)' }}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}

export function RelatedVideoRow({ video }: { video: Video }) {
  return (
    <a href={videoHref(video.id)} className="flex gap-3 py-2.5 group">
      <div className="shrink-0" style={{ width: 168 }}>
        <VideoThumbnail video={video} hoverable={false} showPlay={false} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="font-display leading-[1.25] line-clamp-2 group-hover:text-[color:var(--accent)] transition-colors" style={{ color: 'var(--ink-900)', fontSize: 14 }}>
          {video.title}
        </h4>
        <div className="text-[10.5px] mt-1" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
          {video.platform} · {video.views} · {video.date}
        </div>
      </div>
    </a>
  )
}

/* row-shape sibling to PodcastCard for the merged Media timeline */
export function MediaVideoRow({ video, idx }: { video: Video; idx: number }) {
  const color = video.cover_color || 'var(--accent)'
  const num = String(idx + 1).padStart(2, '0')
  const platformColor = PLATFORM_COLORS[video.platform] || 'var(--accent)'

  return (
    <a href={videoHref(video.id)} className="reveal group grid md:grid-cols-[240px_1fr] gap-6 md:gap-8 py-8 md:py-10 cursor-pointer">
      <div>
        <div style={{ transform: 'rotate(-0.8deg)' }} className="transition-transform group-hover:rotate-0">
          <VideoThumbnail video={video} aspect="16/10" hoverable={false} big={false} />
        </div>
        <div className="mt-4 flex items-center gap-2.5 text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
          <span className="inline-flex items-center gap-1" style={{ color: platformColor }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: platformColor }}></span>
            {video.platform}
          </span>
          <span style={{ color: 'var(--ink-300)' }}>·</span>
          <span>{video.views} views</span>
          {video.likes && (
            <>
              <span style={{ color: 'var(--ink-300)' }}>·</span>
              <span>♥ {video.likes}</span>
            </>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <span className="num-stamp text-[28px]" style={{ color }}>{num}</span>
          <span className="kicker">视频 · VIDEO · {video.platform}</span>
          <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{video.date} · {video.duration}</span>
        </div>

        <h3 className="font-display leading-[1.05] tracking-tight mb-3 group-hover:text-[color:var(--accent)] transition-colors" style={{ color: 'var(--ink-900)', fontSize: 'clamp(24px, 2.8vw, 34px)' }}>
          {video.title}
        </h3>

        <p className="text-[14.5px] md:text-[15px] mb-5 max-w-[58ch]" style={{ color: 'var(--ink-700)', lineHeight: 1.75, fontFamily: 'var(--font-wenkai)' }}>
          {video.desc}
        </p>

        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--ink-300)' }}>
            <span className="kicker mr-1">标签 · TAGS</span>
            {video.tags.map((t) => (
              <span key={t} className="text-[11px] px-2 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-700)', background: 'var(--paper-200)', border: '1px solid var(--ink-300)' }}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}
