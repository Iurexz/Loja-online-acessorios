import type { FormEvent, MouseEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
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

const ALL_CATEGORIES = 'Todas'

const parseCurrency = (value: string) =>
  Number(value.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'))

const toCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const navLinks = [
  { label: 'INICIO', href: '#top' },
  { label: 'COLECOES', href: '#colecoes' },
  { label: 'BEST SELLER', href: '#best-seller' },
  { label: 'NOVIDADES', href: '#novidades' },
  { label: 'CONTATO', href: '#rodape' },
]

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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES)
  const [searchTerm, setSearchTerm] = useState('')
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})
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

  const whatsappCheckoutLink = useMemo(() => {
    if (!cartItems.length) {
      return 'https://wa.me/5571900000000'
    }

    const lines = cartItems.map(
      (item) =>
        `- ${item.name} x${item.quantity} (${toCurrency(
          parseCurrency(item.price) * item.quantity,
        )})`,
    )

    const message = encodeURIComponent(
      `Oi! Quero finalizar meu pedido:%0A${lines.join(
        '%0A',
      )}%0ATotal: ${toCurrency(cartTotal)}`,
    )

    return `https://wa.me/5571900000000?text=${message}`
  }, [cartItems, cartTotal])

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
    setIsMenuOpen(false)
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

  const handleAddToCart = (product: Product) => {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }))

    notify(`${product.name} adicionado a sacola.`, 'success')
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((current) => {
      const next = { ...current }
      delete next[productId]
      return next
    })

    notify('Item removido da sacola.')
  }

  const handleClearCart = () => {
    setCart({})
    notify('Sacola esvaziada.')
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

  return (
    <div id="top" className="min-h-screen">
      <div className="bg-[var(--brand-deep)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-2 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.11em] sm:justify-between sm:text-xs">
            <span className="rounded-full bg-white/12 px-3 py-1">Frete fixo RJ 10,90 | SP 19,90</span>
            <div className="w-full overflow-hidden sm:w-auto sm:flex-1 sm:px-4">
              <p className="ticker-track whitespace-nowrap text-center">
                Entrega para todo Brasil · 3% OFF no Pix · Em ate 12x no cartao · Garantia em todas as pecas
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollToSection('#sacola')}
              className="rounded-full bg-white/15 px-3 py-1 transition hover:bg-white/20"
            >
              Ir para sacola
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-[var(--line)] bg-[var(--surface-soft)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.11em] text-[var(--muted)] lg:px-8 sm:text-xs">
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

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,253,251,0.94)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setIsMenuOpen((state) => !state)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] lg:hidden"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

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

          <nav className="hidden items-center gap-6 text-sm font-bold tracking-[0.09em] text-[var(--muted)] lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => handleNavRedirect(event, link.href)}
                className="transition hover:text-[var(--ink)]"
              >
                {link.label}
              </a>
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
              aria-label="Sacola"
              onClick={() => scrollToSection('#sacola')}
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

        {isMenuOpen ? (
          <div className="border-t border-[var(--line)] px-4 pb-4 pt-3 lg:hidden">
            <form
              onSubmit={handleSearchSubmit}
              className="mb-3 flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--muted)]"
            >
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar produto"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              />
            </form>

            <nav className="grid gap-2 text-sm font-semibold tracking-[0.08em] text-[var(--muted)]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(event) => handleNavRedirect(event, link.href)}
                  className="rounded-xl px-3 py-2 transition hover:bg-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <main className="pb-16">
        <section className="px-4 py-8 lg:px-8 lg:py-12">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.45fr_0.95fr]">
            <article className="animate-rise rounded-3xl bg-gradient-to-br from-[#744158] via-[#90516d] to-[#5f3548] p-7 text-white sm:p-9">
              <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em]">
                Colecao dia das maes
              </p>
              <h1 className="mt-4 max-w-xl text-balance font-heading text-4xl leading-tight sm:text-5xl">
                é desse jeito que você quer ou mais simples ainda?
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#f5e8ee] sm:text-base">
                Explore nossos destaques, encontre rapido por categoria e finalize no WhatsApp em poucos cliques.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('#best-seller')}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)] transition hover:opacity-90"
                >
                  Ver best seller <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('#novidades')}
                  className="inline-flex items-center gap-2 rounded-full border border-white/45 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-white/12"
                >
                  Ver novidades
                </button>
              </div>
            </article>

            <div className="grid gap-4">
              <article className="animate-rise rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  Compre e lucre
                </p>
                <h3 className="mt-2 font-heading text-3xl text-[var(--ink)]">
                  Condicoes para revenda
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Kits com margem alta para quem quer revender com estoque leve.
                </p>
                <a
                  href="https://wa.me/5571900000000"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]"
                >
                  Falar no WhatsApp <ExternalLink size={13} />
                </a>
              </article>

              <article className="animate-rise rounded-3xl border border-[var(--line)] bg-[var(--brand-soft)] p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--brand-deep)]">
                  Garantia e cuidado
                </p>
                <h3 className="mt-2 font-heading text-3xl text-[var(--ink)]">
                  Qualidade em primeiro lugar
                </h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Suporte rapido para trocas e orientacoes de conservacao das pecas.
                </p>
                <button
                  type="button"
                  onClick={() => scrollToSection('#newsletter')}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]"
                >
                  Receber novidades <ArrowRight size={13} />
                </button>
              </article>
            </div>
          </div>
        </section>

        <section id="colecoes" className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Categorias
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Encontre por estilo
                </h2>
              </div>
              <p className="max-w-md text-sm text-[var(--muted)]">
                Layout simples para cliente achar rapido e comprar sem friccao.
              </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryRedirect(ALL_CATEGORIES)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  activeCategory === ALL_CATEGORIES
                    ? 'bg-[var(--brand-deep)] text-white'
                    : 'border border-[var(--line)] bg-white text-[var(--muted)] hover:bg-[var(--brand-soft)]'
                }`}
              >
                {ALL_CATEGORIES}
              </button>

              {categories.map((category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => handleCategoryRedirect(category.name)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                    activeCategory === category.name
                      ? 'bg-[var(--brand-deep)] text-white'
                      : 'border border-[var(--line)] bg-white text-[var(--muted)] hover:bg-[var(--brand-soft)]'
                  }`}
                >
                  {category.chip}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <article key={category.name} className="glass hover-lift animate-rise rounded-3xl p-5">
                  <p className="inline-flex rounded-full bg-[var(--brand-soft)] px-3 py-1 text-[0.63rem] font-bold uppercase tracking-[0.11em] text-[var(--brand-deep)]">
                    {category.chip}
                  </p>
                  <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{category.name}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{category.subtitle}</p>
                  <button
                    type="button"
                    onClick={() => handleCategoryRedirect(category.name)}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]"
                  >
                    Ver produtos <ArrowRight size={13} />
                  </button>
                </article>
              ))}
            </div>
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

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {bestSellerProducts.map((product) => {
                const isFavorite = favoriteIds.includes(product.id)

                return (
                  <article key={product.id} className="glass hover-lift animate-rise rounded-3xl p-5">
                    <div className={`relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${product.tone} p-4`}>
                      <p className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.63rem] font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]">
                        {product.badge}
                      </p>
                      <p className="absolute right-3 top-3 rounded-full bg-[var(--ink)] px-2.5 py-1 text-[0.63rem] font-bold uppercase tracking-[0.1em] text-white">
                        {product.category}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(product)}
                        className={`absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full transition ${
                          isFavorite
                            ? 'bg-[var(--brand-deep)] text-white'
                            : 'bg-white/85 text-[var(--brand-deep)]'
                        }`}
                        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        <Heart size={16} />
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-[var(--ink)]">{product.name}</h3>

                    <div className="mt-3 flex items-end gap-2">
                      {product.oldPrice ? (
                        <span className="text-sm text-[var(--muted)] line-through">{product.oldPrice}</span>
                      ) : null}
                      <span className="font-heading text-3xl leading-none text-[var(--ink)]">{product.price}</span>
                    </div>

                    <p className="mt-1 text-sm text-[var(--muted)]">{product.installment}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--brand-deep)]">{product.pix}</p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                      >
                        Adicionar <ShoppingBag size={13} />
                      </button>
                      <a
                        href={productWhatsAppLink(product)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--brand-soft)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)] transition hover:brightness-95"
                      >
                        Comprar <ExternalLink size={13} />
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>

            {!bestSellerProducts.length ? (
              <div className="mt-5 rounded-3xl border border-[var(--line)] bg-white p-7 text-center text-sm text-[var(--muted)]">
                Nenhum produto encontrado nessa combinacao. Tente limpar os filtros.
              </div>
            ) : null}
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

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {noveltyProducts.map((product) => {
                const isFavorite = favoriteIds.includes(product.id)

                return (
                  <article key={product.id} className="glass hover-lift animate-rise rounded-3xl p-5">
                    <div className={`relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${product.tone} p-4`}>
                      <p className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.63rem] font-bold uppercase tracking-[0.1em] text-[var(--brand-deep)]">
                        {product.badge}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(product)}
                        className={`absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full transition ${
                          isFavorite
                            ? 'bg-[var(--brand-deep)] text-white'
                            : 'bg-white/85 text-[var(--brand-deep)]'
                        }`}
                        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        <Heart size={16} />
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold text-[var(--ink)]">{product.name}</h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                      {product.category}
                    </p>

                    <div className="mt-3 flex items-end gap-2">
                      {product.oldPrice ? (
                        <span className="text-sm text-[var(--muted)] line-through">{product.oldPrice}</span>
                      ) : null}
                      <span className="font-heading text-3xl leading-none text-[var(--ink)]">{product.price}</span>
                    </div>

                    <p className="mt-1 text-sm text-[var(--muted)]">{product.installment}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--brand-deep)]">{product.pix}</p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                      >
                        Adicionar <ShoppingBag size={13} />
                      </button>
                      <a
                        href={productWhatsAppLink(product)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--brand-soft)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)] transition hover:brightness-95"
                      >
                        Comprar <ExternalLink size={13} />
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>

            {!noveltyProducts.length ? (
              <div className="mt-5 rounded-3xl border border-[var(--line)] bg-white p-7 text-center text-sm text-[var(--muted)]">
                Sem novidades para esse filtro agora.
              </div>
            ) : null}
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

        <section id="sacola" className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Sacola
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Fechamento rapido
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{cartCount} item(ns) selecionado(s)</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="glass rounded-3xl p-5 sm:p-6">
                {cartItems.length ? (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink)]">{item.name}</p>
                          <p className="text-xs text-[var(--muted)]">
                            {item.quantity}x {item.price}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--ink)]">
                            {toCurrency(parseCurrency(item.price) * item.quantity)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)]"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[var(--line)] bg-white px-4 py-5 text-sm text-[var(--muted)]">
                    Sua sacola esta vazia. Adicione um produto para finalizar o pedido.
                  </div>
                )}
              </div>

              <aside className="glass rounded-3xl p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                  Resumo
                </p>
                <p className="mt-2 font-heading text-4xl leading-none text-[var(--ink)]">
                  {toCurrency(cartTotal)}
                </p>
                <p className="mt-2 text-xs text-[var(--muted)]">Pix ou cartao em ate 12x</p>

                <a
                  href={whatsappCheckoutLink}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => {
                    if (!cartItems.length) {
                      event.preventDefault()
                      notify('Adicione ao menos 1 item para finalizar.')
                      return
                    }

                    notify('Redirecionando para o WhatsApp...', 'success')
                  }}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] transition ${
                    cartItems.length
                      ? 'bg-[var(--ink)] text-white hover:opacity-90'
                      : 'cursor-not-allowed bg-[#d5c3cc] text-white/85'
                  }`}
                >
                  Finalizar pedido <ExternalLink size={14} />
                </a>

                {cartItems.length ? (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand-deep)]"
                  >
                    Limpar sacola
                  </button>
                ) : null}
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

      <footer id="rodape" className="border-t border-[var(--line)] bg-[var(--surface-soft)] px-4 pb-10 pt-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 text-sm text-[var(--muted)] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-3xl text-[var(--ink)]">Adry</h3>
            <p className="mt-2 max-w-xs leading-relaxed">
              Loja online de acessorios com vitrine atualizada toda semana.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink)]">
              Categorias
            </p>
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
                <a
                  href="https://wa.me/5571900000000"
                  target="_blank"
                  rel="noreferrer"
                >
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
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink)]">
              Atendimento
            </p>
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

      {notification ? (
        <div
          className={`fixed bottom-4 right-4 z-50 inline-flex max-w-xs items-center gap-2 rounded-2xl border px-4 py-3 text-sm shadow-xl animate-rise ${
            notification.type === 'success'
              ? 'border-[#dac2cf] bg-[#fff8fb] text-[var(--brand-deep)]'
              : 'border-[var(--line)] bg-white text-[var(--ink)]'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <CircleAlert size={16} />
          )}
          <span>{notification.message}</span>
        </div>
      ) : null}
    </div>
  )
}

export default App
