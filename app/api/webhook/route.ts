import { NextResponse } from 'next/server'

const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Make.com 웹훅으로 데이터 전송
    const response = await fetch(MAKE_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Webhook 전송 실패')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: '웹훅 전송 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 