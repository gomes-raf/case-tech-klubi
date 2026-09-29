import { describe, expect, it } from 'vitest'
import { compareToBudget } from './budget'

describe('compareToBudget', () => {
  it('abaixo do orçamento', () => {
    expect(compareToBudget(79_000, 100_000)).toEqual({ fit: 'below', difference: 21_000 })
  })

  it('praticamente no valor conta como "no orçamento"', () => {
    expect(compareToBudget(99_990, 100_000)).toEqual({ fit: 'match', difference: 10 })
  })

  it('acima do orçamento', () => {
    expect(compareToBudget(99_990, 80_000)).toEqual({ fit: 'above', difference: 19_990 })
  })
})
