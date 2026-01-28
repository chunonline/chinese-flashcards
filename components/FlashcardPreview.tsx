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
      <div className="bg-white rounded-xl shadow-lg p-6 w-80">
        <h3 className="text-lg font-medium mb-4">编辑词卡</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">中文</label>
            <input
              type="text"
              value={editedCard.chinese}
              onChange={(e) =>
                setEditedCard({ ...editedCard, chinese: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">拼音</label>
            <input
              type="text"
              value={editedCard.pinyin}
              onChange={(e) =>
                setEditedCard({ ...editedCard, pinyin: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">英文</label>
            <input
              type="text"
              value={editedCard.english}
              onChange={(e) =>
                setEditedCard({ ...editedCard, english: e.target.value })
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">图片 URL</label>
            <input
              type="text"
              value={editedCard.imageUrl}
              onChange={(e) =>
                setEditedCard({ ...editedCard, imageUrl: e.target.value })
              }
              className="w-full p-2 border rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80">
      {/* Flashcard */}
      <div
        className={`flip-card cursor-pointer h-80 ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner relative w-full h-full">
          {/* Front */}
          <div className="flip-card-front absolute w-full h-full bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
              {card.imageUrl && !card.imageUrl.includes('placeholder') ? (
                <img
                  src={card.imageUrl}
                  alt={card.imageAlt || card.chinese}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-sm">图片加载中...</div>
              )}
            </div>
            <div className="p-4 text-center">
              <span className="text-4xl font-bold text-gray-800">
                {card.chinese}
              </span>
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              点击翻转
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back absolute w-full h-full bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-6">
            <div className="text-gray-400 text-2xl mb-4">{card.chinese}</div>
            <div className="text-blue-600 text-3xl font-medium mb-4">
              {card.pinyin}
            </div>
            <div className="text-gray-600 text-xl text-center">
              {card.english}
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              点击翻转
            </div>
          </div>
        </div>
      </div>

      {/* Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsEditing(true)
        }}
        className="mt-3 w-full py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        编辑此卡片
      </button>
    </div>
  )
}
