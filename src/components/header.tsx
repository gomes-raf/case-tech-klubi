import { useEffect, useState } from 'react'

// A busca é a única tela, então o header mostra só a marca.
// Catálogo, favoritos e login/cadastro ficam para os próximos passos (ver README).
export default function Header() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0)

  // Sombra no header quando a página rola
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-surface transition-shadow duration-300 ${
        scrolled ? 'border-border shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 md:h-20 lg:px-8">
        <a href="/" className="shrink-0 rounded-md">
          <img
            src="/logo-buscar.svg"
            alt="busCar — página inicial"
            width={677}
            height={230}
            className="h-9 w-auto md:h-10"
          />
        </a>
      </div>
    </header>
  )
}
