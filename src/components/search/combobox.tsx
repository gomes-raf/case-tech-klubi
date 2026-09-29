import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { normalizeText } from '../../lib/format'
import SearchField from './search-field'

export type ComboboxOption = {
  value: string
  /** Texto de apoio à direita (ex.: preço, quantidade) */
  description?: string
}

type ComboboxProps = {
  label: string
  placeholder: string
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  options: ComboboxOption[]
  maxResults?: number
  className?: string
}

/**
 * Campo de texto livre com sugestões (padrão ARIA combobox).
 * Setas navegam, Enter escolhe, Esc fecha.
 */
export default function Combobox({
  label,
  placeholder,
  icon,
  value,
  onChange,
  options,
  maxResults = 6,
  className,
}: ComboboxProps) {
  const id = useId()
  const inputId = `${id}-input`
  const labelId = `${id}-label`
  const listId = `${id}-list`
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const term = normalizeText(value.trim())
  const isExactMatch = options.some((option) => normalizeText(option.value) === term)
  // Sem texto (ou com uma opção já escolhida) mostra todas as sugestões
  const suggestions = (
    term && !isExactMatch
      ? options.filter((option) => normalizeText(option.value).includes(term))
      : options
  ).slice(0, maxResults)

  const isListVisible = open && suggestions.length > 0
  const active = activeIndex < suggestions.length ? activeIndex : -1

  const close = () => {
    setOpen(false)
    setActiveIndex(-1)
  }

  const choose = (option: ComboboxOption) => {
    onChange(option.value)
    close()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setOpen(true)
        setActiveIndex((index) => (index + 1) % suggestions.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setOpen(true)
        setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1))
        break
      case 'Enter':
        // Com uma sugestão destacada, Enter escolhe; senão, envia o formulário
        if (isListVisible && active >= 0) {
          event.preventDefault()
          choose(suggestions[active])
        }
        break
      case 'Escape':
        if (isListVisible) {
          event.preventDefault()
          close()
        }
        break
      case 'Tab':
        close()
        break
    }
  }

  return (
    <SearchField
      inputId={inputId}
      labelId={labelId}
      label={label}
      icon={icon}
      className={className}
      showClear={value !== ''}
      onClear={() => {
        onChange('')
        inputRef.current?.focus()
      }}
      popup={
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          hidden={!isListVisible}
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-lg"
        >
          {suggestions.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(option)}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                index === active ? 'bg-primary-soft' : ''
              }`}
            >
              <span className="truncate text-foreground">
                <Highlight text={option.value} term={value} />
              </span>
              {option.description && (
                <span className="shrink-0 text-xs text-muted">{option.description}</span>
              )}
            </li>
          ))}
        </ul>
      }
    >
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-labelledby={labelId}
        aria-autocomplete="list"
        aria-expanded={isListVisible}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${id}-option-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
          setOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={close}
        onKeyDown={handleKeyDown}
        className="w-full truncate bg-transparent text-base text-foreground outline-none placeholder:text-muted md:text-sm"
      />
    </SearchField>
  )
}

/** Deixa em negrito o trecho que casa com o que foi digitado (ignorando acentos) */
function Highlight({ text, term }: { text: string; term: string }) {
  const normalizedText = normalizeText(text)
  const normalizedTerm = normalizeText(term.trim())
  const start = normalizedTerm ? normalizedText.indexOf(normalizedTerm) : -1

  if (start < 0 || normalizedText.length !== text.length) return text

  const end = start + normalizedTerm.length
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-transparent font-semibold text-foreground">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  )
}
