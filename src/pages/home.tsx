import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import HeroVideo from '../components/hero-video'
import { ArrowRightIcon } from '../components/icons'
import SearchForm from '../components/search/search-form'
import SearchResults from '../components/search/search-results'
import { useMediaQuery } from '../hooks/use-media-query'
import { EMPTY_FILTERS, type SearchFilters, type SearchResponse } from '../lib/search'
import { carsService } from '../services/cars-service'

// Vídeo do lado esquerdo (só no desktop). Arquivos em public/video/
const HERO_VIDEO = {
  src: '/video/hero.mp4',
  poster: '/video/hero-poster.webp',
  overlay: 'rgb(0 0 0 / 0.45)',
}

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  const [response, setResponse] = useState<SearchResponse | null>(null)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)
  const lastSearchRef = useRef(0)
  // No mobile o vídeo nem é renderizado, para não gastar dados à toa
  const isDesktop = useMediaQuery('(min-width: 64rem)')

  const handleSearch = async (search: SearchFilters) => {
    // Se as respostas chegarem fora de ordem (ex.: API lenta), só a última busca vale
    const searchId = ++lastSearchRef.current
    const data = await carsService.search(search)
    if (searchId !== lastSearchRef.current) return

    // flushSync garante que a seção já está na tela antes de rolar até ela
    flushSync(() => setResponse(data))
    const heading = resultsHeadingRef.current
    heading?.focus({ preventScroll: true })
    heading?.scrollIntoView({ block: 'start' })
  }

  return (
    <>
      <section
        id="carros"
        className="relative isolate scroll-mt-20 lg:grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,1fr)_32rem] xl:grid-cols-[minmax(0,1fr)_36rem]"
      >
        {/* Vídeo — desktop */}
        <div className="relative hidden lg:block">
          {isDesktop && <HeroVideo {...HERO_VIDEO} />}
        </div>

        {/* Busca — no desktop vira o painel da direita */}
        <div className="lg:flex lg:items-center">
          <div className="mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 md:pt-24 md:pb-28 lg:w-full lg:max-w-[26rem] lg:px-0 lg:py-12 xl:max-w-md">
            <div className="text-center lg:text-left">
              <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl lg:mx-0 lg:mt-0 lg:text-4xl xl:text-5xl">
                Seu próximo carro está a uma{' '}
                <span className="text-primary">
                  busca
                </span>{' '}
                de distância.
              </h1>


            </div>

            <div className="mx-auto mt-10 max-w-5xl md:mt-12 lg:mt-8">
              <SearchForm filters={filters} onChange={setFilters} onSubmit={handleSearch} />
            </div>

            <div className="mt-10 text-center lg:mt-6 lg:text-left">
              <a
                href="#catalogo"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground"
              >
                Ver todos os carros no catálogo
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none text-primary" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {response && <SearchResults response={response} headingRef={resultsHeadingRef} />}
    </>
  )
}
