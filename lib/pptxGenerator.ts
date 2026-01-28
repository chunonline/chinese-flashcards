import pptxgen from 'pptxgenjs'
import type { Flashcard } from '@/types'

/**
 * Convert image URL to base64 data
 */
async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) return null

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error('Failed to fetch image:', url, error)
    return null
  }
}

/**
 * Generate PowerPoint presentation from flashcards
 */
export async function generatePPTX(cards: Flashcard[]): Promise<Blob> {
  const pres = new pptxgen()

  // Set presentation properties
  pres.layout = 'LAYOUT_16x9'
  pres.title = '中文词汇卡片'
  pres.author = 'Flashcard Generator'

  // Define colors
  const bgColor = 'FFFFFF'
  const textColor = '333333'
  const pinyinColor = '0066CC'
  const englishColor = '666666'

  for (const card of cards) {
    // Fetch image as base64
    const imageData = await fetchImageAsBase64(card.imageUrl)

    // === FRONT SLIDE (Image + Chinese) ===
    const frontSlide = pres.addSlide()
    frontSlide.background = { color: bgColor }

    // Add image (centered, top half)
    if (imageData) {
      frontSlide.addImage({
        data: imageData,
        x: 1.5,
        y: 0.5,
        w: 7,
        h: 3.5,
        sizing: {
          type: 'contain',
          w: 7,
          h: 3.5
        }
      })
    } else {
      // Placeholder rectangle if no image
      frontSlide.addShape(pres.ShapeType.rect, {
        x: 1.5,
        y: 0.5,
        w: 7,
        h: 3.5,
        fill: { color: 'F0F0F0' },
        line: { color: 'CCCCCC', width: 1 }
      })
      frontSlide.addText('图片未找到', {
        x: 1.5,
        y: 2,
        w: 7,
        h: 0.5,
        fontSize: 18,
        color: '999999',
        align: 'center'
      })
    }

    // Add Chinese characters (bottom half, large and bold)
    frontSlide.addText(card.chinese, {
      x: 0,
      y: 4.2,
      w: '100%',
      h: 1,
      fontSize: 72,
      bold: true,
      color: textColor,
      align: 'center',
      fontFace: 'Microsoft YaHei'
    })

    // === BACK SLIDE (Pinyin + English) ===
    const backSlide = pres.addSlide()
    backSlide.background = { color: bgColor }

    // Chinese character (smaller, at top)
    backSlide.addText(card.chinese, {
      x: 0,
      y: 0.5,
      w: '100%',
      h: 0.8,
      fontSize: 36,
      color: '999999',
      align: 'center',
      fontFace: 'Microsoft YaHei'
    })

    // Pinyin (large, centered)
    backSlide.addText(card.pinyin, {
      x: 0,
      y: 2,
      w: '100%',
      h: 1,
      fontSize: 60,
      color: pinyinColor,
      align: 'center',
      fontFace: 'Arial'
    })

    // English translation
    backSlide.addText(card.english, {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 1.5,
      fontSize: 36,
      color: englishColor,
      align: 'center',
      fontFace: 'Arial',
      wrap: true
    })
  }

  // Generate the file
  const output = await pres.write({ outputType: 'arraybuffer' }) as ArrayBuffer
  return new Blob([output], {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  })
}
