export type Category = {
  name: string
  subtitle: string
  chip: string
}

export type ProductBadge = 'Best Seller' | 'Novidade' | 'Reposicao'

export type Product = {
  id: string
  name: string
  category: string
  price: string
  oldPrice?: string
  pix: string
  installment: string
  badge: ProductBadge
  tone: string
}

export type Review = {
  name: string
  city: string
  quote: string
  rating: number
}

export type Notification = {
  type: 'success' | 'info'
  message: string
}

export type CartItem = Product & {
  quantity: number
}

export type CheckoutStep = 1 | 2 | 3

export type PaymentMethod = 'Pix' | 'Cartao' | 'Boleto'

export type CheckoutData = {
  fullName: string
  phone: string
  email: string
  cep: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  note: string
  paymentMethod: PaymentMethod
}

export type StorefrontContent = {
  categories: Category[]
  products: Product[]
  reviews: Review[]
}

export type OrderStatus = 'new' | 'confirmed' | 'paid' | 'fulfilled' | 'canceled'

export type OrderLineItem = {
  productId: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type OrderTotals = {
  subtotal: number
  discount: number
  shipping: number | null
  total: number
  currency: 'BRL'
}

export type CheckoutOrderDraft = {
  customer: {
    fullName: string
    phone: string
    email: string
  }
  deliveryAddress: {
    cep: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
  }
  paymentMethod: PaymentMethod
  note: string
  items: OrderLineItem[]
  totals: OrderTotals
  status: OrderStatus
  source: 'storefront'
  whatsappMessage: string
  createdAt: string
}

export type SavedOrder = CheckoutOrderDraft & {
  id: string
  updatedAt: string
}

export type CouponType = 'percentage' | 'fixed'

export type Coupon = {
  code: string
  type: CouponType
  amount: number
  description: string
  isActive: boolean
  minimumSubtotal?: number
  expiresAt?: string
}

export type CouponValidation = {
  valid: boolean
  discount: number
  coupon?: Coupon
  message?: string
}

export type NewsletterLead = {
  email: string
  source: 'newsletter'
  couponCode?: string
  createdAt: string
}
