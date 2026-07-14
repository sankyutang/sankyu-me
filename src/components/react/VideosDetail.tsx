/* Full VideosDetail page ported from pages.jsx — rendered statically by Astro. */
import { Icon, PLATFORM_COLORS } from './icons'
import { VideoThumbnail, RelatedVideoRow } from './video'
import type { Video } from '@/lib/data-source/types'

export default function VideosDetail({ video: v, related }: { video: Video; related: Video[] }) {
  const platformColor = PLATFORM_COLORS[v.platform] || 'var(--accent)'

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-8 md:pt-10 pb-16">
      <a href="/media" className="text-[13px] mb-6 hand-underline inline-flex items-center gap-1.5" style={{ color: 'var(--ink-700)' }}>
        ← Media · 自媒体
      </a>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10 items-start">
        <div className="min-w-0">
          <div className="reveal mb-6">
            <VideoThumbnail video={v} big showPlay hoverable={false} />
          </div>

          <h1 className="reveal font-display tracking-tight leading-[1.15] mb-4" style={{ color: 'var(--ink-900)', fontSize: 'clamp(26px, 3.8vw, 40px)' }}>
            {v.title}
          </h1>

          <div className="reveal flex flex-wrap items-baseline gap-x-4 gap-y-1.5 mb-5 text-[12.5px]" style={{ color: 'var(--ink-700)', fontFamily: 'var(--font-mono)' }}>
            <span className="inline-flex items-center gap-1.5" style={{ color: platformColor }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: platformColor }}></span>
              {v.platform}
            </span>
            <span style={{ color: 'var(--ink-300)' }}>·</span>
            <span style={{ color: 'var(--ink-900)', fontWeight: 600 }}>{v.views} views</span>
            <span style={{ color: 'var(--ink-300)' }}>·</span>
            <span>{v.date}</span>
            <span style={{ color: 'var(--ink-300)' }}>·</span>
            <span>{v.duration}</span>
          </div>

          <div className="reveal flex flex-wrap items-center gap-3 pb-6 mb-7 border-b" style={{ borderColor: 'var(--ink-300)' }}>
            <a href="#" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px]" style={{ background: platformColor, color: '#fff' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M8 5v14l11-7L8 5Z" />
              </svg>
              在 {v.platform} 上看
              <Icon.arrow />
            </a>
            <span className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px]" style={{ background: 'var(--paper-50)', border: '1px solid var(--ink-300)', color: 'var(--ink-800)' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
              分享
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px]" style={{ background: 'var(--paper-50)', border: '1px solid var(--ink-300)', color: 'var(--ink-800)' }}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />
              </svg>
              收藏
            </span>
          </div>

          <article className="reveal mb-8 max-w-[58ch]">
            <div className="kicker mb-3">简介 · ABOUT</div>
            <p className="text-[16px] md:text-[17px]" style={{ color: 'var(--ink-800)', lineHeight: 1.85, fontFamily: 'var(--font-wenkai)' }}>{v.desc}</p>
            <p className="text-[16px] md:text-[17px] mt-4" style={{ color: 'var(--ink-800)', lineHeight: 1.85, fontFamily: 'var(--font-wenkai)' }}>
              本期视频是「半熟桌面」第三季的第八集。原始素材拍摄于上海的家、杭州的工作室、以及途中的咖啡馆。 字幕、剪辑、调色均由我一人完成。如果你发现错字或者有改进建议,欢迎在 {v.platform} 评论区告诉我。
            </p>
          </article>

          {v.tags && v.tags.length > 0 && (
            <div className="reveal mb-2">
              <div className="kicker mb-3">标签 · TAGS</div>
              <div className="flex flex-wrap gap-2">
                {v.tags.map((t) => (
                  <a key={t} href="#" className="text-[12px] px-2.5 py-1" style={{ fontFamily: 'var(--font-mono)', color: platformColor, background: 'var(--paper-50)', border: '1px solid ' + platformColor }}>
                    #{t}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="reveal min-w-0">
          <div className="kicker mb-3">更多视频 · UP NEXT</div>
          <div className="flex flex-col">
            {related.map((rv) => (
              <RelatedVideoRow key={rv.id} video={rv} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
