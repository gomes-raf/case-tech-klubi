import type { ReactNode } from 'react'
import { XIcon } from '../icons'

type SearchFieldProps = {
  inputId: string
  labelId: string
  label: string
  icon: ReactNode
  /** O <input> do campo */
  children: ReactNode
  /** Mostra o botão de limpar */
  showClear: boolean
  onClear: () => void
  /** Conteúdo flutuante (ex.: lista de sugestões) */
  popup?: ReactNode
  className?: string
}

/** "Casca" visual compartilhada pelos campos da barra de busca */
export default function SearchField({
  inputId,
  labelId,
  label,
  icon,
  children,
  showClear,
  onClear,
  popup,
  className = '',
}: SearchFieldProps) {
  return (
    <div
      className={`relative min-w-0 rounded-2xl transition-colors focus-within:bg-primary-soft focus-within:ring-2 focus-within:ring-primary hover:not-focus-within:bg-background ${className}`}
    >
      <label htmlFor={inputId} className="flex cursor-text items-center gap-3 py-3 pr-12 pl-4">
        <span className="shrink-0 text-muted [&>svg]:size-5">{icon}</span>
        <span className="min-w-0 flex-1">
          <span id={labelId} className="block text-xs font-semibold text-foreground">
            {label}
          </span>
          {children}
        </span>
      </label>

      {showClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={`Limpar ${label.toLowerCase()}`}
          className="absolute top-1/2 right-3 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <XIcon className="size-4" />
        </button>
      )}

      {popup}
    </div>
  )
}
