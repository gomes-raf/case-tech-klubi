import { useId, type ReactNode, type Ref } from 'react'
import { carId } from '../../data/cars'
import { formatCurrency } from '../../lib/format'
import { EMPTY_FILTERS, type SearchFilters, type SearchResponse } from '../../lib/search'
import CarCard from '../cars/car-card'
import { CarIcon, MapPinIcon, WalletIcon } from '../icons'

type SearchResultsProps = {
  response: SearchResponse
  /** Recebe o foco após cada busca, para leitores de tela anunciarem o resultado */
  headingRef: Ref<HTMLHeadingElement>
  /** Refaz a busca com outros filtros (botão "Ver todos os carros" do estado vazio) */
  onApplyFilters: (filters: SearchFilters) => void
}

export default function SearchResults({ response, headingRef, onApplyFilters }: SearchResultsProps) {
  const headingId = useId()
  const { filters, results, nearMatches, alternatives } = response
  const hasResults = results.length > 0
  const isEmpty = !hasResults && nearMatches.length === 0 && alternatives.length === 0

  return (
    <section aria-labelledby={headingId} className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2
          id={headingId}
          ref={headingRef}
          tabIndex={-1}
          className="scroll-mt-24 text-2xl font-semibold tracking-tight outline-none md:scroll-mt-28 md:text-3xl"
        >
          {getTitle(response)}
        </h2>

        <AppliedFilters filters={filters} />

        <div className="mt-8 space-y-14">
          {hasResults && (
            <CarGrid>
              {results.map((car) => (
                <li key={carId(car)}>
                  <CarCard car={car} budget={filters.budget} />
                </li>
              ))}
            </CarGrid>
          )}

          {/* Casos 2 e 3: o carro buscado existe, mas fora da cidade e/ou do orçamento */}
          {nearMatches.length > 0 && (
            <ResultGroup
              title={filters.query ? 'O carro que você procura' : 'Os mais próximos da sua busca'}
              description="Fica fora de algum dos seus filtros — os selos mostram o que muda."
            >
              {nearMatches.map((match) => (
                <li key={carId(match.car)}>
                  <CarCard
                    car={match.car}
                    budget={filters.budget}
                    misses={match.misses}
                    headingLevel={4}
                  />
                </li>
              ))}
            </ResultGroup>
          )}

          {alternatives.length > 0 && (
            <ResultGroup
              title={getAlternativesTitle(response)}
              description={
                hasResults || nearMatches.length > 0
                  ? 'Outros modelos que cabem nos seus filtros.'
                  : `Não encontramos “${filters.query}”, mas estes cabem na sua busca.`
              }
            >
              {alternatives.map((car) => (
                <li key={carId(car)}>
                  <CarCard car={car} budget={filters.budget} headingLevel={4} />
                </li>
              ))}
            </ResultGroup>
          )}

          {isEmpty && <EmptyState onShowAll={() => onApplyFilters(EMPTY_FILTERS)} />}
        </div>
      </div>
    </section>
  )
}

function getTitle({ results, nearMatches, alternatives }: SearchResponse) {
  const total = results.length
  if (total > 0) return `${total} ${total === 1 ? 'carro encontrado' : 'carros encontrados'}`
  if (nearMatches.length > 0) return 'Nenhum resultado exato, mas chegamos perto'
  if (alternatives.length > 0) return 'Nenhum resultado exato'
  return 'Nenhum carro encontrado'
}

/** "Parecidos em São Paulo até R$ 80.000" */
function getAlternativesTitle({ filters, results, nearMatches }: SearchResponse) {
  // Sem o modelo buscado na base, as opções não são "parecidas" com nada
  let title = results.length > 0 || nearMatches.length > 0 ? 'Parecidos' : 'Outras opções'
  if (filters.city) title += ` em ${filters.city}`
  if (filters.budget !== null) title += ` até ${formatCurrency(filters.budget)}`
  return title
}

function ResultGroup({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  const titleId = useId()

  return (
    <section aria-labelledby={titleId}>
      <h3 id={titleId} className="text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <CarGrid className="mt-6">{children}</CarGrid>
    </section>
  )
}

function CarGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <ul className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>{children}</ul>
}

function EmptyState({ onShowAll }: { onShowAll: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-primary-soft text-foreground">
        <CarIcon className="size-6" />
      </span>
      <p className="mt-4 font-semibold">Não achamos nada parecido com essa busca.</p>
      <p className="mt-1 text-sm text-muted">Tente outra cidade ou um orçamento maior.</p>
      <button
        type="button"
        onClick={onShowAll}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5"
      >
        Ver todos os carros
      </button>
    </div>
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
