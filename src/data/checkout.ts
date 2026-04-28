import type { CheckoutData, CheckoutStep } from '../types/store'

export const ALL_CATEGORIES = 'Todas'

export const initialCheckoutData: CheckoutData = {
  fullName: '',
  phone: '',
  email: '',
  cep: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  note: '',
  paymentMethod: 'Pix',
}

export const checkoutSteps: Array<{ id: CheckoutStep; label: string }> = [
  { id: 1, label: 'Dados' },
  { id: 2, label: 'Entrega' },
  { id: 3, label: 'Pagamento' },
]
