import { useEffect } from 'react'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600`

// Pehli image fail ho to agli try hoti hai
const IMAGES = [19361408, 11200015, 4423232, 3226185, 19917456].map(px)

const TITLE = ['Our', 'Vision']
const BANNER_LINES = ['Style. Quality.', 'Forever.']

export default function AboutVision() {
  const [headRef, headIn] = useInView()
  const [bannerRef, bannerIn] = useInView()

  /* Banner: scroll par image aur text alag speed se sarakte hain */
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
      el.style.setProperty('--py', `${(p * -50).toFixed(1)}px`)
      el.style.setProperty('--ty', `${(p * 18).toFixed(1)}px`)
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

  return (
    <section aria-label="Our vision" className="bg-[#faf8f5] pb-16 pt-2 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Upar ki patli line (draw hoti hai) */}
        <span
          aria-hidden="true"
          className={`block h-px origin-left bg-[#e8dfd5] transition-transform duration-[1400ms] ${EASE} ${
            headIn ? 'scale-x-100' : 'scale-x-0'
          }`}
        />

        {/* ================= Text ================= */}
        <div ref={headRef} className="pt-10 sm:pt-12">
          <h2
            aria-label="Our Vision"
            className="font-display text-[clamp(1.7rem,3vw,2.2rem)] leading-[1.1] text-[#3b2a20]"
          >
            {TITLE.map((w, i) => (
              <span
                key={w}
                aria-hidden="true"
                className="mr-[0.25em] inline-block overflow-hidden pb-[0.14em] align-bottom last:mr-0"
              >
                <span
                  style={{ transitionDelay: headIn ? `${i * 120}ms` : '0ms' }}
                  className={`inline-block cursor-default transition-[translate,color] duration-[1000ms] ${EASE} hover:text-[#c9a27a] motion-reduce:translate-y-0 ${
                    headIn ? 'translate-y-0' : 'translate-y-[118%]'
                  }`}
                >
                  {w}
                </span>
              </span>
            ))}
          </h2>

          <p
            style={{ transitionDelay: headIn ? '300ms' : '0ms' }}
            className={`mt-5 max-w-md text-[15px] leading-8 text-[#5c4638] transition-[opacity,filter] duration-[1200ms] ${EASE} motion-reduce:opacity-100 motion-reduce:blur-0 sm:text-base ${
              headIn ? 'opacity-100 blur-0' : 'opacity-0 blur-[6px]'
            }`}
          >
            To become a global fashion brand known for its timeless style, premium quality and positive impact on the
            world.
          </p>
        </div>

        {/* ================= Banner ================= */}
        <div
          ref={bannerRef}
          className={`mt-10 transition-[opacity,translate,scale] duration-[1100ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none sm:mt-12 ${
            bannerIn ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-14 scale-[0.97] opacity-0'
          }`}
        >
          <div
            onMouseMove={onMove}
            className="group relative isolate h-[420px] overflow-hidden rounded-2xl bg-[linear-gradient(110deg,#3f2a1d_0%,#5a4030_48%,#6b4a35_100%)] shadow-[0_30px_60px_-34px_rgba(59,42,32,0.7)] transition-[translate,box-shadow] duration-700 hover:-translate-y-1 hover:shadow-[0_44px_80px_-36px_rgba(59,42,32,0.85)] sm:h-[380px] lg:h-[480px]"
          >
            {/* Image: mobile par poori, baad mein right side par left se fade hoti hui */}
            <div className="absolute inset-0 -z-10 sm:left-auto sm:right-0 sm:w-[74%] sm:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_34%)] sm:[mask-image:linear-gradient(to_right,transparent_0%,#000_34%)]">
              <div
                className={`absolute inset-0 transition-[scale,opacity] duration-[1900ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
                  bannerIn ? 'scale-100 opacity-100' : 'scale-[1.18] opacity-0'
                }`}
              >
                <div
                  className="absolute inset-x-0 -top-[12%] h-[124%] will-change-transform"
                  style={{ transform: 'translate3d(0, var(--py, 0px), 0)' }}
                >
                  <SmartImage
                    sources={IMAGES}
                    alt="Model in a brown hat and sunglasses"
                    className="object-[50%_24%] transition-[opacity,scale] duration-[1400ms] group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            </div>

            {/* Overlays */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(48,30,20,0.85)_0%,rgba(48,30,20,0.35)_45%,transparent_75%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(48,30,20,0.55)_0%,transparent_50%)] sm:block"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(380px circle at var(--mx, 60%) var(--my, 50%), rgba(255,226,190,0.16), transparent 60%)',
              }}
            />

            {/* Text */}
            <div
              className="absolute inset-x-0 bottom-0 p-6 will-change-transform sm:p-10 lg:p-14"
              style={{ transform: 'translate3d(0, var(--ty, 0px), 0)' }}
            >
              <p
                aria-label="Style. Quality. Forever."
                className="font-display text-[clamp(2.2rem,4.8vw,3.9rem)] leading-[1.1] text-[#fbf5ee]"
              >
                {BANNER_LINES.map((line, i) => (
                  <span key={line} aria-hidden="true" className="block overflow-hidden pb-[0.12em]">
                    <span
                      style={{ transitionDelay: bannerIn ? `${450 + i * 160}ms` : '0ms' }}
                      className={`block cursor-default transition-[translate,color] duration-[1200ms] ${EASE} hover:text-[#ecd2b0] motion-reduce:translate-y-0 ${
                        bannerIn ? 'translate-y-0' : 'translate-y-[118%]'
                      }`}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </p>

              <span
                aria-hidden="true"
                style={{ transitionDelay: bannerIn ? '950ms' : '0ms' }}
                className={`mt-4 block h-px w-16 origin-left bg-[#e9dccb]/60 transition-transform duration-[1200ms] ${EASE} group-hover:w-28 sm:mt-5 ${
                  bannerIn ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}