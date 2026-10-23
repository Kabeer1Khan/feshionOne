import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, ChevronDown, LayoutGrid, List, Shirt } from 'lucide-react'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
// Navbar ki height ke hisaab se: filter bar scroll par iske neeche chipakta hai
const STICKY_TOP = 'top-[68px] sm:top-[80px]'
const STICK_AT = 80

const px = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'bags', label: 'Bags' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'new', label: 'New In' },
]

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'name', label: 'Name: A to Z' },
  { id: 'items-desc', label: 'Most Items' },
  { id: 'items-asc', label: 'Fewest Items' },
]

// to = "View Collection" ka link (Shop page ke ?category= / ?q= filters se chalta hai)
// images = [main, fallback1, fallback2...]: ek fail ho to agli try hoti hai
const COLLECTIONS = [
  {
    id: 'women',
    title: 'Women Collection',
    sub: 'Elegant looks for every moment.',
    items: 48,
    to: '/shop?category=women',
    tags: ['women'],
    pos: 'object-[50%_16%]',
    images: [15991060, 13751241, 39705635, 36352974].map(px),
  },
  {
    id: 'men',
    title: 'Men Collection',
    sub: 'Modern style, timeless appeal.',
    items: 36,
    to: '/shop?category=men',
    tags: ['men'],
    pos: 'object-[50%_14%]',
    images: [20143006, 18178903, 33422452, 7576509].map(px),
  },
  {
    id: 'accessories',
    title: 'Accessories Collection',
    sub: 'Small details. Big impact.',
    items: 64,
    to: '/shop?category=accessories',
    tags: ['accessories'],
    pos: 'object-center',
    images: [157888, 2433862, 4339598, 1152077].map(px),
  },
  {
    id: 'footwear',
    title: 'Footwear Collection',
    sub: 'Step into elegance.',
    items: 42,
    to: '/shop?category=footwear',
    tags: ['footwear', 'new'],
    pos: 'object-center',
    images: [134064, 27081008, 27100521, 27596491].map(px),
  },
  {
    id: 'bags',
    title: 'Bags Collection',
    sub: 'Carry your style.',
    items: 28,
    to: '/shop?q=bag',
    tags: ['bags', 'accessories'],
    pos: 'object-center',
    images: [6650009, 6649429, 5591912, 2433862].map(px),
  },
  {
    id: 'jewellery',
    title: 'Jewellery Collection',
    sub: 'Timeless pieces, lasting beauty.',
    items: 31,
    to: '/shop?category=accessories',
    tags: ['jewellery', 'accessories'],
    pos: 'object-center',
    images: [248077, 27495830, 1405521, 34433226].map(px),
  },
  {
    id: 'winter',
    title: 'Winter Collection',
    sub: 'Warmth meets style.',
    items: 22,
    to: '/shop?q=coat',
    tags: ['women', 'men', 'new'],
    pos: 'object-center',
    images: [5710046, 5475173, 1937336, 12056637].map(px),
  },
  {
    id: 'formal',
    title: 'Formal Collection',
    sub: "For life's special moments.",
    items: 18,
    to: '/shop?q=blazer',
    tags: ['women'],
    pos: 'object-[50%_16%]',
    images: [12240187, 11766631, 18909296, 7944785].map(px),
  },
  {
    id: 'casual',
    title: 'Casual Collection',
    sub: 'Effortless style, everyday.',
    items: 40,
    to: '/shop?q=shirt',
    tags: ['men'],
    pos: 'object-[50%_14%]',
    images: [8610482, 8679912, 16018003, 6175641].map(px),
  },
  {
    id: 'linen',
    title: 'Linen Collection',
    sub: 'Light. Breathable. Perfect.',
    items: 16,
    to: '/shop?q=linen',
    tags: ['women', 'men', 'new'],
    pos: 'object-[50%_16%]',
    images: [27896037, 13235402, 12971112, 34367440, 9214356].map(px),
  },
  {
    id: 'summer',
    title: 'Summer Collection',
    sub: 'Cool looks for sunny days.',
    items: 20,
    to: '/shop?q=dress',
    tags: ['women', 'men', 'new'],
    pos: 'object-[50%_14%]',
    images: [14446891, 21967596, 18360475, 29381847].map(px),
  },
  {
    id: 'luxury',
    title: 'Luxury Collection',
    sub: 'Exclusivity in every detail.',
    items: 14,
    to: '/shop?q=leather',
    tags: ['women', 'accessories', 'new'],
    pos: 'object-[50%_14%]',
    images: [36800324, 36946580, 9968540, 8765332, 32271695].map(px),
  },
]

function sortItems(list, sort) {
  const arr = [...list]
  if (sort === 'name') arr.sort((a, b) => a.title.localeCompare(b.title))
  else if (sort === 'items-desc') arr.sort((a, b) => b.items - a.items)
  else if (sort === 'items-asc') arr.sort((a, b) => a.items - b.items)
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
        className="flex h-11 min-w-[130px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#e4dcd3] bg-white px-4 text-sm text-[#3b2a20] transition-[border-color] duration-300 hover:border-[#3b2a20] sm:min-w-[160px]"
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
        aria-label="Sort collections"
        className={`absolute right-0 top-full z-40 mt-2 w-full min-w-[200px] origin-top-right rounded-xl border border-[#efe8df] bg-white p-1.5 shadow-[0_24px_50px_-20px_rgba(59,42,32,0.45)] transition-[opacity,translate,scale,visibility] duration-300 ${EASE} ${
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
/* Collection card                                                      */
/* ------------------------------------------------------------------ */
function CollectionCard({ c, index, view }) {
  const [ref, inView] = useInView()
  const isList = view === 'list'
  const delay = isList ? 0 : (index % 4) * 110 + Math.floor(index / 4) * 50

  return (
    <li
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,translate] duration-[900ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <article
        className={`group relative isolate overflow-hidden rounded-2xl bg-[#3b2a20] shadow-[0_1px_2px_rgba(59,42,32,0.05),0_14px_30px_-20px_rgba(59,42,32,0.45)] transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_55px_-24px_rgba(59,42,32,0.6)] ${
          isList ? 'h-[200px] sm:h-[230px]' : 'aspect-[4/3] sm:aspect-[20/19]'
        }`}
      >
        {/* Image: entry zoom + scroll parallax + hover zoom */}
        <div
          style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
          className={`absolute inset-0 -z-10 transition-[scale] duration-[1400ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
            inView ? 'scale-100' : 'scale-[1.15]'
          }`}
        >
          <div
            data-parallax
            className="absolute inset-x-0 -top-[7%] h-[114%] will-change-transform"
            style={{ transform: 'translate3d(0, var(--py, 0px), 0)' }}
          >
            <SmartImage
              sources={c.images}
              alt={c.title}
              className={`${c.pos} transition-[opacity,scale] duration-[900ms] group-hover:scale-[1.08]`}
            />
          </div>
        </div>

        {/* Overlays */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(42,27,18,0.9)_0%,rgba(42,27,18,0.5)_38%,rgba(42,27,18,0.08)_68%,transparent_100%)] transition-opacity duration-500 group-hover:opacity-90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(42,27,18,0.22),transparent_30%)]"
        />

        {/* Poora card clickable */}
        <Link to={c.to} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10" />

        {/* Arrow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full border border-white/55 bg-black/10 text-white backdrop-blur-sm transition-[background-color,color,border-color,scale] duration-500 group-hover:scale-110 group-hover:border-white group-hover:bg-white group-hover:text-[#3b2a20]"
        >
          <ArrowUpRight
            size={15}
            strokeWidth={1.8}
            className="transition-transform duration-500 group-hover:-translate-y-px group-hover:translate-x-px"
          />
        </span>

        {/* Content */}
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 p-4 sm:p-4 ${isList ? 'lg:p-6' : 'lg:p-4'}`}
        >
          <h3
            className={`font-display text-[22px] leading-tight text-white transition-transform duration-500 ${EASE} group-hover:-translate-y-1 sm:text-[19px] ${
              isList ? 'sm:text-2xl' : 'lg:text-[20px]'
            }`}
          >
            {c.title}
          </h3>
          <p
            className={`mt-1 text-[13px] text-white/85 transition-transform duration-500 ${EASE} group-hover:-translate-y-1 sm:text-xs ${
              isList ? 'sm:text-sm' : ''
            }`}
          >
            {c.sub}
          </p>

          <div className="mt-3.5 flex items-end justify-between gap-3">
            <Link
              to={c.to}
              className="group/cta pointer-events-auto relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-full border border-white/60 px-4 text-xs font-medium text-white transition-[border-color,scale] duration-500 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a27a] active:scale-95 sm:h-8 sm:px-3.5 sm:text-[11px]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover/cta:scale-x-100"
              />
              <span className="relative z-10 transition-colors duration-500 group-hover/cta:text-[#3b2a20]">
                View Collection
              </span>
              <ArrowRight
                size={13}
                strokeWidth={1.8}
                className="relative z-10 transition-[translate,color] duration-500 group-hover/cta:translate-x-1 group-hover/cta:text-[#3b2a20]"
              />
            </Link>
            <span className="pb-1 text-[11px] text-white/80">{c.items} items</span>
          </div>
        </div>
      </article>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
export default function CollectionsGrid() {
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('featured')
  const [view, setView] = useState('grid')
  const [stuck, setStuck] = useState(false)

  const sentinelRef = useRef(null)
  const gridRef = useRef(null)
  const [barRef, barIn] = useInView()

  const items = useMemo(() => {
    const list = COLLECTIONS.filter((c) => filter === 'all' || c.tags.includes(filter))
    return sortItems(list, sort)
  }, [filter, sort])

  const gridKey = `${filter}|${sort}|${view}`

  /* ---------- Sticky bar: chipakne par blur background ---------- */
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
        el.style.setProperty('--py', `${(p * -22).toFixed(1)}px`)
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
    style: { transitionDelay: barIn ? `${i * 70}ms` : '0ms' },
    className: `transition-[opacity,translate] duration-700 ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      barIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`,
  })

  return (
    <section id="collections-grid" className="scroll-mt-20 bg-[#faf8f5] pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />

        {/* ================= Filter bar ================= */}
        <div ref={barRef} className={`sticky ${STICKY_TOP} z-30 -mx-2 px-2 py-2 sm:-mx-3 sm:px-3`}>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 rounded-2xl bg-[#faf8f5]/85 shadow-[0_14px_32px_-20px_rgba(59,42,32,0.5)] ring-1 ring-[#e8dfd5] backdrop-blur-md transition-opacity duration-300 ${
              stuck ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            {/* Category pills */}
            <div
              role="group"
              aria-label="Collection categories"
              className="-mx-1 flex min-w-0 gap-2.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {FILTERS.map((f, i) => {
                const active = filter === f.id
                const r = reveal(i)
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f.id)}
                    style={r.style}
                    className={`h-10 shrink-0 cursor-pointer rounded-full border px-5 text-sm transition-[background-color,color,border-color,box-shadow,opacity,translate] duration-500 hover:-translate-y-0.5 active:scale-95 sm:px-6 ${
                      barIn ? 'opacity-100' : 'translate-y-4 opacity-0'
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
            <div
              style={reveal(FILTERS.length).style}
              className={`flex items-center justify-between gap-3 sm:gap-4 md:justify-end ${reveal(FILTERS.length).className}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#5c4638]">Sort by</span>
                <SortSelect value={sort} onChange={setSort} />
              </div>
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          Showing {items.length} {items.length === 1 ? 'collection' : 'collections'}
        </p>

        {/* ================= Collections ================= */}
        {items.length > 0 ? (
          <ul
            key={gridKey}
            ref={gridRef}
            className={`mt-5 sm:mt-6 ${
              view === 'grid'
                ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6'
                : 'flex flex-col gap-4 sm:gap-5'
            }`}
          >
            {items.map((c, i) => (
              <CollectionCard key={c.id} c={c} index={i} view={view} />
            ))}
          </ul>
        ) : (
          <div className="mt-8 grid place-items-center rounded-3xl border border-dashed border-[#d9cfc4] bg-white/60 px-6 py-16 text-center sm:py-24">
            <Shirt size={36} strokeWidth={1.3} className="text-[#c9a27a]" />
            <h3 className="mt-4 font-display text-2xl text-[#3b2a20]">No collections here yet</h3>
            <p className="mt-2 max-w-sm text-sm text-[#5c4638]">Try another category or see every collection.</p>
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
    </section>
  )
}