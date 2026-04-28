import { parseCurrency, toCurrency } from '../lib/currency'
import type { CartItem, CheckoutData, CheckoutOrderDraft } from '../types/store'

export const formatCheckoutWhatsAppMessage = (
  checkoutData: CheckoutData,
  cartItems: CartItem[],
  cartTotal: number,
) => {
  const lines = cartItems.map(
    (item) =>
      `- ${item.name} x${item.quantity} (${toCurrency(
        parseCurrency(item.price) * item.quantity,
      )})`,
  )

  return [
    'Oi! Quero finalizar meu pedido:',
    '',
    'Cliente:',
    `Nome: ${checkoutData.fullName || 'Nao informado'}`,
    `Telefone: ${checkoutData.phone || 'Nao informado'}`,
    `Email: ${checkoutData.email || 'Nao informado'}`,
    '',
    'Entrega:',
    `CEP: ${checkoutData.cep || 'Nao informado'}`,
    `Endereco: ${checkoutData.street || 'Nao informado'}, ${checkoutData.number || 's/n'}`,
    `Bairro: ${checkoutData.neighborhood || 'Nao informado'}`,
    `Cidade/UF: ${checkoutData.city || 'Nao informado'} - ${checkoutData.state || '--'}`,
    '',
    `Pagamento: ${checkoutData.paymentMethod}`,
    checkoutData.note ? `Observacoes: ${checkoutData.note}` : '',
    '',
    'Itens:',
    ...lines,
    '',
    `Total: ${toCurrency(cartTotal)}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export const createOrderDraft = (
  checkoutData: CheckoutData,
  cartItems: CartItem[],
  cartTotal: number,
  whatsappMessage: string,
): CheckoutOrderDraft => {
  const items = cartItems.map((item) => {
    const unitPrice = parseCurrency(item.price)

    return {
      productId: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
    }
  })

  return {
    customer: {
      fullName: checkoutData.fullName.trim(),
      phone: checkoutData.phone.trim(),
      email: checkoutData.email.trim(),
    },
    deliveryAddress: {
      cep: checkoutData.cep.trim(),
      street: checkoutData.street.trim(),
      number: checkoutData.number.trim(),
      neighborhood: checkoutData.neighborhood.trim(),
      city: checkoutData.city.trim(),
      state: checkoutData.state.trim(),
    },
    paymentMethod: checkoutData.paymentMethod,
    note: checkoutData.note.trim(),
    items,
    totals: {
      subtotal: cartTotal,
      discount: 0,
      shipping: null,
      total: cartTotal,
      currency: 'BRL',
    },
    status: 'new',
    source: 'storefront',
    whatsappMessage,
    createdAt: new Date().toISOString(),
  }
}
