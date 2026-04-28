export const parseCurrency = (value: string) =>
  Number(value.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'))

export const toCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
