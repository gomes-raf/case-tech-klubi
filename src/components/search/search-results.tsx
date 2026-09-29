import { useId, type ReactNode, type Ref } from 'react'
import { carId } from '../../data/cars'
import { formatCurrency } from '../../lib/format'
import type { SearchFilters, SearchResponse } from '../../lib/search'
import CarCard from '../cars/car-card'
import { CarIcon, MapPinIcon, WalletIcon } from '../icons'

type SearchResultsProps = {
  response: SearchResponse
  /** Recebe o foco após cada busca, para leitores de tela anunciarem o resultado */
  headingRef: Ref<HTMLHeadingElement>
}

export default function SearchResults({ response, headingRef }: SearchResultsProps) {
  const headingId = useId()
  const { filters, results } = response
  const total = results.length

  return (
    <section aria-labelledby={headingId} className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="scroll-mt-24 text-2xl font-semibold tracking-tight outline-none md:scroll-mt-28 md:text-3xl"
        >
          {total === 0
            ? 'Nenhum carro encontrado'
            : `${total} ${total === 1 ? 'carro encontrado' : 'carros encontrados'}`}
        </h2>

        <AppliedFilters filters={filters} />

        {total > 0 ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((car) => (
              <li key={carId(car)}>
                <CarCard car={car} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-foreground">
              <CarIcon className="size-6" />
            </span>
            <p className="mt-4 font-semibold">Não achamos um carro com todos esses filtros.</p>
            <p className="mt-1 text-sm text-muted">
              Tente outra cidade ou um orçamento um pouco maior.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/** Resumo do que foi buscado: [BYD Dolphin] [São Paulo] [Até R$ 100.000] */
function AppliedFilters({ filters }: { filters: SearchFilters }) {
  const chips: { icon: ReactNode; label: string }[] = []
  if (filters.query) chips.push({ icon: <CarIcon />, label: filters.query })
  if (filters.city) chips.push({ icon: <MapPinIcon />, label: filters.city })
  if (filters.budget !== null) {
    chips.push({ icon: <WalletIcon />, label: `Até ${formatCurrency(filters.budget)}` })
  }

  if (chips.length === 0) {
    return <p className="mt-2 text-muted">Mostrando todos os carros disponíveis.</p>
  }

  return (
    <ul aria-label="Filtros da busca" className="mt-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li
          key={chip.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm text-foreground [&>svg]:size-4 [&>svg]:text-muted"
        >
          {chip.icon}
          {chip.label}
        </li>
      ))}
    </ul>
  )
}
