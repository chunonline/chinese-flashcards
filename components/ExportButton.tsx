'use client'

import { useState } from 'react'
import type { Flashcard } from '@/types'

interface ExportButtonProps {
  flashcards: Flashcard[]
  disabled?: boolean
}

export default function ExportButton({
  flashcards,
  disabled
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    if (flashcards.length === 0) return

    setIsExporting(true)
    setError(null)

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flashcards })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '导出失败')
      }

      // Get the blob from response
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `flashcards-${Date.now()}.pptx`
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="text-center">
      <button
        onClick={handleExport}
        disabled={disabled || isExporting || flashcards.length === 0}
        className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
      >
        {isExporting ? (
          <>
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
            正在生成 PPT...
          </>
        ) : (
          <>
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            导出为 PowerPoint
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}

      {flashcards.length > 0 && (
        <p className="mt-2 text-gray-500 text-sm">
          共 {flashcards.length} 张词卡（{flashcards.length * 2} 页幻灯片）
        </p>
      )}
    </div>
  )
}
