/** Até essa diferença (em R$), o preço conta como "no orçamento" */
const MATCH_MARGIN = 1_000

export type BudgetFit = 'below' | 'match' | 'above'

/**
 * Onde o preço fica em relação ao orçamento informado.
 * Ex.: 79.000 com orçamento de 100.000 → { fit: 'below', difference: 21.000 }
 */
export function compareToBudget(price: number, budget: number): { fit: BudgetFit; difference: number } {
  const difference = Math.abs(price - budget)

  if (price > budget) return { fit: 'above', difference }
  if (difference < MATCH_MARGIN) return { fit: 'match', difference }
  return { fit: 'below', difference }
}
