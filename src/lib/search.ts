export type SearchFilters = {
  /** Marca e/ou modelo digitado pelo usuário */
  query: string
  /** Cidade desejada ('' = qualquer cidade) */
  city: string
  /** Valor aproximado que o usuário quer pagar (null = sem orçamento) */
  budget: number | null
}

export const EMPTY_FILTERS: SearchFilters = { query: '', city: '', budget: null }
