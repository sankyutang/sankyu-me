/* Pages (library) components ported from pages.jsx — nav → <a href>. */
import { pageHref } from '@/lib/links'
import type { PageEntry, PageLink, Subtopic } from '@/lib/data-source/types'

export const PAGE_KIND_META: Record<string, { label: string; en: string; hint: string }> = {
  topic: { label: '专题', en: 'TOPIC', hint: '持续更新的方向' },
  collection: { label: '合集', en: 'COLLECTION', hint: '互联网内容聚合' },
  static: { label: '页', en: 'PAGE', hint: '独立小页面' },
}

export function PageSpine({ page, size = 'lg' }: { page: PageEntry; size?: 'lg' | 'md' | 'sm' }) {
  const color = page.cover_color || 'var(--accent)'
  const isLg = size === 'lg'
  const isMd = size === 'md'
  const px = isLg ? 28 : isMd ? 18 : 14
  const py = isLg ? 22 : isMd ? 16 : 12
  const glyphSize = isLg ? 88 : isMd ? 56 : 36
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: color,
        color: 'rgba(250,246,236,0.95)',
        padding: `${py}px ${px}px`,
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 14px),' +
          'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: 'auto, 14px 14px',
      }}
    >
      <div className="flex items-baseline justify-between mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em', opacity: 0.82 }}>
        <span>{PAGE_KIND_META[page.kind || 'static'].en} · /{page.id}</span>
        {page.item_count != null && <span>{String(page.item_count).padStart(2, '0')} ITEMS</span>}
      </div>

      <div className="absolute right-3 -bottom-1 leading-none italic font-display select-none pointer-events-none" style={{ fontSize: glyphSize, opacity: 0.16, color: '#fff', fontFamily: 'var(--font-serif-en)' }}>
        {page.glyph || page.id[0].toUpperCase()}
      </div>

      {page.category && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.14em', opacity: 0.8 }}>{page.category}</div>
      )}

      <h3 className="font-display tracking-tight leading-[1.04] mt-1" style={{ fontSize: isLg ? 32 : isMd ? 22 : 17, color: '#fff' }}>
        {page.title_zh}
      </h3>
      {isLg && page.title_en && (
        <p className="italic mt-1" style={{ fontFamily: 'var(--font-serif-en)', fontSize: 16, color: 'rgba(255,255,255,0.78)' }}>{page.title_en}</p>
      )}

      {(page.updates || page.date) && (
        <div className="relative mt-3 pt-2 flex items-baseline justify-between" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.1em', borderTop: '1px dashed rgba(255,255,255,0.25)', opacity: 0.9 }}>
          <span>{page.updates || 'UPDATED'}</span>
          <span>{page.date}</span>
        </div>
      )}
    </div>
  )
}

export function PageTopicCard({ page, layout = 'stacked' }: { page: PageEntry; layout?: 'stacked' | 'horizontal' }) {
  if (layout === 'horizontal') {
    return (
      <a href={pageHref(page.id)} className="paper-card lift block overflow-hidden grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr]">
        <PageSpine page={page} size="md" />
        <div className="p-4 md:p-5 flex flex-col min-w-0">
          <p className="text-[14px] md:text-[15px] flex-1" style={{ color: 'var(--ink-700)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)' }}>{page.desc}</p>
          {page.subtopics && page.subtopics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {page.subtopics.slice(0, 4).map((s) => (
                <span key={s.id} className="text-[11px] px-1.5 py-0.5 whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-700)', background: 'var(--paper-200)' }}>
                  {s.glyph || '·'} {s.title} <span style={{ opacity: 0.6 }}>{s.count}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </a>
    )
  }
  return (
    <a href={pageHref(page.id)} className="paper-card lift block overflow-hidden h-full flex flex-col">
      <PageSpine page={page} size="lg" />
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-[14.5px] flex-1" style={{ color: 'var(--ink-700)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)' }}>{page.desc}</p>
        {page.subtopics && page.subtopics.length > 0 && (
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--ink-300)' }}>
            <div className="kicker mb-2">子话题</div>
            <ul className="space-y-1 text-[13px]" style={{ color: 'var(--ink-700)' }}>
              {page.subtopics.slice(0, 4).map((s) => (
                <li key={s.id} className="flex items-baseline justify-between gap-2">
                  <span className="truncate"><span style={{ color: page.cover_color, marginRight: 6 }}>{s.glyph}</span>{s.title}</span>
                  <span className="whitespace-nowrap shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)', fontSize: 11 }}>{String(s.count).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </a>
  )
}

export function PageCollectionCard({ page }: { page: PageEntry }) {
  const preview = (page.items || []).slice(0, 3)
  return (
    <a href={pageHref(page.id)} className="paper-card lift block overflow-hidden h-full flex flex-col">
      <PageSpine page={page} size="md" />
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-[14px] mb-4" style={{ color: 'var(--ink-700)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)' }}>{page.desc}</p>
        {preview.length > 0 && (
          <ul className="space-y-2 text-[13px]" style={{ color: 'var(--ink-800)' }}>
            {preview.map((it, i) => (
              <li key={i} className="flex items-baseline gap-2 leading-snug">
                <span className="shrink-0" style={{ color: page.cover_color, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="truncate">
                  {it.title}
                  <span className="ml-1.5" style={{ color: 'var(--ink-500)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>· {it.source}</span>
                </span>
              </li>
            ))}
            {(page.item_count || 0) > preview.length && (
              <li className="text-[11px] pt-1" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>+{(page.item_count || 0) - preview.length} 条 →</li>
            )}
          </ul>
        )}
      </div>
    </a>
  )
}

export function PageLinkItem({ item, index, accent }: { item: PageLink; index: number; accent: string }) {
  const kindIcon = item.kind === 'internal' ? '❦' : item.kind === 'tool' ? '⌥' : '↗'
  const kindLabel = item.kind === 'internal' ? '内部' : item.kind === 'tool' ? '工具' : '外链'
  const isExternal = item.kind !== 'internal'
  return (
    <a
      href={item.url || '#'}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group block py-4 border-b grid grid-cols-[36px_1fr_auto] gap-3 md:gap-5 items-baseline"
      style={{ borderColor: 'var(--ink-300)' }}
    >
      <span className="num-stamp text-[20px] leading-none" style={{ color: accent }}>{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
          <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '.1em', color: accent, border: '1px solid ' + accent, lineHeight: 1.4 }}>
            {kindIcon} {kindLabel}
          </span>
          {item.tag && (
            <span className="text-[11px] whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}># {item.tag}</span>
          )}
        </div>
        <h4 className="font-display text-[17px] md:text-[19px] leading-snug mt-1 hand-underline group-hover:opacity-80" style={{ color: 'var(--ink-900)' }}>{item.title}</h4>
        {item.note && <p className="text-[13.5px] mt-1.5" style={{ color: 'var(--ink-700)', lineHeight: 1.65 }}>{item.note}</p>}
        <p className="text-[11px] mt-1.5" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{item.source}</p>
      </div>
      <span className="hidden md:block shrink-0 translate-y-1.5" style={{ color: accent, opacity: 0.6 }}>↗</span>
    </a>
  )
}

export function PageSubtopicGroup({ sub, items, accent }: { sub: Subtopic; items: PageLink[]; accent: string }) {
  if (!items.length) return null
  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between gap-3 mb-3 pb-2 border-b-2" style={{ borderColor: accent }}>
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-display text-[22px] md:text-[26px] shrink-0" style={{ color: accent }}>{sub.glyph}</span>
          <h3 className="font-display text-[22px] md:text-[26px] tracking-tight" style={{ color: 'var(--ink-900)' }}>{sub.title}</h3>
        </div>
        <span className="kicker whitespace-nowrap shrink-0">{String(items.length).padStart(2, '0')} 条</span>
      </div>
      <div>
        {items.map((it, i) => (
          <PageLinkItem key={i} item={it} index={i} accent={accent} />
        ))}
      </div>
    </div>
  )
}
