'use client'

import { useState } from 'react'
import WordInput from '@/components/WordInput'
import FlashcardPreview from '@/components/FlashcardPreview'
import ExportButton from '@/components/ExportButton'
import type { Flashcard } from '@/types'

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (words: string[]) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '处理失败')
      }

      setFlashcards(data.flashcards)
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCard = (updatedCard: Flashcard) => {
    setFlashcards(cards =>
      cards.map(card => card.id === updatedCard.id ? updatedCard : card)
    )
  }

  const handleDeleteCard = (cardId: string) => {
    setFlashcards(cards => cards.filter(card => card.id !== cardId))
  }

  const handleReset = () => {
    setFlashcards([])
    setError(null)
  }

  return (
    <main className="min-h-screen bg-[var(--bg-dark)]">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-[980px] mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <span className="text-[var(--text-primary)] font-medium">词卡生成器</span>
            {flashcards.length > 0 && (
              <span className="text-sm text-[var(--text-secondary)]">
                {flashcards.length} 张词卡
              </span>
            )}
          </nav>
        </div>
      </header>

      <div className="max-w-[980px] mx-auto px-6">
        {flashcards.length === 0 ? (
          <div className="py-20 animate-fade-up">
            {/* Hero */}
            <div className="text-center mb-16">
              <h1 className="text-[56px] font-semibold text-[var(--text-primary)] leading-tight mb-6">
                中文词卡
              </h1>
              <p className="text-[21px] text-[var(--text-secondary)] max-w-[600px] mx-auto leading-relaxed">
                输入词汇，自动生成拼音、翻译和图片。<br />
                一键导出 PowerPoint，用于课堂教学。
              </p>
            </div>

            {/* Input */}
            <WordInput onSubmit={handleSubmit} isLoading={isLoading} />

            {error && (
              <div className="mt-8 text-center">
                <p className="text-[#ef4444] text-[15px]">{error}</p>
              </div>
            )}

            {/* Features */}
            <div className="mt-24 grid grid-cols-3 gap-8">
              <div className="card-dark p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-medium text-[var(--text-primary)] mb-2">智能配图</h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  自动搜索匹配的高清图片
                </p>
              </div>
              <div className="card-dark p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-medium text-[var(--text-primary)] mb-2">精准拼音</h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  支持声调，正确处理多音字
                </p>
              </div>
              <div className="card-dark p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-medium text-[var(--text-primary)] mb-2">一键导出</h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  生成标准 PowerPoint 文件
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 animate-fade-up">
            {/* Actions */}
            <div className="flex items-center justify-between mb-12">
              <button
                onClick={handleReset}
                className="btn-ghost flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                重新开始
              </button>

              <ExportButton flashcards={flashcards} />
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {flashcards.map(card => (
                <div key={card.id} className="relative group opacity-0 animate-fade-up">
                  <FlashcardPreview card={card} onEdit={handleEditCard} />
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-[#ef4444] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom export */}
            <div className="mt-16 pt-12 border-t border-[var(--border)] text-center">
              <p className="text-[var(--text-secondary)] mb-6">准备好了？</p>
              <ExportButton flashcards={flashcards} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-[13px] text-[var(--text-muted)]">
        为中文教师设计
      </footer>
    </main>
  )
}
