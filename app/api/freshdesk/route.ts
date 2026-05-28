import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = 'WwlSY1ncwyBK5e7MXKv0'
    const domain = 'increff.freshdesk.com'
    const auth = Buffer.from(`${apiKey}:X`).toString('base64')

    const res = await fetch(`https://${domain}/api/v2/tickets`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    }).catch(err => {
      throw new Error(`Fetch error: ${err.message}`)
    })

    const statusCode = res.status
    const statusText = res.statusText
    const responseText = await res.text()

    return NextResponse.json({
      success: statusCode === 200,
      status: statusCode,
      statusText,
      responseLength: responseText.length,
      responsePreview: responseText.substring(0, 500),
      auth: auth.substring(0, 20) + '...',
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    })
  }
}
