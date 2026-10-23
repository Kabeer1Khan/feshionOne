import { useEffect } from 'react'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`

// Pehli image fail ho to agli try hoti hai
const IMAGES = [15923917, 8580765, 8581033, 7679444, 9393546, 8483487].map(px)

const TITLE = ['The', 'Beginning']

const PARAGRAPH = [
  'FashiOnia was born from a simple belief — that fashion has the power to inspire, empower and bring people together.',
  'What started as a passion for timeless style has grown into a brand built on quality, creativity and a love for modern elegance.',
]

export default function AboutBeginning() {
  const [ref, inView] = useInView()

  /* Scroll effect: image aur text alag speed se sarakte hain */
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -150 || r.top > vh + 150) return
      const p = (r.top + r.height / 2 - vh / 2) / vh
      el.style.setProperty('--py', `${(p * -38).toFixed(1)}px`)
      el.style.setProperty('--ty', `${(p * 16).toFixed(1)}px`)
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

  return (
    <section ref={ref} aria-labelledby="beginning-title" className="overflow-hidden bg-[#fdfbf8] py-16 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:gap-20 lg:px-8">
        {/* ================= Text ================= */}
        <div
          className="will-change-transform"
          style={{ transform: 'translate3d(0, var(--ty, 0px), 0)' }}
        >
          <h2
            id="beginning-title"
            aria-label="The Beginning"
            className="font-display text-[clamp(2.1rem,4vw,2.9rem)] leading-[1.1] text-[#3b2a20]"
          >
            {TITLE.map((w, i) => (
              <span
                key={w}
                aria-hidden="true"
                className="mr-[0.25em] inline-block overflow-hidden pb-[0.14em] align-bottom last:mr-0"
              >
                <span
                  style={{ transitionDelay: inView ? `${i * 130}ms` : '0ms' }}
                  className={`inline-block cursor-default transition-[translate,color] duration-[1100ms] ${EASE} hover:text-[#c9a27a] motion-reduce:translate-y-0 ${
                    inView ? 'translate-y-0' : 'translate-y-[118%]'
                  }`}
                >
                  {w}
                </span>
              </span>
            ))}
          </h2>

          <p className="mt-6 max-w-md text-[15px] leading-8 text-[#5c4638] sm:mt-7 sm:text-base">
            {PARAGRAPH.map((line, i) => (
              <span
                key={i}
                style={{ transitionDelay: inView ? `${350 + i * 220}ms` : '0ms' }}
                className={`inline transition-[opacity,filter] duration-[1200ms] ${EASE} motion-reduce:opacity-100 motion-reduce:blur-0 ${
                  inView ? 'opacity-100 blur-0' : 'opacity-0 blur-[6px]'
                }`}
              >
                {line}{' '}
              </span>
            ))}
          </p>
        </div>

        {/* ================= Image ================= */}
        <div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
          <div
            style={{ transitionDelay: inView ? '150ms' : '0ms' }}
            className={`group relative transition-[opacity,translate] duration-[1100ms] ${EASE} motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              inView ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            {/* Peeche ka gold frame (hover par thoda sarakta hai) */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-[#c9a27a]/55 transition-[translate,opacity] duration-700 ${EASE} group-hover:translate-x-4 group-hover:translate-y-4 ${
                inView ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              className={`relative aspect-[7/8] overflow-hidden rounded-2xl bg-[#eadfd3] shadow-[0_30px_60px_-34px_rgba(59,42,32,0.55)] transition-[clip-path,box-shadow,translate] duration-[1500ms] ${EASE} group-hover:-translate-y-1.5 group-hover:shadow-[0_44px_80px_-36px_rgba(59,42,32,0.7)] motion-reduce:transition-none`}
              style={{
                clipPath: inView ? 'inset(0% 0% 0% 0% round 16px)' : 'inset(0% 0% 100% 0% round 16px)',
              }}
            >
              <div
                className={`absolute inset-0 transition-[scale] duration-[2000ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                  inView ? 'scale-100' : 'scale-[1.25]'
                }`}
              >
                <div
                  className="absolute inset-x-0 -top-[9%] h-[118%] will-change-transform"
                  style={{ transform: 'translate3d(0, var(--py, 0px), 0)' }}
                >
                  <SmartImage
                    sources={IMAGES}
                    alt="Clothes hanging on a brass rail in warm light"
                    className="object-[50%_45%] transition-[opacity,scale] duration-[1200ms] group-hover:scale-[1.05]"
                  />
                </div>
              </div>

              {/* Halka warm tint */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(59,38,25,0.18),transparent_45%)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}