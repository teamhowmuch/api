export type ConnectionProvider = 'nordigen'

export interface NordigenBank {
  id: string
  name: string
  bic: string
  transaction_total_days: string
  countries: string[]
  logo: string
}
