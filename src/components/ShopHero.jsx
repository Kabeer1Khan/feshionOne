import { useSearchParams } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Reveal from './Reveal'
import useScrollProgress from '../hooks/useScrollProgress'
import heroImg from '../assets/hero/Earth-Tone Sunglasses Duo.webp'

const categoryNames = {
  women: 'Women',
  men: 'Men',
  accessories: 'Accessories',
  footwear: 'Footwear',
}

export default function ShopHero() {
  const sectionRef = useScrollProgress()
  const [params] = useSearchParams()

  // Footer / category links (?category=women) and navbar search (?q=dress) update the text
  const category = categoryNames[params.get('category')]
  const query = params.get('q')
  const title = category ? `${category} Collection` : 'Our Collection'
  const subtitle = query
    ? `Showing results for \u201C${query}\u201D`
    : 'Timeless pieces for every occasion.'
  const words = title.split(' ')

  // Soft light that follows the cursor
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const scrollDown = () => {
    const el = sectionRef.current
    if (el) window.scrollTo({ top: el.offsetHeight, behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      className="group relative isolate flex h-svh min-h-[640px] w-full items-end overflow-hidden bg-[linear-gradient(180deg,#5a4436_0%,#3a281e_100%)] lg:min-h-[600px]"
    >
      {/* Photo layers (settle in on load) */}
      <div className="absolute inset-0 -z-10 animate-hero-settle">
        {/* Blurred copy of the same photo fills the space above the sharp photo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden scale-125 bg-cover bg-center blur-3xl sm:block"
          style={{ backgroundImage: `url("${heroImg}")` }}
        />

        {/* Sharp photo
            phone:  under the navbar, couple fills the width, fades into the brown
            tablet: bottom-right, couple always in view
            laptop: whole photo, never cropped, always touching the bottom */}
        <div
          className="absolute right-0 top-14 aspect-video w-[170%] max-w-none sm:bottom-0 sm:top-auto sm:w-[140%] lg:w-[min(100%,calc(max(100svh,600px)*1.7778))]"
          style={{
            transform: 'translate3d(0, calc((var(--p, 0.5) - 0.5) * 80px), 0)',
          }}
        >
          <img
            src={heroImg}
            alt="Man and woman in earth-tone outfits and sunglasses"
            className="block h-full w-full object-cover object-[75%_bottom] [mask-image:linear-gradient(to_bottom,#000_72%,transparent_100%)] sm:[mask-image:linear-gradient(to_bottom,transparent_0%,#000_26%)] lg:[mask-composite:intersect] lg:[mask-image:linear-gradient(to_bottom,transparent_0%,#000_26%),linear-gradient(to_right,transparent_0%,#000_12%)]"
          />
        </div>
      </div>

      {/* Shades for text and navbar readability */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-[#24160f]/60 via-[#24160f]/25 to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#24160f]/70 to-transparent sm:h-1/3 sm:from-[#24160f]/45" />

      {/* Cursor-following warm light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[5] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(480px circle at var(--mx, 30%) var(--my, 60%), rgba(255,214,170,0.13), transparent 60%)',
        }}
      />

      {/* Text (moves up and fades as you scroll away) */}
      <div
        className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-24 sm:px-8 sm:pb-[15svh] lg:px-12 lg:pb-[17svh]"
        style={{
          transform: 'translate3d(0, calc((var(--p, 0.5) - 0.5) * -160px), 0)',
          opacity: 'calc(1 - (var(--p, 0.5) - 0.5) * 3)',
        }}
      >
        {/* key makes the animation replay when the category / search changes */}
        <div key={`${title}-${subtitle}`}>
          <Reveal delay={300}>
            <div className="flex items-center gap-4">
              <span className="text-xs font-light uppercase tracking-[0.4em] text-white/85 sm:text-sm">
                Shop
              </span>
              <span className="h-px w-8 origin-left scale-x-0 bg-white/60 transition-transform delay-700 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-12" />
            </div>
          </Reveal>

          <Reveal delay={400}>
            <h1 className="mt-3 max-w-3xl font-display text-[42px] font-normal leading-[1.05] text-white sm:mt-5 sm:text-6xl lg:text-7xl xl:text-[84px]">
              {words.map((word, i) => (
                <span
                  key={`${word}-${i}`}
                  className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom last:mr-0"
                >
                  <span
                    className="inline-block translate-y-full bg-[linear-gradient(100deg,#ffffff_35%,#f0d4b4_50%,#ffffff_65%)] bg-[length:260%_100%] bg-[position:100%_0%] bg-clip-text text-transparent transition-[transform,background-position] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[position:0%_0%] group-data-[visible=true]/reveal:translate-y-0"
                    style={{ transitionDelay: `${500 + i * 160}ms` }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>
          </Reveal>

          <Reveal delay={900}>
            <p className="mt-3 max-w-md text-[15px] font-light text-white/85 sm:mt-5 sm:text-lg">
              {subtitle}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Scroll-down button */}
      <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center sm:bottom-6">
        <Reveal delay={1300}>
          <button
            type="button"
            onClick={scrollDown}
            aria-label="Scroll down"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/40 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-[#3b2a20] active:scale-90"
          >
            <ChevronDown
              size={20}
              strokeWidth={1.6}
              className="animate-bounce motion-reduce:animate-none"
            />
          </button>
        </Reveal>
      </div>
    </section>
  )
}