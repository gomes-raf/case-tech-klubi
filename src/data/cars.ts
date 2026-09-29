import { slugify } from '../lib/format'
import carsJson from './cars.json'

export type Car = {
  Name: string
  Model: string
  Image: string
  Price: number
  Location: string
}

export const cars: Car[] = carsJson

/** "BYD Dolphin" */
export const carTitle = (car: Car) => `${car.Name} ${car.Model}`

/** Identificador estável para listas (o JSON não tem id): "byd-dolphin-sao-paulo" */
export const carId = (car: Car) => slugify(`${car.Name} ${car.Model} ${car.Location}`)

/** Cidades com carros disponíveis, em ordem alfabética */
export const cities = [...new Set(cars.map((car) => car.Location))].sort(
  (a, b) => a.localeCompare(b, 'pt-BR'),
)
