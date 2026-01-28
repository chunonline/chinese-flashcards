'use client'

import { useState } from 'react'

interface WordInputProps {
  onSubmit: (words: string[]) => void
  isLoading: boolean
}

export default function WordInput({ onSubmit, isLoading }: WordInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const words = input
      .split(/[\n,，、]+/)
      .map(word => word.trim())
      .filter(word => word.length > 0)

    if (words.length > 0) {
      onSubmit(words)
    }
  }

  const exampleWords = '苹果\n香蕉\n公共汽车\n学校\n老师\n学生\n书本\n电脑\n手机\n音乐'

  const fillExample = () => {
    setInput(exampleWords)
  }

  const wordCount = input
    .split(/[\n,，、]+/)
    .map(word => word.trim())
    .filter(word => word.length > 0).length

  return (
    <form onSubmit={handleSubmit} className="max-w-[680px] mx-auto">
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入中文词汇，每行一个..."
          className="input-dark w-full h-[240px] resize-none text-[17px] leading-relaxed"
          disabled={isLoading}
        />

        {isLoading && (
          <div className="absolute inset-0 bg-[var(--bg-dark)]/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="spinner w-8 h-8"></div>
              <span className="text-[15px] text-[var(--text-secondary)]">正在生成词卡...</span>
            </div>
          </div>
        )}

        {wordCount > 0 && !isLoading && (
          <div className="absolute bottom-4 right-4 text-[13px] text-[var(--text-muted)]">
            {wordCount} 个词汇
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary min-w-[140px]"
        >
          生成词卡
        </button>

        <button
          type="button"
          onClick={fillExample}
          disabled={isLoading}
          className="btn-ghost"
        >
          填入示例
        </button>
      </div>
    </form>
  )
}
