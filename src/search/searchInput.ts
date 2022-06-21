export interface SearchInput {
  limit?: number
  offset?: number
  orderByDirection?: 'ASC' | 'DESC'
  orderByField?: string
}
