import type { Collection } from '../db/types'

export type FieldType = 'text' | 'textarea' | 'markdoc' | 'image' | 'url' | 'datetime' | 'number' | 'checkbox' | 'select' | 'json'

export interface FieldDef {
  key: string                // matches D1 column
  label: string
  type: FieldType
  options?: { label: string; value: string }[]
  required?: boolean
  defaultValue?: any
  help?: string
}

export interface CollectionSchema {
  collection: Collection
  label: string
  slugFrom: string           // field used to derive slug
  listColumns: string[]      // columns shown in admin list view
  fields: FieldDef[]
}

const statusDraftPublished: FieldDef = {
  key: 'status', label: '状态', type: 'select', defaultValue: 'draft',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
}

export const SCHEMAS: Record<Collection, CollectionSchema> = {
  posts: {
    collection: 'posts',
    label: 'Posts',
    slugFrom: 'title',
    listColumns: ['slug', 'title', 'status', 'featured', 'published_at'],
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'excerpt', label: '摘要', type: 'textarea' },
      { key: 'cover_image', label: '封面图 URL', type: 'image' },
      statusDraftPublished,
      { key: 'published_at', label: '发布时间', type: 'datetime' },
      { key: 'featured', label: '置顶', type: 'checkbox' },
      { key: 'category', label: '分类', type: 'text' },
      { key: 'tags', label: '标签 (JSON 数组)', type: 'json', defaultValue: '[]' },
      { key: 'reading_time', label: '阅读时间（分钟）', type: 'number' },
      { key: 'seo_title', label: 'SEO 标题', type: 'text' },
      { key: 'seo_description', label: 'SEO 描述', type: 'textarea' },
      { key: 'og_image', label: 'OG 图片', type: 'image' },
      { key: 'canonical_url', label: 'Canonical URL', type: 'url' },
      { key: 'related_posts', label: '相关文章 slugs (JSON)', type: 'json', defaultValue: '[]' },
      { key: 'content_markdoc', label: '正文（Markdoc）', type: 'markdoc' },
    ],
  },
  pages: {
    collection: 'pages',
    label: 'Pages',
    slugFrom: 'title',
    listColumns: ['slug', 'title'],
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true, help: '路径：/<slug>/' },
      { key: 'seo_title', label: 'SEO 标题', type: 'text' },
      { key: 'seo_description', label: 'SEO 描述', type: 'textarea' },
      { key: 'og_image', label: 'OG 图片', type: 'image' },
      { key: 'content_markdoc', label: '正文（Markdoc）', type: 'markdoc' },
    ],
  },
  products: {
    collection: 'products',
    label: 'Products',
    slugFrom: 'name',
    listColumns: ['slug', 'name', 'status', 'product_type'],
    fields: [
      { key: 'name', label: '产品名称', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'summary', label: '简介', type: 'textarea' },
      { key: 'cover_image', label: '封面图', type: 'image' },
      {
        key: 'status', label: '状态', type: 'select', defaultValue: 'active',
        options: [
          { label: 'Active', value: 'active' },
          { label: 'Coming Soon', value: 'coming-soon' },
          { label: 'Archived', value: 'archived' },
        ],
      },
      {
        key: 'product_type', label: '产品类型', type: 'select', defaultValue: 'digital-product',
        options: [
          { label: 'Notion Template', value: 'notion-template' },
          { label: 'Digital Product', value: 'digital-product' },
          { label: 'Software', value: 'software' },
          { label: 'Service', value: 'service' },
          { label: 'Other', value: 'other' },
        ],
      },
      { key: 'price_text', label: '价格', type: 'text' },
      { key: 'external_url', label: '购买链接', type: 'url' },
      { key: 'cta_text', label: 'CTA 文字', type: 'text', defaultValue: 'Get it' },
      { key: 'featured', label: '置顶', type: 'checkbox' },
      { key: 'tags', label: '标签 (JSON)', type: 'json', defaultValue: '[]' },
      { key: 'highlights', label: '亮点 [{title,description}]', type: 'json', defaultValue: '[]' },
      { key: 'audience', label: '目标用户 (JSON)', type: 'json', defaultValue: '[]' },
      { key: 'faq', label: 'FAQ [{question,answer}]', type: 'json', defaultValue: '[]' },
      { key: 'related_posts', label: '相关文章 (JSON)', type: 'json', defaultValue: '[]' },
      { key: 'seo_title', label: 'SEO 标题', type: 'text' },
      { key: 'seo_description', label: 'SEO 描述', type: 'textarea' },
      { key: 'og_image', label: 'OG 图片', type: 'image' },
      { key: 'content_markdoc', label: '详情（Markdoc）', type: 'markdoc' },
    ],
  },
  podcasts: {
    collection: 'podcasts',
    label: 'Podcasts',
    slugFrom: 'title',
    listColumns: ['slug', 'title', 'status', 'duration'],
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'excerpt', label: '摘要', type: 'textarea' },
      { key: 'cover_image', label: '封面图', type: 'image' },
      { key: 'audio_url', label: '音频链接', type: 'url' },
      { key: 'duration', label: '时长', type: 'text' },
      { key: 'published_at', label: '发布时间', type: 'datetime' },
      statusDraftPublished,
      { key: 'external_links', label: '外部平台 [{platform,url}]', type: 'json', defaultValue: '[]' },
      { key: 'related_posts', label: '相关文章 (JSON)', type: 'json', defaultValue: '[]' },
      { key: 'seo_title', label: 'SEO 标题', type: 'text' },
      { key: 'seo_description', label: 'SEO 描述', type: 'textarea' },
      { key: 'og_image', label: 'OG 图片', type: 'image' },
      { key: 'content_markdoc', label: '正文', type: 'markdoc' },
    ],
  },
  videos: {
    collection: 'videos',
    label: 'Videos',
    slugFrom: 'title',
    listColumns: ['slug', 'title', 'platform', 'status'],
    fields: [
      { key: 'title', label: '标题', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      {
        key: 'platform', label: '平台', type: 'select', defaultValue: 'youtube',
        options: [
          { label: 'YouTube', value: 'youtube' },
          { label: 'Bilibili', value: 'bilibili' },
        ],
      },
      { key: 'video_url', label: '视频链接', type: 'url' },
      { key: 'thumbnail', label: '缩略图', type: 'image' },
      { key: 'description', label: '描述', type: 'textarea' },
      { key: 'published_at', label: '发布时间', type: 'datetime' },
      statusDraftPublished,
    ],
  },
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
