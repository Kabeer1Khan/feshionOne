import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shirt, User, Briefcase, Footprints } from 'lucide-react'
import Reveal from './Reveal'

const categories = [
  {
    name: 'Women',
    slug: 'women',
    icon: Shirt,
    position: 'object-top',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Men',
    slug: 'men',
    icon: User,
    position: 'object-top',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    icon: Briefcase,
    position: 'object-center',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    icon: Footprints,
    position: 'object-center',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
  },
]

function CategoryImage({ src, alt, position, Icon }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  // If an image URL ever breaks, show a clean placeholder instead of a broken icon
  if (failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#f1e8de] to-[#d9c3ad]">
        <Icon size={56} strokeWidth={1} className="text-[#8a6a52]/60" />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`h-full w-full object-cover transition-opacity duration-1000 ${position} ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}

export default function Categories() {
  return (
    <section className="relative overflow-hidden bg-[#faf8f5] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      {/* Soft decorative glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#e9d8c4]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#ecdcc9]/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-8 origin-right scale-x-0 bg-[#c9a27a] transition-transform delay-500 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-12" />
              <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#2b2b2b] sm:text-xs">
                Shop by Category
              </span>
              <span className="h-px w-8 origin-left scale-x-0 bg-[#c9a27a] transition-transform delay-500 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-12" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="mt-5 font-display text-[34px] font-medium leading-tight text-[#1a1a1a] sm:text-5xl lg:text-6xl">
              Find Your Perfect Style
            </h2>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-4 text-[13px] font-light text-neutral-500 sm:text-sm">
              Curated collections for every mood, moment and occasion.
            </p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-6 lg:grid-cols-4 lg:gap-7">
          {categories.map(({ name, slug, image, position, icon: Icon }, i) => (
            <Reveal key={slug} delay={250 + i * 120} direction="up">
              <Link
                to={`/shop?category=${slug}`}
                aria-label={`Shop ${name}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f6f0e9] to-[#ead9c7] shadow-[0_10px_30px_rgba(70,45,25,0.08)] ring-1 ring-black/5 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_28px_55px_rgba(70,45,25,0.2)] hover:ring-[#c9a27a]/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a27a] sm:rounded-3xl"
              >
                <CategoryImage
                  src={image}
                  alt={`${name} collection`}
                  position={position}
                  Icon={Icon}
                />

                {/* Glass label bar */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/70 px-4 py-3.5 backdrop-blur-md transition-colors duration-500 group-hover:bg-[#3b2a20]/90 sm:px-6 sm:py-4">
                  <span className="font-display text-base font-medium text-[#1f1f1f] transition-colors duration-500 group-hover:text-white sm:text-xl">
                    {name}
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full text-[#1f1f1f] transition-all duration-500 group-hover:translate-x-1 group-hover:bg-white group-hover:text-[#3b2a20] sm:h-9 sm:w-9">
                    <ArrowRight
                      size={18}
                      strokeWidth={1.6}
                      className="transition-transform duration-500 group-hover:-rotate-45"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}