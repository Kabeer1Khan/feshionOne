import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'

// Tried in order; if one fails to load, the next one is used
const imageSources = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1400&q=80',
]

const titleWords = ['More', 'Than', 'Fashion']

export default function BrandStory() {
  const sectionRef = useRef(null)
  const [srcIndex, setSrcIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // Scroll progress (0 → 1) written to a CSS variable, used for the parallax
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)))
      el.style.setProperty('--p', progress.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Cursor spotlight on the card
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <section
      ref={sectionRef}
      className="bg-[#faf8f5] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal direction="scale">
          <div
            onMouseMove={handleMove}
            className="group relative isolate overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#a47a5c_0%,#5a4132_32%,#3b2a20_100%)] shadow-[0_30px_70px_rgba(59,42,32,0.35)] sm:rounded-[32px] lg:grid lg:grid-cols-[42%_58%] lg:bg-[linear-gradient(100deg,#b88b6a_0%,#6b4b38_28%,#45302a_55%,#37261e_100%)]"
          >
            {/* Image side (parallax on scroll) */}
            <div className="relative h-60 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)] sm:h-80 lg:h-full lg:min-h-[440px] lg:[mask-image:linear-gradient(to_right,#000_55%,transparent_100%)]">
              {srcIndex < imageSources.length && (
                <img
                  key={srcIndex}
                  src={imageSources[srcIndex]}
                  alt="Curated rack of neutral-toned clothing"
                  loading="lazy"
                  onLoad={() => setLoaded(true)}
                  onError={() => {
                    setLoaded(false)
                    setSrcIndex((i) => i + 1)
                  }}
                  style={{
                    transform:
                      'translate3d(0, calc((var(--p, 0.5) - 0.5) * -50px), 0) scale(1.2)',
                  }}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 will-change-transform ${
                    loaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
              {/* Warm tint so any photo matches the brown palette */}
              <div className="absolute inset-0 bg-[#b88b6a]/25 mix-blend-multiply" />
            </div>

            {/* Text side */}
            <div
              style={{
                transform: 'translate3d(0, calc((var(--p, 0.5) - 0.5) * -28px), 0)',
              }}
              className="relative flex flex-col items-center justify-center px-6 pb-12 pt-4 text-center sm:px-12 sm:pb-14 lg:px-12 lg:py-20 xl:px-20"
            >
              <Reveal delay={200}>
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <span className="h-px w-6 origin-right scale-x-0 bg-white/45 transition-transform delay-700 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-10" />
                  <span className="text-[11px] font-light uppercase tracking-[0.4em] text-white/85 sm:text-xs">
                    Welcome to
                  </span>
                  <span className="h-px w-6 origin-left scale-x-0 bg-white/45 transition-transform delay-700 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-10" />
                </div>
              </Reveal>

              <Reveal delay={300}>
                <h2 className="mt-5 font-display text-[40px] font-normal leading-[1.1] text-white sm:text-5xl lg:text-[52px] xl:text-6xl">
                  {titleWords.map((word, i) => (
                    <span
                      key={word}
                      className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
                    >
                      <span
                        className="inline-block translate-y-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[visible=true]/reveal:translate-y-0"
                        style={{ transitionDelay: `${400 + i * 140}ms` }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </h2>
              </Reveal>

              <Reveal delay={550}>
                <p className="mx-auto mt-5 max-w-md text-[13px] font-light leading-relaxed text-white/75 sm:text-[15px]">
                  At FashiOnia, we believe fashion is more than just what you wear
                  &mdash; it&apos;s a form of self-expression.
                </p>
              </Reveal>

              <Reveal delay={700}>
                <Link
                  to="/about"
                  className="group/btn relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/35 px-7 py-3.5 text-[13px] font-medium tracking-wide text-white transition-all duration-500 hover:border-white hover:text-[#3b2a20] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 sm:px-8"
                >
                  {/* Fill sweep on hover */}
                  <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover/btn:scale-x-100" />
                  <span className="relative">Discover Our Story</span>
                  <ArrowRight
                    size={17}
                    strokeWidth={1.6}
                    className="relative transition-transform duration-500 group-hover/btn:translate-x-1.5"
                  />
                </Link>
              </Reveal>
            </div>

            {/* Cursor-following glow (desktop hover) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(217,180,143,0.16), transparent 60%)',
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}