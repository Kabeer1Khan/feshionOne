import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Shirt,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { CATEGORIES, PRODUCTS, formatPrice } from '../data/products'
import useWishlist from '../hooks/useWishlist'

const PAGE_SIZE = 9

// Navbar ki height ke hisaab se adjust karo: filter bar scroll par iske neeche chipakta hai
const STICKY_TOP = 'top-[68px] sm:top-[80px]'
const STICK_AT = 80

const IO_OPTS = { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'name', label: 'Name A–Z' },
]

const PRICES = [
  { id: 'all', label: 'Any price', test: () => true },
  { id: 'u100', label: 'Under $100', test: (p) => p < 100 },
  { id: 'mid', label: '$100 – $150', test: (p) => p >= 100 && p <= 150 },
  { id: 'o150', label: 'Over $150', test: (p) => p > 150 },
]

// Navbar / Categories ke links se aane wale alag-alag naam bhi chal jayenge
const ALIASES = {
  woman: 'women',
  womens: 'women',
  ladies: 'women',
  man: 'men',
  mens: 'men',
  accessory: 'accessories',
  bag: 'accessories',
  bags: 'accessories',
  shoe: 'footwear',
  shoes: 'footwear',
  boots: 'footwear',
}
const CATEGORY_IDS = CATEGORIES.map((c) => c.id)

function normalizeCategory(value) {
  const v = (value || 'all').toLowerCase().trim()
  const mapped = ALIASES[v] || v
  return CATEGORY_IDS.includes(mapped) ? mapped : 'all'
}

function sortItems(list, sort) {
  const arr = [...list]
  if (sort === 'price-asc') arr.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') arr.sort((a, b) => b.price - a.price)
  else if (sort === 'name') arr.sort((a, b) => a.name.localeCompare(b.name))
  return arr
}

/* ------------------------------------------------------------------ */
/* Scroll par ek baar "in view" detect karne wala hook                  */
/* ------------------------------------------------------------------ */
function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, IO_OPTS)
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, inView]
}

/* ------------------------------------------------------------------ */
/* Image: fallback list + skeleton + last mein placeholder              */
/* ------------------------------------------------------------------ */
function ProductImage({ sources, alt }) {
  const [idx, setIdx] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)
  const failed = idx >= sources.length

  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true)
  }, [idx])

  if (failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-[linear-gradient(160deg,#efe5da,#dccbb9)] text-[#5c4638]/60">
        <div className="flex flex-col items-center gap-2 px-4 text-center">
          <Shirt size={34} strokeWidth={1.3} />
          <span className="text-xs">{alt}</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`absolute inset-0 animate-pulse bg-[#e6d9cb] transition-opacity duration-700 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        key={sources[idx]}
        ref={imgRef}
        src={sources[idx]}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable="false"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false)
          setIdx((i) => i + 1)
        }}
        className={`h-full w-full object-cover transition-[opacity,scale] duration-700 group-hover:scale-[1.06] motion-reduce:transition-none ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Product card                                                         */
/* ------------------------------------------------------------------ */
function ProductCard({ product, index, saved, onToggle }) {
  const [ref, inView] = useInView()
  const [pop, setPop] = useState(false)
  const delay = (index % 3) * 110 + Math.floor(index / 3) * 50
  const href = `/product/${product.slug}`

  useEffect(() => {
    if (!pop) return undefined
    const t = setTimeout(() => setPop(false), 320)
    return () => clearTimeout(t)
  }, [pop])

  return (
    <li
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,translate] duration-[900ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <article className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(59,42,32,0.04),0_10px_30px_-18px_rgba(59,42,32,0.25)] ring-1 ring-[#efe8df] transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_46px_-20px_rgba(59,42,32,0.38)]">
        {/* Image */}
        <Link
          to={href}
          aria-label={`View ${product.name}`}
          className="relative block aspect-[5/6] overflow-hidden bg-[#eadfd3]"
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
              <ProductImage sources={product.images} alt={product.name} />
            </div>
          </div>

          {/* Hover: view details */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-[linear-gradient(to_top,rgba(59,42,32,0.38),transparent)] px-3 pb-3 pt-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="translate-y-3 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-[#3b2a20] shadow-md transition-[translate] duration-500 group-hover:translate-y-0">
              View details
            </span>
          </span>
        </Link>

        {/* Info */}
        <div className="flex items-start justify-between gap-2 px-3 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div className="min-w-0">
            <Link
              to={href}
              className="block truncate text-[13px] font-medium text-[#3b2a20] transition-colors duration-300 hover:text-[#c9a27a] sm:text-sm"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-[13px] font-semibold text-[#3b2a20] sm:text-sm">
              {formatPrice(product.price)}
            </p>
          </div>

          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            onClick={() => {
              onToggle(product)
              setPop(true)
            }}
            className="-mr-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-colors duration-300 hover:bg-[#f3ece4] focus-visible:outline-2 focus-visible:outline-[#c9a27a]"
          >
            <Heart
              size={17}
              strokeWidth={1.8}
              className={`transition-[scale,fill,color] duration-300 ${
                saved ? 'fill-[#3b2a20] text-[#3b2a20]' : 'fill-transparent text-[#5c4638]'
              } ${pop ? 'scale-150' : 'scale-100'}`}
            />
          </button>
        </div>
      </article>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
export default function ProductGrid() {
  const [params, setParams] = useSearchParams()
  const { ids: savedIds, toggle } = useWishlist()

  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('featured')
  const [price, setPrice] = useState('all')
  const [savedOnly, setSavedOnly] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const [toast, setToast] = useState({ text: '', added: true, on: false })

  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const toastTimer = useRef(0)
  const [barRef, barIn] = useInView()
  const [pagRef, pagIn] = useInView()

  const category = normalizeCategory(params.get('category'))
  const q = (params.get('q') || '').trim()

  /* ---------- URL helpers (ShopHero ka text bhi isi se badalta hai) ---------- */
  const updateParams = (mutate) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        mutate(next)
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  const setCategory = (id) =>
    updateParams((n) => {
      if (id === 'all') n.delete('category')
      else n.set('category', id)
    })

  const clearQuery = () => updateParams((n) => n.delete('q'))

  const clearAll = () => {
    setSort('featured')
    setPrice('all')
    setSavedOnly(false)
    setPage(1)
    updateParams((n) => {
      n.delete('category')
      n.delete('q')
    })
  }

  /* ---------- Filter + sort + paginate ---------- */
  const filtered = useMemo(() => {
    const priceTest = PRICES.find((p) => p.id === price)?.test || (() => true)
    const term = q.toLowerCase()
    const list = PRODUCTS.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        priceTest(p.price) &&
        (!savedOnly || savedIds.includes(p.id)) &&
        (!term || p.name.toLowerCase().includes(term) || p.category.includes(term)),
    )
    return sortItems(list, sort)
  }, [category, q, price, sort, savedOnly, savedIds])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const items = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const gridKey = `${category}|${q}|${sort}|${price}|${savedOnly}|${safePage}`
  const activeFilters = Number(sort !== 'featured') + Number(price !== 'all') + Number(savedOnly)

  // Category ya search badle to page 1 par wapas
  useEffect(() => {
    setPage(1)
  }, [category, q])

  /* ---------- Page change: grid ke top par smooth scroll ---------- */
  const goToPage = (n) => {
    if (n < 1 || n > pageCount || n === safePage) return
    setPage(n)
    const el = sectionRef.current
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

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

  /* ---------- Sticky bar: chipakne par blur background ---------- */
  useEffect(() => {
    const el = barRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < STICK_AT),
      { rootMargin: `-${STICK_AT}px 0px 0px 0px` },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [barRef])

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

  /* ---------- Filter panel: Esc se band ---------- */
  useEffect(() => {
    if (!panelOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && setPanelOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelOpen])

  const resetPanel = () => {
    setSort('featured')
    setPrice('all')
    setSavedOnly(false)
    setPage(1)
  }

  const reveal = (i) => ({
    style: { transitionDelay: barIn ? `${i * 70}ms` : '0ms' },
    className: `shrink-0 transition-[opacity,translate] duration-700 ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      barIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`,
  })

  const optionBtn = (active) =>
    `cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${
      active
        ? 'border-[#3b2a20] bg-[#3b2a20] text-white'
        : 'border-[#e4dcd3] bg-white text-[#3b2a20] hover:border-[#3b2a20]'
    }`

  return (
    <section
      id="products"
      ref={sectionRef}
      className="scroll-mt-20 bg-[#faf8f5] py-10 sm:py-14 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Sentinel (sticky + entry trigger) */}
        <div ref={barRef} aria-hidden="true" className="h-px" />

        {/* ================= Filter bar ================= */}
        <div className={`sticky ${STICKY_TOP} z-30 -mx-2 px-2 py-2 sm:-mx-3 sm:px-3`}>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 rounded-2xl bg-[#faf8f5]/80 shadow-[0_12px_30px_-18px_rgba(59,42,32,0.5)] ring-1 ring-[#e8dfd5] backdrop-blur-md transition-opacity duration-300 ${
              stuck ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="relative flex items-center justify-between gap-3">
            <nav
              aria-label="Product categories"
              className="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {CATEGORIES.map((c, i) => {
                const active = category === c.id
                const r = reveal(i)
                return (
                  <span key={c.id} style={r.style} className={r.className}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(c.id)}
                      className={`h-10 cursor-pointer rounded-full border px-5 text-sm transition-[background-color,color,border-color,scale] duration-300 active:scale-95 ${
                        active
                          ? 'border-[#3b2a20] bg-[#3b2a20] text-white shadow-md'
                          : 'border-[#e4dcd3] bg-white text-[#3b2a20] hover:border-[#3b2a20]'
                      }`}
                    >
                      {c.label}
                    </button>
                  </span>
                )
              })}
            </nav>

            {/* Filter button + panel */}
            <div className="relative shrink-0">
              <span
                style={reveal(CATEGORIES.length).style}
                className={reveal(CATEGORIES.length).className}
              >
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={panelOpen}
                  onClick={() => setPanelOpen((o) => !o)}
                  className="relative flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#e4dcd3] bg-white px-4 text-sm text-[#3b2a20] shadow-[0_6px_16px_-10px_rgba(59,42,32,0.5)] transition-[border-color,scale] duration-300 hover:border-[#3b2a20] active:scale-95 sm:px-5"
                >
                  <SlidersHorizontal size={16} strokeWidth={1.8} />
                  Filter
                  {activeFilters > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#c9a27a] px-1 text-[11px] font-semibold text-[#3b2a20]">
                      {activeFilters}
                    </span>
                  )}
                </button>
              </span>

              {/* Backdrop */}
              <button
                type="button"
                tabIndex={-1}
                aria-label="Close filters"
                onClick={() => setPanelOpen(false)}
                className={`fixed inset-0 z-40 cursor-default bg-[#3b2a20]/35 backdrop-blur-[2px] transition-opacity duration-300 sm:bg-transparent sm:backdrop-blur-none ${
                  panelOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              />

              {/* Panel: mobile par bottom sheet, tablet/laptop par dropdown */}
              <div
                role="dialog"
                aria-label="Filter and sort"
                className={`fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-[0_-24px_60px_-24px_rgba(59,42,32,0.5)] transition-[opacity,translate,visibility] duration-[450ms] ${EASE} sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-3 sm:max-h-none sm:w-[340px] sm:overflow-visible sm:rounded-2xl sm:shadow-[0_28px_60px_-24px_rgba(59,42,32,0.45)] sm:ring-1 sm:ring-[#efe8df] ${
                  panelOpen
                    ? 'visible translate-y-0 opacity-100'
                    : 'invisible translate-y-10 opacity-0 sm:translate-y-3'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-[#3b2a20]">Filter &amp; sort</h3>
                  <button
                    type="button"
                    aria-label="Close filters"
                    onClick={() => setPanelOpen(false)}
                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[#5c4638] transition-colors hover:bg-[#f3ece4]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="mt-5 text-sm font-semibold text-[#3b2a20]">Sort by</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {SORTS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-pressed={sort === s.id}
                      onClick={() => {
                        setSort(s.id)
                        setPage(1)
                      }}
                      className={optionBtn(sort === s.id)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <p className="mt-5 text-sm font-semibold text-[#3b2a20]">Price</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {PRICES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={price === p.id}
                      onClick={() => {
                        setPrice(p.id)
                        setPage(1)
                      }}
                      className={optionBtn(price === p.id)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={savedOnly}
                  onClick={() => {
                    setSavedOnly((v) => !v)
                    setPage(1)
                  }}
                  className="mt-5 flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#e4dcd3] px-4 py-3 text-left transition-colors hover:border-[#3b2a20]"
                >
                  <span className="flex items-center gap-2.5 text-sm text-[#3b2a20]">
                    <Heart size={16} strokeWidth={1.8} className={savedOnly ? 'fill-[#3b2a20]' : ''} />
                    Saved items only
                    <span className="text-xs text-[#5c4638]/70">({savedIds.length})</span>
                  </span>
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-md border transition-colors duration-300 ${
                      savedOnly
                        ? 'border-[#3b2a20] bg-[#3b2a20] text-white'
                        : 'border-[#d9cfc4] text-transparent'
                    }`}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                </button>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetPanel}
                    className="h-11 cursor-pointer rounded-full px-5 text-sm font-medium text-[#5c4638] transition-colors hover:bg-[#f3ece4]"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanelOpen(false)}
                    className="h-11 flex-1 cursor-pointer rounded-full bg-[#3b2a20] text-sm font-medium text-white transition-colors duration-300 hover:bg-[#5c4638]"
                  >
                    Show {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search chip (?q= se aaye to) */}
        {q && (
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#5c4638]">
            Results for <span className="font-medium text-[#3b2a20]">“{q}”</span>
            <button
              type="button"
              onClick={clearQuery}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#e4dcd3] bg-white px-2.5 py-1 text-xs transition-colors hover:border-[#3b2a20]"
            >
              <X size={12} /> Clear
            </button>
          </p>
        )}

        {/* ================= Grid ================= */}
        {items.length > 0 ? (
          <ul
            key={gridKey}
            ref={gridRef}
            className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 md:grid-cols-3 lg:gap-6"
          >
            {items.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                saved={savedIds.includes(p.id)}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-[#d9cfc4] bg-white/60 px-6 py-16 text-center sm:mt-12 sm:py-24">
            <Shirt size={36} strokeWidth={1.3} className="text-[#c9a27a]" />
            <h3 className="mt-4 font-display text-2xl text-[#3b2a20]">Nothing matches these filters</h3>
            <p className="mt-2 max-w-sm text-sm text-[#5c4638]">
              Try a different category or price range, or start again from the full collection.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 h-11 cursor-pointer rounded-full bg-[#3b2a20] px-6 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#5c4638]"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ================= Pagination ================= */}
        {pageCount > 1 && (
          <nav
            ref={pagRef}
            aria-label="Pagination"
            className={`mt-12 flex items-center justify-center gap-2 transition-[opacity,translate] duration-700 sm:mt-14 ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              pagIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            {safePage > 1 && (
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => goToPage(safePage - 1)}
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-[#e8dfd5] bg-white text-[#3b2a20] transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-[#3b2a20]"
              >
                <ArrowLeft size={17} strokeWidth={1.8} />
              </button>
            )}

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => {
              const active = n === safePage
              return (
                <button
                  key={n}
                  type="button"
                  aria-label={`Page ${n}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => goToPage(n)}
                  className={`grid h-10 w-10 cursor-pointer place-items-center rounded-xl border text-sm font-medium transition-[background-color,color,border-color,translate] duration-300 ${
                    active
                      ? 'border-[#3b2a20] bg-[#3b2a20] text-white shadow-md'
                      : 'border-[#e8dfd5] bg-white text-[#3b2a20] hover:-translate-y-0.5 hover:border-[#3b2a20]'
                  }`}
                >
                  {n}
                </button>
              )
            })}

            <button
              type="button"
              aria-label="Next page"
              disabled={safePage === pageCount}
              onClick={() => goToPage(safePage + 1)}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-[#e8dfd5] bg-white text-[#3b2a20] transition-[border-color,translate,opacity] duration-300 hover:-translate-y-0.5 hover:border-[#3b2a20] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-[#e8dfd5]"
            >
              <ArrowRight size={17} strokeWidth={1.8} />
            </button>
          </nav>
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