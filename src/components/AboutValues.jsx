import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Gem, Heart, Leaf, Sparkles } from 'lucide-react'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1400`

// Pehli image fail ho to agli try hoti hai
const IMAGES = [11425731, 17267362, 7682076, 36946580, 36800324].map(px)

const VALUES = [
  { icon: Gem, title: 'Premium Quality', text: 'Only the finest materials and craftsmanship.' },
  { icon: Leaf, title: 'Sustainable Fashion', text: 'A kinder choice for a better future.' },
  { icon: Heart, title: 'Timeless Style', text: 'Classic designs that never fade.' },
  { icon: Sparkles, title: 'Customer First', text: 'Your style, our priority.' },
]

const TITLE = ['Our', 'Values']
const BANNER_LINES = ['More', 'Than', 'Just Fashion']

export default function AboutValues() {
  const [valuesRef, valuesIn] = useInView()
  const [bannerRef, bannerIn] = useInView()

  /* Banner: scroll par image text se alag speed se sarakti hai */
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
      el.style.setProperty('--py', `${(p * -44).toFixed(1)}px`)
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

  /* Text panel par mouse ke saath chalti halki roshni (sirf desktop) */
  const onMove = (e) => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section aria-label="Our values" className="bg-[#faf8f5] pb-16 pt-4 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Upar ki patli line (draw hoti hai) */}
        <span
          aria-hidden="true"
          className={`block h-px origin-left bg-[#e8dfd5] transition-transform duration-[1400ms] ${EASE} ${
            valuesIn ? 'scale-x-100' : 'scale-x-0'
          }`}
        />

        {/* ================= Our Values ================= */}
        <div ref={valuesRef} className="pt-10 sm:pt-12">
          <h2
            aria-label="Our Values"
            className="font-display text-[clamp(1.7rem,3vw,2.2rem)] leading-[1.1] text-[#3b2a20]"
          >
            {TITLE.map((w, i) => (
              <span
                key={w}
                aria-hidden="true"
                className="mr-[0.25em] inline-block overflow-hidden pb-[0.14em] align-bottom last:mr-0"
              >
                <span
                  style={{ transitionDelay: valuesIn ? `${i * 120}ms` : '0ms' }}
                  className={`inline-block cursor-default transition-[translate,color] duration-[1000ms] ${EASE} hover:text-[#c9a27a] motion-reduce:translate-y-0 ${
                    valuesIn ? 'translate-y-0' : 'translate-y-[118%]'
                  }`}
                >
                  {w}
                </span>
              </span>
            ))}
          </h2>

          <ul className="mt-9 grid grid-cols-2 gap-y-10 sm:mt-10 lg:grid-cols-4 lg:gap-y-0">
            {VALUES.map((v, i) => {
              const Icon = v.icon
              return (
                <li
                  key={v.title}
                  style={{ transitionDelay: valuesIn ? `${200 + i * 130}ms` : '0ms' }}
                  className={`group relative px-4 transition-[opacity,translate] duration-[1000ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none sm:px-6 ${
                    i === 0 ? 'pl-0 sm:pl-0' : ''
                  } ${i === 2 ? 'max-lg:pl-0 max-lg:sm:pl-0' : ''} ${
                    valuesIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                >
                  {/* Vertical divider (neeche se upar draw hota hai) */}
                  <span
                    aria-hidden="true"
                    style={{ transitionDelay: valuesIn ? `${400 + i * 130}ms` : '0ms' }}
                    className={`absolute inset-y-0 left-0 w-px origin-top bg-[#e8dfd5] transition-transform duration-[1200ms] ${EASE} ${
                      i === 0 ? 'hidden' : i % 2 === 0 ? 'hidden lg:block' : 'block'
                    } ${valuesIn ? 'scale-y-100' : 'scale-y-0'}`}
                  />

                  <div className="transition-transform duration-500 group-hover:-translate-y-1.5">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-[#f3ece4] text-[#5c4638] transition-[background-color,color,scale,rotate] duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#3b2a20] group-hover:text-white">
                      <Icon size={22} strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-5 text-[15px] font-semibold text-[#3b2a20] transition-colors duration-300 group-hover:text-[#c9a27a]">
                      {v.title}
                    </h3>
                    <p className="mt-2 max-w-[180px] text-[13px] leading-6 text-[#6b5a4e]">{v.text}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* ================= More Than Just Fashion banner ================= */}
        <div
          ref={bannerRef}
          className={`mt-14 transition-[opacity,translate,scale] duration-[1100ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none sm:mt-20 ${
            bannerIn ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-14 scale-[0.97] opacity-0'
          }`}
        >
          <div className="group/banner grid overflow-hidden rounded-2xl bg-[#5a4030] shadow-[0_30px_60px_-34px_rgba(59,42,32,0.7)] transition-[translate,box-shadow] duration-700 hover:-translate-y-1 hover:shadow-[0_44px_80px_-36px_rgba(59,42,32,0.85)] sm:min-h-[420px] sm:grid-cols-[0.92fr_1fr] lg:min-h-[470px]">
            {/* Image */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#8a6a52] sm:aspect-auto">
              <div
                className={`absolute inset-0 transition-[scale,opacity] duration-[1900ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                  bannerIn ? 'scale-100 opacity-100' : 'scale-[1.18] opacity-0'
                }`}
              >
                <div
                  className="absolute inset-x-0 -top-[9%] h-[118%] will-change-transform"
                  style={{ transform: 'translate3d(0, var(--py, 0px), 0)' }}
                >
                  <SmartImage
                    sources={IMAGES}
                    alt="Model sitting in a camel coat and wide trousers"
                    className="object-[50%_28%] transition-[opacity,scale] duration-[1400ms] group-hover/banner:scale-[1.04]"
                  />
                </div>
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_72%,rgba(90,64,48,0.55)_100%)] max-sm:hidden"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(90,64,48,0.55),transparent_40%)] sm:hidden"
              />
            </div>

            {/* Text panel */}
            <div
              onMouseMove={onMove}
              className="relative flex flex-col justify-center overflow-hidden bg-[linear-gradient(135deg,#5a4030_0%,#7c5b45_58%,#6b4c3a_100%)] p-8 sm:p-10 lg:p-14"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/banner:opacity-100"
                style={{
                  background:
                    'radial-gradient(360px circle at var(--mx, 70%) var(--my, 30%), rgba(255,226,190,0.16), transparent 60%)',
                }}
              />

              <h2
                aria-label="More Than Just Fashion"
                className="relative font-display text-[clamp(2.2rem,4.2vw,3.5rem)] leading-[1.08] text-[#fbf5ee]"
              >
                {BANNER_LINES.map((line, i) => (
                  <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.12em]">
                    <span
                      style={{ transitionDelay: bannerIn ? `${450 + i * 140}ms` : '0ms' }}
                      className={`block transition-[translate] duration-[1100ms] ${EASE} motion-reduce:translate-y-0 ${
                        bannerIn ? 'translate-y-0' : 'translate-y-[118%]'
                      }`}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h2>

              <p
                style={{ transitionDelay: bannerIn ? '950ms' : '0ms' }}
                className={`relative mt-6 max-w-sm text-[15px] leading-7 text-[#f1e6d9]/90 transition-[opacity,translate] duration-[1000ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                  bannerIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                At FashiOnia, we create more than just clothing — we create confidence, comfort and self-expression.
              </p>

              <div
                style={{ transitionDelay: bannerIn ? '1100ms' : '0ms' }}
                className={`relative mt-8 transition-[opacity,translate] duration-[1000ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
                  bannerIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                <Link
                  to="/collections"
                  className="group/cta relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-white/60 px-7 text-sm font-medium text-white transition-[border-color,scale] duration-500 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a27a] active:scale-[0.97]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover/cta:scale-x-100"
                  />
                  <span className="relative z-10 transition-colors duration-500 group-hover/cta:text-[#3b2a20]">
                    Learn More
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
        </div>
      </div>
    </section>
  )
}