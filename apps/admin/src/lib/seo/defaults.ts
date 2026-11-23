/** Site positioning aligned with the approved About page (b665066). */
export const SITE_POSITIONING = {
  nameZh: '三桥',
  nameEn: 'Sankyu Tang',
  titleZh: 'OPC一人公司 · 独立开发者 · FDE',
  titleEn: 'Indie Maker · OPC',
  location: 'Guangzhou, CN',
  email: 'hi@sankyu.me',
  /** Concise unique description used for home/about meta + empty-setting fallbacks. */
  description:
    '广州 OPC 一人公司。独立开发者与 FDE，做 AI 咨询、独立产品、FDE 落地与一人公司课程。',
  /** Matches approved About intro (do not invent alternate bios). */
  intro: '广州。2024 年起做一人公司：独立开发与 FDE，也写 AI 实践与生活。前大厂前端。',
  defaultSeoTitle: '三桥 · 一人公司 / 独立开发者 / FDE',
  defaultSeoDescription:
    '广州 OPC 一人公司。独立开发者与 FDE，做 AI 咨询、独立产品、FDE 落地与一人公司课程。',
} as const

export function firstNonEmpty(...values: Array<string | null | undefined>): string {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim()
  }
  return ''
}
