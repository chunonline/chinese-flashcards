import cedictData from '@/data/cedict.json'

interface DictEntry {
  t: string    // traditional
  p: string    // pinyin
  e: string[]  // english definitions
}

type CedictData = Record<string, DictEntry>

const dictionary = cedictData as CedictData

// Common single-character words with better translations for teaching
const commonWordOverrides: Record<string, string> = {
  '听': 'to listen',
  '看': 'to look; to watch; to read',
  '说': 'to speak; to say',
  '读': 'to read',
  '写': 'to write',
  '吃': 'to eat',
  '喝': 'to drink',
  '走': 'to walk',
  '跑': 'to run',
  '跳': 'to jump',
  '打': 'to hit; to play (ball)',
  '做': 'to do; to make',
  '是': 'to be; is; am; are',
  '有': 'to have',
  '去': 'to go',
  '来': 'to come',
  '想': 'to think; to want',
  '要': 'to want; to need',
  '能': 'can; able to',
  '会': 'can; will',
  '对': 'correct; right',
  '好': 'good',
  '大': 'big',
  '小': 'small',
  '多': 'many; much',
  '少': 'few; little',
  '书': 'book',
  '歌': 'song',
  '舞': 'dance',
  '那': 'that',
  '这': 'this',
  '我': 'I; me',
  '你': 'you',
  '他': 'he; him',
  '她': 'she; her',
  '它': 'it',
  '们': '(plural marker)',
}

export interface DictionaryResult {
  traditional: string
  simplified: string
  pinyin: string
  english: string[]
}

/**
 * Look up a Chinese word in the dictionary
 */
export function lookupWord(chinese: string): DictionaryResult | null {
  const entry = dictionary[chinese]
  if (!entry) return null

  return {
    traditional: entry.t,
    simplified: chinese,
    pinyin: entry.p,
    english: entry.e
  }
}

/**
 * Get English translation for a Chinese word
 * Returns the first/most common translation
 */
export function getEnglish(chinese: string): string {
  // Check common word overrides first (better for teaching)
  if (commonWordOverrides[chinese]) {
    return commonWordOverrides[chinese]
  }

  const entry = dictionary[chinese]
  if (!entry || entry.e.length === 0) return ''

  // Get first definition, clean it up
  let def = entry.e[0]

  // Remove parenthetical notes at the beginning
  def = def.replace(/^\([^)]+\)\s*/, '')

  return def
}

/**
 * Get pinyin for a Chinese word from dictionary
 */
export function getPinyin(chinese: string): string {
  const entry = dictionary[chinese]
  if (!entry) return ''
  return entry.p
}

/**
 * Check if a word exists in the dictionary
 */
export function hasWord(chinese: string): boolean {
  return chinese in dictionary
}

/**
 * Get all definitions for a word
 */
export function getAllDefinitions(chinese: string): string[] {
  const entry = dictionary[chinese]
  if (!entry) return []
  return entry.e
}
