import { carCategory, type Car } from '../data/cars'
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

/** Filtro que um carro não atendeu */
export type FilterMiss = 'city' | 'budget'

/** O carro buscado, mas fora de algum filtro (ex.: em outra cidade) */
export type NearMatch = {
  car: Car
  /** O que impediu o carro de aparecer na busca exata */
  misses: FilterMiss[]
}

/** Resposta de uma busca — o mesmo formato que uma API devolveria */
export type SearchResponse = {
  /** Filtros efetivamente usados (já limpos) */
  filters: SearchFilters
  /** Carros que atendem a todos os filtros */
  results: Car[]
  /**
   * Só quando `results` vem vazio: o carro buscado acima do orçamento e/ou em outra
   * cidade (casos 2 e 3 do desafio). Traz apenas as opções que pedem o menor ajuste.
   */
  nearMatches: NearMatch[]
  /** Outros modelos que cabem na cidade e no orçamento, parecidos com o buscado */
  alternatives: Car[]
}

const MAX_NEAR_MATCHES = 6
const MAX_ALTERNATIVES = 3

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

/** Quais filtros de cidade e orçamento o carro deixa de atender */
export function getMisses(car: Car, filters: SearchFilters): FilterMiss[] {
  const misses: FilterMiss[] = []
  if (!matchesCity(car, filters.city)) misses.push('city')
  if (!fitsBudget(car, filters.budget)) misses.push('budget')
  return misses
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
 * Busca em camadas:
 * 1. `results` — o que atende a tudo. Com orçamento, o preço mais próximo do valor
 *    informado vem primeiro (o usuário disse "valor aproximado"); sem, do mais barato.
 * 2. `nearMatches` — se nada atende, o carro buscado fora da cidade e/ou do orçamento.
 * 3. `alternatives` — outros modelos parecidos que atendem à cidade e ao orçamento.
 */
export function searchCars(cars: Car[], rawFilters: SearchFilters): SearchResponse {
  const filters = cleanFilters(rawFilters)

  // "sao paulo" digitado → devolve "São Paulo", do jeito que está na base
  const knownCity = cars.find((car) => toSearchable(car.Location) === toSearchable(filters.city))
  if (knownCity) filters.city = knownCity.Location

  // O que o usuário quer (marca/modelo), independentemente de cidade e preço
  const wanted = cars.filter((car) => matchesQuery(car, filters.query))

  const results = wanted
    .filter((car) => getMisses(car, filters).length === 0)
    .sort(byPriceCloseTo(filters.budget))

  return {
    filters,
    results,
    nearMatches: results.length > 0 ? [] : findNearMatches(wanted, filters),
    alternatives: filters.query ? findAlternatives(cars, wanted, filters) : [],
  }
}

/** Casos 2 e 3: o carro existe, mas acima do orçamento e/ou em outra cidade */
function findNearMatches(wanted: Car[], filters: SearchFilters): NearMatch[] {
  const candidates = wanted.map((car) => ({ car, misses: getMisses(car, filters) }))

  // Fica só com o que pede o menor ajuste: se trocar só a cidade já resolve,
  // não vale mostrar também o que ainda estoura o orçamento
  const fewestMisses = Math.min(...candidates.map(({ misses }) => misses.length))
  const byPrice = byPriceCloseTo(filters.budget)

  return candidates
    .filter(({ misses }) => misses.length === fewestMisses)
    .sort((a, b) => byPrice(a.car, b.car))
    .slice(0, MAX_NEAR_MATCHES)
}

/**
 * "Parecidos": outros modelos que atendem à cidade e ao orçamento.
 * Mesma categoria do buscado primeiro (hatch, sedã, SUV), depois o preço mais próximo
 * do orçamento — ou, sem orçamento, do preço do carro buscado.
 */
function findAlternatives(cars: Car[], wanted: Car[], filters: SearchFilters): Car[] {
  const wantedCategories = new Set(wanted.map(carCategory))
  const wantedPrice = wanted.length > 0 ? Math.min(...wanted.map((car) => car.Price)) : null
  const byPrice = byPriceCloseTo(filters.budget ?? wantedPrice)

  const categoryRank = (car: Car) => {
    const category = carCategory(car)
    return category && wantedCategories.has(category) ? 0 : 1
  }

  return cars
    .filter((car) => !wanted.includes(car) && getMisses(car, filters).length === 0)
    .sort((a, b) => categoryRank(a) - categoryRank(b) || byPrice(a, b))
    .slice(0, MAX_ALTERNATIVES)
}

/** Ordena pelo preço mais próximo do alvo; sem alvo, do mais barato ao mais caro */
const byPriceCloseTo = (target: number | null) => (a: Car, b: Car) =>
  target === null ? a.Price - b.Price : Math.abs(a.Price - target) - Math.abs(b.Price - target)
