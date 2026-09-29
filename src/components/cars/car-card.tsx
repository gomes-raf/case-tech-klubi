import type { ReactNode } from 'react'
import type { Car } from '../../data/cars'
import { compareToBudget } from '../../lib/budget'
import { formatCurrency } from '../../lib/format'
import type { FilterMiss } from '../../lib/search'
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, MapPinIcon } from '../icons'

type CarCardProps = {
  car: Car
  /** Orçamento da busca — mostra se o preço fica abaixo ou acima dele */
  budget?: number | null
  /** Filtros da busca que o carro não atende (nas sugestões) */
  misses?: FilterMiss[]
  /** Nível do título, para manter a hierarquia de títulos da página */
  headingLevel?: 3 | 4
}

export default function CarCard({ car, budget = null, misses = [], headingLevel = 3 }: CarCardProps) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  const isOtherCity = misses.includes('city')
  const hasBadges = budget !== null || isOtherCity

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
      <div className="aspect-[16/10] overflow-hidden bg-background">
        {/* alt vazio: o título logo abaixo já diz qual é o carro */}
        <img
          src={car.Image}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Título à esquerda, selos empilhados à direita (quebram para baixo se faltar espaço) */}
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <div className="min-w-0">
            <Heading className="text-lg font-semibold">
              <span className="block text-xs font-semibold tracking-wider text-muted uppercase">
                {car.Name}
              </span>{' '}
              {car.Model}
            </Heading>

            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <MapPinIcon className="size-4 shrink-0 text-(--color-primary)" />
              {car.Location}
            </p>
          </div>

          {hasBadges && (
            <div className="ml-auto flex flex-col items-end gap-1.5">
              {budget !== null && <BudgetBadge price={car.Price} budget={budget} />}
              {isOtherCity && (
                <Badge tone="warning" icon={<MapPinIcon />}>
                  Em outra cidade
                </Badge>
              )}
            </div>
          )}
        </div>

        <p className="mt-auto pt-6">
          <span className="block text-xs text-muted">Preço</span>
          <span className="text-2xl font-semibold tracking-tight">{formatCurrency(car.Price)}</span>
        </p>
      </div>
    </article>
  )
}

/** Selo com a diferença entre o preço e o orçamento ("R$ 19.990 acima") */
function BudgetBadge({ price, budget }: { price: number; budget: number }) {
  const { fit, difference } = compareToBudget(price, budget)

  if (fit === 'match') {
    return (
      <Badge tone="success" icon={<CheckIcon />}>
        No seu orçamento
      </Badge>
    )
  }

  const direction = fit === 'above' ? 'acima' : 'abaixo'
  const fullText = `${formatCurrency(difference)} ${direction} do seu orçamento`

  // Texto curto para caber ao lado do título; o complemento fica no tooltip
  // e para leitores de tela
  return (
    <Badge
      tone={fit === 'above' ? 'warning' : 'success'}
      icon={fit === 'above' ? <ArrowUpIcon /> : <ArrowDownIcon />}
      title={fullText}
    >
      {formatCurrency(difference)} {direction}
      <span className="sr-only"> do seu orçamento</span>
    </Badge>
  )
}

const BADGE_TONES = {
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
}

function Badge({
  tone,
  icon,
  title,
  children,
}: {
  tone: keyof typeof BADGE_TONES
  icon: ReactNode
  title?: string
  children: ReactNode
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap [&>svg]:size-3.5 [&>svg]:shrink-0 ${BADGE_TONES[tone]}`}
    >
      {icon}
      {children}
    </span>
  )
}
