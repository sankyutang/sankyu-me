/* List/feed cards ported from components.jsx — navigation converted to <a href>. */
import { Icon } from './icons'
import { Cover } from './primitives'
import { postHref, pageHref } from '@/lib/links'
import type { Post, PageEntry } from '@/lib/data-source/types'

export function PostCardLarge({ post }: { post: Post }) {
  return (
    <a href={postHref(post.id)} className="paper-card lift cursor-pointer h-full flex flex-col overflow-hidden">
      <Cover src={post.cover_src} glyph={post.cover_emoji} seed={post.id} kicker={post.kicker} aspect="16/10" />
      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="kicker">{post.tag}</span>
          <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{post.date}</span>
        </div>
        <h3 className="font-display text-[22px] md:text-[26px] leading-[1.25] mb-2" style={{ color: 'var(--ink-900)' }}>
          {post.title_zh}
        </h3>
        <p className="text-[12px] italic mb-3" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-serif-en)' }}>
          {post.title_en}
        </p>
        <p className="text-[14px] mb-4 flex-1" style={{ color: 'var(--ink-700)', lineHeight: 1.7 }}>
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--ink-300)' }}>
          <span className="text-[12px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{post.reading}</span>
          <Icon.arrow style={{ color: 'var(--accent)' }} />
        </div>
      </div>
    </a>
  )
}

export function PostRow({ post }: { post: Post }) {
  return (
    <a href={postHref(post.id)} className="group flex items-center gap-4 py-3 border-b" style={{ borderColor: 'var(--ink-300)' }}>
      <Cover src={post.cover_src} glyph={post.cover_emoji} seed={post.id} compact aspect="1/1" className="shrink-0" style={{ width: 52, height: 52 }} />
      <div className="min-w-0 flex-1">
        <h4 className="font-display text-[16px] md:text-[17px] leading-snug truncate" style={{ color: 'var(--ink-900)' }}>
          {post.title_zh}
        </h4>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{post.tag}</span>
          <span className="text-[11px]" style={{ color: 'var(--ink-300)' }}>·</span>
          <span className="text-[11px] truncate" style={{ color: 'var(--ink-500)' }}>{post.title_en}</span>
        </div>
      </div>
      <span className="shrink-0 text-[11px] hidden sm:inline" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{post.date}</span>
      <Icon.arrow style={{ color: 'var(--ink-300)' }} />
    </a>
  )
}

export function PageRow({ p }: { p: PageEntry }) {
  return (
    <a href={pageHref(p.id)} className="flex items-center gap-3 py-2.5 border-b group" style={{ borderColor: 'var(--ink-300)' }}>
      <Cover glyph={p.id[0].toUpperCase()} color={p.cover_color} seed={p.id} compact aspect="1/1" className="shrink-0" style={{ width: 44, height: 44 }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 truncate">
          <span className="font-display text-[15px]" style={{ color: 'var(--accent)' }}>/{p.id}</span>
          <span className="text-[11px]" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{p.title_en}</span>
        </div>
        <p className="text-[12px] truncate" style={{ color: 'var(--ink-700)' }}>{p.desc}</p>
      </div>
      <span className="text-[11px] hidden sm:inline shrink-0" style={{ color: 'var(--ink-500)', fontFamily: 'var(--font-mono)' }}>{p.date}</span>
    </a>
  )
}
