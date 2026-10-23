import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf } from 'lucide-react'
import Reveal from './Reveal'
import useScrollProgress from '../hooks/useScrollProgress'

const p = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1000`

// Tried in order; if one fails to load, the next one is used
const imageSources = [
  p(19313971), // woman in a beige coat among autumn leaves
  p(19537755), // stylish woman with sunglasses in an autumn park
  p(20002322), // woman in an olive trench coat with sunglasses
]

const titleWords = ['Autumn', 'Collection']

const leaves = [
  { left: '6%', size: 16, delay: 0, duration: 11, mobile: true },
  { left: '18%', size: 12, delay: 3, duration: 14, mobile: false },
  { left: '30%', size: 18, delay: 6, duration: 12, mobile: true },
  { left: '41%', size: 13, delay: 1.5, duration: 15, mobile: false },
  { left: '50%', size: 15, delay: 8, duration: 13, mobile: true },
]

export default function AutumnBanner() {
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
            style={{
              backgroundSize: '150% 100%',
              backgroundPosition: 'calc(var(--p, 0.5) * 100%) 50%',
            }}
            className="group relative isolate flex min-h-[270px] items-center overflow-hidden rounded-[22px] bg-[linear-gradient(100deg,#5e3b27_0%,#7d5136_45%,#a8764c_100%)] shadow-[0_30px_70px_rgba(94,59,39,0.35)] sm:min-h-[290px] sm:rounded-[30px] lg:min-h-[330px]"
          >
            {/* Leaf-shadow texture (moves with scroll, sways gently) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-[6%] w-[75%] mix-blend-multiply"
              style={{
                transform:
                  'translate3d(calc((var(--p, 0.5) - 0.5) * 70px), 0, 0)',
              }}
            >
              <svg
                viewBox="0 0 400 320"
                preserveAspectRatio="xMaxYMid slice"
                className="h-full w-full origin-top-right animate-sway motion-reduce:animate-none"
              >
                <defs>
                  <path
                    id="shadow-leaf"
                    d="M0 0C12-16 34-16 48 0C34 16 12 16 0 0Z"
                  />
                </defs>
                <g opacity="0.24" fill="#24120a">
                  <path
                    d="M400 20C330 40 270 80 210 150C170 195 140 240 120 300"
                    fill="none"
                    stroke="#24120a"
                    strokeWidth="3"
                  />
                  <use href="#shadow-leaf" transform="translate(350 38) rotate(30) scale(1.4)" />
                  <use href="#shadow-leaf" transform="translate(310 52) rotate(-40) scale(1.2)" />
                  <use href="#shadow-leaf" transform="translate(280 72) rotate(25) scale(1.5)" />
                  <use href="#shadow-leaf" transform="translate(245 100) rotate(-35) scale(1.3)" />
                  <use href="#shadow-leaf" transform="translate(222 128) rotate(40) scale(1.6)" />
                  <use href="#shadow-leaf" transform="translate(196 160) rotate(-30) scale(1.3)" />
                  <use href="#shadow-leaf" transform="translate(170 190) rotate(35) scale(1.5)" />
                  <use href="#shadow-leaf" transform="translate(150 225) rotate(-45) scale(1.2)" />
                  <use href="#shadow-leaf" transform="translate(135 262) rotate(30) scale(1.4)" />
                  <use href="#shadow-leaf" transform="translate(385 70) rotate(75) scale(1.1)" />
                  <use href="#shadow-leaf" transform="translate(300 110) rotate(95) scale(1.2)" />
                  <use href="#shadow-leaf" transform="translate(215 205) rotate(100) scale(1.1)" />
                </g>
              </svg>
            </div>

            {/* Drifting autumn leaves */}
            {leaves.map((leaf) => (
              <span
                key={leaf.left}
                aria-hidden="true"
                className={`pointer-events-none absolute top-0 animate-leaf text-[#e3b98f]/50 motion-reduce:hidden ${
                  leaf.mobile ? '' : 'hidden sm:block'
                }`}
                style={{
                  left: leaf.left,
                  animationDuration: `${leaf.duration}s`,
                  animationDelay: `-${leaf.delay}s`,
                }}
              >
                <Leaf size={leaf.size} strokeWidth={1.4} fill="currentColor" />
              </span>
            ))}

            {/* Text */}
            <div
              style={{
                transform: 'translate3d(0, calc((var(--p, 0.5) - 0.5) * -26px), 0)',
              }}
              className="relative z-10 w-full py-10 pl-6 pr-[44%] sm:py-12 sm:pl-12 sm:pr-[38%] lg:pl-16 lg:pr-[36%]"
            >
              <Reveal delay={200}>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-light uppercase tracking-[0.4em] text-white/85 sm:text-xs">
                    New Season
                  </span>
                  <span className="h-px w-8 origin-left scale-x-0 bg-white/50 transition-transform delay-700 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-12" />
                </div>
              </Reveal>

              <Reveal delay={300}>
                <h2 className="mt-3 font-display text-[30px] font-normal leading-[1.1] text-white sm:mt-4 sm:text-5xl lg:text-6xl">
                  {titleWords.map((word, i) => (
                    <span
                      key={word}
                      className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
                    >
                      <span
                        className="inline-block translate-y-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[visible=true]/reveal:translate-y-0"
                        style={{ transitionDelay: `${400 + i * 160}ms` }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </h2>
              </Reveal>

              <Reveal delay={550}>
                <p className="mt-3 text-[13px] font-light text-white/80 sm:mt-4 sm:text-base">
                  Elegance in every detail.
                </p>
              </Reveal>

              <Reveal delay={700}>
                <Link
                  to="/shop"
                  className="group/btn relative mt-6 inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/40 px-6 py-3 text-[13px] font-medium tracking-wide text-white transition-all duration-500 hover:border-white hover:text-[#5e3b27] hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70 sm:mt-8 sm:px-7"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 rounded-full bg-white transition-transform duration-500 ease-out group-hover/btn:scale-x-100" />
                  <span className="relative">Shop Now</span>
                  <ArrowRight
                    size={16}
                    strokeWidth={1.6}
                    className="relative transition-transform duration-500 group-hover/btn:translate-x-1.5"
                  />
                </Link>
              </Reveal>
            </div>

            {/* Lady image (slides in, parallax on scroll) */}
            <Reveal
              direction="right"
              delay={400}
              className="absolute inset-y-0 right-0 z-[5] w-[42%] sm:w-[36%] lg:w-[31%]"
            >
              <div className="relative h-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,#000_38%)]">
                {srcIndex < imageSources.length && (
                  <img
                    key={srcIndex}
                    src={imageSources[srcIndex]}
                    alt="Woman in a camel coat for the Autumn Collection"
                    loading="lazy"
                    onLoad={() => setLoaded(true)}
                    onError={() => {
                      setLoaded(false)
                      setSrcIndex((i) => i + 1)
                    }}
                    style={{
                      transform:
                        'translate3d(0, calc((var(--p, 0.5) - 0.5) * -36px), 0) scale(1.18)',
                    }}
                    className={`absolute inset-0 h-full w-full object-cover object-[center_14%] transition-opacity duration-1000 will-change-transform ${
                      loaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
                {/* Warm tint so the photo blends into the brown */}
                <div className="absolute inset-0 bg-[#a8764c]/20 mix-blend-multiply" />
              </div>
            </Reveal>

            {/* Cursor-following glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(255,220,180,0.14), transparent 60%)',
              }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}