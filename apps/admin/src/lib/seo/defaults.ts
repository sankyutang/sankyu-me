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
  intro:
    '你好，我是三桥。广州 OPC 一人公司，独立开发者与 FDE。从 2024 年起专注一人公司：AI 咨询、独立产品、FDE 落地，以及一人公司课程。',
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
