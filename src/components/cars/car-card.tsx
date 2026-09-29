import type { Car } from '../../data/cars'
import { formatCurrency } from '../../lib/format'
import { MapPinIcon } from '../icons'

export default function CarCard({ car }: { car: Car }) {
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
        <h3 className="text-lg font-semibold">
          <span className="block text-xs font-semibold tracking-wider text-muted uppercase">
            {car.Name}
          </span>{' '}
          {car.Model}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPinIcon className="size-4 shrink-0 text-(--color-primary)" />
          {car.Location}
        </p>

        <p className="mt-auto pt-6">
          <span className="block text-xs text-muted">Preço</span>
          <span className="text-2xl font-semibold tracking-tight">{formatCurrency(car.Price)}</span>
        </p>
      </div>
    </article>
  )
}
