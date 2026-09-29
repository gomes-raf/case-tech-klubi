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

/** Cidades com carros disponíveis, em ordem alfabética */
export const cities = [...new Set(cars.map((car) => car.Location))].sort(
  (a, b) => a.localeCompare(b, 'pt-BR'),
)
