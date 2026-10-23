import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Lock, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react'
import { formatPrice } from '../data/products'
import useCart from '../hooks/useCart'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const MAX_QTY = 10
const FREE_SHIP = 150 // is amount se upar shipping free
const SHIP_FEE = 9
// Promo codes (rate = discount). Naye codes yahan jod sakte ho.
const PROMOS = { FASHIONIA10: 0.1, STYLE15: 0.15 }

const sized = (url, w, h) => (url ? url.replace('w=800&h=960', `w=${w}&h=${h}`) : url)

/* ------------------------------------------------------------------ */
/* Cart row                                                             */
/* ------------------------------------------------------------------ */
function CartRow({ item, index, leaving, onQty, onRemove }) {
  const [ref, inView] = useInView()
  const sources = useMemo(() => [sized(item.image, 360, 450)], [item.image])
  const href = `/product/${item.slug}`

  return (
    <li
      ref={ref}
      style={{ transitionDelay: inView && !leaving ? `${Math.min(index, 4) * 90}ms` : '0ms' }}
      className={`transition-[opacity,translate,scale] duration-[800ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        leaving
          ? '-translate-x-6 scale-95 opacity-0'
          : inView
            ? 'translate-x-0 scale-100 opacity-100'
            : 'translate-y-10 scale-100 opacity-0'
      }`}
    >
      <article className="group flex gap-4 rounded-2xl border border-[#ebe3d9] bg-white p-3 shadow-[0_1px_2px_rgba(59,42,32,0.03),0_12px_30px_-24px_rgba(59,42,32,0.3)] transition-[translate,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-[#dccdbd] hover:shadow-[0_24px_46px_-26px_rgba(59,42,32,0.4)] sm:gap-5 sm:p-4">
        <Link
          to={href}
          aria-label={`View ${item.name}`}
          className="relative block aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-xl bg-[#eadfd3] sm:w-32"
        >
          <SmartImage
            sources={sources}
            alt={item.name}
            className="object-[50%_20%] transition-[opacity,scale] duration-700 group-hover:scale-[1.08]"
          />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={href}
                className="block truncate text-[15px] font-medium text-[#3b2a20] transition-colors duration-300 hover:text-[#c9a27a] sm:text-base"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-xs text-[#5c4638] sm:text-[13px]">
                {item.color} <span className="mx-1 text-[#c9a27a]">•</span> Size {item.size}
              </p>
              <p className="mt-1 text-xs text-[#5c4638]/80 sm:text-[13px]">{formatPrice(item.price)} each</p>
            </div>
            <button
              type="button"
              aria-label={`Remove ${item.name} from cart`}
              onClick={() => onRemove(item)}
              className="group/rm grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-[#5c4638] transition-colors duration-300 hover:bg-[#f3ece4] hover:text-[#3b2a20]"
            >
              <Trash2
                size={17}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover/rm:-rotate-12 group-hover/rm:scale-110"
              />
            </button>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            {/* Quantity stepper */}
            <div className="flex h-10 items-center rounded-xl border border-[#e4dcd3] bg-[#faf8f5] px-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={item.qty <= 1}
                onClick={() => onQty(item.key, item.qty - 1)}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[#3b2a20] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <Minus size={14} strokeWidth={1.9} />
              </button>
              <span aria-live="polite" className="w-8 text-center text-sm font-medium text-[#3b2a20]">
                {item.qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={item.qty >= MAX_QTY}
                onClick={() => onQty(item.key, item.qty + 1)}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[#3b2a20] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
              >
                <Plus size={14} strokeWidth={1.9} />
              </button>
            </div>

            <p className="text-base font-semibold text-[#3b2a20] sm:text-lg">{formatPrice(item.price * item.qty)}</p>
          </div>
        </div>
      </article>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */
export default function CartContents() {
  const { items, count, subtotal, setQty, remove, clear, add } = useCart()
  const [leaving, setLeaving] = useState([])
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState(null)
  const [promoMsg, setPromoMsg] = useState({ text: '', ok: false })
  const [stage, setStage] = useState('closed') // closed | form | done
  const [email, setEmail] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [order, setOrder] = useState({ id: '', paid: 0 })
  const [toast, setToast] = useState({ text: '', undo: null, on: false })

  const [headRef, headIn] = useInView()
  const [sumRef, sumIn] = useInView()
  const timers = useRef([])
  const toastTimer = useRef(0)

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      clearTimeout(toastTimer.current)
    },
    [],
  )

  /* ---------- Totals ---------- */
  const discount = promo ? subtotal * promo.rate : 0
  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIP ? 0 : SHIP_FEE
  const total = Math.max(0, subtotal - discount + shipping)
  const shipPct = Math.min(100, (subtotal / FREE_SHIP) * 100)
  const shipLeft = Math.max(0, FREE_SHIP - subtotal)

  const showToast = (text, undo = null) => {
    clearTimeout(toastTimer.current)
    setToast({ text, undo, on: true })
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, on: false })), 4200)
  }

  /* ---------- Hatana (pehle fade, phir remove) + Undo ---------- */
  const removeItem = (item) => {
    setLeaving((l) => [...l, item.key])
    const t = setTimeout(() => {
      remove(item.key)
      setLeaving((l) => l.filter((k) => k !== item.key))
      const { key, ...rest } = item
      showToast(`${item.name} removed`, () => {
        add(rest)
        setToast((x) => ({ ...x, on: false }))
      })
    }, 420)
    timers.current.push(t)
  }

  const clearCart = () => {
    setLeaving(items.map((i) => i.key))
    const t = setTimeout(() => {
      clear()
      setLeaving([])
      showToast('Cart cleared')
    }, 480)
    timers.current.push(t)
  }

  /* ---------- Promo ---------- */
  const applyPromo = (e) => {
    e.preventDefault()
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    if (PROMOS[code]) {
      setPromo({ code, rate: PROMOS[code] })
      setPromoMsg({ text: `Code applied: ${Math.round(PROMOS[code] * 100)}% off`, ok: true })
      setPromoInput('')
    } else {
      setPromoMsg({ text: 'That code is not valid', ok: false })
    }
  }

  const removePromo = () => {
    setPromo(null)
    setPromoMsg({ text: '', ok: false })
  }

  /* ---------- Checkout (demo) ---------- */
  const openCheckout = () => {
    setEmailErr('')
    setStage('form')
  }
  const closeCheckout = () => setStage('closed')

  const placeOrder = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailErr('Please enter a valid email address')
      return
    }
    setOrder({ id: `FA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, paid: total })
    clear()
    setPromo(null)
    setPromoMsg({ text: '', ok: false })
    setEmail('')
    setStage('done')
  }

  useEffect(() => {
    if (stage === 'closed') return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setStage('closed')
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [stage])

  const rv = (i) => ({
    style: { transitionDelay: headIn ? `${i * 90}ms` : '0ms' },
    className: `transition-[opacity,translate] duration-700 ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
      headIn ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
    }`,
  })

  return (
    <section id="cart-items" className="scroll-mt-20 bg-[#faf8f5] pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {items.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10 xl:grid-cols-[1fr_410px]">
            {/* ================= Items ================= */}
            <div>
              <div ref={headRef} className="flex flex-wrap items-end justify-between gap-3">
                <div {...rv(0)}>
                  <h2 className="font-display text-3xl text-[#3b2a20] sm:text-4xl">Your items</h2>
                  <p aria-live="polite" className="mt-2 text-sm text-[#5c4638]">
                    {count} {count === 1 ? 'piece' : 'pieces'} in your cart
                  </p>
                </div>
                <button
                  {...rv(1)}
                  type="button"
                  onClick={clearCart}
                  className={`group/clear inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-[#e4dcd3] bg-white px-4 text-sm text-[#3b2a20] transition-[border-color,scale,opacity,translate] active:scale-95 hover:border-[#3b2a20] ${rv(1).className}`}
                >
                  <Trash2
                    size={15}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover/clear:-rotate-12"
                  />
                  Clear cart
                </button>
              </div>

              <ul className="mt-6 space-y-4">
                {items.map((it, i) => (
                  <CartRow
                    key={it.key}
                    item={it}
                    index={i}
                    leaving={leaving.includes(it.key)}
                    onQty={setQty}
                    onRemove={removeItem}
                  />
                ))}
              </ul>

              <Link
                to="/shop"
                className="group/back mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#3b2a20] underline-offset-4 transition-colors duration-300 hover:text-[#c9a27a]"
              >
                <ArrowRight
                  size={15}
                  strokeWidth={1.8}
                  className="rotate-180 transition-transform duration-500 group-hover/back:-translate-x-1.5"
                />
                Continue shopping
              </Link>
            </div>

            {/* ================= Summary ================= */}
            <aside
              ref={sumRef}
              className={`h-fit rounded-3xl border border-[#ebe3d9] bg-white p-5 shadow-[0_24px_50px_-32px_rgba(59,42,32,0.45)] transition-[opacity,translate] duration-[1000ms] ${EASE} motion-reduce:translate-x-0 motion-reduce:opacity-100 sm:p-7 lg:sticky lg:top-28 ${
                sumIn ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <h3 className="font-display text-2xl text-[#3b2a20]">Order summary</h3>

              {/* Free shipping progress */}
              <div className="mt-5 rounded-2xl bg-[#faf6f1] p-4">
                <p className="flex items-center gap-2 text-[13px] text-[#3b2a20]">
                  <Truck size={16} strokeWidth={1.7} className="shrink-0 text-[#c9a27a]" />
                  {shipLeft > 0 ? (
                    <span>
                      Add <b className="font-semibold">{formatPrice(shipLeft)}</b> more for free shipping
                    </span>
                  ) : (
                    <span className="font-medium">You have unlocked free shipping</span>
                  )}
                </p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#e8dfd5]">
                  <div
                    style={{ width: sumIn ? `${shipPct}%` : '0%', transitionDelay: sumIn ? '500ms' : '0ms' }}
                    className="h-full rounded-full bg-[linear-gradient(90deg,#c9a27a,#3b2a20)] transition-[width] duration-[1400ms] ease-out"
                  />
                </div>
              </div>

              {/* Promo code */}
              <form onSubmit={applyPromo} className="mt-5">
                <label htmlFor="promo" className="text-[13px] font-medium text-[#3b2a20]">
                  Promo code
                </label>
                <div className="mt-2 flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Tag
                      size={15}
                      strokeWidth={1.7}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b9aa9a]"
                    />
                    <input
                      id="promo"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="FASHIONIA10"
                      autoComplete="off"
                      className="h-11 w-full rounded-xl border border-[#e4dcd3] bg-white pl-10 pr-3 text-base uppercase outline-none transition-colors placeholder:normal-case placeholder:text-[#b9aa9a] focus:border-[#3b2a20] sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 shrink-0 cursor-pointer rounded-xl border border-[#3b2a20] px-5 text-sm font-medium text-[#3b2a20] transition-[background-color,color,scale] duration-300 hover:bg-[#3b2a20] hover:text-white active:scale-95"
                  >
                    Apply
                  </button>
                </div>
                {promoMsg.text && (
                  <p className={`mt-2 text-xs ${promoMsg.ok ? 'text-[#4d7a4a]' : 'text-[#b5523b]'}`}>{promoMsg.text}</p>
                )}
                {promo && (
                  <button
                    type="button"
                    onClick={removePromo}
                    className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#f3ece4] px-3 py-1 text-xs font-medium text-[#3b2a20] transition-colors hover:bg-[#e8dccd]"
                  >
                    {promo.code} <X size={12} strokeWidth={2.2} />
                  </button>
                )}
              </form>

              {/* Totals */}
              <dl className="mt-6 space-y-3 border-t border-[#efe8df] pt-5 text-sm text-[#5c4638]">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-[#3b2a20]">{formatPrice(subtotal)}</dd>
                </div>
                {promo && (
                  <div className="flex justify-between text-[#4d7a4a]">
                    <dt>Discount ({Math.round(promo.rate * 100)}%)</dt>
                    <dd className="font-medium">-{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-[#3b2a20]">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-[#efe8df] pt-4 text-[#3b2a20]">
                  <dt className="text-base font-semibold">Total</dt>
                  <dd className="text-2xl font-semibold">{formatPrice(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={openCheckout}
                className="group/co relative mt-6 flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-[#3b2a20] text-[15px] font-medium text-white shadow-[0_16px_30px_-16px_rgba(59,42,32,0.85)] transition-[background-color,scale] duration-300 before:absolute before:inset-y-0 before:-left-1/3 before:w-1/4 before:-translate-x-[200%] before:-skew-x-12 before:bg-white/15 before:transition-transform before:duration-700 hover:bg-[#5c4638] hover:before:translate-x-[700%] active:scale-[0.98]"
              >
                <Lock size={16} strokeWidth={1.9} />
                Proceed to checkout
                <ArrowRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition-transform duration-500 group-hover/co:translate-x-1.5"
                />
              </button>

              <p className="mt-4 text-center text-xs text-[#5c4638]/80">Free returns within 30 days</p>
            </aside>
          </div>
        ) : (
          /* ================= Empty ================= */
          <div
            ref={headRef}
            className={`grid place-items-center rounded-3xl border border-dashed border-[#d9cfc4] bg-white/60 px-6 py-16 text-center transition-[opacity,translate] duration-[900ms] ${EASE} sm:py-24 ${
              headIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-[#f3ece4] text-[#c9a27a]">
              <ShoppingBag size={34} strokeWidth={1.4} />
            </span>
            <h2 className="mt-6 font-display text-2xl text-[#3b2a20] sm:text-3xl">Your cart is empty</h2>
            <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#5c4638]">
              Looks like you have not added anything yet. Let us find something you will love.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#3b2a20] px-7 text-sm font-medium text-white transition-[background-color,scale] duration-300 hover:bg-[#5c4638] active:scale-95"
              >
                Start shopping
                <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
              <Link
                to="/wishlist"
                className="inline-flex h-12 items-center rounded-full border border-[#d9cfc4] bg-white px-7 text-sm font-medium text-[#3b2a20] transition-[border-color,scale] duration-300 hover:border-[#3b2a20] active:scale-95"
              >
                View wishlist
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ================= Checkout modal (demo) ================= */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        aria-hidden={stage === 'closed'}
        className={`fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6 ${
          stage === 'closed' ? 'invisible delay-500' : 'visible'
        }`}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close checkout"
          onClick={closeCheckout}
          className={`absolute inset-0 cursor-default bg-[#3b2a20]/45 backdrop-blur-[3px] transition-opacity duration-500 ${
            stage === 'closed' ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <div
          className={`relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-[0_30px_80px_-30px_rgba(59,42,32,0.6)] transition-[opacity,translate,scale] duration-500 ${EASE} sm:rounded-3xl sm:p-8 ${
            stage === 'closed' ? 'translate-y-10 scale-[0.97] opacity-0' : 'translate-y-0 scale-100 opacity-100'
          }`}
        >
          {stage === 'done' ? (
            <div className="text-center">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#eef4ec] text-[#4d7a4a]">
                <Check size={36} strokeWidth={2} />
              </span>
              <h3 className="mt-6 font-display text-3xl text-[#3b2a20]">Thank you!</h3>
              <p className="mt-3 text-[15px] leading-7 text-[#5c4638]">
                Your demo order <b className="text-[#3b2a20]">{order.id}</b> for{' '}
                <b className="text-[#3b2a20]">{formatPrice(order.paid)}</b> has been placed. This is a demo store, so
                nothing was charged.
              </p>
              <Link
                to="/shop"
                onClick={closeCheckout}
                className="mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[#3b2a20] px-7 text-sm font-medium text-white transition-[background-color,scale] duration-300 hover:bg-[#5c4638] active:scale-95"
              >
                Continue shopping
                <ArrowRight size={15} strokeWidth={1.8} />
              </Link>
            </div>
          ) : (
            <form onSubmit={placeOrder}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-[#3b2a20] sm:text-3xl">Checkout</h3>
                  <p className="mt-2 text-sm text-[#5c4638]">
                    {count} {count === 1 ? 'item' : 'items'} · Total {formatPrice(total)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close checkout"
                  onClick={closeCheckout}
                  className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-[#5c4638] transition-colors hover:bg-[#f3ece4]"
                >
                  <X size={18} />
                </button>
              </div>

              <label htmlFor="co-email" className="mt-6 block text-[13px] font-medium text-[#3b2a20]">
                Email for your order confirmation
              </label>
              <input
                id="co-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailErr('')
                }}
                placeholder="you@example.com"
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-xl border border-[#e4dcd3] px-4 text-base outline-none transition-colors placeholder:text-[#b9aa9a] focus:border-[#3b2a20] sm:text-sm"
              />
              {emailErr && <p className="mt-2 text-xs text-[#b5523b]">{emailErr}</p>}

              <button
                type="submit"
                className="mt-6 flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#3b2a20] text-[15px] font-medium text-white transition-[background-color,scale] duration-300 hover:bg-[#5c4638] active:scale-[0.98]"
              >
                <Lock size={16} strokeWidth={1.9} />
                Place order
              </button>
              <p className="mt-4 text-center text-xs text-[#5c4638]/80">
                Demo checkout: no payment is taken.
              </p>
            </form>
          )}
        </div>
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
            toast.undo ? 'pr-2.5' : 'pr-5'
          } ${toast.on ? 'pointer-events-auto' : ''}`}
        >
          <span className="truncate">{toast.text}</span>
          {toast.undo && (
            <button
              type="button"
              tabIndex={toast.on ? 0 : -1}
              onClick={toast.undo}
              className="shrink-0 cursor-pointer rounded-full bg-[#c9a27a] px-4 py-1.5 font-medium text-[#3b2a20] transition-colors hover:bg-[#d8b690]"
            >
              Undo
            </button>
          )}
        </div>
      </div>
    </section>
  )
}