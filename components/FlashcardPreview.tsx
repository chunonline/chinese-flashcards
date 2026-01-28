'use client'

import { useState } from 'react'
import type { Flashcard } from '@/types'

interface FlashcardPreviewProps {
  card: Flashcard
  onEdit: (card: Flashcard) => void
}

export default function FlashcardPreview({ card, onEdit }: FlashcardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState(card)

  const handleFlip = () => {
    if (!isEditing) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleSave = () => {
    onEdit(editedCard)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedCard(card)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="card-dark p-6">
        <div className="text-[13px] font-medium text-[var(--text-muted)] uppercase tracking-wide mb-4">
          编辑词卡
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] text-[var(--text-muted)] mb-1.5">中文</label>
            <input
              type="text"
              value={editedCard.chinese}
              onChange={(e) => setEditedCard({ ...editedCard, chinese: e.target.value })}
              className="input-dark w-full text-[21px] font-medium"
            />
          </div>

          <div>
            <label className="block text-[13px] text-[var(--text-muted)] mb-1.5">拼音</label>
            <input
              type="text"
              value={editedCard.pinyin}
              onChange={(e) => setEditedCard({ ...editedCard, pinyin: e.target.value })}
              className="input-dark w-full"
            />
          </div>

          <div>
            <label className="block text-[13px] text-[var(--text-muted)] mb-1.5">英文</label>
            <input
              type="text"
              value={editedCard.english}
              onChange={(e) => setEditedCard({ ...editedCard, english: e.target.value })}
              className="input-dark w-full"
            />
          </div>

          <div>
            <label className="block text-[13px] text-[var(--text-muted)] mb-1.5">图片链接</label>
            <input
              type="text"
              value={editedCard.imageUrl}
              onChange={(e) => setEditedCard({ ...editedCard, imageUrl: e.target.value })}
              className="input-dark w-full text-[14px]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} className="btn-primary flex-1 text-[15px]">
            保存
          </button>
          <button onClick={handleCancel} className="btn-ghost flex-1 text-[15px]">
            取消
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        className={`flip-card cursor-pointer h-[320px] ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner relative w-full h-full">
          {/* Front */}
          <div className="flip-card-front absolute w-full h-full card-dark overflow-hidden">
            <div className="h-[200px] bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
              {card.imageUrl && !card.imageUrl.includes('placeholder') ? (
                <img
                  src={card.imageUrl}
                  alt={card.imageAlt || card.chinese}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[var(--text-muted)]">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-5 text-center">
              <span className="text-[32px] font-semibold text-[var(--text-primary)]">
                {card.chinese}
              </span>
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back absolute w-full h-full card-accent flex flex-col items-center justify-center p-8">
            <div className="text-white/40 text-[24px] mb-8">{card.chinese}</div>
            <div className="text-[28px] text-white font-medium mb-4">
              {card.pinyin}
            </div>
            <div className="text-[19px] text-white/90 text-center leading-relaxed">
              {card.english}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsEditing(true)
        }}
        className="mt-3 w-full py-2 text-[13px] text-[var(--accent-bright)] hover:bg-[var(--bg-card)] rounded-lg transition-colors"
      >
        编辑
      </button>
    </div>
  )
}
