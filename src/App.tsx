import type { FormEvent, MouseEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  House,
  Heart,
  LayoutGrid,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react'

type Category = {
  name: string
  subtitle: string
  chip: string
}

type Product = {
  id: string
  name: string
  category: string
  price: string
  oldPrice?: string
  pix: string
  installment: string
  badge: 'Best Seller' | 'Novidade' | 'Reposicao'
  tone: string
}

type Review = {
  name: string
  city: string
  quote: string
  rating: number
}

type Notification = {
  type: 'success' | 'info'
  message: string
}

type CartItem = Product & {
  quantity: number
}

type CheckoutStep = 1 | 2 | 3

type CheckoutData = {
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
  paymentMethod: 'Pix' | 'Cartao' | 'Boleto'
}

type ProductCardProps = {
  product: Product
  isFavorite: boolean
  onToggleFavorite: (product: Product) => void
  onAddToCart: (product: Product) => void
}

const ALL_CATEGORIES = 'Todas'

const initialCheckoutData: CheckoutData = {
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

const checkoutSteps: Array<{ id: CheckoutStep; label: string }> = [
  { id: 1, label: 'Dados' },
  { id: 2, label: 'Entrega' },
  { id: 3, label: 'Pagamento' },
]

const parseCurrency = (value: string) =>
  Number(value.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'))

const toCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const categories: Category[] = [
  {
    name: 'Semijoias de Prata',
    subtitle: 'Pecas leves para usar todo dia.',
    chip: 'PRATA',
  },
  {
    name: 'Semijoias de Ouro',
    subtitle: 'Brilho dourado com acabamento premium.',
    chip: 'OURO',
  },
  {
    name: 'Linha Infantil',
    subtitle: 'Modelos delicados para presentes.',
    chip: 'INFANTIL',
  },
  {
    name: 'Personalizados',
    subtitle: 'Nomes e simbolos com toque unico.',
    chip: 'PERSONALIZE',
  },
]

const products: Product[] = [
  {
    id: 'p1',
    name: 'Choker Fita Dourada',
    category: 'Semijoias de Ouro',
    oldPrice: 'R$ 24,90',
    price: 'R$ 19,90',
    pix: 'R$ 19,30 no Pix (-3%)',
    installment: '2x de R$ 9,95 sem juros',
    badge: 'Best Seller',
    tone: 'from-[#f7e5ed] via-[#fdf8fb] to-[#e7c4d5]',
  },
  {
    id: 'p2',
    name: 'Colar Riviera Cristal',
    category: 'Semijoias de Prata',
    price: 'R$ 21,90',
    pix: 'R$ 21,24 no Pix (-3%)',
    installment: '2x de R$ 10,95 sem juros',
    badge: 'Best Seller',
    tone: 'from-[#f5e1ea] via-[#fff9fb] to-[#dfb7ca]',
  },
  {
    id: 'p3',
    name: 'Pulseira Coracao Pink',
    category: 'Linha Infantil',
    price: 'R$ 17,90',
    pix: 'R$ 17,36 no Pix (-3%)',
    installment: '2x de R$ 8,95 sem juros',
    badge: 'Reposicao',
    tone: 'from-[#fbe7ef] via-[#fff8fb] to-[#eec7d8]',
  },
  {
    id: 'p4',
    name: 'Argola Bolinhas Prata',
    category: 'Semijoias de Prata',
    price: 'R$ 19,90',
    pix: 'R$ 19,30 no Pix (-3%)',
    installment: '2x de R$ 9,95 sem juros',
    badge: 'Best Seller',
    tone: 'from-[#f5dfe9] via-[#fff8fb] to-[#e7c2d3]',
  },
  {
    id: 'p5',
    name: 'Colar Letra Cravejada',
    category: 'Personalizados',
    oldPrice: 'R$ 29,90',
    price: 'R$ 24,90',
    pix: 'R$ 24,15 no Pix (-3%)',
    installment: '2x de R$ 12,45 sem juros',
    badge: 'Best Seller',
    tone: 'from-[#f6e7ed] via-[#fff8f9] to-[#e4bfd1]',
  },
  {
    id: 'p6',
    name: 'Choker Coracoes Lisos',
    category: 'Semijoias de Prata',
    price: 'R$ 19,90',
    pix: 'R$ 19,30 no Pix (-3%)',
    installment: '2x de R$ 9,95 sem juros',
    badge: 'Reposicao',
    tone: 'from-[#f4dce8] via-[#fff8fb] to-[#ddb3c7]',
  },
  {
    id: 'p7',
    name: 'Colar Mae + Filho',
    category: 'Personalizados',
    price: 'R$ 22,90',
    pix: 'R$ 22,21 no Pix (-3%)',
    installment: '2x de R$ 11,45 sem juros',
    badge: 'Novidade',
    tone: 'from-[#f8e8ef] via-[#fff9fc] to-[#ebcddb]',
  },
  {
    id: 'p8',
    name: 'Anel Princesa Azul',
    category: 'Semijoias de Prata',
    price: 'R$ 18,90',
    pix: 'R$ 18,33 no Pix (-3%)',
    installment: '2x de R$ 9,45 sem juros',
    badge: 'Novidade',
    tone: 'from-[#f5e2ea] via-[#fff9fc] to-[#e4bfd0]',
  },
  {
    id: 'p9',
    name: 'Pulseira Medalhas Dourada',
    category: 'Semijoias de Ouro',
    price: 'R$ 21,90',
    pix: 'R$ 21,24 no Pix (-3%)',
    installment: '2x de R$ 10,95 sem juros',
    badge: 'Novidade',
    tone: 'from-[#f7e8ef] via-[#fffafc] to-[#e8c8d8]',
  },
  {
    id: 'p10',
    name: 'Brinco Gota Amassadinho',
    category: 'Semijoias de Prata',
    price: 'R$ 19,90',
    pix: 'R$ 19,30 no Pix (-3%)',
    installment: '2x de R$ 9,95 sem juros',
    badge: 'Novidade',
    tone: 'from-[#f4dae6] via-[#fff8fb] to-[#dfb7ca]',
  },
  {
    id: 'p11',
    name: 'Colar Longo Medalhas',
    category: 'Semijoias de Ouro',
    oldPrice: 'R$ 39,90',
    price: 'R$ 36,90',
    pix: 'R$ 35,79 no Pix (-3%)',
    installment: '2x de R$ 18,45 sem juros',
    badge: 'Novidade',
    tone: 'from-[#f8e9ef] via-[#fff9fb] to-[#ebc8d9]',
  },
  {
    id: 'p12',
    name: 'Kit Mae + Filha',
    category: 'Linha Infantil',
    price: 'R$ 29,90',
    pix: 'R$ 29,00 no Pix (-3%)',
    installment: '2x de R$ 14,95 sem juros',
    badge: 'Novidade',
    tone: 'from-[#fbeaf1] via-[#fffafe] to-[#efcfde]',
  },
]

const reviews: Review[] = [
  {
    name: 'Pamela Lima',
    city: 'Rio de Janeiro, RJ',
    quote: 'As pecas sao lindas e chegaram muito rapido. Atendimento excelente!',
    rating: 5,
  },
  {
    name: 'Jessica Souza',
    city: 'Belo Horizonte, MG',
    quote: 'Qualidade muito boa, nao escureceu e veio com cheirinho maravilhoso.',
    rating: 5,
  },
  {
    name: 'Miria Menezes',
    city: 'Salvador, BA',
    quote: 'Site facil de usar e as fotos batem com o produto real. Recomendo demais.',
    rating: 5,
  },
]

const productWhatsAppLink = (product: Product) => {
  const message = encodeURIComponent(
    `Oi! Quero comprar ${product.name} por ${product.price}. Pode me ajudar?`,
  )
  return `https://wa.me/5571900000000?text=${message}`
}

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
}: ProductCardProps) {
  return (
    <article className="glass hover-lift animate-rise rounded-3xl p-4 sm:p-5">
      <div
        className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl border border-black/5 bg-white p-3 sm:mb-5 sm:p-4"
      >
        <p className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.63rem] font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]">
          {product.badge}
        </p>
        <p className="absolute right-3 top-3 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[0.63rem] font-bold uppercase tracking-[0.1em] text-white">
          {product.category}
        </p>

        <button
          type="button"
          onClick={() => onToggleFavorite(product)}
          className={`absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full transition sm:h-9 sm:w-9 ${
            isFavorite
              ? 'bg-[var(--brand-deep)] text-white'
              : 'bg-white/85 text-[var(--brand-deep)]'
          }`}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart size={16} />
        </button>
      </div>

      <h3 className="text-sm font-normal leading-snug text-[var(--ink)] sm:text-base">
        {product.name}
      </h3>

      <div className="mt-3 flex items-end gap-2">
        {product.oldPrice ? (
          <span className="text-xs text-[var(--muted)] line-through sm:text-sm">
            {product.oldPrice}
          </span>
        ) : null}
        <span className="font-heading text-xl font-bold leading-none text-[var(--ink)] sm:text-2xl">
          {product.price}
        </span>
      </div>

      <p className="mt-2 text-xs text-[var(--muted)] sm:text-sm">{product.installment}</p>
      <p className="mt-1 text-xs font-semibold text-[var(--brand-deep)] sm:text-sm">{product.pix}</p>

      <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--ink)] bg-[var(--ink)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.06em] text-white transition hover:brightness-95 sm:px-4 sm:text-xs sm:tracking-[0.08em]"
        >
          ADICIONAR <ShoppingBag size={13} />
        </button>
        <a
          href={productWhatsAppLink(product)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--ink)] bg-[var(--ink)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.06em] !text-white transition hover:brightness-95 hover:!text-white sm:px-4 sm:text-xs sm:tracking-[0.08em]"
        >
          COMPRAR <ExternalLink size={13} />
        </a>
      </div>
    </article>
  )
}

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)
  const [searchTerm, setSearchTerm] = useState('')
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(1)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(initialCheckoutData)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterFeedback, setNewsletterFeedback] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORIES || product.category === activeCategory
      const matchesQuery =
        !query || `${product.name} ${product.category}`.toLowerCase().includes(query)

      return matchesCategory && matchesQuery
    })
  }, [activeCategory, searchTerm])

  const bestSellerProducts = useMemo(() => {
    const selected = filteredProducts.filter(
      (product) => product.badge === 'Best Seller' || product.badge === 'Reposicao',
    )
    return selected.length ? selected : filteredProducts.slice(0, 6)
  }, [filteredProducts])

  const noveltyProducts = useMemo(() => {
    const selected = filteredProducts.filter((product) => product.badge === 'Novidade')
    return selected.length ? selected : filteredProducts.slice(0, 6)
  }, [filteredProducts])

  const goldProducts = useMemo(() => {
    const selected = filteredProducts.filter((product) => product.category === 'Semijoias de Ouro')
    return selected.length ? selected : bestSellerProducts.slice(0, 6)
  }, [bestSellerProducts, filteredProducts])

  const silverProducts = useMemo(() => {
    const selected = filteredProducts.filter((product) => product.category === 'Semijoias de Prata')
    return selected.length ? selected : bestSellerProducts.slice(0, 6)
  }, [bestSellerProducts, filteredProducts])

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds],
  )

  const cartItems = useMemo<CartItem[]>(
    () =>
      products
        .filter((product) => (cart[product.id] ?? 0) > 0)
        .map((product) => ({
          ...product,
          quantity: cart[product.id] as number,
        })),
    [cart],
  )

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + parseCurrency(item.price) * item.quantity,
        0,
      ),
    [cartItems],
  )

  const checkoutWhatsAppLink = useMemo(() => {
    if (!cartItems.length) {
      return 'https://wa.me/5571900000000'
    }

    const lines = cartItems.map(
      (item) =>
        `- ${item.name} x${item.quantity} (${toCurrency(
          parseCurrency(item.price) * item.quantity,
        )})`,
    )

    const message = [
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

    return `https://wa.me/5571900000000?text=${encodeURIComponent(message)}`
  }, [cartItems, cartTotal, checkoutData])

  useEffect(() => {
    if (!notification) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setNotification(null)
    }, 2500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [notification])

  useEffect(() => {
    if (!isCartOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isCartOpen])

  const notify = (message: string, type: Notification['type'] = 'info') => {
    setNotification({ message, type })
  }

  const scrollToSection = (selector: string) => {
    const target = document.querySelector<HTMLElement>(selector)

    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleNavRedirect = (
    event: MouseEvent<HTMLAnchorElement>,
    selector: string,
  ) => {
    event.preventDefault()
    scrollToSection(selector)
  }

  const handleCategoryRedirect = (categoryName: string) => {
    setActiveCategory(categoryName)
    scrollToSection('#best-seller')
    notify(
      categoryName === ALL_CATEGORIES
        ? 'Mostrando todas as categorias.'
        : `Filtro aplicado: ${categoryName}`,
    )
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActiveCategory(ALL_CATEGORIES)
    scrollToSection('#best-seller')

    const cleanSearch = searchTerm.trim()

    notify(
      cleanSearch
        ? `Resultados para "${cleanSearch}".`
        : 'Busca limpa. Mostrando todos os produtos.',
      'info',
    )
  }

  const handleToggleFavorite = (product: Product) => {
    const isFavorite = favoriteIds.includes(product.id)

    setFavoriteIds((current) =>
      isFavorite
        ? current.filter((favoriteId) => favoriteId !== product.id)
        : [...current, product.id],
    )

    notify(
      isFavorite
        ? `${product.name} removido dos favoritos.`
        : `${product.name} adicionado aos favoritos.`,
      'success',
    )
  }

  const handleOpenCart = () => {
    setIsCartOpen(true)
    setCheckoutError(null)
  }

  const handleCloseCart = () => {
    setIsCartOpen(false)
    setCheckoutError(null)
  }

  const handleAddToCart = (product: Product) => {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }))

    notify(`${product.name} adicionado ao carrinho.`, 'success')
  }

  const handleUpdateCartQuantity = (productId: string, change: number) => {
    setCart((current) => {
      const currentQuantity = current[productId] ?? 0
      const nextQuantity = currentQuantity + change

      if (nextQuantity <= 0) {
        const next = { ...current }
        delete next[productId]
        return next
      }

      return {
        ...current,
        [productId]: nextQuantity,
      }
    })
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((current) => {
      const next = { ...current }
      delete next[productId]
      return next
    })

    notify('Item removido do carrinho.')
  }

  const handleClearCart = () => {
    setCart({})
    setCheckoutStep(1)
    setCheckoutData(initialCheckoutData)
    setCheckoutError(null)
    setIsCartOpen(false)
    notify('Carrinho esvaziado.')
  }

  const handleCheckoutFieldChange = (field: keyof CheckoutData, value: string) => {
    setCheckoutData((current) => ({
      ...current,
      [field]: value,
    }))
    setCheckoutError(null)
  }

  const validateCheckoutStep = (step: CheckoutStep) => {
    if (step === 1) {
      if (!checkoutData.fullName.trim() || !checkoutData.phone.trim() || !checkoutData.email.trim()) {
        setCheckoutError('Preencha nome, telefone e e-mail para continuar.')
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(checkoutData.email.trim())) {
        setCheckoutError('Digite um e-mail valido.')
        return false
      }
    }

    if (step === 2) {
      if (
        !checkoutData.cep.trim() ||
        !checkoutData.street.trim() ||
        !checkoutData.number.trim() ||
        !checkoutData.city.trim() ||
        !checkoutData.state.trim()
      ) {
        setCheckoutError('Preencha os dados de entrega obrigatorios.')
        return false
      }
    }

    if (step === 3 && !checkoutData.paymentMethod) {
      setCheckoutError('Selecione uma forma de pagamento.')
      return false
    }

    setCheckoutError(null)
    return true
  }

  const handleNextCheckoutStep = () => {
    if (!validateCheckoutStep(checkoutStep)) {
      return
    }

    setCheckoutStep((current) => {
      if (current === 1) {
        return 2
      }

      if (current === 2) {
        return 3
      }

      return 3
    })
  }

  const handlePreviousCheckoutStep = () => {
    setCheckoutError(null)
    setCheckoutStep((current) => {
      if (current === 3) {
        return 2
      }

      if (current === 2) {
        return 1
      }

      return 1
    })
  }

  const handleStartCheckout = () => {
    if (!cartItems.length) {
      notify('Adicione ao menos 1 item para iniciar o checkout.')
      return
    }

    setCheckoutStep(1)
    setCheckoutError(null)
    setIsCartOpen(true)
  }

  const handleCheckoutFinalizeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!validateCheckoutStep(3)) {
      event.preventDefault()
      return
    }

    notify('Redirecionando para o WhatsApp com seu pedido.', 'success')
  }

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const email = newsletterEmail.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      setNewsletterFeedback('Digite um e-mail valido para receber o cupom.')
      notify('Email invalido. Confira e tente novamente.')
      return
    }

    setNewsletterFeedback('Cadastro confirmado! Cupom PRIMEIRACOMPRA10 enviado.')
    setNewsletterEmail('')
    notify('Cadastro realizado com sucesso!', 'success')
  }

  const renderProductShelf = (items: Product[], emptyMessage: string) => {
    if (!items.length) {
      return (
        <div className="mt-5 rounded-3xl border border-[var(--line)] bg-white p-7 text-center text-sm text-[var(--muted)]">
          {emptyMessage}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favoriteIds.includes(product.id)}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    )
  }

  return (
    <div id="top" className="min-h-screen">
      <div className="bg-[var(--brand-deep)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-1.5 sm:py-2 lg:px-8">
          <div className="flex items-center justify-between gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.09em] sm:flex-wrap sm:gap-3 sm:text-xs sm:tracking-[0.11em]">
            <span className="hidden rounded-full bg-white/12 px-3 py-1 sm:inline-flex">
              Frete fixo RJ 10,90 | SP 19,90
            </span>
            <span className="sm:hidden">Frete RJ/SP + Pix 3% off</span>

            <div className="hidden w-full overflow-hidden sm:block sm:w-auto sm:flex-1 sm:px-4">
              <p className="ticker-track whitespace-nowrap text-center">
                Entrega para todo Brasil · 3% OFF no Pix · Em ate 12x no cartao · Garantia em todas as pecas
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => scrollToSection('#checkout')}
                className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.62rem] normal-case tracking-[0.02em] transition hover:bg-white/20 sm:px-3 sm:py-1 sm:text-xs sm:uppercase sm:tracking-[0.08em]"
              >
                Rastrear pedido
              </button>
              <button
                type="button"
                onClick={handleOpenCart}
                className="rounded-full bg-white/15 px-2.5 py-0.5 text-[0.62rem] normal-case tracking-[0.02em] transition hover:bg-white/20 sm:px-3 sm:py-1 sm:text-xs sm:uppercase sm:tracking-[0.08em]"
              >
                Abrir carrinho
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--line)] bg-[var(--surface-soft)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1.5 px-4 py-2 text-[0.66rem] font-semibold uppercase tracking-[0.09em] text-[var(--muted)] sm:gap-x-5 sm:gap-y-2 sm:py-3 sm:text-xs sm:tracking-[0.11em] lg:px-8">
          <span className="inline-flex items-center gap-2">
            <Truck size={14} /> entrega em todo o Brasil
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgePercent size={14} /> cupom PRIMEIRACOMPRA10
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={14} /> garantia e cuidado
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,253,251,0.98)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <a
              href="#top"
              onClick={(event) => handleNavRedirect(event, '#top')}
              className="leading-none"
            >
              <p className="font-heading text-4xl text-[var(--ink)]">Adry</p>
              <p className="text-[0.63rem] font-bold uppercase tracking-[0.23em] text-[var(--muted)]">
                Acessorios
              </p>
            </a>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => handleCategoryRedirect(ALL_CATEGORIES)}
              className={`rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.09em] transition ${
                activeCategory === ALL_CATEGORIES
                  ? 'bg-[var(--brand-deep)] text-white'
                  : 'border border-[var(--line)] bg-white text-[var(--muted)] hover:bg-[var(--brand-soft)]'
              }`}
            >
              {ALL_CATEGORIES}
            </button>

            {categories.map((category) => (
              <button
                key={`header-${category.chip}`}
                type="button"
                onClick={() => handleCategoryRedirect(category.name)}
                className={`rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.09em] transition ${
                  activeCategory === category.name
                    ? 'bg-[var(--brand-deep)] text-white'
                    : 'border border-[var(--line)] bg-white text-[var(--muted)] hover:bg-[var(--brand-soft)]'
                }`}
              >
                {category.chip}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <form
              onSubmit={handleSearchSubmit}
              className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--muted)] md:flex"
            >
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar produto"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-40 bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              />
              <button
                type="submit"
                className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)]"
              >
                Buscar
              </button>
            </form>

            <button
              type="button"
              aria-label="Favoritos"
              onClick={() => scrollToSection('#favoritos')}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)]"
            >
              <Heart size={17} />
              {favoriteIds.length > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--brand)] text-[0.64rem] font-bold text-white">
                  {favoriteIds.length}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              aria-label="Carrinho"
              onClick={handleOpenCart}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-white"
            >
              <ShoppingBag size={17} />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--brand-soft)] text-[0.64rem] font-bold text-[var(--brand-deep)]">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="border-t border-[var(--line)] lg:hidden">
          <div className="no-scrollbar mx-auto max-w-7xl overflow-x-auto px-4 py-3">
            <div className="flex min-w-max items-center gap-2">
              <button
                type="button"
                onClick={() => handleCategoryRedirect(ALL_CATEGORIES)}
                className={`rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.09em] transition ${
                  activeCategory === ALL_CATEGORIES
                    ? 'bg-[var(--brand-deep)] text-white'
                    : 'border border-[var(--line)] bg-white text-[var(--muted)] hover:bg-[var(--brand-soft)]'
                }`}
              >
                {ALL_CATEGORIES}
              </button>

              {categories.map((category) => (
                <button
                  key={`mobile-header-${category.chip}`}
                  type="button"
                  onClick={() => handleCategoryRedirect(category.name)}
                  className={`rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.09em] transition ${
                    activeCategory === category.name
                      ? 'bg-[var(--brand-deep)] text-white'
                      : 'border border-[var(--line)] bg-white text-[var(--muted)] hover:bg-[var(--brand-soft)]'
                  }`}
                >
                  {category.chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="pb-24 lg:pb-16">
        <section className="px-4 pb-4 pt-3 sm:pb-5 sm:pt-4 lg:px-8 lg:pt-6">
          <div className="no-scrollbar mx-auto flex max-w-7xl gap-3 overflow-x-auto pb-1 sm:grid sm:gap-4 sm:overflow-visible sm:pb-0 sm:grid-cols-2 lg:grid-cols-3">
            <article className="glass min-w-[86%] rounded-2xl px-4 py-3 sm:min-w-0 sm:rounded-3xl sm:px-5 sm:py-4">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.09em] text-[var(--muted)] sm:text-[0.68rem] sm:tracking-[0.1em]">
                Frete para todo Brasil
              </p>
              <p className="mt-1.5 text-[0.98rem] font-semibold leading-snug text-[var(--ink)] sm:mt-2 sm:text-sm">
                RJ e SP com condicoes especiais e envio rapido.
              </p>
            </article>

            <article className="glass min-w-[86%] rounded-2xl px-4 py-3 sm:min-w-0 sm:rounded-3xl sm:px-5 sm:py-4">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.09em] text-[var(--muted)] sm:text-[0.68rem] sm:tracking-[0.1em]">
                Formas de pagamento
              </p>
              <p className="mt-1.5 text-[0.98rem] font-semibold leading-snug text-[var(--ink)] sm:mt-2 sm:text-sm">
                Em ate 12x no cartao e 3% OFF no Pix no atendimento.
              </p>
            </article>

            <article className="glass min-w-[86%] rounded-2xl px-4 py-3 sm:min-w-0 sm:rounded-3xl sm:px-5 sm:py-4 sm:col-span-2 lg:col-span-1">
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.09em] text-[var(--muted)] sm:text-[0.68rem] sm:tracking-[0.1em]">
                Garantia e suporte
              </p>
              <p className="mt-1.5 text-[0.98rem] font-semibold leading-snug text-[var(--ink)] sm:mt-2 sm:text-sm">
                Atendimento dedicado para trocas, duvidas e pos-venda.
              </p>
            </article>
          </div>
        </section>

        <section id="best-seller" className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Vitrine
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Best Seller
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">
                {filteredProducts.length} produto(s) encontrado(s)
              </p>
            </div>

            {searchTerm.trim() || activeCategory !== ALL_CATEGORIES ? (
              <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--muted)]">
                <span>
                  Filtro ativo: <strong>{activeCategory}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setActiveCategory(ALL_CATEGORIES)
                    notify('Filtros removidos.')
                  }}
                  className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--ink)]"
                >
                  Limpar
                </button>
              </div>
            ) : null}

            {renderProductShelf(bestSellerProducts, 'Nenhum produto encontrado nessa combinacao.')}
          </div>
        </section>

        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Vitrine
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Banho de ouro
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCategoryRedirect('Semijoias de Ouro')}
                className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.09em] text-[var(--brand-deep)]"
              >
                Ver tudo
              </button>
            </div>

            {renderProductShelf(goldProducts, 'Sem produtos de ouro para este filtro.')}
          </div>
        </section>

        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Vitrine
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Banho de prata
                </h2>
              </div>
              <button
                type="button"
                onClick={() => handleCategoryRedirect('Semijoias de Prata')}
                className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.09em] text-[var(--brand-deep)]"
              >
                Ver tudo
              </button>
            </div>

            {renderProductShelf(silverProducts, 'Sem produtos de prata para este filtro.')}
          </div>
        </section>

        <section id="novidades" className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Atualizacao semanal
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Novidades e reposicoes
                </h2>
              </div>
              <button
                type="button"
                onClick={() => scrollToSection('#newsletter')}
                className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]"
              >
                Receber aviso
              </button>
            </div>

            {renderProductShelf(noveltyProducts, 'Sem novidades para esse filtro agora.')}
          </div>
        </section>

        <section id="favoritos" className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Favoritos
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Lista de desejos
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{favoriteProducts.length} item(ns)</p>
            </div>

            {favoriteProducts.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteProducts.map((product) => (
                  <article key={product.id} className="glass rounded-3xl p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                      {product.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">{product.name}</h3>
                    <p className="mt-2 font-heading text-3xl text-[var(--ink)]">{product.price}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--ink)]"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(product)}
                        className="rounded-full border border-[var(--line)] bg-[var(--brand-soft)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)]"
                      >
                        Remover
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[var(--line)] bg-white p-8 text-center text-sm text-[var(--muted)]">
                Nenhum favorito por enquanto. Salve seus produtos para decidir depois.
              </div>
            )}
          </div>
        </section>

        <section id="checkout" className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Checkout
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Carrinho lateral em 3 passos
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{cartCount} item(ns) no carrinho</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <article className="glass rounded-3xl p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]">1</p>
                    <h3 className="mt-2 text-sm font-semibold text-[var(--ink)]">Dados do cliente</h3>
                    <p className="mt-1 text-xs text-[var(--muted)]">Nome, telefone e e-mail.</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]">2</p>
                    <h3 className="mt-2 text-sm font-semibold text-[var(--ink)]">Entrega</h3>
                    <p className="mt-1 text-xs text-[var(--muted)]">CEP e endereco para envio.</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--line)] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]">3</p>
                    <h3 className="mt-2 text-sm font-semibold text-[var(--ink)]">Pagamento</h3>
                    <p className="mt-1 text-xs text-[var(--muted)]">Pix, cartao ou boleto.</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-[var(--muted)]">
                  O cliente finaliza no painel lateral e o pedido vai pronto para atendimento no WhatsApp.
                </p>
              </article>

              <aside className="glass rounded-3xl p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Resumo</p>
                <p className="mt-2 font-heading text-4xl leading-none text-[var(--ink)]">{toCurrency(cartTotal)}</p>
                <p className="mt-2 text-xs text-[var(--muted)]">Pix ou cartao em ate 12x</p>

                <button
                  type="button"
                  onClick={handleOpenCart}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:opacity-90"
                >
                  Abrir carrinho lateral <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  onClick={handleStartCheckout}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)]"
                >
                  Iniciar checkout
                </button>
              </aside>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 lg:px-8" id="depoimentos">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Avaliacoes reais
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  O que falam da gente
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">+2.000 avaliacoes verificadas</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <article key={review.name} className="glass rounded-3xl p-5">
                  <div className="mb-3 flex items-center gap-1 text-[var(--brand)]">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={`${review.name}-${index}`} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">"{review.quote}"</p>
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.1em] text-[var(--ink)]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{review.city}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="newsletter" className="px-4 pb-6 pt-10 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--line)] bg-[var(--brand-soft)] p-7 sm:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-deep)]">
                Clube de ofertas
              </p>
              <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                Ganhe 10% OFF na primeira compra
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
                Receba avisos de reposicao, lancamentos e cupons semanais.
              </p>

              <form
                onSubmit={handleNewsletterSubmit}
                className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  className="h-12 flex-1 rounded-full border border-[var(--line)] bg-white px-5 text-sm outline-none ring-[var(--brand)] transition focus:ring-2"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-7 text-sm font-bold uppercase tracking-[0.1em] text-white"
                >
                  Quero cupom <ArrowRight size={15} />
                </button>
              </form>

              {newsletterFeedback ? (
                <p className="mt-4 text-sm font-semibold text-[var(--brand-deep)]">
                  {newsletterFeedback}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer
        id="rodape"
        className="border-t border-[var(--line)] bg-[var(--surface-soft)] px-4 pb-10 pt-10 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 text-sm text-[var(--muted)] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-3xl text-[var(--ink)]">Adry</h3>
            <p className="mt-2 max-w-xs leading-relaxed">
              Loja online de acessorios com vitrine atualizada toda semana.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink)]">Categorias</p>
            <ul className="mt-3 space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <button
                    type="button"
                    onClick={() => handleCategoryRedirect(category.name)}
                    className="text-left"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink)]">
              Institucional
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#top" onClick={(event) => handleNavRedirect(event, '#top')}>
                  Sobre a marca
                </a>
              </li>
              <li>
                <a href="#depoimentos" onClick={(event) => handleNavRedirect(event, '#depoimentos')}>
                  Avaliacoes
                </a>
              </li>
              <li>
                <a href="https://wa.me/5571900000000" target="_blank" rel="noreferrer">
                  Fale conosco
                </a>
              </li>
              <li>
                <a href="#newsletter" onClick={(event) => handleNavRedirect(event, '#newsletter')}>
                  Politica de privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink)]">Atendimento</p>
            <ul className="mt-3 space-y-2">
              <li>Seg a Sex · 08h as 17h</li>
              <li>WhatsApp: (71) 90000-0000</li>
              <li>contato@adryacessorios.com</li>
              <li>Salvador - BA</li>
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-7xl border-t border-[var(--line)] pt-5 text-xs tracking-[0.07em] text-[var(--muted)]">
          Adry Acessorios 2026. Todos os direitos reservados.
        </p>
      </footer>

      <nav className="mobile-dock fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--line)] bg-[rgba(255,253,251,0.96)] px-2 py-2 lg:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => scrollToSection('#top')}
            className="inline-flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[var(--muted)]"
          >
            <House size={15} />
            Inicio
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('#best-seller')}
            className="inline-flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[var(--muted)]"
          >
            <LayoutGrid size={15} />
            Vitrines
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('#novidades')}
            className="inline-flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[var(--muted)]"
          >
            <Sparkles size={15} />
            Novidades
          </button>

          <button
            type="button"
            onClick={handleOpenCart}
            className="relative inline-flex flex-col items-center justify-center gap-1 rounded-2xl bg-[var(--ink)] px-2 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white"
          >
            <ShoppingBag size={15} />
            Carrinho
            {cartCount > 0 ? (
              <span className="absolute right-3 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--brand-soft)] px-1 text-[0.55rem] font-bold text-[var(--brand-deep)]">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-[70] transition ${
          isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!isCartOpen}
      >
        <button
          type="button"
          aria-label="Fechar carrinho"
          onClick={handleCloseCart}
          className={`absolute inset-0 bg-[#8a4a64]/45 transition-opacity ${
            isCartOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col border-l border-[var(--line)] bg-[var(--surface-soft)] shadow-2xl transition-transform duration-300 ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-label="Carrinho lateral"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-4 sm:px-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.11em] text-[var(--muted)]">Seu carrinho</p>
              <h3 className="font-heading text-3xl text-[var(--ink)]">Checkout</h3>
            </div>
            <button
              type="button"
              onClick={handleCloseCart}
              aria-label="Fechar"
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)]"
            >
              <X size={16} />
            </button>
          </div>

          {cartItems.length ? (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[var(--line)] bg-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--ink)]">{item.name}</p>
                          <p className="mt-0.5 text-xs text-[var(--muted)]">{item.category}</p>
                          <div className="mt-2 inline-flex items-center rounded-full border border-[var(--line)] bg-white">
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQuantity(item.id, -1)}
                              className="grid h-8 w-8 place-items-center text-[var(--muted)]"
                              aria-label="Diminuir"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-sm font-bold text-[var(--ink)]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateCartQuantity(item.id, 1)}
                              className="grid h-8 w-8 place-items-center text-[var(--muted)]"
                              aria-label="Aumentar"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-[var(--ink)]">
                            {toCurrency(parseCurrency(item.price) * item.quantity)}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                  <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[var(--ink)]">{toCurrency(cartTotal)}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>Itens</span>
                    <span>{cartCount}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>Frete</span>
                    <span>Calculado no atendimento</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">Pix com 3% OFF no atendimento.</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {checkoutSteps.map((step, index) => {
                    const isDone = checkoutStep > step.id
                    const isActive = checkoutStep === step.id

                    return (
                      <div key={step.id} className="flex flex-1 items-center gap-2">
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.62rem] font-bold ${
                            isDone || isActive
                              ? 'border-[var(--brand-deep)] bg-[var(--brand-soft)] text-[var(--brand-deep)]'
                              : 'border-[var(--line)] bg-white text-[var(--muted)]'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={12} /> : step.id}
                        </span>
                        <span
                          className={`text-[0.62rem] font-bold uppercase tracking-[0.08em] ${
                            isDone || isActive ? 'text-[var(--brand-deep)]' : 'text-[var(--muted)]'
                          }`}
                        >
                          {step.label}
                        </span>

                        {index < checkoutSteps.length - 1 ? (
                          <span className="h-px flex-1 bg-[var(--line)]" />
                        ) : null}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-3 rounded-2xl border border-[var(--line)] bg-white p-4">
                  {checkoutStep === 1 ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Nome completo"
                        value={checkoutData.fullName}
                        onChange={(event) => handleCheckoutFieldChange('fullName', event.target.value)}
                        className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                      />
                      <input
                        type="text"
                        placeholder="Telefone"
                        value={checkoutData.phone}
                        onChange={(event) => handleCheckoutFieldChange('phone', event.target.value)}
                        className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                      />
                      <input
                        type="email"
                        placeholder="E-mail"
                        value={checkoutData.email}
                        onChange={(event) => handleCheckoutFieldChange('email', event.target.value)}
                        className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                      />
                    </div>
                  ) : null}

                  {checkoutStep === 2 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="CEP"
                          value={checkoutData.cep}
                          onChange={(event) => handleCheckoutFieldChange('cep', event.target.value)}
                          className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                        />
                        <input
                          type="text"
                          placeholder="Numero"
                          value={checkoutData.number}
                          onChange={(event) => handleCheckoutFieldChange('number', event.target.value)}
                          className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Rua"
                        value={checkoutData.street}
                        onChange={(event) => handleCheckoutFieldChange('street', event.target.value)}
                        className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                      />
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={checkoutData.neighborhood}
                        onChange={(event) => handleCheckoutFieldChange('neighborhood', event.target.value)}
                        className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Cidade"
                          value={checkoutData.city}
                          onChange={(event) => handleCheckoutFieldChange('city', event.target.value)}
                          className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                        />
                        <input
                          type="text"
                          placeholder="UF"
                          value={checkoutData.state}
                          onChange={(event) => handleCheckoutFieldChange('state', event.target.value)}
                          className="h-10 w-full rounded-xl border border-[var(--line)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                        />
                      </div>
                    </div>
                  ) : null}

                  {checkoutStep === 3 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2">
                        {(['Pix', 'Cartao', 'Boleto'] as CheckoutData['paymentMethod'][]).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => handleCheckoutFieldChange('paymentMethod', method)}
                            className={`rounded-xl border px-2 py-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] ${
                              checkoutData.paymentMethod === method
                                ? 'border-[var(--brand-deep)] bg-[var(--brand-soft)] text-[var(--brand-deep)]'
                                : 'border-[var(--line)] bg-white text-[var(--muted)]'
                            }`}
                          >
                            {method}
                          </button>
                        ))}
                      </div>

                      <textarea
                        placeholder="Observacoes do pedido (opcional)"
                        value={checkoutData.note}
                        onChange={(event) => handleCheckoutFieldChange('note', event.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-soft)]"
                      />
                    </div>
                  ) : null}

                  {checkoutError ? (
                    <p className="mt-3 text-xs font-semibold text-[#a45777]">{checkoutError}</p>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-[var(--line)] p-4 sm:p-5">
                <div className="flex gap-2">
                  {checkoutStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePreviousCheckoutStep}
                      className="flex-1 rounded-full border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--ink)]"
                    >
                      Voltar
                    </button>
                  ) : null}

                  {checkoutStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextCheckoutStep}
                      className="flex-1 rounded-full bg-[var(--ink)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
                    >
                      Continuar
                    </button>
                  ) : (
                    <a
                      href={checkoutWhatsAppLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleCheckoutFinalizeClick}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
                    >
                      Finalizar no WhatsApp <ExternalLink size={13} />
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleClearCart}
                  className="mt-2 w-full rounded-full border border-[var(--line)] bg-white px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)]"
                >
                  Limpar carrinho
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <ShoppingBag size={34} className="text-[var(--muted)]" />
              <p className="mt-3 text-lg font-semibold text-[var(--ink)]">Seu carrinho esta vazio</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Adicione produtos para iniciar o checkout lateral.
              </p>
              <button
                type="button"
                onClick={handleCloseCart}
                className="mt-4 rounded-full border border-[var(--line)] bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)]"
              >
                Continuar comprando
              </button>
            </div>
          )}
        </aside>
      </div>

      {notification ? (
        <div
          className={`fixed bottom-4 right-4 z-50 inline-flex max-w-xs items-center gap-2 rounded-2xl border px-4 py-3 text-sm shadow-xl animate-rise ${
            notification.type === 'success'
              ? 'border-[#dac2cf] bg-[#fff8fb] text-[var(--brand-deep)]'
              : 'border-[var(--line)] bg-white text-[var(--ink)]'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <CircleAlert size={16} />}
          <span>{notification.message}</span>
        </div>
      ) : null}
    </div>
  )
}

export default App