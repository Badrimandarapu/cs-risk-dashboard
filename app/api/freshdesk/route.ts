import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = 'U6ZNaOkxNplnfPesmJ0I'
    const domain = 'support.increff'

    console.log('Freshdesk API called')
    console.log('API Key:', apiKey ? 'Present' : 'Missing')
    console.log('Domain:', domain)

    const auth = Buffer.from(`${apiKey}:X`).toString('base64')
    console.log('Auth header created')

    // Test companies endpoint
    console.log('Fetching companies...')
    const companiesRes = await fetch(
      `https://${domain}.freshdesk.com/api/v2/companies`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    ).catch(err => {
      console.error('Companies fetch error:', err)
      throw err
    })

    console.log('Companies response status:', companiesRes.status)
    console.log('Companies response headers:', Object.fromEntries(companiesRes.headers))

    const companiesText = await companiesRes.text()
    console.log('Companies response body:', companiesText.substring(0, 200))

    if (!companiesRes.ok) {
      return NextResponse.json({
        success: false,
        accounts: [],
        error: `Companies fetch failed: ${companiesRes.status}`,
        details: companiesText.substring(0, 500),
      })
    }

    const companiesData = JSON.parse(companiesText)
    const companies = companiesData.companies || []

    console.log('Found companies:', companies.length)

    return NextResponse.json({
      success: true,
      accounts: companies.slice(0, 5).map((c: any) => ({
        id: c.id,
        name: c.name,
      })),
      debug: {
        companiesCount: companies.length,
        apiKeyLength: apiKey.length,
      },
    })
  } catch (error: any) {
    console.error('Freshdesk API error:', error)
    return NextResponse.json({
      success: false,
      accounts: [],
      error: error.message || 'Unknown error',
      stack: error.stack,
    })
  }
}
