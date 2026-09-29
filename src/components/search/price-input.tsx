import { useId, useRef } from 'react'
import { formatNumber } from '../../lib/format'
import { WalletIcon } from '../icons'
import SearchField from './search-field'

type PriceInputProps = {
  label: string
  placeholder: string
  value: number | null
  onChange: (value: number | null) => void
  className?: string
}

const MAX_DIGITS = 7 // até R$ 9.999.999

/** Campo de valor em reais com máscara (100000 → "100.000") */
export default function PriceInput({ label, placeholder, value, onChange, className }: PriceInputProps) {
  const id = useId()
  const inputId = `${id}-input`
  const labelId = `${id}-label`
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <SearchField
      inputId={inputId}
      labelId={labelId}
      label={label}
      icon={<WalletIcon />}
      className={className}
      showClear={value !== null}
      onClear={() => {
        onChange(null)
        inputRef.current?.focus()
      }}
    >
      <span className="flex items-baseline gap-1">
        {value !== null && <span className="text-base text-foreground md:text-sm">R$</span>}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-labelledby={labelId}
          placeholder={placeholder}
          value={value === null ? '' : formatNumber(value)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '').slice(0, MAX_DIGITS)
            onChange(digits ? Number(digits) : null)
          }}
          className="w-full min-w-0 truncate bg-transparent text-base text-foreground outline-none placeholder:text-muted md:text-sm"
        />
      </span>
    </SearchField>
  )
}
