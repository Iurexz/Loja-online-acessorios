import { storeConfig } from '../config/storefront'
import { categories, products as seedProducts, reviews, storefrontContent } from '../data/catalog'
import { coupons } from '../data/promotions'
import { validateCoupon } from './promotions'
import type {
  CheckoutOrderDraft,
  Coupon,
  CouponValidation,
  NewsletterLead,
  OrderStatus,
  Product,
  SavedOrder,
  StorefrontContent,
} from '../types/store'

export type ProductPayload = Omit<Product, 'id'> & {
  id?: string
}

export type StoreRepository = {
  getStorefront: () => Promise<StorefrontContent>
  listProducts: () => Promise<Product[]>
  createProduct: (product: ProductPayload) => Promise<Product>
  updateProduct: (id: string, product: Partial<ProductPayload>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  createOrder: (order: CheckoutOrderDraft) => Promise<SavedOrder>
  listOrders: () => Promise<SavedOrder[]>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<SavedOrder>
  subscribeNewsletter: (lead: NewsletterLead) => Promise<void>
  validateCoupon: (code: string, subtotal: number) => Promise<CouponValidation>
  listCoupons: () => Promise<Coupon[]>
  upsertCoupon: (coupon: Coupon) => Promise<Coupon>
}

const localProductStorageKey = 'adry.products.v1'
const localOrderStorageKey = 'adry.orders.v1'
const localNewsletterStorageKey = 'adry.newsletter.v1'
const localCouponStorageKey = 'adry.coupons.v1'

const isBrowser = () => typeof window !== 'undefined'

const createId = (prefix: string) => {
  if (isBrowser() && window.crypto?.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}`
}

const readStorage = <T,>(key: string, fallback: T): T => {
  if (!isBrowser()) {
    return fallback
  }

  try {
    const rawValue = window.localStorage.getItem(key)
    return rawValue ? (JSON.parse(rawValue) as T) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = <T,>(key: string, value: T) => {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

const getLocalProducts = () => readStorage<Product[]>(localProductStorageKey, [])

const getLocalCoupons = () => readStorage<Coupon[]>(localCouponStorageKey, coupons)

const createLocalStoreRepository = (): StoreRepository => ({
  async getStorefront() {
    return {
      ...storefrontContent,
      categories,
      products: await this.listProducts(),
      reviews,
    }
  },

  async listProducts() {
    return [...seedProducts, ...getLocalProducts()]
  },

  async createProduct(product) {
    const storedProducts = getLocalProducts()
    const savedProduct: Product = {
      ...product,
      id: product.id ?? createId('product'),
    }

    writeStorage(localProductStorageKey, [...storedProducts, savedProduct])
    return savedProduct
  },

  async updateProduct(id, product) {
    const storedProducts = getLocalProducts()
    const storedIndex = storedProducts.findIndex((item) => item.id === id)
    const currentProduct = storedProducts[storedIndex] ?? seedProducts.find((item) => item.id === id)

    if (!currentProduct) {
      throw new Error(`Produto ${id} nao encontrado.`)
    }

    const updatedProduct: Product = {
      ...currentProduct,
      ...product,
      id,
    }

    if (storedIndex >= 0) {
      storedProducts[storedIndex] = updatedProduct
      writeStorage(localProductStorageKey, storedProducts)
    } else {
      writeStorage(localProductStorageKey, [...storedProducts, updatedProduct])
    }

    return updatedProduct
  },

  async deleteProduct(id) {
    writeStorage(
      localProductStorageKey,
      getLocalProducts().filter((product) => product.id !== id),
    )
  },

  async createOrder(order) {
    const orders = readStorage<SavedOrder[]>(localOrderStorageKey, [])
    const timestamp = new Date().toISOString()
    const savedOrder: SavedOrder = {
      ...order,
      id: createId('order'),
      updatedAt: timestamp,
    }

    writeStorage(localOrderStorageKey, [savedOrder, ...orders])
    return savedOrder
  },

  async listOrders() {
    return readStorage<SavedOrder[]>(localOrderStorageKey, [])
  },

  async updateOrderStatus(id, status) {
    const orders = readStorage<SavedOrder[]>(localOrderStorageKey, [])
    const orderIndex = orders.findIndex((order) => order.id === id)

    if (orderIndex < 0) {
      throw new Error(`Pedido ${id} nao encontrado.`)
    }

    const updatedOrder: SavedOrder = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    orders[orderIndex] = updatedOrder
    writeStorage(localOrderStorageKey, orders)
    return updatedOrder
  },

  async subscribeNewsletter(lead) {
    const leads = readStorage<NewsletterLead[]>(localNewsletterStorageKey, [])
    writeStorage(localNewsletterStorageKey, [lead, ...leads])
  },

  async validateCoupon(code, subtotal) {
    return validateCoupon(code, subtotal)
  },

  async listCoupons() {
    return getLocalCoupons()
  },

  async upsertCoupon(coupon) {
    const nextCoupons = getLocalCoupons().filter((item) => item.code !== coupon.code)
    writeStorage(localCouponStorageKey, [coupon, ...nextCoupons])
    return coupon
  },
})

class HttpStoreRepository implements StoreRepository {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(path: string, init?: RequestInit) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      ...init,
    })

    if (!response.ok) {
      throw new Error(`API ${response.status}: ${response.statusText}`)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }

  getStorefront() {
    return this.request<StorefrontContent>('/storefront')
  }

  listProducts() {
    return this.request<Product[]>('/products')
  }

  createProduct(product: ProductPayload) {
    return this.request<Product>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    })
  }

  updateProduct(id: string, product: Partial<ProductPayload>) {
    return this.request<Product>(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(product),
    })
  }

  deleteProduct(id: string) {
    return this.request<void>(`/admin/products/${id}`, {
      method: 'DELETE',
    })
  }

  createOrder(order: CheckoutOrderDraft) {
    return this.request<SavedOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    })
  }

  listOrders() {
    return this.request<SavedOrder[]>('/admin/orders')
  }

  updateOrderStatus(id: string, status: OrderStatus) {
    return this.request<SavedOrder>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  }

  subscribeNewsletter(lead: NewsletterLead) {
    return this.request<void>('/newsletter', {
      method: 'POST',
      body: JSON.stringify(lead),
    })
  }

  validateCoupon(code: string, subtotal: number) {
    return this.request<CouponValidation>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    })
  }

  listCoupons() {
    return this.request<Coupon[]>('/admin/coupons')
  }

  upsertCoupon(coupon: Coupon) {
    return this.request<Coupon>(`/admin/coupons/${coupon.code}`, {
      method: 'PUT',
      body: JSON.stringify(coupon),
    })
  }
}

class FallbackStoreRepository implements StoreRepository {
  private readonly primary: StoreRepository
  private readonly fallback: StoreRepository

  constructor(primary: StoreRepository, fallback: StoreRepository) {
    this.primary = primary
    this.fallback = fallback
  }

  async getStorefront() {
    try {
      return await this.primary.getStorefront()
    } catch {
      return this.fallback.getStorefront()
    }
  }

  async listProducts() {
    try {
      return await this.primary.listProducts()
    } catch {
      return this.fallback.listProducts()
    }
  }

  async createProduct(product: ProductPayload) {
    try {
      return await this.primary.createProduct(product)
    } catch {
      return this.fallback.createProduct(product)
    }
  }

  async updateProduct(id: string, product: Partial<ProductPayload>) {
    try {
      return await this.primary.updateProduct(id, product)
    } catch {
      return this.fallback.updateProduct(id, product)
    }
  }

  async deleteProduct(id: string) {
    try {
      return await this.primary.deleteProduct(id)
    } catch {
      return this.fallback.deleteProduct(id)
    }
  }

  async createOrder(order: CheckoutOrderDraft) {
    try {
      return await this.primary.createOrder(order)
    } catch {
      return this.fallback.createOrder(order)
    }
  }

  async listOrders() {
    try {
      return await this.primary.listOrders()
    } catch {
      return this.fallback.listOrders()
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    try {
      return await this.primary.updateOrderStatus(id, status)
    } catch {
      return this.fallback.updateOrderStatus(id, status)
    }
  }

  async subscribeNewsletter(lead: NewsletterLead) {
    try {
      return await this.primary.subscribeNewsletter(lead)
    } catch {
      return this.fallback.subscribeNewsletter(lead)
    }
  }

  async validateCoupon(code: string, subtotal: number) {
    try {
      return await this.primary.validateCoupon(code, subtotal)
    } catch {
      return this.fallback.validateCoupon(code, subtotal)
    }
  }

  async listCoupons() {
    try {
      return await this.primary.listCoupons()
    } catch {
      return this.fallback.listCoupons()
    }
  }

  async upsertCoupon(coupon: Coupon) {
    try {
      return await this.primary.upsertCoupon(coupon)
    } catch {
      return this.fallback.upsertCoupon(coupon)
    }
  }
}

const localStoreRepository = createLocalStoreRepository()

export const storeRepository: StoreRepository = storeConfig.api.baseUrl
  ? new FallbackStoreRepository(new HttpStoreRepository(storeConfig.api.baseUrl), localStoreRepository)
  : localStoreRepository
