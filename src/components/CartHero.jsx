import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home as HomeIcon } from 'lucide-react'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1800`

// Pehli = aapki local image. Wo na mile to agli Pexels images try hoti hain.
const LOCAL = new URL('../assets/hero/Golden Hour Trench Editorial Over Warm Shadows.webp', import.meta.url).href
const SOURCES = [LOCAL, px(36800324), px(36946580), px(9968540), px(8765332)]

// Image mein ladki kahan hai (0 = left edge, 1 = right edge). Position galat lage to sirf yeh badlo:
// right ko ghatao = ladki thodi right jati hai, badhao = left aati hai.
const FOCUS = { center: 0.69, right: 0.96 }

// Agar image ke andar "Style is always a good idea." pehle se likha hai to isko false kar do
const SHOW_QUOTE = true

const WORDS = ['Shopping', 'Cart']
const QUOTE = ['Style is', 'always a', 'good idea.']
const LG_QUERY = '(min-width: 1024px)'

const mask = (g) => ({ WebkitMaskImage: g, maskImage: g })
const V_MOBILE = 'linear-gradient(to bottom, transparent 0%, #000 6%, #000 76%, transparent 100%)'
const V_LG = 'linear-gradient(to bottom, transparent 0%, #000 7%, #000 90%, transparent 100%)'

// Pehli image jo load ho jaye wahi use hoti hai (aur uski asli ratio bhi milti hai)
function useFirstLoadable(sources) {
  const [state, setState] = useState({ src: null, ratio: 1.78 })
  useEffect(() => {
    let dead = false
    let i = 0
    const next = () => {
      if (dead) return
      if (i >= sources.length) {
        setState({ src: '', ratio: 1.78 })
        return
      }
      const img = new Image()
      img.onload = () => {
        if (!dead) setState({ src: sources[i], ratio: img.naturalWidth / img.naturalHeight || 1.78 })
      }
      img.onerror = () => {
        i += 1
        next()
      }
      img.src = sources[i]
    }
    next()
    return () => {
      dead = true
    }
  }, [sources])
  return state
}

function useIsLg() {
  const [lg, setLg] = useState(() => typeof window !== 'undefined' && window.matchMedia(LG_QUERY).matches)
  useEffect(() => {
    const m = window.matchMedia(LG_QUERY)
    const on = () => setLg(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return lg
}

// Screen ke size ke hisaab se image ko aise sarkata hai ke ladki hamesha poori dikhe
function focusPos(w, h, ratio, lg) {
  const iw = h * ratio
  if (iw <= w + 1) return '50% 12%'
  const max = iw - w
  const x0 = lg ? FOCUS.right * iw - w : FOCUS.center * iw - w / 2
  return `${((Math.min(max, Math.max(0, x0)) / max) * 100).toFixed(2)}% 50%`
}

export default function CartHero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const { src, ratio } = useFirstLoadable(SOURCES)
  const isLg = useIsLg()
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [vp, setVp] = useState({ w: 1280, h: 800 })
  const [mounted, setMounted] = useState(false)
  const ready = mounted && Boolean(src)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  /* Window ka size track karo (hero ki height isi se nikalti hai) */
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])

  /* Stage ka size track karo */
  useEffect(() => {
    const el = stageRef.current
    if (!el || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(([e]) => {
      setBox({ w: e.contentRect.width, h: e.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* Scroll effect: --sy se image (slow zoom + parallax), text aur roshni alag speed se sarakte hain */
  useEffect(() => {
    const el = sectionRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const y = Math.min(window.scrollY, window.innerHeight * 0.9)
      el.style.setProperty('--sy', String(Math.round(y)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Laptop par hero ki height: image bahut wide ho to hero chhota (khali jagah nahi), warna poori screen
  const lgHeight = isLg && src ? Math.round(Math.min(vp.h, Math.max(640, (1.3 * vp.w) / ratio))) : undefined
  const pos = src && box.w ? focusPos(box.w, box.h, ratio, isLg) : '70% 20%'

  const fade = (delay) => ({
    style: { transitionDelay: mounted ? `${delay}ms` : '0ms' },
    className: `transition-[opacity,translate] duration-[1000ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      mounted ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'
    }`,
  })

  return (
    <section
      ref={sectionRef}
      aria-label="Shopping cart"
      style={lgHeight ? { minHeight: lgHeight } : undefined}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[linear-gradient(120deg,#6b4c3a,#3f2a1d)] lg:min-h-[640px] lg:justify-center lg:py-28"
    >
      {/* ===== Blurred backdrop ===== */}
      {src ? (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 -z-10 h-full w-full scale-125 object-cover blur-3xl brightness-[0.65] saturate-125 transition-opacity duration-[1400ms] ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* ===== Image stage (laptop par poora hero bharta hai) ===== */}
      <div
        ref={stageRef}
        className="relative mt-[76px] aspect-[10/11] w-full sm:mt-[88px] sm:aspect-[5/4] md:aspect-[4/3] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto lg:h-full"
        style={mask(isLg ? V_LG : V_MOBILE)}
      >
        {src ? (
          <div
            className={`h-full w-full transition-[scale,opacity] duration-[2200ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
              ready ? 'scale-100 opacity-100' : 'scale-[1.12] opacity-0'
            }`}
          >
            <div
              className="h-full w-full will-change-transform"
              style={{
                transform:
                  'translate3d(0, calc(var(--sy, 0) * 0.1px), 0) scale(calc(1.03 + var(--sy, 0) * 0.00012))',
                transformOrigin: '70% 40%',
              }}
            >
              <img
                src={src}
                alt="Model in a camel trench coat and sunglasses in golden light"
                draggable="false"
                className="h-full w-full object-cover"
                style={{ objectPosition: pos }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* ===== Halki roshni ===== */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-x-10 inset-y-0 mix-blend-soft-light transition-opacity duration-[2000ms] ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(105deg, transparent 20%, rgba(255,226,190,0.2) 34%, transparent 46%, rgba(255,226,190,0.12) 60%, transparent 72%)',
          transform: 'translate3d(0, calc(var(--sy, 0) * 0.06px), 0)',
        }}
      />

      {/* ===== Text readability overlays ===== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(48,30,20,0.72)_0%,rgba(48,30,20,0.3)_44%,transparent_64%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(to_top,rgba(40,25,16,0.92)_0%,rgba(40,25,16,0.55)_45%,transparent_100%)] lg:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[linear-gradient(to_bottom,rgba(40,25,16,0.45),transparent)]"
      />

      {/* ===== Script quote (sirf bade screen par) ===== */}
      {SHOW_QUOTE && (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute right-[5%] top-[58%] z-10 hidden text-right text-[clamp(1.5rem,2.2vw,2.1rem)] leading-[1.35] text-white/85 xl:block"
          style={{
            fontFamily: '"Segoe Script","Ink Free","Brush Script MT","Snell Roundhand",cursive',
            transform: 'translate3d(0, calc(var(--sy, 0) * -0.1px), 0) rotate(-6deg)',
            opacity: 'calc(1 - var(--sy, 0) / 500)',
          }}
        >
          {QUOTE.map((l, i) => (
            <span
              key={l}
              style={{ transitionDelay: mounted ? `${1500 + i * 220}ms` : '0ms', marginRight: `${i * 1.4}rem` }}
              className={`block transition-[opacity,translate,filter] duration-[1400ms] ${EASE} ${
                mounted ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-3 opacity-0 blur-[4px]'
              }`}
            >
              {l}
            </span>
          ))}
        </p>
      )}

      {/* ===== Content ===== */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="-mt-14 max-w-xl pb-12 will-change-transform sm:-mt-24 sm:pb-16 lg:mt-0 lg:max-w-[56%] lg:pb-0"
          style={{
            transform: 'translate3d(0, calc(var(--sy, 0) * -0.16px), 0)',
            opacity: 'calc(1 - var(--sy, 0) / 650)',
          }}
        >
          {/* Eyebrow: YOUR CART */}
          <p
            style={{ transitionDelay: mounted ? '300ms' : '0ms' }}
            className={`cursor-default text-[11px] uppercase tracking-[0.32em] text-[#f3e8dc]/85 transition-[opacity,translate,letter-spacing] duration-[900ms] ${EASE} hover:tracking-[0.42em] sm:text-xs ${
              mounted ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
          >
            Your <span className="font-semibold text-white">Cart</span>
          </p>

          {/* Title: word-mask reveal */}
          <h1
            aria-label="Shopping Cart"
            className="mt-4 font-display text-[clamp(3rem,13vw,5.5rem)] leading-[1.04] text-[#fbf5ee] sm:mt-5 lg:text-[clamp(3.8rem,6.2vw,5.8rem)]"
          >
            {WORDS.map((w, i) => (
              <span
                key={w}
                aria-hidden="true"
                className="mr-[0.22em] inline-block overflow-hidden pb-[0.16em] align-bottom last:mr-0"
              >
                <span
                  style={{ transitionDelay: mounted ? `${420 + i * 160}ms` : '0ms' }}
                  className={`inline-block cursor-default transition-[translate,color] duration-[1200ms] ${EASE} hover:text-[#ecd2b0] motion-reduce:translate-y-0 ${
                    mounted ? 'translate-y-0' : 'translate-y-[118%]'
                  }`}
                >
                  {w}
                </span>
              </span>
            ))}
          </h1>

          <p
            {...fade(900)}
            className={`mt-3 max-w-md text-[15px] leading-7 text-[#f7eee4] sm:mt-4 sm:text-base lg:text-[17px] ${fade(900).className}`}
          >
            Review your selected items, make changes if needed and proceed to checkout when you&apos;re ready.
          </p>

          {/* Breadcrumb */}
          <nav {...fade(1060)} aria-label="Breadcrumb" className={`mt-7 sm:mt-9 ${fade(1060).className}`}>
            <ol className="flex items-center gap-2.5 text-sm text-[#f3e8dc]/90">
              <li>
                <Link
                  to="/"
                  className="group/home inline-flex items-center gap-2 transition-colors duration-300 hover:text-[#ecd2b0]"
                >
                  <HomeIcon
                    size={17}
                    strokeWidth={1.6}
                    className="transition-transform duration-500 group-hover/home:-translate-y-0.5"
                  />
                  Home
                </Link>
              </li>
              <ChevronRight size={14} className="text-white/60" aria-hidden="true" />
              <li aria-current="page" className="font-medium text-white">
                Cart
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </section>
  )
}