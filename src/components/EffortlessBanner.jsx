import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`

// Pehli image fail ho to agli try hoti hai. Apni pasand ki Pexels photo ID sabse upar daal do.
const IMAGES = [39705635, 13751241, 15991060, 36352974, 36800324].map(px)

const LINES = ['Effortless', 'Elegance']

export default function EffortlessBanner() {
  const [ref, inView] = useInView()

  /* Scroll parallax: image aur dunes alag speed se sarakte hain */
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -120 || r.top > vh + 120) return
      const p = (r.top + r.height / 2 - vh / 2) / vh
      el.style.setProperty('--py', `${(p * -40).toFixed(1)}px`)
      el.style.setProperty('--dy', `${(p * 24).toFixed(1)}px`)
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
  }, [ref])

  /* Mouse ke saath chalne wali soft light (sirf desktop) */
  const onMove = (e) => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const fade = (delay) => ({
    style: { transitionDelay: inView ? `${delay}ms` : '0ms' },
    className: `transition-[opacity,translate] duration-[900ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
    }`,
  })

  return (
    <section ref={ref} aria-label="Effortless Elegance" className="mt-20 sm:mt-28">
      {/* Entry: poora card neeche se uthta hai */}
      <div
        className={`transition-[opacity,translate] duration-[1100ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-14 opacity-0'
        }`}
      >
        <div
          onMouseMove={onMove}
          className="group relative isolate aspect-[16/15] overflow-hidden rounded-3xl bg-[linear-gradient(115deg,#8a6650_0%,#b08a6c_48%,#7d5842_100%)] shadow-[0_30px_60px_-34px_rgba(59,42,32,0.6)] ring-1 ring-[#efe8df] transition-[translate,box-shadow] duration-700 hover:-translate-y-1.5 hover:shadow-[0_44px_80px_-34px_rgba(59,42,32,0.75)] sm:aspect-[16/10] lg:aspect-[16/8]"
        >
          {/* Canyon ka dark shade */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(60%_80%_at_85%_8%,rgba(58,36,26,0.55),transparent_70%)]"
          />

          {/* Dunes (scroll par thode sarakte hain) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-8 h-[48%] will-change-transform"
            style={{ transform: 'translate3d(0, var(--dy, 0px), 0)' }}
          >
            <svg viewBox="0 0 800 300" preserveAspectRatio="none" className="h-full w-full">
              <path
                d="M0 210 C 130 130 270 110 410 165 S 690 235 800 110 L800 300 L0 300 Z"
                fill="#a37a5b"
                fillOpacity="0.5"
              />
              <path
                d="M0 255 C 170 195 310 228 460 210 S 710 160 800 195 L800 300 L0 300 Z"
                fill="#7d5842"
                fillOpacity="0.6"
              />
            </svg>
          </div>

          {/* Model ki image: right edge soft fade hoti hai */}
          <div
            className="absolute inset-y-0 left-0 w-[56%] sm:w-[54%]"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, #000 68%, transparent 100%)',
              maskImage: 'linear-gradient(to right, #000 68%, transparent 100%)',
            }}
          >
            <div
              className={`absolute inset-0 transition-[scale] duration-[1800ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                inView ? 'scale-100' : 'scale-[1.15]'
              }`}
            >
              <div
                className="absolute inset-x-0 -top-[8%] h-[116%] will-change-transform"
                style={{ transform: 'translate3d(0, var(--py, 0px), 0)' }}
              >
                <SmartImage
                  sources={IMAGES}
                  alt="Model in a beige linen blazer set"
                  eager
                  className="object-[50%_18%] transition-[opacity,scale] duration-[1200ms] group-hover:scale-[1.06]"
                />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="absolute inset-y-0 right-0 flex w-1/2 flex-col justify-center pl-2 pr-5 sm:w-[46%] sm:pr-10 lg:pr-20">
            <h2
              aria-label="Effortless Elegance"
              className="font-display text-[26px] leading-[1.08] text-[#fbf5ee] sm:text-4xl lg:text-[58px]"
            >
              {LINES.map((w, i) => (
                <span key={w} aria-hidden="true" className="block overflow-hidden pb-[0.14em]">
                  <span
                    style={{ transitionDelay: inView ? `${500 + i * 140}ms` : '0ms' }}
                    className={`block transition-[translate] duration-[1100ms] ${EASE} motion-reduce:translate-y-0 ${
                      inView ? 'translate-y-0' : 'translate-y-[115%]'
                    }`}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </h2>

            <p
              {...fade(900)}
              className={`mt-3 text-[11px] text-[#f3e8dc]/90 sm:mt-5 sm:text-sm lg:text-base ${fade(900).className}`}
            >
              Classic pieces. Modern soul.
            </p>

            <div {...fade(1050)} className={`mt-5 sm:mt-9 ${fade(1050).className}`}>
              <Link
                to="/shop"
                className="group/cta relative inline-flex min-w-[150px] items-center justify-between gap-6 pb-2 text-[11px] font-medium text-white sm:min-w-[220px] sm:text-sm"
              >
                Shop Collection
                <ArrowRight
                  size={17}
                  strokeWidth={1.6}
                  className="transition-transform duration-500 group-hover/cta:translate-x-2"
                />
                <span className="absolute inset-x-0 bottom-0 h-px bg-white/45" />
                <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-[width] duration-500 ease-out group-hover/cta:w-full" />
              </Link>
            </div>
          </div>

          {/* Hover par mouse ke saath chalti roshni */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,236,214,0.2), transparent 60%)',
            }}
          />
        </div>
      </div>
    </section>
  )
}