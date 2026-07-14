/* Full ProductsDetail page ported from pages.jsx — rendered statically by Astro. */
import { Icon } from './icons'
import { ProductMock, FeatureCard, PricingCard, ProductMiniCard } from './product'
import { FauxBody } from './shells'
import type { Product, ProductMetric } from '@/lib/data-source/types'

export default function ProductsDetail({ product: p, others }: { product: Product; others: Product[] }) {
  const statusColor =
    p.status === 'Live' ? '#3a6b46' : p.status === 'Beta' ? '#c8553d' : p.status === 'OSS' ? '#1e3a5f' : '#7d6a52'

  const metrics: ProductMetric[] =
    p.metrics && p.metrics.length > 0
      ? p.metrics
      : ([
          { label: 'MRR', value: p.mrr, highlight: true },
          { label: 'PRICE', value: p.price },
          p.users ? { label: 'USERS', value: p.users } : null,
        ].filter(Boolean) as ProductMetric[])

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-16">
      <a href="/products" className="text-[13px] mb-8 hand-underline inline-flex items-center gap-1.5" style={{ color: 'var(--ink-700)' }}>
        ← 返回 产品列表
      </a>

      <header className="reveal mb-10 md:mb-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="kicker">PRODUCT · 一人公司的产品线</span>
          <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: statusColor, border: '1px solid ' + statusColor, borderRadius: 999 }}>
            <Icon.dot style={{ color: statusColor }} /> {p.status}
          </span>
          <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>EST. {p.year}</span>
        </div>
        <h1 className="font-display tracking-tight leading-[0.95]" style={{ color: 'var(--ink-900)', fontSize: 'clamp(48px, 8vw, 96px)' }}>{p.name_en}</h1>
        <p className="mt-4 font-wenkai" style={{ color: p.color, fontSize: 'clamp(20px, 2.6vw, 28px)', lineHeight: 1.45 }}>{p.tagline}</p>
      </header>

      <section className="reveal grid md:grid-cols-12 gap-8 md:gap-10 mb-14 md:mb-20 items-start">
        <div className="md:col-span-7 lg:col-span-8">
          <div className="relative">
            <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translate(8px, 10px)', border: '1px solid var(--ink-300)', zIndex: 0 }}></div>
            <div className="relative" style={{ zIndex: 1 }}>
              <ProductMock product={p} />
            </div>
          </div>
        </div>

        <aside className="md:col-span-5 lg:col-span-4 md:sticky md:top-24 md:self-start">
          <p className="text-[16px] mb-6" style={{ color: 'var(--ink-800)', lineHeight: 1.8, fontFamily: 'var(--font-wenkai)' }}>{p.desc}</p>

          <div className="paper-card p-5 mb-5" style={{ background: 'var(--paper-50)' }}>
            <div className="kicker mb-3">规格 · SPECS</div>
            <dl className="space-y-2.5">
              {metrics.map((m) => (
                <div key={m.label} className="flex items-baseline justify-between gap-3 py-1.5 border-b last:border-b-0" style={{ borderColor: 'var(--ink-300)' }}>
                  <dt className="kicker">{m.label}</dt>
                  <dd className="font-display text-[18px]" style={{ color: m.highlight ? p.color : 'var(--ink-800)' }}>{m.value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-3 py-1.5 border-b last:border-b-0" style={{ borderColor: 'var(--ink-300)' }}>
                <dt className="kicker">YEAR</dt>
                <dd className="font-display text-[18px]" style={{ color: 'var(--ink-800)' }}>{p.year}</dd>
              </div>
              <div className="py-1.5">
                <dt className="kicker mb-1.5">STACK</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-700)', background: 'var(--paper-200)' }}>{s}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-2.5">
            {p.url && p.url !== '#' ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-[14px]" style={{ background: p.color, color: 'var(--paper-50)' }}>
                {p.status === 'OSS' ? '查看 GitHub 仓库' : '访问产品'} <Icon.arrow />
              </a>
            ) : (
              <span className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-[14px]" style={{ background: 'var(--paper-300)', color: 'var(--ink-500)' }}>已下线 · Discontinued</span>
            )}
            <a href="#pricing" className="text-[13px] hand-underline text-center" style={{ color: 'var(--ink-700)' }}>查看定价 / Pricing ↓</a>
          </div>
        </aside>
      </section>

      <hr className="hand-divider mb-14 md:mb-20" />

      {p.features && p.features.length > 0 && (
        <>
          <section className="reveal mb-16 md:mb-20">
            <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12 mb-10 md:mb-14 items-end">
              <div>
                <div className="kicker mb-3">能做什么 · CAPABILITIES</div>
                <h2 className="font-display tracking-tight leading-[1.02]" style={{ color: 'var(--ink-900)', fontSize: 'clamp(36px, 5vw, 60px)' }}>
                  四件 <span className="italic" style={{ fontFamily: 'var(--font-serif-en)', color: p.color }}>main things</span>
                </h2>
              </div>
              <p className="text-[15px] max-w-[44ch]" style={{ color: 'var(--ink-700)', lineHeight: 1.8 }}>
                {p.name_en} 不是一个什么都做的工具。它只做下面这几件,但做得比同类好。
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-5 md:gap-6">
              {p.features.map((f, i) => (
                <FeatureCard key={f.title} feature={f} index={i} color={p.color} />
              ))}
            </div>
          </section>
          <hr className="hand-divider mb-14 md:mb-20" />
        </>
      )}

      <section className="reveal mb-16 md:mb-20">
        <div className="grid md:grid-cols-[1fr_240px] gap-10 md:gap-14">
          <article className="max-w-[65ch]" style={{ color: 'var(--ink-800)' }}>
            <div className="kicker mb-3">STORY · 制作笔记</div>
            <h2 className="font-display tracking-tight leading-[1.02] mb-6" style={{ color: 'var(--ink-900)', fontSize: 'clamp(32px, 4vw, 48px)' }}>{p.story_title || '为什么做这个'}</h2>
            {p.story_lede && (
              <p className="text-[19px] md:text-[21px] mb-7" style={{ color: 'var(--ink-700)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)', borderLeft: '3px solid ' + p.color, paddingLeft: 18 }}>
                {p.story_lede}
              </p>
            )}
            <FauxBody paragraphs={5} headings={['', '缘起', '现状', '下一步']} />
          </article>

          <aside className="md:sticky md:top-24 md:self-start">
            <div className="kicker mb-3">目录 · CONTENTS</div>
            <ul className="text-[13px] space-y-1.5 mb-7">
              {[
                { id: 'h-1', label: '缘起' },
                { id: 'h-2', label: '现状' },
                { id: 'h-3', label: '下一步' },
              ].map((t, i) => (
                <li key={i}>
                  <a href={'#' + t.id} className="hand-underline" style={{ color: 'var(--ink-700)' }}>{String(i + 1).padStart(2, '0')} · {t.label}</a>
                </li>
              ))}
            </ul>
            <div className="kicker mb-3">分享 · SHARE</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12px]" style={{ color: 'var(--ink-700)' }}>
              <a href="#" className="hand-underline">复制链接</a>
              <a href="#" className="hand-underline">X / Twitter</a>
              <a href="#" className="hand-underline">微信</a>
            </div>
          </aside>
        </div>
      </section>

      <hr className="hand-divider mb-14 md:mb-20" />

      <section id="pricing" className="reveal mb-16 md:mb-20">
        <div className="kicker mb-3">PRICING · 定价</div>
        <h2 className="font-display tracking-tight leading-[1.02] mb-8 md:mb-10" style={{ color: 'var(--ink-900)', fontSize: 'clamp(36px, 5vw, 60px)' }}>
          多少钱 <span className="italic" style={{ fontFamily: 'var(--font-serif-en)', color: 'var(--ink-500)' }}>· How much</span>
        </h2>
        <PricingCard product={p} />
      </section>

      {others.length > 0 && (
        <>
          <hr className="hand-divider mb-14 md:mb-20" />
          <section className="reveal">
            <div className="kicker mb-2">更多产品 · MORE FROM THE SOLO CO.</div>
            <h3 className="font-display tracking-tight leading-[1.02] mb-8" style={{ color: 'var(--ink-900)', fontSize: 'clamp(28px, 3.2vw, 36px)' }}>不止这一个</h3>
            <div className="grid md:grid-cols-3 gap-5 md:gap-6">
              {others.map((o) => (
                <ProductMiniCard key={o.id} product={o} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
