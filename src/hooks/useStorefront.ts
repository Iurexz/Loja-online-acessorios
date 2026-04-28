import { useEffect, useState } from 'react'
import { storefrontContent } from '../data/catalog'
import { storeRepository } from '../services/storeRepository'
import type { StorefrontContent } from '../types/store'

export const useStorefront = () => {
  const [storefront, setStorefront] = useState<StorefrontContent>(storefrontContent)

  useEffect(() => {
    let isCurrent = true

    storeRepository
      .getStorefront()
      .then((content) => {
        if (isCurrent) {
          setStorefront(content)
        }
      })
      .catch(() => undefined)

    return () => {
      isCurrent = false
    }
  }, [])

  return storefront
}
