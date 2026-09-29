import type { Car } from '../data/cars'
import { toSearchable } from './format'

export type SearchFilters = {
  /** Marca e/ou modelo digitado pelo usuário */
  query: string
  /** Cidade desejada ('' = qualquer cidade) */
  city: string
  /** Valor aproximado que o usuário quer pagar (null = sem orçamento) */
  budget: number | null
}

export const EMPTY_FILTERS: SearchFilters = { query: '', city: '', budget: null }

/** Resposta de uma busca — o mesmo formato que uma API devolveria */
export type SearchResponse = {
  /** Filtros efetivamente usados (já limpos) */
  filters: SearchFilters
  /** Carros que atendem a todos os filtros */
  results: Car[]
}

/**
 * Marca/modelo: toda palavra digitada precisa aparecer em "Marca Modelo",
 * em qualquer ordem ("byd dolphin", "dolphin", "Dólphin").
 */
export function matchesQuery(car: Car, query: string) {
  const term = toSearchable(query)
  if (!term) return true

  const carText = toSearchable(`${car.Name} ${car.Model}`)
  const hasEveryWord = term.split(' ').every((word) => carText.includes(word))

  // Também aceita escrito junto: "tcross" → "T-Cross"
  const joined = (text: string) => text.replaceAll(' ', '')
  return hasEveryWord || joined(carText).includes(joined(term))
}

/** Cidade: ignora acentos e maiúsculas ("sao paulo" → "São Paulo") */
export function matchesCity(car: Car, city: string) {
  const term = toSearchable(city)
  return !term || toSearchable(car.Location).includes(term)
}

/** Orçamento: o preço não pode passar do valor informado */
export function fitsBudget(car: Car, budget: number | null) {
  return budget === null || car.Price <= budget
}

/** Limpa o que veio do formulário (espaços sobrando, orçamento zerado) */
export function cleanFilters(filters: SearchFilters): SearchFilters {
  return {
    query: filters.query.trim(),
    city: filters.city.trim(),
    budget: filters.budget && filters.budget > 0 ? filters.budget : null,
  }
}

/**
 * Busca exata: devolve só os carros que atendem a todos os filtros.
 *
 * Ordenação: com orçamento, o preço mais próximo do valor informado vem primeiro
 * (o usuário disse "valor aproximado"); sem orçamento, do mais barato ao mais caro.
 */
export function searchCars(cars: Car[], rawFilters: SearchFilters): SearchResponse {
  const filters = cleanFilters(rawFilters)
  const { budget } = filters

  // "sao paulo" digitado → devolve "São Paulo", do jeito que está na base
  const knownCity = cars.find((car) => toSearchable(car.Location) === toSearchable(filters.city))
  if (knownCity) filters.city = knownCity.Location

  const results = cars
    .filter(
      (car) =>
        matchesQuery(car, filters.query) &&
        matchesCity(car, filters.city) &&
        fitsBudget(car, budget),
    )
    .sort((a, b) =>
      budget === null
        ? a.Price - b.Price
        : Math.abs(a.Price - budget) - Math.abs(b.Price - budget),
    )

  return { filters, results }
}
