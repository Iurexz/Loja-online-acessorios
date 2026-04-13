import type { CSSProperties, FormEvent, MouseEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BadgePercent,
  BanknoteArrowDown,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Gem,
  Heart,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  Truck,
  X,
} from 'lucide-react'

type Category = {
  name: string
  subtitle: string
  palette: string
  icon: string
}

type Product = {
  id: string
  name: string
  category: string
  price: string
  oldPrice?: string
  pix: string
  installment: string
  badge?: string
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

const ALL_CATEGORIES = 'Todos'

const parseCurrency = (value: string) =>
  Number(value.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'))

const toCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const navLinks = [
  { label: 'LANCAMENTOS', href: '#destaques' },
  { label: 'COLECOES', href: '#categorias' },
  { label: 'PRESENTES', href: '#newsletter' },
  { label: 'SOBRE', href: '#rodape' },
]

const categories: Category[] = [
  {
    name: 'Colares',
    subtitle: 'Camadas delicadas e mix de texturas.',
    palette: 'bg-gradient-to-br from-[#f6f4eb] to-[#efe2e9]',
    icon: 'C',
  },
  {
    name: 'Brincos',
    subtitle: 'Modelagens organicas para destaque imediato.',
    palette: 'bg-gradient-to-br from-[#f3dde7] to-[#e7bfd0]',
    icon: 'B',
  },
  {
    name: 'Pulseiras',
    subtitle: 'Minimalismo premium para uso diario.',
    palette: 'bg-gradient-to-br from-[#f7e8ee] to-[#edd2df]',
    icon: 'P',
  },
  {
    name: 'Aneis',
    subtitle: 'Design bold com acabamento polido.',
    palette: 'bg-gradient-to-br from-[#f1dae5] to-[#e2bdd0]',
    icon: 'A',
  },
]

const products: Product[] = [
  {
    id: 'p1',
    name: 'Choker Halo Dourada',
    category: 'Colares',
    oldPrice: 'R$ 239,00',
    price: 'R$ 169,00',
    pix: 'R$ 152,10 no Pix',
    installment: '5x de R$ 33,80',
    badge: 'Mais Vendido',
    tone: 'from-[#f6e3eb] via-[#fbf3f7] to-[#e7bfd1]',
  },
  {
    id: 'p2',
    name: 'Argola Lua Fosca',
    category: 'Brincos',
    price: 'R$ 129,00',
    pix: 'R$ 116,10 no Pix',
    installment: '4x de R$ 32,25',
    badge: 'Novo',
    tone: 'from-[#f4dee8] via-[#fff6f9] to-[#dfb2c7]',
  },
  {
    id: 'p3',
    name: 'Pulseira Riviera Soft',
    category: 'Pulseiras',
    oldPrice: 'R$ 189,00',
    price: 'R$ 139,00',
    pix: 'R$ 125,10 no Pix',
    installment: '4x de R$ 34,75',
    badge: 'Oferta',
    tone: 'from-[#f6f0e8] via-[#fffaf4] to-[#ebd7e3]',
  },
  {
    id: 'p4',
    name: 'Anel Trama Sculpt',
    category: 'Aneis',
    price: 'R$ 112,00',
    pix: 'R$ 100,80 no Pix',
    installment: '3x de R$ 37,33',
    tone: 'from-[#f3d9e5] via-[#fef2f8] to-[#e1b6cb]',
  },
  {
    id: 'p5',
    name: 'Colar Eclipse Longo',
    category: 'Colares',
    price: 'R$ 198,00',
    pix: 'R$ 178,20 no Pix',
    installment: '6x de R$ 33,00',
    tone: 'from-[#f6eee5] via-[#fffaf3] to-[#e7cfdc]',
  },
  {
    id: 'p6',
    name: 'Brinco Gota Satin',
    category: 'Brincos',
    oldPrice: 'R$ 99,00',
    price: 'R$ 79,00',
    pix: 'R$ 71,10 no Pix',
    installment: '2x de R$ 39,50',
    tone: 'from-[#f2dbe6] via-[#fef3f8] to-[#ddb4c9]',
  },
]

const reviews: Review[] = [
  {
    name: 'Marina P.',
    city: 'Sao Paulo, SP',
    quote: 'Acabamento impecavel e entrega muito rapida. A embalagem parece joalheria boutique.',
    rating: 5,
  },
  {
    name: 'Isabela C.',
    city: 'Curitiba, PR',
    quote: 'A experiencia de compra foi premium do inicio ao fim. As pecas chegaram lindas.',
    rating: 5,
  },
  {
    name: 'Juliana M.',
    city: 'Salvador, BA',
    quote: 'Modelos modernos, excelente custo-beneficio e fotos fieis. Virou minha loja favorita.',
    rating: 5,
  },
]

const metrics = [
  { value: '+12 mil', label: 'clientes ativas' },
  { value: '4,9/5', label: 'avaliacao media' },
  { value: '48h', label: 'prazo medio de envio' },
]

const getDelayStyle = (index: number): CSSProperties =>
  ({ '--delay': `${index * 95}ms` }) as CSSProperties

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
    }, 2300)

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

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
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
    scrollToSection('#destaques')
    notify(
      categoryName === ALL_CATEGORIES
        ? 'Mostrando todos os produtos.'
        : `Filtro aplicado: ${categoryName}`,
    )
  }

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActiveCategory(ALL_CATEGORIES)
    scrollToSection('#destaques')

    const cleanSearch = searchTerm.trim()

    notify(
      cleanSearch
        ? `Exibindo resultados para "${cleanSearch}".`
        : 'Busca limpa. Exibindo todos os produtos.',
      'info',
    )
  }

  const handleAddToCart = (product: Product) => {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] ?? 0) + 1,
    }))

    notify(`${product.name} adicionado a sacola.`, 'success')
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
    )
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

    setNewsletterFeedback(
      'Cadastro concluido! O cupom BEMVINDA10 foi enviado para seu e-mail.',
    )
    setNewsletterEmail('')
    notify('Cadastro realizado com sucesso.', 'success')
  }

  return (
    <div id="top" className="relative overflow-x-clip">
      <div className="animate-soft-pulse bg-[#8f5875] text-[0.72rem] font-semibold tracking-[0.12em] text-[#fff8fb] sm:text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-2.5 lg:px-8">
          <span className="inline-flex items-center gap-2">
            <Truck size={14} /> Frete gratis acima de R$ 299
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgePercent size={14} /> Primeira compra 10% OFF
          </span>
          <span className="inline-flex items-center gap-2">
            <BanknoteArrowDown size={14} /> 5% OFF no Pix
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/65 bg-[rgba(246,244,235,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-white/80 text-[var(--ink)] lg:hidden"
              onClick={() => setIsMenuOpen((state) => !state)}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <a
              href="#top"
              onClick={(event) => handleNavRedirect(event, '#top')}
              className="group inline-flex flex-col leading-none"
            >
              <span className="font-heading text-4xl tracking-[0.06em] text-[var(--ink)] transition group-hover:tracking-[0.1em]">
                Adry
              </span>
              <span className="mt-1 text-[0.62rem] font-semibold tracking-[0.26em] text-[var(--muted)]">
                ATELIER ACCESSORIES
              </span>
            </a>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold tracking-[0.1em] text-[var(--muted)] lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(event) => handleNavRedirect(event, link.href)}
                className="transition-colors hover:text-[var(--ink)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <form
              className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm text-[var(--muted)] md:flex"
              onSubmit={handleSearchSubmit}
            >
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar acessorios"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-36 bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#f3e3eb] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#865772] transition hover:bg-[#edd3e0]"
              >
                Ir
              </button>
            </form>

            <button
              type="button"
              aria-label="Favoritos"
              onClick={() => scrollToSection('#favoritos')}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-white/70 text-[var(--ink)] transition hover:bg-white"
            >
              <Heart size={17} />
              {favoriteIds.length > 0 ? (
                <span className="absolute -mt-6 ml-6 grid h-5 w-5 place-items-center rounded-full bg-[#c97ba0] text-[0.65rem] font-bold text-white">
                  {favoriteIds.length}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label="Sacola"
              onClick={() => scrollToSection('#sacola')}
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--ink)] text-[var(--surface-soft)] transition hover:scale-105"
            >
              <ShoppingBag size={17} />
              {cartCount > 0 ? (
                <span className="absolute -mt-6 ml-6 grid h-5 w-5 place-items-center rounded-full bg-[#f8e8f0] text-[0.65rem] font-bold text-[#5a3450]">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-[var(--line)] px-4 pb-4 pt-2 lg:hidden">
            <nav className="grid gap-2 text-sm font-semibold tracking-[0.08em] text-[var(--muted)]">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(event) => handleNavRedirect(event, link.href)}
                  className="rounded-xl px-3 py-2 transition hover:bg-white/70 hover:text-[var(--ink)]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        ) : null}
      </header>

      <main className="pb-20">
        <section className="relative px-4 pb-14 pt-12 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="animate-drift pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(229,184,200,0.35)_0%,_rgba(229,184,200,0)_65%)]" />

          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-7">
              <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-[#e8d7e0] bg-[#f3e3eb] px-4 py-2 text-xs font-bold tracking-[0.14em] text-[#8c4f70] uppercase">
                <Sparkles size={14} /> Colecao 2026
              </p>
              <h1 className="animate-rise text-balance font-heading text-5xl leading-[0.9] text-[var(--ink)] sm:text-6xl lg:text-7xl" style={getDelayStyle(1)}>
                Acessorios que elevam qualquer look.
              </h1>
              <p className="animate-rise max-w-xl text-balance text-base leading-relaxed text-[var(--muted)] sm:text-lg" style={getDelayStyle(2)}>
                Descubra pecas com design contemporaneo, acabamento premium e curadoria pensada para quem quer estilo com presenca.
              </p>

              <div className="animate-rise flex flex-wrap items-center gap-3" style={getDelayStyle(3)}>
                <button
                  type="button"
                  onClick={() => scrollToSection('#destaques')}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold tracking-[0.08em] text-[var(--surface-soft)] transition hover:translate-y-[-1px]"
                >
                  EXPLORAR AGORA <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('#categorias')}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-[var(--ink)] transition hover:bg-white"
                >
                  Ver categorias
                </button>
              </div>

              <div className="animate-rise grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3" style={getDelayStyle(4)}>
                {metrics.map((item) => (
                  <div key={item.label} className="glass hover-lift rounded-2xl px-4 py-3">
                    <p className="font-heading text-3xl leading-none text-[var(--ink)]">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <article className="glass hover-lift animate-rise relative rounded-[2.2rem] p-5 sm:p-6" style={getDelayStyle(2)}>
              <div className="absolute -right-4 -top-4 animate-float rounded-2xl border border-[#edd5e2] bg-[#f8e8f0] px-3 py-2 text-[0.67rem] font-bold uppercase tracking-[0.14em] text-[#915978]">
                drop quinzenal
              </div>

              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-[#f4dce7] via-[#fff9f3] to-[#e2b4c8] p-6">
                <div className="absolute inset-x-8 bottom-8 top-24 rounded-[1.4rem] border border-white/45 bg-white/26 backdrop-blur-sm" />
                <div className="absolute left-7 top-7 h-12 w-12 rounded-full border border-white/60 bg-white/45" />
                <div className="absolute right-8 top-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#5a3450] text-[var(--surface-soft)] shadow-lg">
                  <Gem size={24} />
                </div>
                <div className="absolute bottom-10 left-8 right-8 rounded-2xl border border-white/60 bg-white/58 p-4 text-left shadow-xl backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Peca destaque</p>
                  <h3 className="mt-2 font-heading text-3xl leading-none text-[var(--ink)]">Pulseira Aurora</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">Banho premium + fecho seguro + brilho espelhado.</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                <p className="rounded-xl border border-[var(--line)] bg-white/65 px-3 py-2">banho antialergico</p>
                <p className="rounded-xl border border-[var(--line)] bg-white/65 px-3 py-2">garantia de 6 meses</p>
              </div>
            </article>
          </div>
        </section>

        <section id="categorias" className="px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Navegue por categoria</p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">Essenciais da temporada</h2>
              </div>
              <a
                href="#destaques"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.11em] text-[#7b4c66]"
              >
                Ver vitrine <ArrowRight size={16} />
              </a>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryRedirect(ALL_CATEGORIES)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                  activeCategory === ALL_CATEGORIES
                    ? 'bg-[#8f5875] text-white'
                    : 'border border-[var(--line)] bg-white/75 text-[var(--muted)] hover:bg-white'
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
                      ? 'bg-[#8f5875] text-white'
                      : 'border border-[var(--line)] bg-white/75 text-[var(--muted)] hover:bg-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <article
                  key={category.name}
                  className={`animate-rise hover-lift group rounded-3xl border border-white/70 p-5 ${category.palette}`}
                  style={getDelayStyle(index + 1)}
                >
                  <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 font-heading text-2xl text-[var(--ink)] shadow-sm">
                    {category.icon}
                  </div>
                  <h3 className="font-heading text-3xl text-[var(--ink)]">{category.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#745d6b]">{category.subtitle}</p>
                  <button
                    type="button"
                    onClick={() => handleCategoryRedirect(category.name)}
                    className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#815972] transition group-hover:gap-2"
                  >
                    explorar <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="destaques" className="px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">Vitrine premium</p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">Mais vendidos agora</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
                Curadoria com alta rotacao, avaliacao excelente e modelagens que equilibram elegancia com proposta atual.
              </p>
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/60 px-4 py-3 text-sm">
              <p className="text-[var(--muted)]">
                Mostrando <strong>{filteredProducts.length}</strong> itens em{' '}
                <strong>
                  {activeCategory === ALL_CATEGORIES ? 'todas as categorias' : activeCategory}
                </strong>
              </p>
              {searchTerm.trim() || activeCategory !== ALL_CATEGORIES ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setActiveCategory(ALL_CATEGORIES)
                    notify('Filtros removidos.')
                  }}
                  className="rounded-full border border-[var(--line)] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--muted)] transition hover:bg-[#f9edf3]"
                >
                  Limpar filtros
                </button>
              ) : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => {
                const isFavorite = favoriteIds.includes(product.id)

                return (
                <article
                  key={product.name}
                  className="glass hover-lift animate-rise rounded-3xl p-4 sm:p-5"
                  style={getDelayStyle(index + 1)}
                >
                  <div className={`relative mb-5 aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${product.tone} p-4`}>
                    <div className="absolute right-3 top-3 rounded-full bg-[#513046] px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[var(--surface-soft)]">
                      {product.category}
                    </div>
                    {product.badge ? (
                      <div className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[0.64rem] font-bold uppercase tracking-[0.11em] text-[#835873]">
                        {product.badge}
                      </div>
                    ) : null}
                    <div className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full bg-white/70">
                      <Gem size={20} className="text-[#7a4b66]" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(product)}
                      className={`absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                        isFavorite
                          ? 'bg-[#8f5875] text-white'
                          : 'bg-white/75 text-[#7a4b66] hover:bg-white'
                      }`}
                      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Heart size={17} />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-[var(--ink)]">{product.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">{product.category}</p>

                  <div className="mt-4 flex items-end gap-2">
                    {product.oldPrice ? (
                      <span className="text-sm text-[var(--muted)] line-through">{product.oldPrice}</span>
                    ) : null}
                    <span className="font-heading text-3xl leading-none text-[var(--ink)]">{product.price}</span>
                  </div>

                  <p className="mt-1 text-sm text-[var(--muted)]">{product.installment}</p>
                  <p className="mt-1 text-sm font-semibold text-[#6f3f5b]">{product.pix}</p>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e2ced9] bg-white/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-[var(--surface-soft)]"
                    >
                      Adicionar <ShoppingBag size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(product)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e2ced9] bg-white/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-[#8f5875] hover:text-white"
                    >
                      {isFavorite ? 'Favorito' : 'Salvar'}
                    </button>
                  </div>
                </article>
                )
              })}
            </div>

            {!filteredProducts.length ? (
              <div className="mt-6 rounded-3xl border border-[var(--line)] bg-white/70 p-7 text-center">
                <p className="text-sm text-[var(--muted)]">
                  Nenhum produto encontrado para os filtros atuais.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('')
                    setActiveCategory(ALL_CATEGORIES)
                    notify('Exibindo todos os produtos.')
                  }}
                  className="mt-4 rounded-full bg-[#8f5875] px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90"
                >
                  Mostrar todos
                </button>
              </div>
            ) : null}
          </div>
        </section>

        <section id="favoritos" className="px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                  Seus favoritos
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Lista de desejos
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">
                {favoriteProducts.length} itens salvos
              </p>
            </div>

            {favoriteProducts.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteProducts.map((product, index) => (
                  <article
                    key={product.id}
                    className="glass hover-lift animate-rise rounded-3xl p-5"
                    style={getDelayStyle(index + 1)}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                      {product.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-[var(--ink)]">{product.name}</h3>
                    <p className="mt-1 font-heading text-3xl text-[var(--ink)]">{product.price}</p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e2ced9] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
                      >
                        Adicionar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(product)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e2ced9] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-[#f3e3eb]"
                      >
                        Remover
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[var(--line)] bg-white/70 p-8 text-center">
                <p className="text-sm text-[var(--muted)]">
                  Voce ainda nao adicionou produtos aos favoritos.
                </p>
                <button
                  type="button"
                  onClick={() => scrollToSection('#destaques')}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#8f5875] px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90"
                >
                  Explorar vitrine <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="sacola" className="px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                  Sacola
                </p>
                <h2 className="mt-2 font-heading text-4xl text-[var(--ink)] sm:text-5xl">
                  Resumo do pedido
                </h2>
              </div>
              <p className="text-sm text-[var(--muted)]">{cartCount} itens na sacola</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="glass rounded-3xl p-5 sm:p-6">
                {cartItems.length ? (
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3"
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
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2ced9] bg-white text-[#7a4b66] transition hover:bg-[#f3e3eb]"
                            aria-label="Remover item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-5 text-sm text-[var(--muted)]">
                    Sua sacola esta vazia. Adicione produtos para continuar.
                  </div>
                )}
              </div>

              <aside className="glass rounded-3xl p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                  Total
                </p>
                <p className="mt-2 font-heading text-4xl leading-none text-[var(--ink)]">
                  {toCurrency(cartTotal)}
                </p>
                <p className="mt-2 text-xs text-[var(--muted)]">Pagamento via Pix e cartao</p>

                <a
                  href={whatsappCheckoutLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] transition ${
                    cartItems.length
                      ? 'bg-[var(--ink)] text-white hover:opacity-90'
                      : 'cursor-not-allowed bg-[#d5c5cf] text-white/80'
                  }`}
                  onClick={(event) => {
                    if (!cartItems.length) {
                      event.preventDefault()
                      notify('Adicione ao menos 1 item para finalizar.')
                      return
                    }

                    notify('Redirecionando para o WhatsApp...', 'success')
                  }}
                >
                  Finalizar no WhatsApp <ExternalLink size={14} />
                </a>

                {cartItems.length ? (
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e2ced9] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-[#f3e3eb]"
                  >
                    Limpar sacola <Trash2 size={14} />
                  </button>
                ) : null}
              </aside>
            </div>
          </div>
        </section>

        <section className="px-4 py-6 lg:px-8 lg:py-10">
          <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] bg-gradient-to-r from-[#5a344a] via-[#7b4c66] to-[#4a2b3f] p-7 text-[#fdf7fb] sm:grid-cols-2 sm:p-10">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#edd8e3]">Experiencia premium</p>
              <h2 className="font-heading text-4xl leading-tight sm:text-5xl">Seu pedido com mimo, cuidado e assinatura de luxo.</h2>
              <p className="max-w-md text-sm leading-relaxed text-[#f6e8ef]">
                Do checkout ao unboxing, cada etapa foi desenhada para gerar desejo, confianca e recompra.
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="rounded-2xl border border-white/20 bg-white/8 p-4">
                <p className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.1em]">
                  <ShieldCheck size={16} /> Compra segura e monitorada
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/8 p-4">
                <p className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.1em]">
                  <Truck size={16} /> Envio agil com rastreio em tempo real
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/8 p-4">
                <p className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.1em]">
                  <Sparkles size={16} /> Embalagem presenteavel em todos os pedidos
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 lg:px-8" id="depoimentos">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-heading text-4xl text-[var(--ink)] sm:text-5xl">Clientes apaixonadas</h2>
              <p className="hidden text-sm text-[var(--muted)] md:block">+ de 2.300 avaliacoes verificadas</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((review, index) => (
                <article
                  key={review.name}
                  className="glass animate-rise rounded-3xl p-5"
                  style={getDelayStyle(index + 1)}
                >
                  <div className="mb-4 flex items-center gap-1 text-[#c97ba0]">
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <Star key={`${review.name}-${starIndex}`} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">"{review.quote}"</p>
                  <p className="mt-5 text-sm font-bold uppercase tracking-[0.11em] text-[var(--ink)]">{review.name}</p>
                  <p className="text-xs text-[var(--muted)]">{review.city}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="newsletter" className="px-4 pb-4 pt-12 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.2rem] border border-[#eadce4] bg-gradient-to-br from-[#f7edf3] via-[#f6f4eb] to-[#f0dde7] p-7 sm:p-10">
            <div className="animate-sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#865772]">clube exclusivo Adry</p>
              <h2 className="mt-3 font-heading text-4xl text-[var(--ink)] sm:text-5xl">Ganhe 10% OFF no primeiro pedido</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                Receba lancamentos, reposicoes e campanhas privadas antes de todo mundo. Sem spam, so conteudo de moda e vantagens reais.
              </p>

              <form
                className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"
                onSubmit={handleNewsletterSubmit}
              >
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  className="h-12 flex-1 rounded-full border border-[#dfcddd] bg-white/85 px-5 text-sm outline-none ring-[#c884a8] transition focus:ring-2"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-7 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--surface-soft)] transition hover:translate-y-[-1px]"
                >
                  Quero meu cupom <ArrowRight size={16} />
                </button>
              </form>

              {newsletterFeedback ? (
                <p className="mt-4 text-sm font-semibold text-[#6f3f5b]">
                  {newsletterFeedback}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer id="rodape" className="mt-12 border-t border-[#e8d9e2] bg-[rgba(245,234,241,0.72)] px-4 pb-10 pt-10 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 text-sm text-[var(--muted)] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-3xl text-[var(--ink)]">Adry</h3>
            <p className="mt-2 max-w-xs leading-relaxed">
              Acessorios com direcao criativa contemporanea, producao selecionada e atendimento humanizado.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink)]">Institucional</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href="#top" onClick={(event) => handleNavRedirect(event, '#top')}>
                  Sobre a marca
                </a>
              </li>
              <li>
                <a
                  href="#newsletter"
                  onClick={(event) => handleNavRedirect(event, '#newsletter')}
                >
                  Duvidas frequentes
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5571900000000"
                  target="_blank"
                  rel="noreferrer"
                >
                  Trocas e devolucoes
                </a>
              </li>
              <li>
                <a
                  href="#rodape"
                  onClick={(event) => handleNavRedirect(event, '#rodape')}
                >
                  Politica de privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink)]">Atendimento</p>
            <ul className="mt-3 space-y-2">
              <li>Seg a Sex, 8h as 18h</li>
              <li>WhatsApp: (71) 90000-0000</li>
              <li>contato@Adry.com.br</li>
              <li>Salvador - BA</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--ink)]">Confianca</p>
            <ul className="mt-3 space-y-2">
              <li className="inline-flex items-center gap-2">
                <ShieldCheck size={15} /> Pagamento seguro
              </li>
              <li className="inline-flex items-center gap-2">
                <Truck size={15} /> Entrega para todo o Brasil
              </li>
              <li className="inline-flex items-center gap-2">
                <Sparkles size={15} /> Curadoria semanal
              </li>
            </ul>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-7xl border-t border-[#e8d9e2] pt-5 text-xs tracking-[0.07em] text-[#8b6c7f]">
          Adry ATELIER ACCESSORIES 2026. Todos os direitos reservados.
        </p>
      </footer>

      {notification ? (
        <div
          className={`fixed bottom-4 right-4 z-50 inline-flex max-w-xs items-center gap-2 rounded-2xl border px-4 py-3 text-sm shadow-xl animate-rise ${
            notification.type === 'success'
              ? 'border-[#d8c0ce] bg-[#fff7fb] text-[#6f3f5b]'
              : 'border-[#e5d8df] bg-white text-[var(--ink)]'
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
