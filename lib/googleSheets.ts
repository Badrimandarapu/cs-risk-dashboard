const SHEET_ID = '1hf1DESzc6ub-88V-jilbxGBe_0nu0Ssp0vaTsDKqYNA'

export interface Account {
  name: string
  company: string
  healthScore: number
  riskLevel: 'green' | 'yellow' | 'red'
  escalationProbability: number
  email: string
}

export async function getAccountsFromSheet(): Promise<Account[]> {
  try {
    // Fetch CSV from Google Sheets
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`
    
    const response = await fetch(csvUrl, { 
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!response.ok) return []

    const csv = await response.text()
    const lines = csv.split('\n')
    
    // Skip header row
    const accounts: Account[] = lines.slice(1).map((line) => {
      const [name, company, healthScore, riskLevel, escalationProbability, email] = line.split(',')
      
      return {
        name: name?.trim() || '',
        company: company?.trim() || '',
        healthScore: parseInt(healthScore) || 0,
        riskLevel: (riskLevel?.trim()?.toLowerCase() as 'green' | 'yellow' | 'red') || 'green',
        escalationProbability: parseInt(escalationProbability) / 100 || 0,
        email: email?.trim() || '',
      }
    }).filter((a) => a.name) // Remove empty rows

    return accounts
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error)
    return []
  }
}