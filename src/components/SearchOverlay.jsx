import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CornerDownLeft, Search, SearchX, X } from 'lucide-react'
import { PRODUCTS, formatPrice } from '../data/products'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const MAX_RESULTS = 8
const POPULAR = ['Blazer', 'Dress', 'Handbag', 'Boots', 'Linen', 'Sweater']
const POPULAR_SLUGS = ['linen-blazer-set', 'satin-dress', 'leather-handbag', 'trench-coat']

const sized = (url, w, h) => url.replace('w=800&h=960', `w=${w}&h=${h}`)

// Category ke saath ye alfaaz bhi search mein chalte hain (jaise "shoes" likhne par footwear)
const KEYWORDS = {
  women: 'women woman womens ladies clothing apparel',
  men: 'men man mens clothing apparel',
  accessories: 'accessories accessory bag bags handbag purse',
  footwear: 'footwear shoes shoe boots heels',
}

const INDEX = PRODUCTS.map((p) => ({
  p,
  name: p.name.toLowerCase(),
  words: `${p.name} ${p.category} ${KEYWORDS[p.category] || ''}`
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean),
}))

function searchProducts(q) {
  const query = q.toLowerCase().trim()
  const tokens = query.split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  const out = []
  INDEX.forEach(({ p, name, words }, order) => {
    let score = 0
    for (const t of tokens) {
      // "men" sirf "men" se match ho, "women" se nahi: isliye shuruaat se match
      const hit = words.some((w) => w.startsWith(t)) ? 2 : t.length >= 4 && words.some((w) => w.includes(t)) ? 1 : 0
      if (!hit) return
      score += hit
    }
    if (name.startsWith(tokens[0])) score += 3
    if (name.includes(query)) score += 2
    out.push({ p, score, order })
  })
  out.sort((a, b) => b.score - a.score || a.order - b.order)
  return out.map((x) => x.p)
}

function Highlight({ text, tokens }) {
  if (!tokens.length) return text
  const safe = tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${safe.join('|')})`, 'ig')
  return text.split(re).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-[#c9a27a]/50 px-0.5 text-white">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

/* ------------------------------------------------------------------ */
/* Glass result card                                                    */
/* ------------------------------------------------------------------ */
function ResultCard({ product, index, active, tokens, onPick }) {
  const [on, setOn] = useState(false)
  const sources = useMemo(() => product.images.map((u) => sized(u, 480, 600)), [product])

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <li
      data-result
      style={{ transitionDelay: on ? `${index * 55}ms` : '0ms' }}
      className={`transition-[opacity,translate] duration-700 ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        on ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <Link
        to={`/product/${product.slug}`}
        onClick={onPick}
        className={`group block overflow-hidden rounded-2xl border bg-white/15 p-2 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[translate,background-color,border-color] duration-500 hover:-translate-y-1.5 hover:border-white/60 hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white ${
          active ? '-translate-y-1.5 border-white/70 bg-white/25' : 'border-white/30'
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white/20">
          <SmartImage
            sources={sources}
            alt={product.name}
            className="transition-[opacity,scale] duration-700 group-hover:scale-[1.07]"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-[linear-gradient(to_top,rgba(42,27,18,0.5),transparent)] px-3 pb-2.5 pt-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="translate-y-3 rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-medium text-[#3b2a20] transition-[translate] duration-500 group-hover:translate-y-0">
              View details
            </span>
          </span>
        </div>
        <div className="px-1.5 pb-1.5 pt-2.5">
          <p className="truncate text-sm font-medium text-white">
            <Highlight text={product.name} tokens={tokens} />
          </p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] uppercase tracking-[0.16em] text-white/70">{product.category}</span>
            <span className="shrink-0 text-sm font-semibold text-[#f1d9b8]">{formatPrice(product.price)}</span>
          </div>
        </div>
      </Link>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
export default function SearchOverlay() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState(0)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const resetTimer = useRef(0)

  const q = query.trim()
  const tokens = useMemo(() => q.toLowerCase().split(/\s+/).filter(Boolean), [q])
  const results = useMemo(() => searchProducts(q), [q])
  const shown = useMemo(() => {
    if (q) return results.slice(0, MAX_RESULTS)
    const picks = POPULAR_SLUGS.map((s) => PRODUCTS.find((p) => p.slug === s)).filter(Boolean)
    return picks.length ? picks : PRODUCTS.slice(0, 4)
  }, [q, results])

  // "View all" ka link: Shop page ke filters se match karne wala
  const viewAllHref = useMemo(() => {
    if (!q) return '/shop'
    const t = q.toLowerCase()
    const shopCount = PRODUCTS.filter((p) => p.name.toLowerCase().includes(t) || p.category.includes(t)).length
    const cats = new Set(results.map((p) => p.category))
    if (shopCount === 0 && cats.size === 1) return `/shop?category=${[...cats][0]}`
    return `/shop?q=${encodeURIComponent(q)}`
  }, [q, results])

  const openSearch = () => {
    clearTimeout(resetTimer.current)
    setSession((s) => s + 1)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => {
      setQuery('')
      setActive(-1)
    }, 500)
  }

  /* Navbar ke search icon ka click pakadta hai (Navbar mein kuch badalna nahi padta) */
  useEffect(() => {
    const onClick = (e) => {
      const t = e.target
      if (!(t instanceof Element) || t.closest('[data-search-overlay]')) return
      const el = t.closest('button, a, [role="button"]')
      if (!el) return
      const isSearch =
        el.querySelector('svg[class*="lucide-search"]') || /search/i.test(el.getAttribute('aria-label') || '')
      if (!isSearch) return
      e.preventDefault()
      e.stopPropagation()
      openSearch()
    }
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        openSearch()
      }
    }
    const onCustom = () => openSearch()
    document.addEventListener('click', onClick, true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('fashionia:search', onCustom)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('fashionia:search', onCustom)
      clearTimeout(resetTimer.current)
    }
  }, [])

  /* Open hote hi input par focus, page scroll band, Esc se band */
  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const f = setTimeout(() => inputRef.current?.focus(), 80)
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      clearTimeout(f)
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  /* Page badalne par band */
  useEffect(() => {
    if (open) close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => setActive(-1), [q])

  /* Arrow keys se result chuno, Enter se kholo */
  const onInputKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!q || !shown.length) return
      e.preventDefault()
      const next =
        e.key === 'ArrowDown' ? (active + 1) % shown.length : (active - 1 + shown.length) % shown.length
      setActive(next)
      listRef.current?.querySelectorAll('[data-result]')[next]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && shown[active]) navigate(`/product/${shown[active].slug}`)
      else if (q) navigate(viewAllHref)
    }
  }

  return (
    <div
      data-search-overlay
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      aria-hidden={!open}
      className={`fixed inset-0 z-[100] ${open ? 'visible' : 'invisible delay-500'}`}
    >
      {/* Halka blur wala background */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close search"
        onClick={close}
        className={`absolute inset-0 cursor-default bg-[#2a1b12]/45 backdrop-blur-[6px] transition-opacity duration-500 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`relative mx-auto flex h-full w-full max-w-4xl flex-col px-4 pb-4 pt-16 transition-[opacity,translate,scale] duration-500 ${EASE} sm:px-6 sm:pt-24 ${
          open ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-6 scale-[0.98] opacity-0'
        }`}
      >
        {/* ================= Glass search bar ================= */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/20 px-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[border-color,background-color] duration-300 focus-within:border-white/70 focus-within:bg-white/25">
          <Search size={20} strokeWidth={1.7} className="shrink-0 text-white/85" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Search blazers, dresses, bags, boots..."
            aria-label="Search products"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-white placeholder-white/65 outline-none sm:h-16 sm:text-lg"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full bg-white/20 text-white transition-[background-color,rotate] duration-300 hover:rotate-90 hover:bg-white/35"
            >
              <X size={15} strokeWidth={2} />
            </button>
          )}
          <button
            type="button"
            aria-label="Close search"
            onClick={close}
            className="hidden h-8 shrink-0 cursor-pointer items-center rounded-lg border border-white/35 px-2.5 text-[11px] font-medium tracking-wider text-white/85 transition-colors duration-300 hover:bg-white/20 sm:flex"
          >
            ESC
          </button>
          <button
            type="button"
            aria-label="Close search"
            onClick={close}
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-white/90 transition-colors duration-300 hover:bg-white/20 sm:hidden"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* ================= Results ================= */}
        <div
          ref={listRef}
          className="mt-5 min-h-0 flex-1 overflow-y-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Heading row */}
          <div className="flex items-center justify-between gap-3 px-1">
            <p aria-live="polite" className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/80 sm:text-xs">
              {!q
                ? 'Popular right now'
                : results.length > 0
                  ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${q}”`
                  : `No results for “${q}”`}
            </p>
            {q && results.length > 0 && (
              <Link
                to={viewAllHref}
                onClick={close}
                className="group/all inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-white/90 transition-colors hover:text-[#f1d9b8] sm:text-sm"
              >
                View all
                <ArrowRight
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform duration-500 group-hover/all:translate-x-1"
                />
              </Link>
            )}
          </div>

          {/* Popular chips (jab kuch likha na ho ya kuch na mile) */}
          {(!q || results.length === 0) && (
            <div className="mt-4 flex flex-wrap gap-2.5">
              {POPULAR.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setQuery(w)
                    inputRef.current?.focus()
                  }}
                  className="h-9 cursor-pointer rounded-full border border-white/35 bg-white/15 px-4 text-sm text-white backdrop-blur-md transition-[background-color,translate,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/30 active:scale-95"
                >
                  {w}
                </button>
              ))}
            </div>
          )}

          {/* Kuch na mile to */}
          {q && results.length === 0 ? (
            <div className="mt-6 grid place-items-center rounded-3xl border border-white/30 bg-white/15 px-6 py-12 text-center shadow-[0_16px_40px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <SearchX size={34} strokeWidth={1.3} className="text-[#f1d9b8]" />
              <h3 className="mt-4 font-display text-2xl text-white">Nothing found</h3>
              <p className="mt-2 max-w-sm text-sm text-white/80">
                Try a different word, or pick one of the popular searches above.
              </p>
              <Link
                to="/shop"
                onClick={close}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-white/90 px-6 text-sm font-medium text-[#3b2a20] transition-[background-color,scale] duration-300 hover:bg-white active:scale-95"
              >
                Browse all products
                <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
            </div>
          ) : (
            <ul
              key={session}
              className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
            >
              {shown.map((p, i) => (
                <ResultCard
                  key={p.id}
                  product={p}
                  index={i}
                  active={active === i}
                  tokens={tokens}
                  onPick={close}
                />
              ))}
            </ul>
          )}

          {/* Neeche "View all" button + hint */}
          {q && results.length > 0 && (
            <div className="mt-6 flex flex-col items-center gap-3">
              <Link
                to={viewAllHref}
                onClick={close}
                className="group/btn relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-white/45 bg-white/15 px-7 text-sm font-medium text-white backdrop-blur-xl transition-[border-color,scale] duration-500 hover:border-white active:scale-95"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover/btn:scale-x-100"
                />
                <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-[#3b2a20]">
                  View all results
                </span>
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="relative z-10 transition-[translate,color] duration-500 group-hover/btn:translate-x-1.5 group-hover/btn:text-[#3b2a20]"
                />
              </Link>
              <p className="hidden items-center gap-1.5 text-xs text-white/65 sm:flex">
                <CornerDownLeft size={12} /> Enter to see all, arrow keys to browse
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}