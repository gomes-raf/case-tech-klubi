import { describe, expect, it } from 'vitest'
import { carTitle, cars, type Car } from '../data/cars'
import { EMPTY_FILTERS, adjustFiltersFor, searchCars, type SearchFilters } from './search'

const search = (filters: Partial<SearchFilters>) =>
  searchCars(cars, { ...EMPTY_FILTERS, ...filters })

const titles = (list: Car[]) => list.map(carTitle)

const findCar = (title: string) => {
  const car = cars.find((item) => carTitle(item) === title)
  if (!car) throw new Error(`Carro não encontrado na base: ${title}`)
  return car
}

describe('busca exata', () => {
  it('cenário 1 do README: BYD Dolphin em São Paulo por ~R$ 100 mil', () => {
    const { results, nearMatches } = search({
      query: 'BYD Dolphin',
      city: 'São Paulo',
      budget: 100_000,
    })

    expect(titles(results)).toEqual(['BYD Dolphin'])
    expect(nearMatches).toEqual([])
  })

  it('ignora acentos, maiúsculas e a ordem das palavras', () => {
    expect(titles(search({ query: 'dolphin BYD', city: 'sao paulo' }).results)).toEqual([
      'BYD Dolphin',
    ])
  })

  it('aceita o modelo escrito junto ("tcross" → T-Cross)', () => {
    expect(titles(search({ query: 'tcross' }).results)).toEqual(['Volkswagen T-Cross'])
  })

  it('devolve a cidade do jeito que está na base', () => {
    expect(search({ city: 'sao paulo' }).filters.city).toBe('São Paulo')
  })

  it('sem filtros, lista todos do mais barato ao mais caro', () => {
    const prices = search({}).results.map((car) => car.Price)

    expect(prices).toHaveLength(cars.length)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('com orçamento, o preço mais próximo do valor informado vem primeiro', () => {
    expect(titles(search({ city: 'São Paulo', budget: 90_000 }).results)).toEqual([
      'Peugeot 208',
      'Hyundai HB20',
    ])
  })
})

describe('cenário 2 do README: carro existe, mas acima do orçamento', () => {
  const response = search({ query: 'BYD Dolphin', city: 'São Paulo', budget: 80_000 })

  it('mostra o carro buscado, indicando que passou do orçamento', () => {
    expect(response.results).toEqual([])
    expect(response.nearMatches).toEqual([{ car: findCar('BYD Dolphin'), misses: ['budget'] }])
  })

  it('sugere um carro parecido que cabe no orçamento, na mesma cidade', () => {
    expect(titles(response.alternatives)).toEqual(['Hyundai HB20'])
  })
})

describe('cenário 3 do README: carro existe, mas em outra cidade', () => {
  const response = search({ query: 'BYD Dolphin', city: 'Curitiba' })

  it('mostra o carro buscado, indicando a outra cidade', () => {
    expect(response.results).toEqual([])
    expect(response.nearMatches).toEqual([{ car: findCar('BYD Dolphin'), misses: ['city'] }])
  })

  it('sugere um carro da mesma categoria na cidade desejada', () => {
    expect(titles(response.alternatives)).toEqual(['Renault Kwid'])
  })

  it('também encontra o carro quando cidade e orçamento não batem', () => {
    const { nearMatches } = search({ query: 'Dolphin', city: 'Curitiba', budget: 50_000 })

    expect(nearMatches).toEqual([{ car: findCar('BYD Dolphin'), misses: ['city', 'budget'] }])
  })
})

describe('sugestões', () => {
  it('só traz as opções que pedem o menor ajuste', () => {
    // Em Curitiba até R$ 60 mil: o Kwid só passa do orçamento; os demais
    // também estão em outra cidade, então ficam de fora
    const { nearMatches } = search({ city: 'Curitiba', budget: 60_000 })

    expect(nearMatches).toEqual([{ car: findCar('Renault Kwid'), misses: ['budget'] }])
  })

  it('prioriza a mesma categoria antes do preço mais próximo', () => {
    // O Pulse (SUV) é o mais perto de R$ 100 mil, mas os hatches vêm antes
    const { alternatives } = search({ query: 'Dolphin', city: 'São Paulo', budget: 100_000 })

    expect(titles(alternatives)).toEqual(['Peugeot 208', 'Hyundai HB20', 'Fiat Pulse'])
  })

  it('sem ninguém da mesma categoria, vale o preço mais próximo', () => {
    // Nenhum sedã em São Paulo até R$ 100 mil
    const { alternatives } = search({ query: 'Corolla', city: 'São Paulo', budget: 100_000 })

    expect(titles(alternatives)).toEqual(['BYD Dolphin', 'Fiat Pulse', 'Peugeot 208'])
  })

  it('carro fora da base: sem nearMatches, mas com opções na cidade e no orçamento', () => {
    const { results, nearMatches, alternatives } = search({
      query: 'Ferrari',
      city: 'São Paulo',
      budget: 90_000,
    })

    expect(results).toEqual([])
    expect(nearMatches).toEqual([])
    expect(titles(alternatives)).toEqual(['Peugeot 208', 'Hyundai HB20'])
  })

  it('sem marca/modelo, não sugere "parecidos"', () => {
    expect(search({ city: 'São Paulo' }).alternatives).toEqual([])
  })
})

describe('adjustFiltersFor', () => {
  const dolphin = findCar('BYD Dolphin')

  it('sobe o orçamento até o preço do carro, arredondado para o milhar', () => {
    const filters = { query: 'Dolphin', city: 'São Paulo', budget: 80_000 }

    expect(adjustFiltersFor(dolphin, filters)).toEqual({ ...filters, budget: 100_000 })
  })

  it('troca a cidade quando o carro está em outro lugar', () => {
    const filters = { query: 'Dolphin', city: 'Curitiba', budget: null }

    expect(adjustFiltersFor(dolphin, filters)).toEqual({ ...filters, city: 'São Paulo' })
  })

  it('o filtro ajustado encontra o carro na busca exata', () => {
    const adjusted = adjustFiltersFor(dolphin, { query: 'Dolphin', city: 'Curitiba', budget: 50_000 })

    expect(searchCars(cars, adjusted).results).toContain(dolphin)
  })
})
