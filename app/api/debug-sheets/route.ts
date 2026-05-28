import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const SHEET_ID = '1hf1DESzc6ub-88V-jilbxGBe_0nu0Ssp0vaTsDKqYNA'
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`
    
    const response = await fetch(csvUrl, { cache: 'no-store' })
    const csv = await response.text()
    
    // Show first 5 lines
    const lines = csv.split('\n').slice(0, 5)
    
    return NextResponse.json({
      csvPreview: lines,
      fullCsv: csv.substring(0, 1000), // First 1000 chars
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}