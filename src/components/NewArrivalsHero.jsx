import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1800`

// Pehli = aapki local image. Wo na mile to agli Pexels images try hoti hain.
const LOCAL = new URL('../assets/hero/Sunlit Camel Suit Fashion Editorial.webp', import.meta.url).href
const SOURCES = [LOCAL, px(39705635), px(13751241), px(15991060)]

// Image mein ladki kahan hai (0 = left edge, 1 = right edge). Position galat lage to sirf yeh badlo:
// right ko badhao = ladki left jati hai, ghatao = ladki right jati hai.
const FOCUS = { center: 0.65, right: 0.81 }

const WORDS = ['Just', 'Arrived']
const LG_QUERY = '(min-width: 1024px)'

const mask = (g) => ({ WebkitMaskImage: g, maskImage: g })
const V_FULL = 'linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)'
const V_MOBILE = 'linear-gradient(to bottom, transparent 0%, #000 6%, #000 76%, transparent 100%)'
const H_LEFT = 'linear-gradient(to right, transparent 0%, #000 20%)'

// Pehli image jo load ho jaye wahi use hoti hai (aur uski asli ratio bhi milti hai)
function useFirstLoadable(sources) {
  const [state, setState] = useState({ src: null, ratio: 2.9 })
  useEffect(() => {
    let dead = false
    let i = 0
    const next = () => {
      if (dead) return
      if (i >= sources.length) {
        setState({ src: '', ratio: 2.9 })
        return
      }
      const img = new Image()
      img.onload = () => {
        if (!dead) setState({ src: sources[i], ratio: img.naturalWidth / img.naturalHeight || 2.9 })
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
  if (iw <= w + 1) return '50% 14%'
  const max = iw - w
  const x0 = lg ? FOCUS.right * iw - w : FOCUS.center * iw - w / 2
  return `${((Math.min(max, Math.max(0, x0)) / max) * 100).toFixed(2)}% 50%`
}

export default function NewArrivalsHero() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const { src, ratio } = useFirstLoadable(SOURCES)
  const isLg = useIsLg()
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [mounted, setMounted] = useState(false)
  const ready = mounted && Boolean(src)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
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

  /* Scroll effect: --sy se image, text aur roshni alag speed se sarakte hain */
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
      aria-label="New arrivals"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[linear-gradient(120deg,#6b4c3a,#4a3426)] lg:justify-center lg:py-28"
    >
      {/* ===== Blurred backdrop (image kabhi zoom/crop hoke kharab nahi dikhegi) ===== */}
      {src ? (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 -z-10 h-full w-full scale-125 object-cover blur-3xl brightness-[0.7] saturate-125 transition-opacity duration-[1400ms] ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : null}

      {/* ===== Image stage =====
          Mobile/tablet: text ke upar, poori width. Laptop: poori height, right side par ladki. */}
      <div
        ref={stageRef}
        className="relative mt-[76px] aspect-square w-full sm:mt-[88px] sm:aspect-[5/4] md:aspect-[4/3] lg:absolute lg:inset-x-0 lg:inset-y-0 lg:my-auto lg:aspect-auto lg:h-full lg:max-h-[62vw]"
        style={mask(isLg ? H_LEFT : V_MOBILE)}
      >
        <div className="h-full w-full" style={isLg ? mask(V_FULL) : undefined}>
          {src ? (
            <div
              className={`h-full w-full transition-[scale,opacity] duration-[2200ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                ready ? 'scale-100 opacity-100' : 'scale-[1.12] opacity-0'
              }`}
            >
              <div
                className="h-full w-full will-change-transform"
                style={{ transform: 'translate3d(0, calc(var(--sy, 0) * 0.1px), 0) scale(1.04)' }}
              >
                <img
                  src={src}
                  alt="Model in a camel suit in warm sunlight"
                  draggable="false"
                  className="h-full w-full object-cover"
                  style={{ objectPosition: pos }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ===== Dhoop ki lakeerein ===== */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-x-10 inset-y-0 mix-blend-soft-light transition-opacity duration-[2000ms] ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(105deg, transparent 18%, rgba(255,226,190,0.28) 30%, transparent 42%, rgba(255,226,190,0.18) 56%, transparent 68%)',
          transform: 'translate3d(0, calc(var(--sy, 0) * 0.06px), 0)',
        }}
      />

      {/* ===== Text readability overlays ===== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(74,48,32,0.7)_0%,rgba(74,48,32,0.3)_44%,transparent_66%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(to_top,rgba(48,30,20,0.92)_0%,rgba(48,30,20,0.55)_45%,transparent_100%)] lg:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[linear-gradient(to_bottom,rgba(40,25,16,0.45),transparent)]"
      />

      {/* ===== Content ===== */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="-mt-14 max-w-xl pb-12 will-change-transform sm:-mt-24 sm:pb-16 lg:mt-0 lg:max-w-[46%] lg:pb-0"
          style={{
            transform: 'translate3d(0, calc(var(--sy, 0) * -0.16px), 0)',
            opacity: 'calc(1 - var(--sy, 0) / 650)',
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-4">
            <span
              style={{ transitionDelay: mounted ? '300ms' : '0ms' }}
              className={`text-[11px] font-medium uppercase tracking-[0.32em] text-[#f3e8dc]/90 transition-[opacity,translate] duration-[900ms] ${EASE} sm:text-xs ${
                mounted ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
            >
              New Arrivals
            </span>
            <span
              aria-hidden="true"
              style={{ transitionDelay: mounted ? '550ms' : '0ms' }}
              className={`h-px w-10 origin-left bg-[#f3e8dc]/70 transition-transform duration-[1100ms] ${EASE} sm:w-14 ${
                mounted ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </div>

          {/* Title: word-mask reveal */}
          <h1
            aria-label="Just Arrived"
            className="mt-4 font-display text-[clamp(3rem,12vw,5.5rem)] leading-[1.02] text-[#fbf5ee] sm:mt-5 lg:text-[clamp(4.2rem,7.4vw,6.6rem)]"
          >
            {WORDS.map((w, i) => (
              <span
                key={w}
                aria-hidden="true"
                className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom last:mr-0"
              >
                <span
                  style={{ transitionDelay: mounted ? `${420 + i * 160}ms` : '0ms' }}
                  className={`inline-block transition-[translate] duration-[1200ms] ${EASE} motion-reduce:translate-y-0 ${
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
            className={`mt-3 max-w-md text-[15px] leading-7 text-[#f7eee4] sm:mt-4 sm:text-lg ${fade(900).className}`}
          >
            The latest expressions of timeless style.
          </p>

          <div {...fade(1060)} className={`mt-7 sm:mt-8 ${fade(1060).className}`}>
            <Link
              to="/shop"
              className="group/cta relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-white/70 px-7 text-sm font-medium text-white transition-[border-color,scale] duration-500 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a27a] active:scale-[0.97] sm:h-[52px] sm:px-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover/cta:scale-x-100"
              />
              <span className="relative z-10 transition-colors duration-500 group-hover/cta:text-[#3b2a20]">
                Explore the Edit
              </span>
              <ArrowRight
                size={16}
                strokeWidth={1.7}
                className="relative z-10 transition-[translate,color] duration-500 group-hover/cta:translate-x-1.5 group-hover/cta:text-[#3b2a20]"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}