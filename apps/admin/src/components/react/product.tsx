/* Product mocks + feature/pricing components ported from product-mocks.jsx & pages.jsx */
import { Icon } from './icons'
import { Cover } from './primitives'
import { productHref } from '@/lib/links'
import type { Product, ProductMetric } from '@/lib/data-source/types'

/* ===== SoloBoard mock ===== */
function SoloBoardMock({ accent }: { accent: string }) {
  const bars = [38, 44, 41, 52, 58, 49, 63, 71, 68, 79, 84, 92]
  const max = Math.max(...bars)
  return (
    <div className="paper-card overflow-hidden" style={{ background: 'var(--paper-50)' }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--ink-300)', background: 'var(--paper-200)' }}>
        <div className="flex items-center gap-1.5">
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink-300)' }}></span>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink-300)' }}></span>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink-300)' }}></span>
        </div>
        <span className="text-[10px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>soloboard.app · MAY 2026</span>
        <span className="text-[10px]" style={{ color: 'var(--ink-300)', fontFamily: 'var(--font-mono)' }}>⌘K</span>
      </div>
      <div className="p-5 md:p-6">
        <div className="flex items-baseline justify-between mb-1">
          <div className="kicker">MRR · MONTHLY RECURRING</div>
          <span className="text-[11px] px-1.5 py-0.5" style={{ background: 'rgba(58,107,70,0.12)', color: '#3a6b46', fontFamily: 'var(--font-mono)' }}>▲ +18.2% vs APR</span>
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display leading-none" style={{ fontSize: 44, color: accent }}>$8,420</span>
          <span className="text-[13px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>.18</span>
        </div>
        <div className="flex items-end gap-[3px] mb-1" style={{ height: 56 }}>
          {bars.map((v, i) => (
            <div key={i} className="flex-1" style={{ height: (v / max) * 100 + '%', background: i === bars.length - 1 ? accent : `${accent}55`, borderTop: i === bars.length - 1 ? `1px solid ${accent}` : 'none' }}></div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] mb-5" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
          <span>JUN '25</span><span>MAY '26</span>
        </div>
        <div className="space-y-2 pt-4 border-t" style={{ borderColor: 'var(--ink-300)' }}>
          <div className="kicker mb-1">渠道分布 · SOURCES</div>
          {[
            { name: 'Stripe', val: '$4,210', pct: 50, c: '#635bff' },
            { name: 'Lemon Squeezy', val: '$2,890', pct: 34, c: '#ffce00' },
            { name: '支付宝 / 微信', val: '$1,320', pct: 16, c: accent },
          ].map((s) => (
            <div key={s.name}>
              <div className="flex items-baseline justify-between text-[12px] mb-0.5">
                <span style={{ color: 'var(--ink-800)' }}>{s.name}</span>
                <span style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{s.val}</span>
              </div>
              <div style={{ height: 3, background: 'var(--paper-200)' }}>
                <div style={{ height: 3, width: s.pct + '%', background: s.c }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ===== Letterbox mock ===== */
function LetterboxMock({ accent }: { accent: string }) {
  return (
    <div className="paper-card overflow-hidden" style={{ background: 'var(--paper-50)' }}>
      <div className="px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--ink-300)' }}>
        <div className="flex items-baseline justify-between mb-1">
          <span className="kicker">LETTERBOX · ISSUE 023</span>
          <span className="text-[10px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>SUN · MAY 19</span>
        </div>
        <div className="text-[11px]" style={{ color: 'var(--ink-700)', fontFamily: 'var(--font-mono)' }}>
          From: <span style={{ color: accent }}>hi@sankyu.me</span>
          <span style={{ color: 'var(--ink-300)' }}> · </span>
          To: 你 &lt;your@email&gt;
        </div>
      </div>
      <div className="p-6 md:p-7">
        <div className="font-hand text-[15px] mb-2" style={{ color: accent }}>第二十三封信</div>
        <h4 className="font-display leading-[1.1] mb-4" style={{ color: 'var(--ink-900)', fontSize: 32 }}>
          一周三件 <span className="italic" style={{ fontFamily: 'var(--font-serif-en)' }}>good things</span>
        </h4>
        <p className="text-[13.5px] mb-2" style={{ color: 'var(--ink-800)', lineHeight: 1.85, fontFamily: 'var(--font-wenkai)' }}>
          这是一封五月的信。我们聊了三件好事、两个失败和一份月度账单—— 没有 emoji,没有打分,也没有"点我"。
        </p>
        <p className="text-[13.5px] mb-5" style={{ color: 'var(--ink-800)', lineHeight: 1.85, fontFamily: 'var(--font-wenkai)' }}>
          如果你愿意,可以直接回复这封邮件。我会读、会想很久,但不保证能回。
        </p>
        <div className="pt-4 border-t" style={{ borderColor: 'var(--ink-300)' }}>
          <div className="font-hand text-[22px]" style={{ color: 'var(--ink-900)' }}>—— 三九</div>
          <div className="flex items-center justify-between mt-4 text-[10px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
            <span>UNSUBSCRIBE · VIEW IN BROWSER</span>
            <span>NO TRACKERS · NO SCORE</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== PaperDesk mock ===== */
function PaperDeskMock({ accent }: { accent: string }) {
  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #d8c8a8 0%, #b89a76 100%)', borderRadius: 6, padding: '0 0 28px 0', boxShadow: '0 12px 28px -12px rgba(58,42,29,0.35)' }}>
      <div className="flex items-center px-3 py-1.5" style={{ background: 'rgba(245,241,232,0.65)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(58,42,29,0.12)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-800)' }}>
        <span className="font-display italic mr-3" style={{ fontStyle: 'normal', fontWeight: 600, fontSize: 12 }}>🍎</span>
        <span className="mr-3" style={{ fontWeight: 600 }}>PaperDesk</span>
        <span className="mr-3" style={{ opacity: 0.6 }}>File</span>
        <span className="mr-3" style={{ opacity: 0.6 }}>Edit</span>
        <span className="mr-3" style={{ opacity: 0.6 }}>View</span>
        <span style={{ marginLeft: 'auto' }}>🔋 84%</span>
        <span style={{ marginLeft: 8 }}>Thu 19 · 11:42</span>
      </div>
      <div className="relative mx-auto mt-6" style={{ width: '78%', background: '#fff8d6', boxShadow: '0 14px 24px -10px rgba(58,42,29,0.45)', transform: 'rotate(-1.2deg)', padding: '14px 18px 22px' }}>
        <span className="absolute" style={{ top: -8, left: '50%', marginLeft: -22, width: 44, height: 12, background: 'rgba(232,200,130,0.65)', borderLeft: '1px dashed rgba(120,90,40,0.3)', borderRight: '1px dashed rgba(120,90,40,0.3)' }}></span>
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-hand" style={{ fontSize: 18, color: '#7a5b0e' }}>2026 · 5 · 19</span>
          <span className="text-[10px]" style={{ color: '#7a5b0e', opacity: 0.55, fontFamily: 'var(--font-mono)' }}>⌘⌥N</span>
        </div>
        <div className="font-hand mb-3" style={{ fontSize: 22, color: '#3a2a1d', lineHeight: 1.2 }}>今天要做的事</div>
        <ul className="space-y-1.5 font-hand" style={{ fontSize: 17, color: '#3a2a1d', lineHeight: 1.4 }}>
          <li><span style={{ color: accent, marginRight: 6 }}>✓</span><s style={{ opacity: 0.55 }}>买猫粮 5kg</s></li>
          <li><span style={{ color: accent, marginRight: 6 }}>✓</span><s style={{ opacity: 0.55 }}>回 Lemon 的邮件</s></li>
          <li><span style={{ color: 'var(--ink-500)', marginRight: 6 }}>○</span>写一篇 newsletter</li>
          <li><span style={{ color: 'var(--ink-500)', marginRight: 6 }}>○</span>给 PaperDesk 加深色主题</li>
          <li><span style={{ color: 'var(--ink-500)', marginRight: 6 }}>○</span>下午跑步 5km</li>
        </ul>
        <div className="mt-4 pt-3 text-[10px] flex items-center justify-between" style={{ borderTop: '1px dashed rgba(122,91,14,0.35)', color: '#7a5b0e', fontFamily: 'var(--font-mono)' }}>
          <span>LOCAL ONLY · ~/Library</span>
          <span>v1.2.0 BETA</span>
        </div>
      </div>
    </div>
  )
}

/* ===== Mokuji mock ===== */
function MokujiMock({ accent }: { accent: string }) {
  return (
    <div className="paper-card overflow-hidden relative" style={{ background: 'var(--paper-50)' }}>
      <span className="absolute" style={{ top: 14, right: 14, transform: 'rotate(-12deg)', border: '1.5px solid var(--ink-500)', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', padding: '3px 8px', borderRadius: 2, background: 'rgba(245,241,232,0.7)', zIndex: 2 }}>
        DISCONTINUED · 2024
      </span>
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'var(--ink-300)', background: 'var(--paper-200)' }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink-300)' }}></span>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink-300)' }}></span>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink-300)' }}></span>
        <div className="flex-1 mx-2 text-[10px] px-2 py-0.5 truncate" style={{ background: 'var(--paper-50)', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)', borderRadius: 3, border: '1px solid var(--ink-300)' }}>
          🔒 sankyu.me/posts/quit-bigco
        </div>
      </div>
      <div className="grid grid-cols-[1fr_140px]">
        <div className="p-5 md:p-6 border-r" style={{ borderColor: 'var(--ink-300)' }}>
          <div className="kicker mb-2">ESSAY · 札记</div>
          <h4 className="font-display leading-[1.15] mb-3" style={{ color: 'var(--ink-900)', fontSize: 22 }}>我离开大厂的第 365 天</h4>
          <div className="space-y-1.5" style={{ opacity: 0.6 }}>
            {[100, 92, 96, 80, 100, 88, 70].map((w, i) => (
              <div key={i} style={{ height: 4, width: w + '%', background: 'var(--ink-300)' }}></div>
            ))}
          </div>
          <h5 className="font-display mt-5 mb-2.5" style={{ color: 'var(--ink-900)', fontSize: 14 }}>02 · 中段</h5>
          <div className="space-y-1.5" style={{ opacity: 0.6 }}>
            {[100, 86, 94].map((w, i) => (
              <div key={i} style={{ height: 4, width: w + '%', background: 'var(--ink-300)' }}></div>
            ))}
          </div>
        </div>
        <div className="p-3" style={{ background: 'var(--paper-200)' }}>
          <div className="text-[9px] mb-3 flex items-baseline gap-1" style={{ color: accent, fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>
            <span className="font-display italic" style={{ fontSize: 14, lineHeight: 1, color: accent }}>目次</span>
            <span style={{ color: 'var(--ink-500)' }}>· MOKUJI</span>
          </div>
          <ul className="text-[10px] space-y-2" style={{ color: 'var(--ink-700)', fontFamily: 'var(--font-mono)' }}>
            <li className="flex items-baseline gap-1.5"><span style={{ color: 'var(--ink-300)' }}>01</span><span>开场</span></li>
            <li className="flex items-baseline gap-1.5 -ml-2 pl-2 py-0.5" style={{ background: 'rgba(200,85,61,0.12)', borderLeft: '2px solid ' + accent }}>
              <span style={{ color: accent }}>02</span><span style={{ color: 'var(--ink-900)', fontWeight: 600 }}>中段</span>
            </li>
            <li className="flex items-baseline gap-1.5 pl-4"><span style={{ color: 'var(--ink-300)' }}>·</span><span>记账</span></li>
            <li className="flex items-baseline gap-1.5 pl-4"><span style={{ color: 'var(--ink-300)' }}>·</span><span>回家</span></li>
            <li className="flex items-baseline gap-1.5"><span style={{ color: 'var(--ink-300)' }}>03</span><span>尾声</span></li>
          </ul>
          <div className="mt-4 pt-3 text-[9px]" style={{ borderTop: '1px dashed var(--ink-300)', color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
            5 sections · 4,210 字
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Paper UI mock ===== */
function PaperSystemMock({ accent }: { accent: string }) {
  return (
    <div className="paper-card overflow-hidden" style={{ background: 'var(--paper-50)' }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--ink-300)', background: 'var(--paper-200)' }}>
        <div className="flex items-baseline gap-2">
          <span className="font-display italic" style={{ color: accent, fontSize: 14, fontWeight: 600 }}>paper-ui</span>
          <span className="text-[10px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>v1.4.0</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: accent }}>★ 2,107</span>
          <span>⑂ 184</span>
          <span style={{ opacity: 0.6 }}>MIT</span>
        </div>
      </div>
      <div className="p-5 md:p-6">
        <div className="kicker mb-3">COMPONENTS · 23 EXPORTED</div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="relative paper-card p-3 flex items-center justify-center" style={{ background: 'var(--paper-100)', minHeight: 56 }}>
            <span className="absolute" style={{ top: -8, left: '50%', marginLeft: -22, width: 44, height: 12, background: 'rgba(232,200,130,0.6)', borderLeft: '1px dashed rgba(120,90,40,0.25)', borderRight: '1px dashed rgba(120,90,40,0.25)', transform: 'rotate(-3deg)' }}></span>
            <span className="text-[10px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>&lt;Tape /&gt;</span>
          </div>
          <div className="paper-card p-3 flex items-center justify-center gap-2" style={{ background: 'var(--paper-100)', minHeight: 56 }}>
            <div className="inline-flex items-center justify-center" style={{ width: 28, height: 28, border: '1.5px solid var(--accent)', color: 'var(--accent)', borderRadius: '50%', fontFamily: 'var(--font-serif-cn)', fontSize: 11, transform: 'rotate(-6deg)', background: 'rgba(200,85,61,0.05)' }}>印</div>
            <span className="text-[10px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>&lt;Stamp /&gt;</span>
          </div>
          <div className="paper-card p-3 flex items-center justify-center" style={{ background: 'var(--paper-100)', minHeight: 56 }}>
            <button className="px-3 py-1.5 text-[10px]" style={{ background: accent, color: 'var(--paper-50)', fontFamily: 'var(--font-body)' }}>Subscribe</button>
          </div>
        </div>
        <div className="paper-card p-3 mb-4" style={{ background: 'var(--paper-100)' }}>
          <hr className="hand-divider" />
          <div className="text-[10px] text-center mt-1.5" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>&lt;HandDivider /&gt;</div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-[11px]" style={{ background: 'var(--ink-900)', color: 'var(--paper-50)', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: accent }}>$</span>
          <span style={{ opacity: 0.6 }}>npm i</span>
          <span>@sankyu/paper-ui</span>
          <span className="ml-auto" style={{ opacity: 0.5 }}>copy</span>
        </div>
      </div>
    </div>
  )
}

/* ===== ProductMock dispatcher ===== */
export function ProductMock({ product }: { product: Product }) {
  const accent = product.color
  if (product.id === 'product-soloboard') return <SoloBoardMock accent={accent} />
  if (product.id === 'product-letterbox') return <LetterboxMock accent={accent} />
  if (product.id === 'product-papersystem') return <PaperSystemMock accent={accent} />
  if (product.id === 'product-paperdesk') return <PaperDeskMock accent={accent} />
  if (product.id === 'product-mokuji') return <MokujiMock accent={accent} />
  return <Cover glyph={product.name_en[0]} color={product.color} kicker={product.status} seed={product.id} aspect="4/3" />
}

function statusColorOf(status: string) {
  return status === 'Live' ? '#3a6b46' : status === 'Beta' ? '#c8553d' : status === 'OSS' ? '#1e3a5f' : '#7d6a52'
}

/* ===== ProductFeature — full-width spotlight row ===== */
export function ProductFeature({ product, index = 0, total }: { product: Product; index?: number; total?: number }) {
  const flip = index % 2 === 1
  const statusColor = statusColorOf(product.status)
  const number = String(index + 1).padStart(2, '0')
  const totalStr = total ? ' / ' + String(total).padStart(2, '0') : ''

  const metrics: ProductMetric[] =
    product.metrics && product.metrics.length > 0
      ? product.metrics
      : ([
          { label: 'MRR', value: product.mrr, highlight: true },
          { label: 'PRICE', value: product.price },
          product.users ? { label: 'USERS', value: product.users } : null,
        ].filter(Boolean) as ProductMetric[])

  return (
    <article className="reveal grid md:grid-cols-12 gap-8 md:gap-12 items-center py-12 md:py-16">
      <div className={'md:col-span-6 lg:col-span-7 ' + (flip ? 'md:order-2' : 'md:order-1')}>
        <div className="relative" style={{ maxWidth: 600 }}>
          <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translate(8px, 10px)', border: '1px solid var(--ink-300)', background: 'transparent', zIndex: 0 }}></div>
          <div className="relative" style={{ zIndex: 1 }}>
            <ProductMock product={product} />
          </div>
        </div>
      </div>

      <div className={'md:col-span-6 lg:col-span-5 min-w-0 ' + (flip ? 'md:order-1' : 'md:order-2')}>
        <div className="flex items-baseline gap-4 mb-3">
          <span className="num-stamp" style={{ fontSize: 28, color: product.color, lineHeight: 1 }}>
            {number}<span style={{ color: 'var(--ink-300)', fontSize: 16 }}>{totalStr}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: statusColor, border: '1px solid ' + statusColor, borderRadius: 999 }}>
            <Icon.dot style={{ color: statusColor }} /> {product.status}
          </span>
          <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>EST. {product.year}</span>
        </div>

        <h3 className="font-display leading-[1.02] tracking-tight mb-2" style={{ color: 'var(--ink-900)', fontSize: 'clamp(34px, 4.2vw, 48px)' }}>
          {product.name_en}
        </h3>

        <p className="font-wenkai mb-5" style={{ color: product.color, fontSize: 19, lineHeight: 1.45 }}>{product.tagline}</p>

        <p className="text-[15px] md:text-[16px] mb-6" style={{ color: 'var(--ink-700)', lineHeight: 1.8 }}>{product.desc}</p>

        {product.features && product.features.length > 0 && (
          <ul className="mb-7 space-y-3">
            {product.features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="shrink-0 inline-flex items-center justify-center mt-[3px]" style={{ width: 18, height: 18, borderRadius: 999, background: `${product.color}1a`, color: product.color }}>
                  <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m2 6 3 3 5-6" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <span className="font-display text-[15.5px] md:text-[16px]" style={{ color: 'var(--ink-900)' }}>{f.title}</span>
                  <span className="text-[14px] md:text-[14.5px]" style={{ color: 'var(--ink-700)' }}>
                    <span style={{ color: 'var(--ink-300)', margin: '0 6px' }}>—</span>
                    {f.desc}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-baseline gap-x-7 gap-y-3 mb-6 pb-5 border-b" style={{ borderColor: 'var(--ink-300)' }}>
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="kicker mb-1">{m.label}</div>
              <div className="font-display" style={{ color: m.highlight ? product.color : 'var(--ink-800)', fontSize: 22, lineHeight: 1 }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {product.url && product.url !== '#' ? (
            <a href={product.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px]" style={{ background: product.color, color: 'var(--paper-50)' }}>
              {product.status === 'OSS' ? '查看 GitHub' : '访问产品'} <Icon.arrow />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px]" style={{ background: 'var(--paper-300)', color: 'var(--ink-500)' }}>已下线</span>
          )}

          <a href={productHref(product.id)} className="hand-underline text-[13px] inline-flex items-center gap-1.5" style={{ color: 'var(--ink-700)' }}>
            完整介绍 <Icon.arrow />
          </a>

          <div className="ml-auto flex flex-wrap gap-1.5">
            {product.stack.map((s) => (
              <span key={s} className="text-[10px] px-1.5 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-700)', background: 'var(--paper-200)' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

/* ===== FeatureCard (detail) ===== */
export function FeatureCard({ feature, index, color }: { feature: { title: string; desc: string }; index: number; color: string }) {
  return (
    <div className="paper-card p-5 md:p-6 h-full flex flex-col" style={{ background: 'var(--paper-50)' }}>
      <div className="flex items-start gap-3 mb-2">
        <span className="num-stamp shrink-0" style={{ color, fontSize: 22, lineHeight: 1.1 }}>{String(index + 1).padStart(2, '0')}</span>
        <h4 className="font-display leading-tight" style={{ color: 'var(--ink-900)', fontSize: 22 }}>{feature.title}</h4>
      </div>
      <p className="text-[14px]" style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>{feature.desc}</p>
    </div>
  )
}

/* ===== PricingCard (detail) ===== */
export function PricingCard({ product }: { product: Product }) {
  const isOSS = product.status === 'OSS'
  const isSunset = product.status === 'Sunset'

  if (isOSS) {
    return (
      <div className="paper-card p-6 md:p-8 max-w-2xl" style={{ background: 'var(--paper-50)', borderTop: '4px solid ' + product.color }}>
        <div className="kicker mb-2" style={{ color: product.color }}>OPEN SOURCE · MIT LICENSE</div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display" style={{ color: product.color, fontSize: 56, lineHeight: 1 }}>Free</span>
          <span className="text-[14px]" style={{ color: 'var(--ink-500)' }}>· forever</span>
        </div>
        <p className="text-[15px] mb-5" style={{ color: 'var(--ink-700)', lineHeight: 1.75 }}>
          用就用,不要钱,也不许卖。如果它真的帮到你了——请去 GitHub 给它一颗 star,然后告诉一个朋友。
        </p>
        <ul className="space-y-2 text-[14px] mb-6" style={{ color: 'var(--ink-800)' }}>
          <li>✓ 商业项目随便用 (MIT)</li>
          <li>✓ 长期维护,不会突然 sunset</li>
          <li>✓ PR / Issue 通常 48 小时内回复</li>
          <li>✓ 不打广告 · 不收集任何数据</li>
        </ul>
        {product.url && product.url !== '#' && (
          <a href={product.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px]" style={{ background: product.color, color: 'var(--paper-50)' }}>
            打开 GitHub <Icon.arrow />
          </a>
        )}
      </div>
    )
  }

  if (isSunset) {
    return (
      <div className="paper-card p-6 md:p-8 max-w-2xl" style={{ background: 'var(--paper-50)', borderTop: '4px solid var(--ink-500)' }}>
        <div className="kicker mb-2" style={{ color: 'var(--ink-500)' }}>DISCONTINUED · 已下线</div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display" style={{ color: 'var(--ink-500)', fontSize: 56, lineHeight: 1, textDecoration: 'line-through' }}>$0</span>
          <span className="text-[14px]" style={{ color: 'var(--ink-500)' }}>· 不再提供</span>
        </div>
        <p className="text-[15px]" style={{ color: 'var(--ink-700)', lineHeight: 1.75 }}>
          这个产品已经在 2024 年末停止维护。当年的用户数据仍然可用,但不再有新版本。 关停的全过程写在 Posts 里。
        </p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-5 md:gap-6">
      <div className="paper-card p-6" style={{ background: 'var(--paper-50)' }}>
        <div className="kicker mb-2">免费试用 · FREE TRIAL</div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display" style={{ color: 'var(--ink-800)', fontSize: 44, lineHeight: 1 }}>$0</span>
          <span className="text-[13px]" style={{ color: 'var(--ink-500)' }}>· 14 天</span>
        </div>
        <ul className="space-y-1.5 text-[13.5px] mb-5" style={{ color: 'var(--ink-700)' }}>
          <li>· 全部功能解锁</li>
          <li>· 不要信用卡</li>
          <li>· 14 天后自动转免费版</li>
        </ul>
        <span className="text-[13px] hand-underline" style={{ color: 'var(--ink-700)' }}>开始试用 →</span>
      </div>

      <div className="paper-card p-6 relative overflow-hidden" style={{ background: 'var(--paper-50)', borderTop: '4px solid ' + product.color }}>
        <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5" style={{ background: product.color, color: 'var(--paper-50)', fontFamily: 'var(--font-mono)' }}>推荐</span>
        <div className="kicker mb-2" style={{ color: product.color }}>专业版 · PRO</div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display" style={{ color: product.color, fontSize: 44, lineHeight: 1 }}>{product.price.split(' / ')[0] || product.price}</span>
          <span className="text-[13px]" style={{ color: 'var(--ink-500)' }}>
            {product.price.includes('/ mo') ? '/ 月 · 按月续费' : product.price.includes('once') ? '一次买断' : ''}
          </span>
        </div>
        <ul className="space-y-1.5 text-[13.5px] mb-5" style={{ color: 'var(--ink-700)' }}>
          <li>✓ 全部功能</li>
          <li>✓ 优先邮件回复 (24h 内)</li>
          <li>✓ 跟着我一起把这个产品做下去</li>
          <li>✓ 随时退订,按比例退款</li>
        </ul>
        {product.url && product.url !== '#' ? (
          <a href={product.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px]" style={{ background: product.color, color: 'var(--paper-50)' }}>
            订阅 / Subscribe <Icon.arrow />
          </a>
        ) : null}
      </div>
    </div>
  )
}

/* ===== ProductMiniCard (related) ===== */
export function ProductMiniCard({ product }: { product: Product }) {
  const statusColor = statusColorOf(product.status)
  return (
    <a href={productHref(product.id)} className="paper-card lift block p-5 cursor-pointer h-full flex flex-col" style={{ background: 'var(--paper-50)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5" style={{ fontFamily: 'var(--font-mono)', color: statusColor, border: '1px solid ' + statusColor, borderRadius: 999 }}>
          <Icon.dot style={{ color: statusColor }} /> {product.status}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{product.year}</span>
      </div>
      <h4 className="font-display text-[22px] leading-tight mb-1.5" style={{ color: 'var(--ink-900)' }}>{product.name_en}</h4>
      <p className="font-wenkai text-[14px] mb-3 flex-1" style={{ color: product.color, lineHeight: 1.5 }}>{product.tagline}</p>
      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--ink-300)' }}>
        <span className="text-[12px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{product.mrr}</span>
        <Icon.arrow style={{ color: 'var(--accent)' }} />
      </div>
    </a>
  )
}
