import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { PRODUCTS, formatPrice } from '../data/products'
import { getMeta } from '../data/productMeta'
import useWishlist from '../hooks/useWishlist'
import useCart from '../hooks/useCart'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const sized = (url, w, h) => url.replace('w=800&h=960', `w=${w}&h=${h}`)

/* ------------------------------------------------------------------ */
/* Saved product card                                                   */
/* ------------------------------------------------------------------ */
function WishCard({ product, index, leaving, onRemove, onAdd }) {
  const [ref, inView] = useInView()
  const [added, setAdded] = useState(false)
  const timer = useRef(0)
  const href = `/product/${product.slug}`
  const sources = useMemo(() => product.images.map((u) => sized(u, 720, 864)), [product])
  const delay = (index % 4) * 100 + Math.floor(index / 4) * 60
  const pos = product.category === 'women' || product.category === 'men' ? 'object-[50%_14%]' : 'object-center'

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleAdd = () => {
    onAdd(product)
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1800)
  }

  return (
    <li
      ref={ref}
      style={{ transitionDelay: inView && !leaving ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,translate,scale] duration-[800ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        leaving
          ? 'translate-y-2 scale-90 opacity-0'
          : inView
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-12 scale-100 opacity-0'
      }`}
    >
      <article className="group relative rounded-2xl border border-[#ebe3d9] bg-white p-1.5 shadow-[0_1px_2px_rgba(59,42,32,0.03),0_12px_30px_-22px_rgba(59,42,32,0.3)] transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-[#dccdbd] hover:shadow-[0_26px_50px_-24px_rgba(59,42,32,0.4)] sm:p-2">
        <div className="relative">
          <Link
            to={href}
            aria-label={`View ${product.name}`}
            className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-[#eadfd3]"
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
                  className={`${pos} transition-[opacity,scale] duration-700 group-hover:scale-[1.07]`}
                />
              </div>
            </div>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-[linear-gradient(to_top,rgba(59,42,32,0.4),transparent)] px-3 pb-3 pt-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="translate-y-3 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-[#3b2a20] shadow-md transition-[translate] duration-500 group-hover:translate-y-0">
                View details
              </span>
            </span>
          </Link>

          {/* Wishlist se hatao */}
          <button
            type="button"
            aria-label={`Remove ${product.name} from wishlist`}
            onClick={() => onRemove(product)}
            className="group/heart absolute right-2.5 top-2.5 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/95 shadow-sm transition-[scale,background-color] duration-300 hover:scale-110 hover:bg-[#3b2a20] active:scale-90 sm:right-3 sm:top-3"
          >
            <Heart
              size={17}
              strokeWidth={1.8}
              className="fill-[#3b2a20] text-[#3b2a20] transition-colors duration-300 group-hover/heart:fill-white group-hover/heart:text-white"
            />
          </button>
        </div>

        <div className="px-2 pb-2 pt-3.5 sm:px-3 sm:pb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#c9a27a]">{product.category}</p>
          <Link
            to={href}
            className="mt-1 block truncate text-[13px] font-medium text-[#3b2a20] transition-colors duration-300 hover:text-[#c9a27a] sm:text-sm"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-[13px] font-semibold text-[#3b2a20] sm:text-sm">{formatPrice(product.price)}</p>

          <button
            type="button"
            onClick={handleAdd}
            className="group/add relative mt-3.5 flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-[#3b2a20] text-[13px] font-medium text-white transition-[background-color,scale] duration-300 hover:bg-[#5c4638] active:scale-[0.97]"
          >
            <span
              className={`flex items-center gap-2 transition-[translate,opacity] duration-500 ${EASE} ${
                added ? '-translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
              }`}
            >
              <ShoppingBag size={15} strokeWidth={1.8} /> Add to Cart
            </span>
            <span
              aria-hidden={!added}
              className={`absolute inset-0 flex items-center justify-center gap-2 transition-[translate,opacity] duration-500 ${EASE} ${
                added ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              <Check size={16} strokeWidth={2.2} /> Added
            </span>
          </button>
        </div>
      </article>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
export default function WishlistGrid() {
  const { ids, toggle } = useWishlist()
  const { add } = useCart()
  const [leaving, setLeaving] = useState([])
  const [toast, setToast] = useState({ text: '', href: '', cta: '', on: false })
  const [headRef, headIn] = useInView()

  const gridRef = useRef(null)
  const toggleRef = useRef(toggle)
  const toastTimer = useRef(0)
  const timers = useRef([])

  useEffect(() => {
    toggleRef.current = toggle
  }, [toggle])

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current)
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  // Jis order mein save kiye, usi order mein dikhao
  const items = useMemo(() => ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean), [ids])

  const showToast = (text, href = '', cta = '') => {
    clearTimeout(toastTimer.current)
    setToast({ text, href, cta, on: true })
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, on: false })), 2800)
  }

  /* ---------- Hatana (pehle card fade hota hai, phir remove) ---------- */
  const removeOne = (product, silent = false) => {
    setLeaving((l) => (l.includes(product.id) ? l : [...l, product.id]))
    const t = setTimeout(() => {
      toggleRef.current(product.id)
      setLeaving((l) => l.filter((x) => x !== product.id))
      if (!silent) showToast(`${product.name} removed from wishlist`)
    }, 420)
    timers.current.push(t)
  }

  const clearAll = () => {
    items.forEach((p, i) => {
      const t = setTimeout(() => removeOne(p, true), i * 90)
      timers.current.push(t)
    })
    showToast('Wishlist cleared')
  }

  /* ---------- Cart mein daalna ---------- */
  const addToCart = (product) => {
    const meta = getMeta(product)
    add({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: meta.colors[0].name,
      size: meta.defaultSize,
      qty: 1,
    })
    showToast(`${product.name} added to cart`, '/cart', 'View cart')
  }

  /* ---------- Scroll parallax ---------- */
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
  }, [items.length])

  const rv = (i) => ({
    style: { transitionDelay: headIn ? `${i * 90}ms` : '0ms' },
    className: `transition-[opacity,translate] duration-700 ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
      headIn ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
    }`,
  })

  return (
    <section id="wishlist-items" className="scroll-mt-20 bg-[#faf8f5] pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= Header row ================= */}
        <div ref={headRef} className="flex flex-wrap items-end justify-between gap-4">
          <div {...rv(0)}>
            <h2 className="font-display text-3xl text-[#3b2a20] sm:text-4xl">Saved pieces</h2>
            <p aria-live="polite" className="mt-2 text-sm text-[#5c4638]">
              {items.length === 0
                ? 'Nothing saved yet'
                : `${items.length} ${items.length === 1 ? 'item' : 'items'} in your wishlist`}
            </p>
          </div>

          <div {...rv(1)} className={`flex items-center gap-3 ${rv(1).className}`}>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="group/clear inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[#e4dcd3] bg-white px-5 text-sm text-[#3b2a20] transition-[border-color,color,scale] duration-300 hover:border-[#3b2a20] active:scale-95"
              >
                <Trash2
                  size={15}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover/clear:-rotate-12"
                />
                Clear all
              </button>
            )}
            <Link
              to="/shop"
              className="group/shop inline-flex h-11 items-center gap-2 rounded-full bg-[#3b2a20] px-5 text-sm font-medium text-white transition-[background-color,scale] duration-300 hover:bg-[#5c4638] active:scale-95"
            >
              Continue shopping
              <ArrowRight
                size={15}
                strokeWidth={1.8}
                className="transition-transform duration-500 group-hover/shop:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* ================= Items / Empty ================= */}
        {items.length > 0 ? (
          <ul
            ref={gridRef}
            className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
          >
            {items.map((p, i) => (
              <WishCard
                key={p.id}
                product={p}
                index={i}
                leaving={leaving.includes(p.id)}
                onRemove={removeOne}
                onAdd={addToCart}
              />
            ))}
          </ul>
        ) : (
          <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-[#d9cfc4] bg-white/60 px-6 py-16 text-center sm:py-24">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-[#f3ece4] text-[#c9a27a]">
              <Heart size={34} strokeWidth={1.4} />
            </span>
            <h3 className="mt-6 font-display text-2xl text-[#3b2a20] sm:text-3xl">Your wishlist is empty</h3>
            <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#5c4638]">
              Tap the heart on any piece you love and it will wait for you here.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#3b2a20] px-7 text-sm font-medium text-white transition-[background-color,scale] duration-300 hover:bg-[#5c4638] active:scale-95"
              >
                Explore the collection
                <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
              <Link
                to="/new-arrivals"
                className="inline-flex h-12 items-center rounded-full border border-[#d9cfc4] bg-white px-7 text-sm font-medium text-[#3b2a20] transition-[border-color,scale] duration-300 hover:border-[#3b2a20] active:scale-95"
              >
                See new arrivals
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ================= Toast ================= */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4 transition-[opacity,translate] duration-500 ${EASE} ${
          toast.on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div
          className={`flex max-w-full items-center gap-3 rounded-full bg-[#3b2a20] py-2.5 pl-5 text-sm text-white shadow-xl ${
            toast.href ? 'pr-2.5' : 'pr-5'
          } ${toast.on ? 'pointer-events-auto' : ''}`}
        >
          <span className="truncate">{toast.text}</span>
          {toast.href && (
            <Link
              to={toast.href}
              tabIndex={toast.on ? 0 : -1}
              className="shrink-0 rounded-full bg-[#c9a27a] px-4 py-1.5 font-medium text-[#3b2a20] transition-colors hover:bg-[#d8b690]"
            >
              {toast.cta}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}