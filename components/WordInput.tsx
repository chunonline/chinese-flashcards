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

    // Parse input: split by newlines, commas, or Chinese comma
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

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <label
          htmlFor="words"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          输入中文词汇
        </label>
        <p className="text-sm text-gray-500 mb-2">
          每行一个词，或用逗号分隔
        </p>
        <textarea
          id="words"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="公共汽车&#10;学校&#10;老师&#10;..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              处理中...
            </span>
          ) : (
            '生成词卡'
          )}
        </button>

        <button
          type="button"
          onClick={fillExample}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          示例词汇
        </button>
      </div>
    </form>
  )
}
