'use client'

import { useState } from 'react'
import type { Flashcard } from '@/types'

interface ExportButtonProps {
  flashcards: Flashcard[]
  disabled?: boolean
}

export default function ExportButton({ flashcards, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    if (flashcards.length === 0) return

    setIsExporting(true)
    setError(null)

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flashcards })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '导出失败')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `词卡-${new Date().toLocaleDateString('zh-CN')}.pptx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={disabled || isExporting || flashcards.length === 0}
        className="btn-primary inline-flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <div className="spinner w-4 h-4 border-[var(--bg-dark)] border-t-[var(--bg-dark)]"></div>
            导出中...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出 PowerPoint
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-[13px] text-[#ef4444]">{error}</p>
      )}
    </div>
  )
}
