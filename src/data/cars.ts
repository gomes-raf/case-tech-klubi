import { slugify } from '../lib/format'
import carsJson from './cars.json'

export type Car = {
  Name: string
  Model: string
  Image: string
  Price: number
  Location: string
}

export type CarCategory = 'hatch' | 'sedan' | 'suv'

export const cars: Car[] = carsJson

/** "BYD Dolphin" */
export const carTitle = (car: Car) => `${car.Name} ${car.Model}`

/** Identificador estável para listas (o JSON não tem id): "byd-dolphin-sao-paulo" */
export const carId = (car: Car) => slugify(`${car.Name} ${car.Model} ${car.Location}`)

/**
 * Categoria de cada modelo. O JSON do desafio não traz essa informação, mas é ela
 * que permite sugerir "carros parecidos" quando o buscado não está disponível.
 */
const CATEGORY_BY_CAR: Record<string, CarCategory> = {
  'BYD Dolphin': 'hatch',
  'Chevrolet Onix': 'hatch',
  'Hyundai HB20': 'hatch',
  'Peugeot 208': 'hatch',
  'Renault Kwid': 'hatch',
  'Honda Civic': 'sedan',
  'Toyota Corolla': 'sedan',
  'Fiat Pulse': 'suv',
  'Jeep Renegade': 'suv',
  'Volkswagen T-Cross': 'suv',
}

export const carCategory = (car: Car): CarCategory | undefined => CATEGORY_BY_CAR[carTitle(car)]

/** Cidades com carros disponíveis, em ordem alfabética */
export const cities = [...new Set(cars.map((car) => car.Location))].sort(
  (a, b) => a.localeCompare(b, 'pt-BR'),
)
