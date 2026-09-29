import { useState } from 'react'
import HeroVideo from '../components/hero-video'
import { ArrowRightIcon } from '../components/icons'
import SearchForm from '../components/search/search-form'
import { useMediaQuery } from '../hooks/use-media-query'
import { EMPTY_FILTERS, type SearchFilters } from '../lib/search'

// Vídeo do lado esquerdo (só no desktop). Arquivos em public/video/
const HERO_VIDEO = {
  src: '/video/hero.mp4',
  poster: '/video/hero-poster.webp',
  // Camada por cima do vídeo — aceita qualquer cor CSS ou gradiente. Para testar:
  //   'rgb(0 0 0 / 0.45)'                                         preto 45%
  //   'rgb(45 48 49 / 0.6)'                                       grafite da marca (#2D3031)
  //   'rgb(254 183 60 / 0.25)'                                    amarelo da marca
  //   'linear-gradient(to right, rgb(0 0 0 / 0.65), rgb(0 0 0 / 0.25))'  mais escuro à esquerda
  overlay: 'rgb(0 0 0 / 0.45)',
}

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS)
  // No mobile o vídeo nem é renderizado, para não gastar dados à toa
  const isDesktop = useMediaQuery('(min-width: 64rem)')

  const handleSearch = (search: SearchFilters) => {
    // TODO (próximo passo): exibir os resultados da busca
    console.info('Busca:', search)
  }

  return (
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
              <span className="relative inline-block isolate">
                busca
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[0.32em] rounded-sm bg-primary"
                />
              </span>{' '}
              de distância
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted md:text-lg lg:mx-0 lg:mt-4 lg:text-base">
              Diga o modelo, a cidade e quanto quer investir.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl md:mt-12 lg:mt-8">
            <SearchForm filters={filters} onChange={setFilters} onSubmit={handleSearch} />
          </div>

          <div className="mt-10 text-center lg:mt-6 lg:text-left">
            <a
              href="#catalogo"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
            >
              Ver todos os carros no catálogo
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
