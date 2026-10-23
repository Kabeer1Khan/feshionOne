import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, ChevronRight, Heart, LayoutGrid, List, Shirt } from 'lucide-react'
import { PRODUCTS, formatPrice } from '../data/products'
import { getMeta } from '../data/productMeta'
import useWishlist from '../hooks/useWishlist'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
// Navbar ki height ke hisaab se: filter bar scroll par iske neeche chipakta hai
const STICKY_TOP = 'top-[68px] sm:top-[80px]'
const STICK_AT = 80

const sized = (url, w, h) => url.replace('w=800&h=960', `w=${w}&h=${h}`)

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'clothing', label: 'Clothing', test: (i) => i.type === 'clothing' },
  { id: 'bags', label: 'Bags', test: (i) => i.type === 'bags' },
  { id: 'shoes', label: 'Shoes', test: (i) => i.type === 'shoes' },
  { id: 'accessories', label: 'Accessories', test: (i) => i.type === 'bags' || i.type === 'accessories' },
]

const SORTS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name', label: 'Name: A to Z' },
]

const C = (name, value) => ({ name, value })

// Slug products.js ke slug se bilkul match hona chahiye. Order = newest pehle.
const NEW_ITEMS = [
  {
    slug: 'tailored-blazer-set',
    type: 'clothing',
    pos: '50% 12%',
    colors: [C('Cream', '#e6d6c3'), C('Taupe', '#a58b78'), C('Ivory', '#efe6d8'), C('Espresso', '#5a3b2e')],
  },
  {
    slug: 'linen-shirt-trousers',
    type: 'clothing',
    pos: '50% 12%',
    colors: [C('Ivory', '#efe6d8'), C('Sand', '#d8c7ae'), C('Olive', '#5b5a3a'), C('Espresso', '#4a3426')],
  },
  {
    slug: 'leather-tote-bag',
    type: 'bags',
    pos: '50% 50%',
    colors: [C('Cognac', '#8a4b25'), C('Tan', '#b8793e'), C('Black', '#171412')],
  },
  {
    slug: 'satin-midi-dress',
    type: 'clothing',
    pos: '50% 14%',
    colors: [C('Chocolate', '#5a3320'), C('Sand', '#d6bda0'), C('Cream', '#f1e7d8')],
  },
  {
    slug: 'leather-loafers',
    type: 'shoes',
    pos: '50% 50%',
    colors: [C('Cream', '#eadfcf'), C('Tan', '#c19a6b'), C('Cognac', '#8a4b25'), C('Black', '#171412')],
  },
  {
    slug: 'classic-trench-coat',
    type: 'clothing',
    pos: '50% 14%',
    colors: [C('Sand', '#d8c0a3'), C('Mocha', '#6b4a38'), C('Camel', '#a67c52'), C('Black', '#171412')],
  },
  {
    slug: 'ribbed-knit-sweater',
    type: 'clothing',
    pos: '50% 14%',
    colors: [C('Chocolate', '#5a3b2e'), C('Stone', '#9a8f84'), C('Sand', '#d8c7ae')],
  },
  {
    slug: 'structured-handbag',
    type: 'bags',
    pos: '50% 50%',
    colors: [C('Cream', '#e7dccb'), C('Tan', '#b8895b'), C('Black', '#171412')],
  },
]

const ITEMS = NEW_ITEMS.map((n, order) => ({
  ...n,
  order,
  product: PRODUCTS.find((p) => p.slug === n.slug),
})).filter((n) => n.product)

function sortItems(list, sort) {
  const arr = [...list]
  if (sort === 'price-asc') arr.sort((a, b) => a.product.price - b.product.price)
  else if (sort === 'price-desc') arr.sort((a, b) => b.product.price - a.product.price)
  else if (sort === 'name') arr.sort((a, b) => a.product.name.localeCompare(b.product.name))
  else arr.sort((a, b) => a.order - b.order)
  return arr
}

/* ------------------------------------------------------------------ */
/* Sort dropdown                                                        */
/* ------------------------------------------------------------------ */
function SortSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const current = SORTS.find((s) => s.id === value) || SORTS[0]

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 min-w-[150px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#e4dcd3] bg-white px-4 text-sm text-[#3b2a20] transition-[border-color] duration-300 hover:border-[#3b2a20] sm:min-w-[190px]"
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`shrink-0 transition-transform duration-500 ${EASE} ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <ul
        role="listbox"
        aria-label="Sort products"
        className={`absolute right-0 top-full z-40 mt-2 w-full min-w-[220px] origin-top-right rounded-xl border border-[#efe8df] bg-white p-1.5 shadow-[0_24px_50px_-20px_rgba(59,42,32,0.45)] transition-[opacity,translate,scale,visibility] duration-300 ${EASE} ${
          open ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-2 scale-95 opacity-0'
        }`}
      >
        {SORTS.map((s) => {
          const active = s.id === value
          return (
            <li key={s.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={active}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  onChange(s.id)
                  setOpen(false)
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-200 ${
                  active ? 'bg-[#f3ece4] font-medium text-[#3b2a20]' : 'text-[#5c4638] hover:bg-[#faf6f1]'
                }`}
              >
                {s.label}
                {active && <Check size={15} strokeWidth={2.2} className="text-[#c9a27a]" />}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Grid / List toggle (slider wala)                                     */
/* ------------------------------------------------------------------ */
function ViewToggle({ view, onChange }) {
  const opts = [
    ['grid', LayoutGrid, 'Grid view'],
    ['list', List, 'List view'],
  ]
  return (
    <div role="group" aria-label="Change layout" className="relative flex h-11 items-center rounded-xl border border-[#e4dcd3] bg-white p-1">
      <span
        aria-hidden="true"
        className={`absolute left-1 top-1 h-9 w-9 rounded-lg bg-[#3b2a20] shadow-md transition-transform duration-500 ${EASE} ${
          view === 'list' ? 'translate-x-9' : 'translate-x-0'
        }`}
      />
      {opts.map(([id, Icon, label]) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          aria-pressed={view === id}
          onClick={() => onChange(id)}
          className={`relative z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-lg transition-colors duration-300 ${
            view === id ? 'text-white' : 'text-[#5c4638] hover:text-[#3b2a20]'
          }`}
        >
          <Icon size={17} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Product card (grid + list dono)                                      */
/* ------------------------------------------------------------------ */
function ProductCard({ item, index, view, saved, onToggle }) {
  const { product, colors, pos } = item
  const [ref, inView] = useInView()
  const [pop, setPop] = useState(false)
  const [colorIdx, setColorIdx] = useState(0)
  const isList = view === 'list'
  const href = `/product/${product.slug}`
  const sources = useMemo(() => product.images.map((u) => sized(u, 720, 864)), [product])
  const description = useMemo(() => getMeta(product).description, [product])
  const delay = isList ? 0 : (index % 4) * 100 + Math.floor(index / 4) * 60

  useEffect(() => {
    if (!pop) return undefined
    const t = setTimeout(() => setPop(false), 320)
    return () => clearTimeout(t)
  }, [pop])

  const swatches = (
    <div className="flex items-center gap-2.5">
      {colors.map((c, i) => (
        <button
          key={c.name}
          type="button"
          title={c.name}
          aria-label={c.name}
          aria-pressed={i === colorIdx}
          onClick={() => setColorIdx(i)}
          style={{ backgroundColor: c.value }}
          className={`h-[18px] w-[18px] cursor-pointer rounded-full transition-[scale,box-shadow] duration-300 ${
            i === colorIdx
              ? 'scale-110 ring-2 ring-[#3b2a20] ring-offset-2 ring-offset-white'
              : 'ring-1 ring-black/10 hover:scale-125'
          }`}
        />
      ))}
    </div>
  )

  return (
    <li
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,translate] duration-[900ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <article
        className={`group relative rounded-2xl border border-[#ebe3d9] bg-white p-1.5 shadow-[0_1px_2px_rgba(59,42,32,0.03),0_12px_30px_-22px_rgba(59,42,32,0.3)] transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-[#dccdbd] hover:shadow-[0_26px_50px_-24px_rgba(59,42,32,0.4)] sm:p-2 ${
          isList ? 'flex gap-4 sm:gap-6' : ''
        }`}
      >
        {/* ---------- Image ---------- */}
        <div className={`relative shrink-0 ${isList ? 'w-36 sm:w-56 lg:w-64' : ''}`}>
          <Link
            to={href}
            aria-label={`View ${product.name}`}
            className="relative block aspect-square overflow-hidden rounded-xl bg-[#eadfd3]"
          >
            <div
              style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
              className={`absolute inset-0 transition-[scale] duration-[1400ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                inView ? 'scale-100' : 'scale-[1.15]'
              }`}
            >
              <div
                data-parallax
                className="absolute inset-x-0 -top-[6%] h-[112%] will-change-transform"
                style={{ transform: 'translate3d(0, var(--py, 0px), 0)' }}
              >
                <SmartImage
                  sources={sources}
                  alt={product.name}
                  className="transition-[opacity,scale] duration-700 group-hover:scale-[1.07]"
                  style={undefined}
                />
              </div>
            </div>

            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-[linear-gradient(to_top,rgba(59,42,32,0.4),transparent)] px-3 pb-3 pt-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="translate-y-3 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-[#3b2a20] shadow-md transition-[translate] duration-500 group-hover:translate-y-0">
                View details
              </span>
            </span>
          </Link>

          {/* New badge */}
          <span
            style={{ transitionDelay: inView ? `${delay + 450}ms` : '0ms' }}
            className={`pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium text-[#3b2a20] shadow-sm transition-[opacity,translate] duration-700 ${EASE} sm:left-3 sm:top-3 ${
              inView ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
          >
            New
          </span>

          {/* Wishlist */}
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            onClick={() => {
              onToggle(product)
              setPop(true)
            }}
            className="absolute right-2.5 top-2.5 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-white/95 shadow-sm transition-[scale,background-color] duration-300 hover:scale-110 hover:bg-white active:scale-90 sm:right-3 sm:top-3"
          >
            <Heart
              size={16}
              strokeWidth={1.8}
              className={`transition-[scale,fill,color] duration-300 ${
                saved ? 'fill-[#3b2a20] text-[#3b2a20]' : 'fill-transparent text-[#5c4638]'
              } ${pop ? 'scale-150' : 'scale-100'}`}
            />
          </button>
        </div>

        {/* ---------- Info ---------- */}
        {isList ? (
          <div className="flex min-w-0 flex-1 flex-col justify-center py-2 pr-2 sm:pr-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#c9a27a] sm:text-[11px]">
              {product.category}
            </p>
            <Link
              to={href}
              className="mt-1.5 block truncate text-[15px] font-medium text-[#3b2a20] transition-colors duration-300 hover:text-[#c9a27a] sm:text-lg"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-sm font-semibold text-[#3b2a20] sm:text-base">{formatPrice(product.price)}</p>
            <p className="mt-3 hidden max-w-lg text-sm leading-6 text-[#5c4638] sm:line-clamp-2 sm:block">
              {description}
            </p>
            <div className="mt-4 flex items-center gap-3">
              {swatches}
              <span className="hidden text-xs text-[#5c4638]/80 sm:inline">{colors[colorIdx].name}</span>
            </div>
            <Link
              to={href}
              className="group/cta mt-4 hidden w-fit items-center gap-2 text-sm font-medium text-[#3b2a20] underline-offset-4 transition-colors duration-300 hover:text-[#c9a27a] sm:inline-flex"
            >
              View details
              <ArrowRight
                size={15}
                strokeWidth={1.7}
                className="transition-transform duration-500 group-hover/cta:translate-x-1.5"
              />
            </Link>
          </div>
        ) : (
          <div className="px-2 pb-3 pt-3.5 sm:px-3 sm:pb-4">
            <Link
              to={href}
              className="block truncate text-[13px] font-medium text-[#3b2a20] transition-colors duration-300 hover:text-[#c9a27a] sm:text-sm"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-[13px] font-semibold text-[#3b2a20] sm:text-sm">{formatPrice(product.price)}</p>
            <div className="mt-3">{swatches}</div>
          </div>
        )}
      </article>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
export default function NewArrivalsGrid() {
  const { ids: savedIds, toggle } = useWishlist()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [stuck, setStuck] = useState(false)
  const [toast, setToast] = useState({ text: '', added: true, on: false })

  const sentinelRef = useRef(null)
  const gridRef = useRef(null)
  const toastTimer = useRef(0)
  const [headRef, headIn] = useInView()

  const items = useMemo(() => {
    const test = FILTERS.find((f) => f.id === filter)?.test || (() => true)
    return sortItems(ITEMS.filter(test), sort)
  }, [filter, sort])

  const gridKey = `${filter}|${sort}|${view}`

  /* ---------- Wishlist toast ---------- */
  const handleToggle = (product) => {
    const added = !savedIds.includes(product.id)
    toggle(product.id)
    clearTimeout(toastTimer.current)
    setToast({
      text: added ? `${product.name} saved to wishlist` : `${product.name} removed`,
      added,
      on: true,
    })
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, on: false })), 2600)
  }
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  /* ---------- Sticky bar: chipakne par shadow ---------- */
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < STICK_AT),
      { rootMargin: `-${STICK_AT}px 0px 0px 0px` },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* ---------- Scroll parallax: images thodi si opposite direction mein sarakti hain ---------- */
  useEffect(() => {
    const root = gridRef.current
    if (!root) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      root.querySelectorAll('[data-parallax]').forEach((el) => {
        const r = el.parentElement.getBoundingClientRect()
        if (r.bottom < -120 || r.top > vh + 120) return
        const p = (r.top + r.height / 2 - vh / 2) / vh
        el.style.setProperty('--py', `${(p * -18).toFixed(1)}px`)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [gridKey])

  const reveal = (i) => ({
    style: { transitionDelay: headIn ? `${i * 70}ms` : '0ms' },
    className: `transition-[opacity,translate] duration-700 ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      headIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`,
  })

  return (
    <section id="new-arrivals-grid" className="scroll-mt-20 bg-[#faf8f5] pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headRef}>
          {/* ================= Breadcrumb ================= */}
          <nav aria-label="Breadcrumb" {...reveal(0)}>
            <ol className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#5c4638] sm:text-xs">
              <li>
                <Link to="/" className="transition-colors duration-300 hover:text-[#c9a27a]">
                  Home
                </Link>
              </li>
              <ChevronRight size={13} className="text-[#b9aa9a]" aria-hidden="true" />
              <li aria-current="page" className="text-[#3b2a20]">
                New Arrivals
              </li>
            </ol>
          </nav>

          <div ref={sentinelRef} aria-hidden="true" className="h-px" />

          {/* ================= Filter bar ================= */}
          <div className={`sticky ${STICKY_TOP} z-30 mt-4 sm:mt-5`}>
            <div
              {...reveal(1)}
              className={`rounded-2xl border border-[#ebe3d9] bg-white/90 backdrop-blur-md transition-[shadow,opacity,translate] duration-500 ${
                stuck ? 'shadow-[0_18px_40px_-22px_rgba(59,42,32,0.5)]' : 'shadow-[0_1px_2px_rgba(59,42,32,0.03)]'
              } ${reveal(1).className}`}
            >
              <div className="flex flex-col gap-3 p-3 sm:p-4 md:flex-row md:items-center md:justify-between md:gap-4">
                {/* Category pills */}
                <div
                  role="group"
                  aria-label="Product categories"
                  className="-mx-1 flex min-w-0 gap-2.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {FILTERS.map((f, i) => {
                    const active = filter === f.id
                    return (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setFilter(f.id)}
                        style={{ transitionDelay: headIn ? `${150 + i * 70}ms` : '0ms' }}
                        className={`h-10 shrink-0 cursor-pointer rounded-full border px-5 text-sm transition-[background-color,color,border-color,box-shadow,opacity,translate] duration-500 hover:-translate-y-0.5 active:scale-95 sm:px-6 ${
                          headIn ? 'opacity-100' : 'translate-y-3 opacity-0'
                        } ${
                          active
                            ? 'border-[#3b2a20] bg-[#3b2a20] font-medium text-white shadow-md'
                            : 'border-[#e4dcd3] bg-white text-[#3b2a20] hover:border-[#3b2a20]'
                        }`}
                      >
                        {f.label}
                      </button>
                    )
                  })}
                </div>

                {/* Sort + view */}
                <div className="flex items-center justify-between gap-3 sm:gap-4 md:justify-end">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#5c4638]">Sort by</span>
                    <SortSelect value={sort} onChange={setSort} />
                  </div>
                  <ViewToggle view={view} onChange={setView} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          Showing {items.length} {items.length === 1 ? 'product' : 'products'}
        </p>

        {/* ================= Products ================= */}
        {items.length > 0 ? (
          <ul
            key={gridKey}
            ref={gridRef}
            className={`mt-6 sm:mt-8 ${
              view === 'grid'
                ? 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6'
                : 'flex flex-col gap-4 sm:gap-5'
            }`}
          >
            {items.map((item, i) => (
              <ProductCard
                key={item.product.id}
                item={item}
                index={i}
                view={view}
                saved={savedIds.includes(item.product.id)}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-8 grid place-items-center rounded-3xl border border-dashed border-[#d9cfc4] bg-white/60 px-6 py-16 text-center sm:py-24">
            <Shirt size={36} strokeWidth={1.3} className="text-[#c9a27a]" />
            <h3 className="mt-4 font-display text-2xl text-[#3b2a20]">Nothing here yet</h3>
            <p className="mt-2 max-w-sm text-sm text-[#5c4638]">
              No new arrivals in this category right now. Try another one or see everything.
            </p>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="mt-6 h-11 cursor-pointer rounded-full bg-[#3b2a20] px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#5c4638]"
            >
              Show all
            </button>
          </div>
        )}
      </div>

      {/* ================= Wishlist toast ================= */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4 transition-[opacity,translate] duration-500 ${EASE} ${
          toast.on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div
          className={`flex max-w-full items-center gap-3 rounded-full bg-[#3b2a20] py-2.5 pl-5 pr-2.5 text-sm text-white shadow-xl ${
            toast.on ? 'pointer-events-auto' : ''
          }`}
        >
          <Heart
            size={15}
            className={toast.added ? 'shrink-0 fill-[#c9a27a] text-[#c9a27a]' : 'shrink-0 text-white/70'}
          />
          <span className="truncate">{toast.text}</span>
          <Link
            to="/wishlist"
            tabIndex={toast.on ? 0 : -1}
            className="shrink-0 rounded-full bg-[#c9a27a] px-4 py-1.5 font-medium text-[#3b2a20] transition-colors hover:bg-[#d8b690]"
          >
            View
          </Link>
        </div>
      </div>
    </section>
  )
}