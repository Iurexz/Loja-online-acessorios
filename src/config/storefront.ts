export const storeConfig = {
  brandName: 'Adry',
  contact: {
    whatsappNumber: '5571900000000',
    whatsappDisplay: '(71) 90000-0000',
    email: 'contato@adryacessorios.com',
    city: 'Salvador - BA',
    hours: 'Seg a Sex \u00b7 08h as 17h',
  },
  marketing: {
    firstPurchaseCoupon: 'PRIMEIRACOMPRA10',
    pixDiscountPercent: 3,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '',
  },
} as const

export const buildWhatsAppUrl = (message?: string) => {
  const baseUrl = `https://wa.me/${storeConfig.contact.whatsappNumber}`

  if (!message) {
    return baseUrl
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`
}
