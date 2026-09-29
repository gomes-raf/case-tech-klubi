const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('pt-BR')

/** 99990 → "R$ 99.990" */
export const formatCurrency = (value: number) => currencyFormatter.format(value)

/** 99990 → "99.990" */
export const formatNumber = (value: number) => numberFormatter.format(value)

/** Remove acentos e deixa minúsculo: "São Paulo" → "sao paulo" */
export const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
