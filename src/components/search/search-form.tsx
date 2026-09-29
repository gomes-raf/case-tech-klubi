import { carTitle, cars, cities } from '../../data/cars'
import type { SearchFilters } from '../../lib/search'
import { CarIcon, MapPinIcon, SearchIcon } from '../icons'
import Combobox, { type ComboboxOption } from './combobox'
import PriceInput from './price-input'

const CAR_OPTIONS: ComboboxOption[] = [...new Set(cars.map(carTitle))].map((value) => ({ value }))

const CITY_OPTIONS: ComboboxOption[] = cities.map((city) => {
  const total = cars.filter((car) => car.Location === city).length
  return { value: city, description: `${total} ${total === 1 ? 'carro' : 'carros'}` }
})

type SearchFormProps = {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  onSubmit: (filters: SearchFilters) => void
}

export default function SearchForm({ filters, onChange, onSubmit }: SearchFormProps) {
  const update = (patch: Partial<SearchFilters>) => onChange({ ...filters, ...patch })

  return (
    <form
      role="search"
      aria-label="Buscar carros"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(filters)
      }}
      className="flex flex-col gap-1 rounded-3xl border border-border bg-surface p-2 shadow-xl shadow-foreground/5 md:flex-row md:items-center lg:flex-col lg:items-stretch lg:shadow-sm"
    >
      <Combobox
        label="Carro"
        placeholder="Marca ou modelo"
        icon={<CarIcon />}
        value={filters.query}
        onChange={(query) => update({ query })}
        options={CAR_OPTIONS}
        maxResults={8}
        className="md:flex-[1.4] lg:flex-none"
      />
      <Divider />
      <Combobox
        label="Localização"
        placeholder="Qualquer cidade"
        icon={<MapPinIcon />}
        value={filters.city}
        onChange={(city) => update({ city })}
        options={CITY_OPTIONS}
        className="md:flex-1 lg:flex-none"
      />
      <Divider />
      <PriceInput
        label="Orçamento"
        placeholder="Valor aproximado"
        value={filters.budget}
        onChange={(budget) => update({ budget })}
        className="md:flex-1 lg:flex-none"
      />

      <button
        type="submit"
        className="mt-1 inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-primary px-7 font-semibold text-on-primary transition hover:bg-primary-hover active:scale-[0.98] motion-reduce:transition-none md:mt-0 md:ml-1 md:h-14 lg:mt-1 lg:ml-0 lg:h-12"
      >
        <SearchIcon className="size-5" />
        Buscar
      </button>
    </form>
  )
}

function Divider() {
  return <span aria-hidden="true" className="mx-4 h-px bg-border md:mx-0 md:h-8 md:w-px md:shrink-0 lg:mx-4 lg:h-px lg:w-auto" />
}
