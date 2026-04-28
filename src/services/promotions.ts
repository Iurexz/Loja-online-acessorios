import { coupons } from '../data/promotions'
import type { Coupon, CouponValidation } from '../types/store'

export const normalizeCouponCode = (code: string) => code.trim().toUpperCase()

export const calculateCouponDiscount = (coupon: Coupon, subtotal: number) => {
  if (coupon.type === 'fixed') {
    return Math.min(coupon.amount, subtotal)
  }

  return Math.min((subtotal * coupon.amount) / 100, subtotal)
}

export const validateCoupon = (code: string, subtotal: number): CouponValidation => {
  const coupon = coupons.find((item) => item.code === normalizeCouponCode(code))

  if (!coupon) {
    return {
      valid: false,
      discount: 0,
      message: 'Cupom nao encontrado.',
    }
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      discount: 0,
      coupon,
      message: 'Cupom inativo.',
    }
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return {
      valid: false,
      discount: 0,
      coupon,
      message: 'Cupom expirado.',
    }
  }

  if (coupon.minimumSubtotal && subtotal < coupon.minimumSubtotal) {
    return {
      valid: false,
      discount: 0,
      coupon,
      message: 'Valor minimo do cupom nao atingido.',
    }
  }

  return {
    valid: true,
    discount: calculateCouponDiscount(coupon, subtotal),
    coupon,
  }
}
