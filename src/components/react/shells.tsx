/* Article body + related grid ported from pages.jsx. */
import { Icon } from './icons'

export interface RelatedItem {
  id: string
  kicker: string
  title: string
  excerpt: string
  meta: string
  href: string
}

export function RelatedGrid({ items }: { items: RelatedItem[] }) {
  return (
    <div className="grid md:grid-cols-3 gap-5 md:gap-6">
      {items.map((it) => (
        <a key={it.id} href={it.href} className="paper-card lift p-5 block">
          <div className="kicker mb-3">{it.kicker}</div>
          <h4 className="font-display text-[19px] leading-tight mb-2" style={{ color: 'var(--ink-900)' }}>{it.title}</h4>
          <p className="text-[13px]" style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>{it.excerpt}</p>
          <div className="mt-3 text-[11px] flex items-center justify-between" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>
            <span>{it.meta}</span>
            <Icon.arrow style={{ color: 'var(--accent)' }} />
          </div>
        </a>
      ))}
    </div>
  )
}

/* Faux article body — used in mock mode where there is no real markdoc content. */
export function FauxBody({ paragraphs = 5, headings = ['开场', '中段', '尾声'] }: { paragraphs?: number; headings?: string[] }) {
  const lorem_zh = [
    '我离开大厂的时候,口袋里的工资条还没有冷,心里的那张地图却已经全部撕掉了。前面那条所谓的「晋升路径」在 LinkedIn 上闪闪发亮,在我的浏览器里却越来越像一张拍立得照片——边角发黄、人脸模糊。',
    '我开始记账。不是公司的账,是自己的账。每一笔咖啡、每一份订阅、每一个月的服务器、每一次去咖啡馆改 bug 的车费,都记进一个叫《一人公司》的 Numbers 文件。半年之后我才发现,我以为最贵的房租,其实远远比不上「无所事事」的隐形成本。',
    '做一人公司不是逃离。它更像一次回家——回到那个相信「做出好东西就能活下去」的少年的家。这个家很小,墙也薄,冬天会漏风。但灯是自己开的,窗也是自己擦的。',
    '于是我把一年里发生的所有事写在这里。请你把这篇文章当成一封长一点的邮件——没有结论,也不需要回复。',
    '如果你也准备出走,我能给的最实在的建议只有三条:留够 18 个月的生活费、写一个网站、每周至少和一个陌生人聊一小时。剩下的,边走边看。',
    '去年的今天,我在一家会议室里。今年的今天,我在一家面馆里。明年的今天,但愿我还在某个有人记得我名字的小店里。',
  ]
  const items: { type: 'h' | 'p'; text: string; id?: string }[] = []
  for (let i = 0; i < paragraphs; i++) {
    if (headings[i] && i > 0) items.push({ type: 'h', text: headings[i], id: 'h-' + i })
    items.push({ type: 'p', text: lorem_zh[i % lorem_zh.length] })
  }
  return (
    <div className="space-y-5 text-[16px] md:text-[17px]" style={{ lineHeight: 1.85 }}>
      <p className="text-[20px] md:text-[22px]" style={{ color: 'var(--ink-700)', lineHeight: 1.7, fontFamily: 'var(--font-wenkai)' }}>
        <span style={{ float: 'left', fontSize: '3.6em', lineHeight: 0.85, marginRight: 8, marginTop: 6, color: 'var(--accent)', fontFamily: 'var(--font-serif-en)', fontStyle: 'italic' }}>“</span>
        这是一篇还在生长的文字。它会随着我的脚步变长,也可能会被我某天删掉。如果你看到这一行,说明此刻它还在。
      </p>
      {items.map((it, i) =>
        it.type === 'h' ? (
          <h2 id={it.id} key={i} className="font-display text-[24px] md:text-[28px] pt-4" style={{ color: 'var(--ink-900)' }}>{it.text}</h2>
        ) : (
          <p key={i}>{it.text}</p>
        )
      )}
      <blockquote className="my-8 pl-5 border-l-2 italic text-[19px] md:text-[21px]" style={{ borderColor: 'var(--accent)', color: 'var(--ink-800)', fontFamily: 'var(--font-serif-en)', lineHeight: 1.55 }}>
        "Done is better than perfect, but kind is better than done."
      </blockquote>
      <p>{lorem_zh[5]}</p>
    </div>
  )
}
