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
        headers: {
          'Content-Type': 'application/json'
        },
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
      cards.map(card =>
        card.id === updatedCard.id ? updatedCard : card
      )
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
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            中文词汇卡片生成器
          </h1>
          <p className="text-lg text-gray-600">
            输入中文词汇，自动生成带图片的教学幻灯片
          </p>
        </div>

        {/* Main content */}
        {flashcards.length === 0 ? (
          <div>
            <WordInput onSubmit={handleSubmit} isLoading={isLoading} />

            {error && (
              <div className="mt-6 max-w-2xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-12 max-w-2xl mx-auto">
              <h2 className="text-xl font-medium text-gray-800 mb-4">
                使用说明
              </h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-gray-600">
                <p>1. 在文本框中输入中文词汇，每行一个词或用逗号分隔</p>
                <p>2. 点击"生成词卡"按钮，系统会自动：</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>为每个词汇生成拼音</li>
                  <li>查找英文翻译</li>
                  <li>搜索相关图片</li>
                </ul>
                <p>3. 预览词卡，可以点击卡片翻转查看正反面</p>
                <p>4. 如需修改，可以编辑拼音、翻译或图片</p>
                <p>5. 点击"导出为 PowerPoint"下载幻灯片文件</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Action bar */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                重新开始
              </button>

              <ExportButton flashcards={flashcards} />
            </div>

            {/* Flashcard grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {flashcards.map(card => (
                <div key={card.id} className="relative">
                  <FlashcardPreview card={card} onEdit={handleEditCard} />
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md"
                    title="删除此卡片"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Export section at bottom */}
            <div className="mt-12 pt-8 border-t">
              <ExportButton flashcards={flashcards} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
