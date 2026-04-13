import type { CSSProperties, FormEvent } from 'react'
import { useState } from 'react'
import {
  ArrowRight,
  BadgePercent,
  BanknoteArrowDown,
  Gem,
  Heart,
  Menu,
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
  palette: string
  icon: string
}

type Product = {
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
    name: 'Argola Lua Fosca',
    category: 'Brincos',
    price: 'R$ 129,00',
    pix: 'R$ 116,10 no Pix',
    installment: '4x de R$ 32,25',
    badge: 'Novo',
    tone: 'from-[#f4dee8] via-[#fff6f9] to-[#dfb2c7]',
  },
  {
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
    name: 'Anel Trama Sculpt',
    category: 'Aneis',
    price: 'R$ 112,00',
    pix: 'R$ 100,80 no Pix',
    installment: '3x de R$ 37,33',
    tone: 'from-[#f3d9e5] via-[#fef2f8] to-[#e1b6cb]',
  },
  {
    name: 'Colar Eclipse Longo',
    category: 'Colares',
    price: 'R$ 198,00',
    pix: 'R$ 178,20 no Pix',
    installment: '6x de R$ 33,00',
    tone: 'from-[#f6eee5] via-[#fffaf3] to-[#e7cfdc]',
  },
  {
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

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <div className="relative overflow-x-clip">
      <div className="bg-[#8f5875] text-[0.72rem] font-semibold tracking-[0.12em] text-[#fff8fb] sm:text-xs">
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

            <a href="#" className="group inline-flex flex-col leading-none">
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
                className="transition-colors hover:text-[var(--ink)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <label className="hidden items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm text-[var(--muted)] md:flex">
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar acessorios"
                className="w-40 bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
              />
            </label>

            <button
              type="button"
              aria-label="Favoritos"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-white/70 text-[var(--ink)] transition hover:bg-white"
            >
              <Heart size={17} />
            </button>
            <button
              type="button"
              aria-label="Sacola"
              className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--ink)] text-[var(--surface-soft)] transition hover:scale-105"
            >
              <ShoppingBag size={17} />
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
                  onClick={() => setIsMenuOpen(false)}
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
          <div className="pointer-events-none absolute left-1/2 top-0 h-[42rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(229,184,200,0.35)_0%,_rgba(229,184,200,0)_65%)]" />

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
                <a
                  href="#destaques"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-semibold tracking-[0.08em] text-[var(--surface-soft)] transition hover:translate-y-[-1px]"
                >
                  EXPLORAR AGORA <ArrowRight size={16} />
                </a>
                <a
                  href="#categorias"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-6 py-3 text-sm font-semibold tracking-[0.08em] text-[var(--ink)] transition hover:bg-white"
                >
                  Ver categorias
                </a>
              </div>

              <div className="animate-rise grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3" style={getDelayStyle(4)}>
                {metrics.map((item) => (
                  <div key={item.label} className="glass rounded-2xl px-4 py-3">
                    <p className="font-heading text-3xl leading-none text-[var(--ink)]">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <article className="glass animate-rise relative rounded-[2.2rem] p-5 sm:p-6" style={getDelayStyle(2)}>
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

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <article
                  key={category.name}
                  className={`animate-rise group rounded-3xl border border-white/70 p-5 ${category.palette}`}
                  style={getDelayStyle(index + 1)}
                >
                  <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 font-heading text-2xl text-[var(--ink)] shadow-sm">
                    {category.icon}
                  </div>
                  <h3 className="font-heading text-3xl text-[var(--ink)]">{category.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#745d6b]">{category.subtitle}</p>
                  <p className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-[#815972] transition group-hover:gap-2">
                    explorar <ArrowRight size={14} />
                  </p>
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

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <article
                  key={product.name}
                  className="glass animate-rise rounded-3xl p-4 sm:p-5"
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

                  <button
                    type="button"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e2ced9] bg-white/90 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-[var(--surface-soft)]"
                  >
                    Adicionar <ShoppingBag size={15} />
                  </button>
                </article>
              ))}
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
          <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-[#eadce4] bg-gradient-to-br from-[#f7edf3] via-[#f6f4eb] to-[#f0dde7] p-7 sm:p-10">
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
                  className="h-12 flex-1 rounded-full border border-[#dfcddd] bg-white/85 px-5 text-sm outline-none ring-[#c884a8] transition focus:ring-2"
                />
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-7 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--surface-soft)] transition hover:translate-y-[-1px]"
                >
                  Quero meu cupom <ArrowRight size={16} />
                </button>
              </form>
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
              <li>Sobre a marca</li>
              <li>Duvidas frequentes</li>
              <li>Trocas e devolucoes</li>
              <li>Politica de privacidade</li>
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
    </div>
  )
}

export default App
