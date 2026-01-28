import { NextRequest, NextResponse } from 'next/server'
import { generatePinyin } from '@/lib/pinyin'
import { getEnglish } from '@/lib/dictionary'
import { searchVocabImage, getPlaceholderImage } from '@/lib/imageSearch'
import type { Flashcard } from '@/types'

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

async function processWord(chinese: string): Promise<Flashcard> {
  // Generate pinyin
  const pinyin = generatePinyin(chinese)

  // Get English translation (getEnglish handles common word overrides)
  const english = getEnglish(chinese) || ''

  // Search for image using English term (better results)
  const searchTerm = english || chinese
  const imageResult = await searchVocabImage(chinese, searchTerm)

  return {
    id: generateId(),
    chinese,
    pinyin,
    english,
    imageUrl: imageResult?.url || getPlaceholderImage(),
    imageAlt: imageResult?.alt || chinese
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { words } = body

    if (!words || !Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: '请提供词汇列表' },
        { status: 400 }
      )
    }

    // Limit to 50 words at a time
    const limitedWords = words.slice(0, 50)

    // Process all words in parallel
    const flashcards = await Promise.all(
      limitedWords.map((word: string) => processWord(word.trim()))
    )

    return NextResponse.json({ flashcards })
  } catch (error) {
    console.error('Process error:', error)
    return NextResponse.json(
      { error: '处理失败，请重试' },
      { status: 500 }
    )
  }
}
