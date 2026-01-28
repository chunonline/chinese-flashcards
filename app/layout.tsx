import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '中文词汇卡片生成器',
  description: '为中文教学生成带图片的词汇卡片',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
