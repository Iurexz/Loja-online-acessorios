import { storeConfig } from '../config/storefront'
import type { Coupon } from '../types/store'

export const coupons: Coupon[] = [
  {
    code: storeConfig.marketing.firstPurchaseCoupon,
    type: 'percentage',
    amount: 10,
    description: '10% OFF na primeira compra',
    isActive: true,
  },
]
