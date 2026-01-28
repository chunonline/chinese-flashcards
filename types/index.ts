export interface Flashcard {
  id: string
  chinese: string
  pinyin: string
  english: string
  imageUrl: string
  imageAlt?: string
}

export interface ProcessedWord {
  chinese: string
  pinyin: string
  english: string
  imageUrl: string
  imageAlt?: string
  error?: string
}
