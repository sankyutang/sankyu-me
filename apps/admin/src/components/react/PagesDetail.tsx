/* Topic/Collection page detail ported from pages.jsx (the full-feature variant). */
import { Icon } from './icons'
import { PageSpine, PageTopicCard, PageCollectionCard, PageLinkItem, PageSubtopicGroup, PAGE_KIND_META } from './pagebits'
import { RelatedGrid, type RelatedItem } from './shells'
import type { PageEntry, PageLink, Subtopic } from '@/lib/data-source/types'

const matchSub = (it: PageLink, s: Subtopic) =>
  !!it.tag && !!s && (it.tag === s.title || it.tag === s.id || s.title.startsWith(it.tag) || it.tag.startsWith(s.title))

export default function PagesDetail({
  page: p,
  relatedPages,
  crossRelated,
}: {
  page: PageEntry
  relatedPages: PageEntry[]
  crossRelated: RelatedItem[]
}) {
  const kind = p.kind || 'static'
  const accent = p.cover_color || 'var(--accent)'
  const items = p.items || []

  const grouped =
    p.subtopics && p.subtopics.length > 0
      ? p.subtopics.map((s) => ({ sub: s, items: items.filter((it) => matchSub(it, s)) }))
      : null
  const ungrouped = grouped ? items.filter((it) => !p.subtopics!.some((s) => matchSub(it, s))) : items

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-16">
      <a href="/pages" className="text-[13px] mb-8 hand-underline inline-flex items-center gap-1.5" style={{ color: 'var(--ink-700)' }}>
        ← 返回 Pages 列表
      </a>

      <header className="reveal mb-12 md:mb-16 grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">
        <div className="md:sticky md:top-24">
          <PageSpine page={p} size="lg" />
          <div className="mt-4 paper-card p-4" style={{ background: 'var(--paper-50)' }}>
            <div className="kicker mb-2">维护 · MAINTENANCE</div>
            <dl className="text-[12.5px] space-y-1.5" style={{ color: 'var(--ink-700)' }}>
              <div className="flex justify-between">
                <dt style={{ color: 'var(--ink-500)' }}>状态</dt>
                <dd className="inline-flex items-center gap-1.5">
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: p.maintain === 'active' ? '#3a6b46' : 'var(--ink-500)' }}></span>
                  {p.maintain === 'active' ? '持续维护' : '归档'}
                </dd>
              </div>
              <div className="flex justify-between"><dt style={{ color: 'var(--ink-500)' }}>更新频率</dt><dd>{p.updates}</dd></div>
              <div className="flex justify-between"><dt style={{ color: 'var(--ink-500)' }}>最近更新</dt><dd>{p.date}</dd></div>
              <div className="flex justify-between"><dt style={{ color: 'var(--ink-500)' }}>条目数</dt><dd>{p.item_count}</dd></div>
            </dl>
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="kicker">{PAGE_KIND_META[kind].en} · {PAGE_KIND_META[kind].label}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)', color: accent, border: '1px solid ' + accent, borderRadius: 999 }}>
              <Icon.dot style={{ color: accent }} /> {p.category}
            </span>
          </div>
          <h1 className="font-display tracking-tight leading-[0.98]" style={{ color: 'var(--ink-900)', fontSize: 'clamp(40px, 6.5vw, 72px)' }}>{p.title_zh}</h1>
          {p.title_en && (
            <p className="mt-2 italic" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-serif-en)', fontSize: 'clamp(20px, 2.4vw, 26px)' }}>{p.title_en}</p>
          )}
          {p.lede && (
            <p className="mt-6 text-[17px] md:text-[19px] max-w-[58ch]" style={{ color: 'var(--ink-800)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)', borderLeft: '3px solid ' + accent, paddingLeft: 18 }}>
              {p.lede}
            </p>
          )}

          {p.tags && p.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 whitespace-nowrap" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-700)', background: 'var(--paper-200)' }}># {t}</span>
              ))}
            </div>
          )}

          {p.subtopics && p.subtopics.length > 0 && (
            <div className="mt-7 pt-5 border-t" style={{ borderColor: 'var(--ink-300)' }}>
              <div className="kicker mb-3">子话题 · SUBTOPICS</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {p.subtopics.map((s) => (
                  <a key={s.id} href={'#sub-' + s.id} className="flex items-baseline justify-between gap-3 py-2 px-3" style={{ background: 'var(--paper-50)', border: '1px solid var(--ink-300)' }}>
                    <span className="flex items-baseline gap-2 min-w-0 truncate">
                      <span className="shrink-0" style={{ color: accent, fontFamily: 'var(--font-serif-en)', fontSize: 16 }}>{s.glyph}</span>
                      <span className="font-display text-[15px] truncate" style={{ color: 'var(--ink-900)' }}>{s.title}</span>
                    </span>
                    <span className="whitespace-nowrap shrink-0" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)', fontSize: 11 }}>{String(s.count).padStart(2, '0')} 条</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <hr className="hand-divider mb-14 md:mb-16" />

      <div className="grid md:grid-cols-[minmax(0,1fr)_240px] gap-10 md:gap-14">
        <article className="reveal min-w-0">
          <div className="kicker mb-3">INTRO · 一段话</div>
          <p className="text-[18px] md:text-[20px] mb-10" style={{ color: 'var(--ink-800)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)' }}>{p.desc}</p>

          <div className="flex items-baseline justify-between gap-3 mb-5 pb-3 border-b-2" style={{ borderColor: accent }}>
            <h2 className="font-display tracking-tight leading-tight" style={{ color: 'var(--ink-900)', fontSize: 'clamp(28px, 3.4vw, 38px)' }}>
              精选 · <span className="italic" style={{ fontFamily: 'var(--font-serif-en)', color: accent }}>The Pile</span>
            </h2>
            <span className="kicker whitespace-nowrap shrink-0">共 {items.length} 条</span>
          </div>

          {grouped ? (
            <>
              {grouped.map((g) => (
                <div key={g.sub.id} id={'sub-' + g.sub.id} className="scroll-mt-24">
                  <PageSubtopicGroup sub={g.sub} items={g.items} accent={accent} />
                </div>
              ))}
              {ungrouped.length > 0 && <PageSubtopicGroup sub={{ id: 'more', title: '其它', glyph: '···', count: ungrouped.length }} items={ungrouped} accent={accent} />}
            </>
          ) : (
            <div>{items.map((it, i) => <PageLinkItem key={i} item={it} index={i} accent={accent} />)}</div>
          )}

          <div className="mt-12 p-5 md:p-6 relative" style={{ background: 'var(--paper-50)', border: '1px dashed var(--ink-300)' }}>
            <div className="kicker mb-2">投稿 · CONTRIBUTE</div>
            <p className="text-[14px]" style={{ color: 'var(--ink-700)', lineHeight: 1.75 }}>
              有没有错过什么?读到好东西可以丢给我 ——
              <a href="mailto:hi@sankyu.me" className="hand-underline ml-1" style={{ color: accent }}>hi@sankyu.me</a>。 下个月更新的时候会一起放进来。
            </p>
          </div>
        </article>

        <aside className="reveal md:sticky md:top-24 md:self-start min-w-0">
          <div className="kicker mb-3">META · 元信息</div>
          <dl className="text-[13px] space-y-1.5 mb-7" style={{ color: 'var(--ink-700)' }}>
            {[
              { label: 'PATH', value: '/' + p.id },
              { label: 'KIND', value: PAGE_KIND_META[kind].label },
              { label: 'ITEMS', value: String(p.item_count ?? '') },
              { label: 'UPDATED', value: p.date },
            ].map((f) => (
              <div key={f.label} className="flex justify-between gap-3 py-1 border-b" style={{ borderColor: 'var(--ink-300)' }}>
                <dt style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{f.label}</dt>
                <dd className="text-right">{f.value}</dd>
              </div>
            ))}
          </dl>

          {p.subtopics && p.subtopics.length > 0 && (
            <>
              <div className="kicker mb-3">目录 · CONTENTS</div>
              <ul className="text-[13px] space-y-1.5 mb-7">
                {p.subtopics.map((s, i) => (
                  <li key={s.id}>
                    <a href={'#sub-' + s.id} className="hand-underline" style={{ color: 'var(--ink-700)' }}>{String(i + 1).padStart(2, '0')} · {s.title}</a>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="kicker mb-3">分享 · SHARE</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px]" style={{ color: 'var(--ink-700)' }}>
            <a href="#" className="hand-underline">复制链接</a>
            <a href="#" className="hand-underline">X / Twitter</a>
            <a href="#" className="hand-underline">微信</a>
          </div>
        </aside>
      </div>

      {relatedPages.length > 0 && (
        <section className="reveal mt-20">
          <hr className="hand-divider mb-10" />
          <div className="grid md:grid-cols-[1fr_auto] items-end gap-3 mb-8">
            <div>
              <div className="kicker mb-2">更多专题 · OTHER PAGES</div>
              <h3 className="font-display tracking-tight leading-tight" style={{ color: 'var(--ink-900)', fontSize: 'clamp(26px, 3vw, 36px)' }}>别的方向也在长</h3>
            </div>
            <a href="/pages" className="hand-underline text-[13px]" style={{ color: 'var(--ink-700)' }}>所有 Pages →</a>
          </div>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {relatedPages.map((rp) => (rp.kind === 'topic' ? <PageTopicCard key={rp.id} page={rp} /> : <PageCollectionCard key={rp.id} page={rp} />))}
          </div>
        </section>
      )}

      {crossRelated.length > 0 && (
        <section className="reveal mt-20">
          <hr className="hand-divider mb-10" />
          <div className="kicker mb-2">看看别的 · ELSEWHERE</div>
          <h3 className="font-display text-[28px] md:text-[32px] leading-tight mb-8" style={{ color: 'var(--ink-900)' }}>或许你也会喜欢</h3>
          <RelatedGrid items={crossRelated} />
        </section>
      )}
    </div>
  )
}
