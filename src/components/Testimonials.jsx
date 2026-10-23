import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Quote } from 'lucide-react'
import Reveal from './Reveal'
import useScrollProgress from '../hooks/useScrollProgress'

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=300`

// Each person has backup photos: if one fails to load, the next is used
const testimonials = [
  {
    name: 'Sarah Khan',
    quote:
      'The quality is outstanding and the designs are just perfect! Absolutely love FashiOnia.',
    images: [px(14758778), px(36041246), px(1645820)],
  },
  {
    name: 'Ayesha Malik',
    quote:
      'Fast shipping, amazing service and the clothes are even better in person!',
    images: [px(15602468), px(1248472), px(713312)],
  },
  {
    name: 'Hira Ahmed',
    quote:
      "Finally a brand that understands modern style. I'm in love with everything I've bought!",
    images: [px(16175852), px(36041246), px(713312)],
  },
]

const titleWords = ['What', 'Our', 'Customers', 'Say']

function Avatar({ images, name }) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')

  return (
    <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16">
      {/* Gold ring that spins on card hover */}
      <span className="absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,#c9a27a,#f3e3d0,#8a5a3c,#c9a27a)] opacity-0 transition-opacity duration-500 [animation-duration:3s] group-hover:animate-spin group-hover:opacity-100" />

      <div className="relative h-full w-full overflow-hidden rounded-full bg-[#ecd9c4] ring-2 ring-white">
        {index < images.length ? (
          <img
            key={index}
            src={images[index]}
            alt={name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(false)
              setIndex((i) => i + 1)
            }}
            className={`h-full w-full object-cover object-[center_22%] transition-opacity duration-1000 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <span className="grid h-full w-full place-items-center font-display text-lg text-[#8a5a3c]">
            {initials}
          </span>
        )}
      </div>
    </div>
  )
}

function TestimonialCard({ item }) {
  return (
    <figure className="group relative flex h-full gap-4 overflow-hidden rounded-2xl bg-white/70 p-5 shadow-[0_8px_30px_rgba(70,45,25,0.07)] ring-1 ring-[#eadccd] backdrop-blur transition-all duration-500 ease-out hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_24px_50px_rgba(70,45,25,0.15)] hover:ring-[#c9a27a]/60 sm:p-6 md:flex-col lg:flex-row">
      {/* Quote mark appears on hover */}
      <Quote
        aria-hidden="true"
        size={34}
        strokeWidth={1.2}
        className="absolute right-4 top-4 translate-y-2 text-[#c9a27a]/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-[#c9a27a]/50"
      />

      <Avatar images={item.images} name={item.name} />

      <div className="flex min-w-0 flex-col justify-between">
        <blockquote className="text-[13px] leading-relaxed text-neutral-600 transition-colors duration-500 group-hover:text-neutral-800 sm:text-sm">
          &ldquo;{item.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-4 flex items-center gap-2 text-[13px] font-medium text-neutral-900">
          <span className="h-px w-4 bg-[#c9a27a] transition-all duration-500 group-hover:w-8" />
          {item.name}
        </figcaption>
      </div>
    </figure>
  )
}

export default function Testimonials() {
  const sectionRef = useScrollProgress()

  return (
    <section
      ref={sectionRef}
      className="bg-[#faf8f5] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading row */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <Reveal>
              <h2 className="font-display text-[26px] font-medium leading-tight text-[#1a1a1a] sm:text-4xl lg:text-[40px]">
                {titleWords.map((word, i) => (
                  <span
                    key={word}
                    className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
                  >
                    <span
                      className="inline-block translate-y-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[visible=true]/reveal:translate-y-0"
                      style={{ transitionDelay: `${150 + i * 110}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h2>
            </Reveal>

            <Reveal delay={350}>
              <p className="mt-1.5 font-display text-base font-semibold text-[#2b1b12] sm:text-lg">
                Real People, Real Style.
              </p>
              <span className="mt-3 block h-px w-14 origin-left scale-x-0 bg-[#c9a27a] transition-transform delay-700 duration-1000 group-data-[visible=true]/reveal:scale-x-100" />
            </Reveal>
          </div>

          <Reveal delay={300} direction="right" className="shrink-0 pb-1">
            <Link
              to="/reviews"
              className="group/view relative inline-flex items-center gap-2 pb-1.5 text-xs font-medium text-neutral-800 sm:text-[13px]"
            >
              View All
              <ArrowRight
                size={15}
                strokeWidth={1.6}
                className="transition-transform duration-500 group-hover/view:translate-x-1.5"
              />
              <span className="absolute bottom-0 left-0 h-px w-full bg-neutral-300" />
              <span className="absolute bottom-0 left-0 h-px w-0 bg-[#3b2a20] transition-all duration-500 ease-out group-hover/view:w-full" />
            </Link>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:mt-9 md:grid-cols-3 md:gap-5 lg:gap-7">
          {testimonials.map((item, i) => (
            // Outer div: scroll parallax. Inner Reveal: entry animation.
            <div
              key={item.name}
              style={{
                '--shift': i === 1 ? '-14px' : '-34px',
                transform:
                  'translate3d(0, calc((var(--p, 0.5) - 0.5) * var(--shift)), 0)',
              }}
            >
              <Reveal
                delay={200 + i * 140}
                direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}
                className="h-full"
              >
                <TestimonialCard item={item} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}