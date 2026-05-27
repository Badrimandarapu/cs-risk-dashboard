import { NextResponse } from 'next/server'
import { getAccountsFromSheet } from '@/lib/googleSheets'

export async function GET() {
  try {
    const accounts = await getAccountsFromSheet()
    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json({ accounts: [] }, { status: 200 })
  }
}