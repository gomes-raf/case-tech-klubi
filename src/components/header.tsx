import { useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { label: 'Comprar carros', href: '#carros' },
  { label: 'Catálogo', href: '#catalogo' },
  { label: 'Favoritos', href: '#favoritos' },
]

const LOGIN_HREF = '/login'
const SIGNUP_HREF = '/cadastro'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Sombra no header quando a página rola
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Com o menu mobile aberto: Esc fecha e devolve o foco ao botão;
  // se a tela crescer para desktop, fecha automaticamente
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 48rem)')
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onBreakpoint)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onBreakpoint)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-surface/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled || menuOpen ? 'border-border shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-10 px-4 sm:px-6 md:h-20 lg:px-8">
        <a href="/" className="shrink-0 rounded-md" onClick={closeMenu}>
          <img
            src="/logo-buscar.svg"
            alt="busCar — página inicial"
            width={677}
            height={230}
            className="h-9 w-auto md:h-10"
          />
        </a>

        {/* Navegação desktop */}
        <nav aria-label="Menu principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative p-2 text-sm font-medium text-muted transition-colors hover:text-foreground hover:bg-black/5 rounded-full transition:colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Ações desktop */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <a
            href={LOGIN_HREF}
            className="inline-flex h-10 items-center rounded-full px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            Entrar
          </a>
          <a
            href={SIGNUP_HREF}
            className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover active:scale-[0.98] motion-reduce:transition-none"
          >
            Criar conta
          </a>
        </div>

        {/* Botão do menu mobile */}
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((open) => !open)}
          className="-mr-2 ml-auto inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-foreground/5 md:hidden"
        >
          <span aria-hidden="true" className="relative block h-3.5 w-5">
            <span
              className={`absolute top-0 left-0 h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 motion-reduce:transition-none ${
                menuOpen ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute top-1.5 left-0 h-0.5 w-5 rounded-full bg-foreground transition-opacity duration-200 motion-reduce:transition-none ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute top-3 left-0 h-0.5 w-5 rounded-full bg-foreground transition-transform duration-300 motion-reduce:transition-none ${
                menuOpen ? '-translate-y-1.5 -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        inert={!menuOpen}
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none md:hidden ${
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Menu principal" className="border-t border-border px-4 pt-2 pb-6 sm:px-6">
            <ul className="-mx-3 flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-foreground/5"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-3 border-t border-border pt-5">
              <a
                href={LOGIN_HREF}
                onClick={closeMenu}
                className="inline-flex h-12 items-center justify-center rounded-full border border-border text-base font-medium text-foreground transition-colors hover:bg-foreground/5"
              >
                Entrar
              </a>
              <a
                href={SIGNUP_HREF}
                onClick={closeMenu}
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-hover"
              >
                Criar conta
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
