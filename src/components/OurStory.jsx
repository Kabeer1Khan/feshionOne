import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import useScrollProgress from '../hooks/useScrollProgress'

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1200`

// Tried in order; if one fails to load, the next one is used
const imageSources = [
  px(19537755), // stylish woman with sunglasses in autumn attire
  px(20002322), // woman in an olive trench coat with sunglasses
  px(19313971), // woman in a beige coat among autumn leaves
]

const titleWords = ['Crafted', 'for', 'the', 'Modern', 'You']

export default function OurStory() {
  const sectionRef = useScrollProgress()
  const [srcIndex, setSrcIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

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
            className="group relative isolate flex flex-col overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#fffdfb_0%,#f7efe6_55%,#ecd9c4_100%)] shadow-[0_24px_60px_rgba(94,59,39,0.16)] ring-1 ring-[#e9d9c8] sm:rounded-[28px] md:min-h-[320px] md:flex-row md:items-center lg:min-h-[360px]"
          >
            {/* Soft leaf-shadow in the fade zone (desktop) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-[34%] hidden w-[40%] md:block"
              style={{
                transform:
                  'translate3d(calc((var(--p, 0.5) - 0.5) * 50px), 0, 0)',
              }}
            >
              <svg
                viewBox="0 0 300 320"
                preserveAspectRatio="xMidYMid slice"
                className="h-full w-full origin-top-right animate-sway motion-reduce:animate-none"
              >
                <defs>
                  <path id="story-leaf" d="M0 0C12-16 34-16 48 0C34 16 12 16 0 0Z" />
                </defs>
                <g opacity="0.12" fill="#8a5a3c">
                  <path
                    d="M290 10C230 50 180 100 140 170C115 215 100 260 95 315"
                    fill="none"
                    stroke="#8a5a3c"
                    strokeWidth="3"
                  />
                  <use href="#story-leaf" transform="translate(250 38) rotate(30) scale(1.4)" />
                  <use href="#story-leaf" transform="translate(215 70) rotate(-40) scale(1.3)" />
                  <use href="#story-leaf" transform="translate(190 105) rotate(28) scale(1.5)" />
                  <use href="#story-leaf" transform="translate(160 145) rotate(-35) scale(1.3)" />
                  <use href="#story-leaf" transform="translate(140 185) rotate(38) scale(1.5)" />
                  <use href="#story-leaf" transform="translate(118 228) rotate(-42) scale(1.3)" />
                  <use href="#story-leaf" transform="translate(105 268) rotate(30) scale(1.4)" />
                  <use href="#story-leaf" transform="translate(275 75) rotate(80) scale(1.1)" />
                  <use href="#story-leaf" transform="translate(205 160) rotate(100) scale(1.2)" />
                </g>
              </svg>
            </div>

            {/* Photo: top on mobile, right side on tablet/laptop */}
            <Reveal
              direction="right"
              delay={300}
              className="relative z-[5] order-first h-64 w-full sm:h-80 md:absolute md:inset-y-0 md:right-0 md:order-none md:h-auto md:w-[52%] lg:w-[56%]"
            >
              <div className="relative h-full overflow-hidden [mask-image:linear-gradient(to_bottom,#000_55%,transparent_100%)] md:[mask-image:linear-gradient(to_right,transparent_0%,#000_42%)]">
                {srcIndex < imageSources.length && (
                  <img
                    key={srcIndex}
                    src={imageSources[srcIndex]}
                    alt="Woman in sunglasses wearing a camel-toned coat"
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={() => {
                      setLoaded(false)
                      setSrcIndex((i) => i + 1)
                    }}
                    style={{
                      transform:
                        'translate3d(0, calc((var(--p, 0.5) - 0.5) * -32px), 0) scale(1.16)',
                    }}
                    className={`absolute inset-0 h-full w-full object-cover object-[center_22%] transition-opacity duration-1000 will-change-transform ${
                      loaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
                {/* Warm tint to match the palette */}
                <div className="absolute inset-0 bg-[#a8764c]/10 mix-blend-multiply" />
              </div>
            </Reveal>

            {/* Text */}
            <div
              style={{
                transform: 'translate3d(0, calc((var(--p, 0.5) - 0.5) * -22px), 0)',
              }}
              className="relative z-10 px-6 pb-9 pt-2 sm:px-10 md:w-[54%] md:py-12 md:pl-10 lg:w-[48%] lg:pl-14"
            >
              <Reveal delay={200}>
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 origin-right scale-x-0 bg-[#c9a27a] transition-transform delay-700 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-8" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-700 sm:text-xs">
                    Our Story
                  </span>
                  <span className="h-px w-6 origin-left scale-x-0 bg-[#c9a27a] transition-transform delay-700 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-8" />
                </div>
              </Reveal>

              <Reveal delay={300}>
                <h2 className="mt-4 font-display text-[28px] font-medium leading-[1.15] text-[#1f1713] sm:text-4xl lg:text-[44px]">
                  {titleWords.map((word, i) => (
                    <span
                      key={`${word}-${i}`}
                      className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
                    >
                      <span
                        className="inline-block translate-y-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[visible=true]/reveal:translate-y-0"
                        style={{ transitionDelay: `${350 + i * 110}ms` }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </h2>
              </Reveal>

              <Reveal delay={550}>
                <p className="mt-4 max-w-md text-[13px] font-light leading-relaxed text-neutral-600 sm:text-sm">
                  FashiOnia is a celebration of timeless style, premium quality
                  and modern elegance. We bring together fashion, culture and
                  individuality in every piece.
                </p>
              </Reveal>

              <Reveal delay={700}>
                <Link
                  to="/about"
                  className="group/btn relative mt-7 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#3b2a20] px-6 py-3 text-xs font-medium tracking-wide text-white transition-all duration-500 hover:shadow-[0_14px_30px_rgba(59,42,32,0.35)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a27a] sm:px-7 sm:text-[13px]"
                >
                  {/* Gold fill sweep on hover */}
                  <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#c9a27a] transition-transform duration-500 ease-out group-hover/btn:scale-x-100" />
                  <span className="relative transition-colors duration-500 group-hover/btn:text-[#2b1b12]">
                    Learn More
                  </span>
                  <ArrowRight
                    size={15}
                    strokeWidth={1.7}
                    className="relative transition-all duration-500 group-hover/btn:translate-x-1.5 group-hover/btn:text-[#2b1b12]"
                  />
                </Link>
              </Reveal>
            </div>

            {/* Cursor-following warm glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(201,162,122,0.16), transparent 60%)',
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}