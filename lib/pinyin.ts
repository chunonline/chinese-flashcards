import pinyin from 'pinyin'
import { getPinyin as getDictPinyin } from './dictionary'

/**
 * Generate pinyin for Chinese text
 * Uses pinyin library first (better for common words and handles context)
 * Falls back to dictionary for compound words
 */
export function generatePinyin(chinese: string): string {
  // Use pinyin library first (better handling of common pronunciations)
  try {
    const result = pinyin(chinese, {
      style: pinyin.STYLE_TONE,  // With tone marks
      heteronym: false,          // Don't return multiple pronunciations
      segment: true              // Enable word segmentation
    })

    const pinyinStr = result.map((arr: string[]) => arr[0]).join(' ')
    if (pinyinStr) {
      return pinyinStr
    }
  } catch {
    // Continue to dictionary fallback
  }

  // Fall back to dictionary for unknown words
  const dictPinyin = getDictPinyin(chinese)
  if (dictPinyin) {
    return dictPinyin
  }

  return ''
}

/**
 * Generate pinyin without tone marks (for search)
 */
export function generatePinyinNoTone(chinese: string): string {
  try {
    const result = pinyin(chinese, {
      style: pinyin.STYLE_NORMAL,  // Without tone marks
      heteronym: false,
      segment: true
    })
    return result.map((arr: string[]) => arr[0]).join('')
  } catch {
    return ''
  }
}
