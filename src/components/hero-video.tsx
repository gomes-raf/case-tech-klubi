import { useMediaQuery } from '../hooks/use-media-query'

type HeroVideoProps = {
  /** Caminho a partir de /public, ex.: '/video/hero.mp4' */
  src: string
  /** Primeiro frame do vídeo — aparece na hora, enquanto o vídeo carrega */
  poster?: string
  /** Camada por cima do vídeo: qualquer cor CSS ou gradiente */
  overlay?: string
}

/** Vídeo decorativo em loop, sem som, com uma camada de cor por cima */
export default function HeroVideo({ src, poster, overlay }: HeroVideoProps) {
  // Quem pediu "reduzir movimento" no sistema vê só a imagem parada (e não baixa o vídeo)
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-foreground rounded-r-2xl">
      <video
        src={src}
        poster={poster}
        autoPlay={!reduceMotion}
        preload={reduceMotion ? 'none' : 'auto'}
        muted
        loop
        playsInline
        disablePictureInPicture
        className="size-full object-cover"
      />
      {overlay && <div className="absolute inset-0" style={{ background: overlay }} />}
    </div>
  )
}
