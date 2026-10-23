import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronUp, Heart, Loader2 } from 'lucide-react'
import { PRODUCTS, formatPrice } from '../data/products'
import { getMeta } from '../data/productMeta'
import useWishlist from '../hooks/useWishlist'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const BATCH = 8

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`
const sized = (url, w, h) => url.replace('w=800&h=960', `w=${w}&h=${h}`)

// Pehli image fail ho to agli try hoti hai
const BANNER_IMAGES = [18879348, 17012564, 4813561, 12318511, 1926768, 39705635].map(px)

const WORDS = ['The', 'Signature', 'Edit']

// Ye 8 products upar wale New Arrivals grid mein pehle se hain, to Load More mein dobara nahi aayenge
const SHOWN = [
  'tailored-blazer-set',
  'linen-shirt-trousers',
  'leather-tote-bag',
  'satin-midi-dress',
  'leather-loafers',
  'classic-trench-coat',
  'ribbed-knit-sweater',
  'structured-handbag',
]
const EXTRA = PRODUCTS.filter((p) => !SHOWN.includes(p.slug))

/* ------------------------------------------------------------------ */
/* Load More wale cards (upar wale grid jaisa look)                     */
/* ------------------------------------------------------------------ */
function MoreCard({ product, index, saved, onToggle }) {
  const [ref, inView] = useInView()
  const [pop, setPop] = useState(false)
  const [colorIdx, setColorIdx] = useState(0)
  const href = `/product/${product.slug}`
  const colors = useMemo(() => getMeta(product).colors, [product])
  const sources = useMemo(() => product.images.map((u) => sized(u, 720, 864)), [product])
  const pos = product.category === 'women' || product.category === 'men' ? '50% 14%' : '50% 50%'
  const slot = index % BATCH
  const delay = (slot % 4) * 100 + Math.floor(slot / 4) * 60

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
      <article className="group relative rounded-2xl border border-[#ebe3d9] bg-white p-1.5 shadow-[0_1px_2px_rgba(59,42,32,0.03),0_12px_30px_-22px_rgba(59,42,32,0.3)] transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1.5 hover:border-[#dccdbd] hover:shadow-[0_26px_50px_-24px_rgba(59,42,32,0.4)] sm:p-2">
        <div className="relative">
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
              <SmartImage
                sources={sources}
                alt={product.name}
                className="transition-[opacity,scale] duration-700 group-hover:scale-[1.07]"
                style={{ objectPosition: pos }}
              />
            </div>
            <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-[linear-gradient(to_top,rgba(59,42,32,0.4),transparent)] px-3 pb-3 pt-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="translate-y-3 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-[#3b2a20] shadow-md transition-[translate] duration-500 group-hover:translate-y-0">
                View details
              </span>
            </span>
          </Link>

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

        <div className="px-2 pb-3 pt-3.5 sm:px-3 sm:pb-4">
          <Link
            to={href}
            className="block truncate text-[13px] font-medium text-[#3b2a20] transition-colors duration-300 hover:text-[#c9a27a] sm:text-sm"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-[13px] font-semibold text-[#3b2a20] sm:text-sm">{formatPrice(product.price)}</p>
          <div className="mt-3 flex items-center gap-2.5">
            {colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={c.name}
                aria-pressed={i === colorIdx}
                onClick={() => setColorIdx(i)}
                style={{ backgroundColor: c.hex }}
                className={`h-[18px] w-[18px] cursor-pointer rounded-full transition-[scale,box-shadow] duration-300 ${
                  i === colorIdx
                    ? 'scale-110 ring-2 ring-[#3b2a20] ring-offset-2 ring-offset-white'
                    : 'ring-1 ring-black/10 hover:scale-125'
                }`}
              />
            ))}
          </div>
        </div>
      </article>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
export default function SignatureEdit() {
  const { ids: savedIds, toggle } = useWishlist()
  const [bannerRef, bannerIn] = useInView()
  const [rowRef, rowIn] = useInView()
  const [visible, setVisible] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ text: '', added: true, on: false })

  const listRef = useRef(null)
  const loadTimer = useRef(0)
  const toastTimer = useRef(0)

  const done = visible >= EXTRA.length

  /* ---------- Banner: scroll par image alag speed se sarakti hai ---------- */
  useEffect(() => {
    const el = bannerRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -150 || r.top > vh + 150) return
      const p = (r.top + r.height / 2 - vh / 2) / vh
      el.style.setProperty('--py', `${(p * -46).toFixed(1)}px`)
      el.style.setProperty('--ty', `${(p * -10).toFixed(1)}px`)
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
  }, [bannerRef])

  /* Mouse ke saath chalti halki roshni (sirf desktop) */
  const onMove = (e) => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  /* ---------- Load More / Show Less ---------- */
  const loadMore = () => {
    if (loading) return
    setLoading(true)
    const prev = visible
    loadTimer.current = setTimeout(() => {
      setVisible((v) => Math.min(EXTRA.length, v + BATCH))
      setLoading(false)
      // Naye products ki taraf smooth scroll
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          const first = listRef.current?.children[prev]
          if (first) {
            window.scrollTo({
              top: first.getBoundingClientRect().top + window.scrollY - 110,
              behavior: 'smooth',
            })
          }
        }),
      )
    }, 550)
  }

  const showLess = () => {
    setVisible(0)
    const el = bannerRef.current
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' })
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

  useEffect(
    () => () => {
      clearTimeout(loadTimer.current)
      clearTimeout(toastTimer.current)
    },
    [],
  )

  const fade = (delay) => ({
    style: { transitionDelay: bannerIn ? `${delay}ms` : '0ms' },
    className: `transition-[opacity,translate] duration-[1000ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      bannerIn ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
    }`,
  })

  return (
    <section
      aria-label="Featured collection"
      className="-mt-6 bg-[#faf8f5] pb-16 sm:-mt-8 sm:pb-20 lg:-mt-14 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================= Banner ================= */}
        <div
          ref={bannerRef}
          className={`transition-[opacity,translate,scale] duration-[1100ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none ${
            bannerIn ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-14 scale-[0.97] opacity-0'
          }`}
        >
          <div
            onMouseMove={onMove}
            className="group relative isolate h-[440px] overflow-hidden rounded-[20px] bg-[linear-gradient(100deg,#35221680%,#3f2a1d_0%,#4a3123_46%,#6b4a35_100%)] shadow-[0_24px_50px_-30px_rgba(59,42,32,0.7)] transition-[translate,box-shadow] duration-700 hover:-translate-y-1 hover:shadow-[0_38px_70px_-32px_rgba(59,42,32,0.85)] sm:h-[340px] lg:h-[300px] xl:h-[330px]"
            style={{ translate: '0 var(--ty, 0px)' }}
          >
            {/* Image */}
            <div className="absolute inset-0 -z-10 sm:left-auto sm:right-0 sm:w-[64%] sm:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_36%)] sm:[mask-image:linear-gradient(to_right,transparent_0%,#000_36%)]">
              <div
                className={`absolute inset-0 transition-[scale,opacity] duration-[1900ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                  bannerIn ? 'scale-100 opacity-100' : 'scale-[1.16] opacity-0'
                }`}
              >
                <div
                  className="absolute inset-x-0 -top-[12%] h-[124%] will-change-transform"
                  style={{ transform: 'translate3d(0, var(--py, 0px), 0)' }}
                >
                  <SmartImage
                    sources={BANNER_IMAGES}
                    alt="Model in a camel blazer and sunglasses"
                    eager
                    className="object-[60%_28%]"
                  />
                </div>
              </div>
            </div>

            {/* Overlays */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(53,34,22,0.96)_0%,rgba(53,34,22,0.62)_48%,transparent_82%)] sm:hidden"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(53,34,22,0.55)_0%,transparent_45%)] sm:block"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(380px circle at var(--mx, 70%) var(--my, 50%), rgba(255,226,190,0.16), transparent 60%)',
              }}
            />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-end p-6 sm:max-w-[56%] sm:justify-center sm:p-10 lg:px-14">
              <div className="flex items-center gap-4">
                <span
                  style={{ transitionDelay: bannerIn ? '350ms' : '0ms' }}
                  className={`text-[10px] font-medium uppercase tracking-[0.32em] text-[#e9dccb]/85 transition-[opacity,translate] duration-[900ms] ${EASE} sm:text-xs ${
                    bannerIn ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                >
                  Featured Collection
                </span>
                <span
                  aria-hidden="true"
                  style={{ transitionDelay: bannerIn ? '600ms' : '0ms' }}
                  className={`hidden h-px w-14 origin-left bg-[#e9dccb]/35 transition-transform duration-[1100ms] ${EASE} sm:block ${
                    bannerIn ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </div>

              <h2
                aria-label="The Signature Edit"
                className="mt-3 font-display text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.06] text-[#fbf5ee] sm:mt-4"
              >
                {WORDS.map((w, i) => (
                  <span
                    key={w}
                    aria-hidden="true"
                    className="mr-[0.24em] inline-block overflow-hidden pb-[0.14em] align-bottom last:mr-0"
                  >
                    <span
                      style={{ transitionDelay: bannerIn ? `${450 + i * 130}ms` : '0ms' }}
                      className={`inline-block transition-[translate] duration-[1100ms] ${EASE} motion-reduce:translate-y-0 ${
                        bannerIn ? 'translate-y-0' : 'translate-y-[118%]'
                      }`}
                    >
                      {w}
                    </span>
                  </span>
                ))}
              </h2>

              <p
                {...fade(850)}
                className={`mt-2 text-[14px] leading-6 text-[#f3e8dc] sm:mt-3 sm:text-base ${fade(850).className}`}
              >
                Refined silhouettes. Lasting impressions.
              </p>

              <div {...fade(1000)} className={`mt-5 sm:mt-6 ${fade(1000).className}`}>
                <Link
                  to="/shop"
                  className="group/cta relative inline-flex h-11 items-center gap-3 overflow-hidden rounded-full border border-white/65 px-6 text-sm font-medium text-white transition-[border-color,scale] duration-500 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a27a] active:scale-[0.97]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover/cta:scale-x-100"
                  />
                  <span className="relative z-10 transition-colors duration-500 group-hover/cta:text-[#3b2a20]">
                    Shop Collection
                  </span>
                  <ArrowRight
                    size={15}
                    strokeWidth={1.7}
                    className="relative z-10 transition-[translate,color] duration-500 group-hover/cta:translate-x-1.5 group-hover/cta:text-[#3b2a20]"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Load More wale products ================= */}
        {visible > 0 && (
          <ul
            ref={listRef}
            className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
          >
            {EXTRA.slice(0, visible).map((p, i) => (
              <MoreCard
                key={p.id}
                product={p}
                index={i}
                saved={savedIds.includes(p.id)}
                onToggle={handleToggle}
              />
            ))}
          </ul>
        )}

        <p role="status" aria-live="polite" className="sr-only">
          {visible > 0 ? `Showing ${visible} more products` : ''}
        </p>

        {/* ================= Load More button ================= */}
        {EXTRA.length > 0 && (
          <div ref={rowRef} className="mt-10 flex items-center justify-center gap-4 sm:mt-12 sm:gap-8">
            <span
              aria-hidden="true"
              className={`h-px max-w-[240px] flex-1 origin-right bg-[#d9cfc4] transition-transform duration-[1200ms] ${EASE} ${
                rowIn ? 'scale-x-100' : 'scale-x-0'
              }`}
            />

            <button
              type="button"
              disabled={loading}
              onClick={done ? showLess : loadMore}
              style={{ transitionDelay: rowIn ? '200ms' : '0ms' }}
              className={`group/btn relative inline-flex h-12 shrink-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-full border border-[#d9cfc4] bg-white px-8 text-sm font-medium text-[#3b2a20] transition-[opacity,translate,border-color,scale,box-shadow] duration-700 ${EASE} hover:border-[#3b2a20] hover:shadow-[0_14px_30px_-16px_rgba(59,42,32,0.5)] active:scale-95 disabled:cursor-wait ${
                rowIn ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-[#3b2a20] transition-transform duration-500 ease-out group-hover/btn:scale-y-100 group-disabled/btn:scale-y-0"
              />
              <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-white group-disabled/btn:text-[#3b2a20]">
                {loading ? 'Loading' : done ? 'Show Less' : 'Load More'}
              </span>
              {loading ? (
                <Loader2 size={16} strokeWidth={1.8} className="relative z-10 animate-spin" />
              ) : done ? (
                <ChevronUp
                  size={16}
                  strokeWidth={1.8}
                  className="relative z-10 transition-[translate,color] duration-500 group-hover/btn:-translate-y-0.5 group-hover/btn:text-white"
                />
              ) : (
                <ChevronDown
                  size={16}
                  strokeWidth={1.8}
                  className="relative z-10 transition-[translate,color] duration-500 group-hover/btn:translate-y-0.5 group-hover/btn:text-white"
                />
              )}
            </button>

            <span
              aria-hidden="true"
              className={`h-px max-w-[240px] flex-1 origin-left bg-[#d9cfc4] transition-transform duration-[1200ms] ${EASE} ${
                rowIn ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
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