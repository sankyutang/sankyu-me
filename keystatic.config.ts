import { config, collection, singleton, fields } from '@keystatic/core'

export default config({
  storage: {
    kind: 'github',
    repo: 'sankyutang/sankyu-me',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: '标题' } }),
        excerpt: fields.text({ label: '摘要', multiline: true }),
        coverImage: fields.image({
          label: '封面图',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        status: fields.select({
          label: '状态',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        publishedAt: fields.datetime({ label: '发布时间' }),
        featured: fields.checkbox({ label: '置顶', defaultValue: false }),
        category: fields.text({ label: '分类' }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: '标签',
          itemLabel: (props) => props.value,
        }),
        readingTime: fields.integer({ label: '阅读时间（分钟）' }),
        seoTitle: fields.text({ label: 'SEO 标题' }),
        seoDescription: fields.text({ label: 'SEO 描述', multiline: true }),
        ogImage: fields.image({
          label: 'OG 图片',
          directory: 'public/images/og',
          publicPath: '/images/og/',
        }),
        canonicalUrl: fields.url({ label: 'Canonical URL' }),
        relatedPosts: fields.array(fields.text({ label: 'Slug' }), {
          label: '相关文章',
          itemLabel: (props) => props.value,
        }),
        content: fields.markdoc({ label: '内容' }),
      },
    }),

    pages: collection({
      label: 'Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: '标题' } }),
        seoTitle: fields.text({ label: 'SEO 标题' }),
        seoDescription: fields.text({ label: 'SEO 描述', multiline: true }),
        ogImage: fields.image({
          label: 'OG 图片',
          directory: 'public/images/og',
          publicPath: '/images/og/',
        }),
        content: fields.markdoc({ label: '内容' }),
      },
    }),

    works: collection({
      label: 'Works',
      slugField: 'title',
      path: 'src/content/works/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: '标题' } }),
        summary: fields.text({ label: '简介', multiline: true }),
        coverImage: fields.image({
          label: '封面图',
          directory: 'public/images/works',
          publicPath: '/images/works/',
        }),
        status: fields.select({
          label: '状态',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        publishedAt: fields.datetime({ label: '发布时间' }),
        featured: fields.checkbox({ label: '置顶', defaultValue: false }),
        externalUrl: fields.url({ label: '外部链接' }),
        seoTitle: fields.text({ label: 'SEO 标题' }),
        seoDescription: fields.text({ label: 'SEO 描述', multiline: true }),
        ogImage: fields.image({
          label: 'OG 图片',
          directory: 'public/images/og',
          publicPath: '/images/og/',
        }),
        content: fields.markdoc({ label: '内容' }),
      },
    }),

    products: collection({
      label: 'Products',
      slugField: 'name',
      path: 'src/content/products/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        name: fields.slug({ name: { label: '产品名称' } }),
        summary: fields.text({ label: '简介', multiline: true }),
        coverImage: fields.image({
          label: '封面图',
          directory: 'public/images/products',
          publicPath: '/images/products/',
        }),
        status: fields.select({
          label: '状态',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Coming Soon', value: 'coming-soon' },
            { label: 'Archived', value: 'archived' },
          ],
          defaultValue: 'active',
        }),
        productType: fields.select({
          label: '产品类型',
          options: [
            { label: 'Notion Template', value: 'notion-template' },
            { label: 'Digital Product', value: 'digital-product' },
            { label: 'Software', value: 'software' },
            { label: 'Service', value: 'service' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'digital-product',
        }),
        priceText: fields.text({ label: '价格' }),
        externalUrl: fields.url({ label: '购买链接' }),
        ctaText: fields.text({ label: 'CTA 按钮文字', defaultValue: 'Get it' }),
        featured: fields.checkbox({ label: '置顶', defaultValue: false }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: '标签',
          itemLabel: (props) => props.value,
        }),
        highlights: fields.array(
          fields.object({
            title: fields.text({ label: '标题' }),
            description: fields.text({ label: '描述' }),
          }),
          { label: '亮点', itemLabel: (props) => props.fields.title.value }
        ),
        audience: fields.array(fields.text({ label: '标签' }), {
          label: '目标用户',
          itemLabel: (props) => props.value,
        }),
        faq: fields.array(
          fields.object({
            question: fields.text({ label: '问题' }),
            answer: fields.text({ label: '回答', multiline: true }),
          }),
          { label: 'FAQ', itemLabel: (props) => props.fields.question.value }
        ),
        relatedPosts: fields.array(fields.text({ label: 'Slug' }), {
          label: '相关文章',
          itemLabel: (props) => props.value,
        }),
        seoTitle: fields.text({ label: 'SEO 标题' }),
        seoDescription: fields.text({ label: 'SEO 描述', multiline: true }),
        ogImage: fields.image({
          label: 'OG 图片',
          directory: 'public/images/og',
          publicPath: '/images/og/',
        }),
        content: fields.markdoc({ label: '内容' }),
      },
    }),

    podcasts: collection({
      label: 'Podcasts',
      slugField: 'title',
      path: 'src/content/podcasts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: '标题' } }),
        excerpt: fields.text({ label: '摘要', multiline: true }),
        coverImage: fields.image({
          label: '封面图',
          directory: 'public/images/podcasts',
          publicPath: '/images/podcasts/',
        }),
        audioUrl: fields.url({ label: '音频链接' }),
        duration: fields.text({ label: '时长（如 42:15）' }),
        publishedAt: fields.datetime({ label: '发布时间' }),
        status: fields.select({
          label: '状态',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        externalLinks: fields.array(
          fields.object({
            platform: fields.text({ label: '平台' }),
            url: fields.url({ label: '链接' }),
          }),
          { label: '外部链接', itemLabel: (props) => props.fields.platform.value }
        ),
        relatedPosts: fields.array(fields.text({ label: 'Slug' }), {
          label: '相关文章',
          itemLabel: (props) => props.value,
        }),
        seoTitle: fields.text({ label: 'SEO 标题' }),
        seoDescription: fields.text({ label: 'SEO 描述', multiline: true }),
        ogImage: fields.image({
          label: 'OG 图片',
          directory: 'public/images/og',
          publicPath: '/images/og/',
        }),
        content: fields.markdoc({ label: '内容' }),
      },
    }),

    videos: collection({
      label: 'Videos',
      slugField: 'title',
      path: 'src/content/videos/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: '标题' } }),
        platform: fields.select({
          label: '平台',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Bilibili', value: 'bilibili' },
          ],
          defaultValue: 'youtube',
        }),
        videoUrl: fields.url({ label: '视频链接' }),
        thumbnail: fields.image({
          label: '缩略图',
          directory: 'public/images/videos',
          publicPath: '/images/videos/',
        }),
        description: fields.text({ label: '描述', multiline: true }),
        publishedAt: fields.datetime({ label: '发布时间' }),
        status: fields.select({
          label: '状态',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
      },
    }),
  },

  singletons: {
    siteSettings: singleton({
      label: 'Site Settings',
      path: 'src/content/site-settings',
      format: { data: 'json' },
      schema: {
        siteName: fields.text({ label: '站点名称', defaultValue: 'sankyu.me' }),
        siteUrl: fields.url({ label: '站点 URL' }),
        siteDescription: fields.text({ label: '站点描述', multiline: true }),
        defaultSeoTitle: fields.text({ label: '默认 SEO 标题' }),
        defaultSeoDescription: fields.text({ label: '默认 SEO 描述', multiline: true }),
        defaultOgImage: fields.image({
          label: '默认 OG 图片',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        mainNav: fields.array(
          fields.object({
            label: fields.text({ label: '名称' }),
            href: fields.text({ label: '链接' }),
          }),
          { label: '主导航', itemLabel: (props) => props.fields.label.value }
        ),
        socialLinks: fields.array(
          fields.object({
            platform: fields.text({ label: '平台' }),
            url: fields.url({ label: '链接' }),
          }),
          { label: '社交链接', itemLabel: (props) => props.fields.platform.value }
        ),
        introHeadline: fields.text({ label: '首页标题' }),
        introBody: fields.text({ label: '首页简介', multiline: true }),
        footerEmoji: fields.text({ label: 'Footer Emoji' }),
      },
    }),
  },
})
