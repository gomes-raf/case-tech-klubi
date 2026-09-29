import { useCallback, useSyncExternalStore } from 'react'

/** true enquanto a media query casar, ex.: useMediaQuery('(min-width: 64rem)') */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}
