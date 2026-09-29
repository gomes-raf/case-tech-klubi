import { cars } from '../data/cars'
import { searchCars, type SearchFilters, type SearchResponse } from '../lib/search'

/**
 * Camada de dados da aplicação — as telas só conversam com ela.
 *
 * Hoje a base é o JSON local e a busca roda no navegador. Mesmo assim a interface
 * já é assíncrona e devolve o formato de uma resposta de API: se os dados forem
 * para um servidor, basta trocar o corpo por um fetch('/api/cars?...') e nenhuma
 * tela precisa mudar.
 */
export const carsService = {
  async search(filters: SearchFilters): Promise<SearchResponse> {
    return searchCars(cars, filters)
  },
}
