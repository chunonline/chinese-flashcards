import { NextRequest, NextResponse } from 'next/server'
import { generatePPTX } from '@/lib/pptxGenerator'
import type { Flashcard } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { flashcards } = body

    if (!flashcards || !Array.isArray(flashcards) || flashcards.length === 0) {
      return NextResponse.json(
        { error: '请提供词汇卡片数据' },
        { status: 400 }
      )
    }

    // Generate PPTX
    const blob = await generatePPTX(flashcards as Flashcard[])

    // Convert blob to array buffer for response
    const arrayBuffer = await blob.arrayBuffer()

    // Return as downloadable file
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="flashcards-${Date.now()}.pptx"`,
        'Content-Length': arrayBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: '导出失败，请重试' },
      { status: 500 }
    )
  }
}
