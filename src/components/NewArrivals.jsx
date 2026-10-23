import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Shirt, User, Briefcase } from 'lucide-react'
import Reveal from './Reveal'
import useScrollProgress from '../hooks/useScrollProgress'

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`

// Each product has several image options; if one fails, the next is tried
const products = [
  {
    slug: 'linen-blazer-set',
    name: 'Linen Blazer Set',
    price: 129,
    icon: Shirt,
    images: [
      u('photo-1594633312681-425c7b97ccd1'),
      u('photo-1515886657613-9f3515b0c78f'),
      u('photo-1490481651871-ab68de25d43d'),
    ],
  },
  {
    slug: 'classic-shirt',
    name: 'Classic Shirt',
    price: 65,
    icon: User,
    images: [
      u('photo-1507003211169-0a1dd7228f2d'),
      u('photo-1492562080023-ab3db95bfbce'),
      u('photo-1500648767791-00dcc994a43e'),
    ],
  },
  {
    slug: 'leather-handbag',
    name: 'Leather Handbag',
    price: 149,
    icon: Briefcase,
    images: [
      u('photo-1548036328-c9fa89d128fa'),
      u('photo-1584917865442-de89df76afd3'),
      u('photo-1590874103328-eac38a683ce7'),
    ],
  },
  {
    slug: 'satin-dress',
    name: 'Satin Dress',
    price: 85,
    icon: Shirt,
    images: [
      u('photo-1496747611176-843222e1e57c'),
      u('photo-1539109136881-3be0616acf4b'),
      u('photo-1509631179647-0177331693ae'),
    ],
  },
]

const titleWords = ['Fresh', 'Styles,', 'Just', 'In']

function ProductImage({ images, name, Icon }) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // All options failed: show a clean placeholder instead of a broken image
  if (index >= images.length) {
    return (
      <div className="grid h-full w-full place-items-center">
        <Icon size={52} strokeWidth={1} className="text-[#8a6a52]/60" />
      </div>
    )
  }

  return (
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
      className={`h-full w-full object-cover object-top transition-opacity duration-1000 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const { slug, name, price, images, icon: Icon } = product

  return (
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(70,45,25,0.07)] ring-1 ring-black/5 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_28px_55px_rgba(70,45,25,0.18)] hover:ring-[#c9a27a]/50">
      {/* Image */}
      <Link
        to={`/product/${slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#e8d8c8] to-[#d9c3ad]"
      >
        <ProductImage images={images} name={name} Icon={Icon} />

        {/* Hover pill */}
        <span className="absolute inset-x-3 bottom-3 flex translate-y-4 items-center justify-center gap-2 rounded-full bg-white/85 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#3b2a20] opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-[11px]">
          View details
          <ArrowRight size={14} strokeWidth={1.8} />
        </span>
      </Link>

      {/* Info */}
      <div className="flex items-start justify-between gap-2 px-3.5 pb-4 pt-3.5 sm:px-4">
        <Link to={`/product/${slug}`} className="group/name min-w-0">
          <h3 className="truncate text-[13px] font-medium text-neutral-800 transition-colors duration-300 group-hover/name:text-[#8a5a3c] sm:text-sm">
            {name}
          </h3>
          <p className="mt-1.5 text-[13px] font-semibold text-neutral-900 sm:text-sm">
            ${price.toFixed(2)}
          </p>
        </Link>

        <button
          type="button"
          onClick={() => setLiked((v) => !v)}
          aria-label={liked ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          aria-pressed={liked}
          className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-neutral-500 transition-all duration-300 hover:scale-110 hover:bg-[#f4e9df] hover:text-[#b5523b] active:scale-90"
        >
          <Heart
            size={17}
            strokeWidth={1.6}
            fill={liked ? 'currentColor' : 'none'}
            className={liked ? 'animate-pop text-[#b5523b]' : ''}
          />
        </button>
      </div>
    </article>
  )
}

export default function NewArrivals() {
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
              <div className="flex items-center gap-3">
                <span className="h-px w-6 origin-right scale-x-0 bg-[#c9a27a] transition-transform delay-500 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-8" />
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-700 sm:text-xs">
                  New Arrivals
                </span>
                <span className="h-px w-6 origin-left scale-x-0 bg-[#c9a27a] transition-transform delay-500 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-8" />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-3 font-display text-[28px] font-medium leading-tight text-[#1a1a1a] sm:text-4xl lg:text-5xl">
                {titleWords.map((word, i) => (
                  <span
                    key={word}
                    className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
                  >
                    <span
                      className="inline-block translate-y-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[visible=true]/reveal:translate-y-0"
                      style={{ transitionDelay: `${250 + i * 120}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h2>
            </Reveal>

            <Reveal delay={250}>
              <p className="mt-2 max-w-md text-[13px] font-light text-neutral-500 sm:mt-3 sm:text-sm">
                Be the first to own the latest trends and timeless pieces.
              </p>
            </Reveal>
          </div>

          <Reveal delay={300} direction="right" className="shrink-0 pb-1">
            <Link
              to="/new-arrivals"
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

        {/* Product grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.map((product, i) => (
            // Outer div: scroll parallax (alternating speed). Inner Reveal: entry animation.
            <div
              key={product.slug}
              style={{
                '--shift': i % 2 === 0 ? '-22px' : '-46px',
                transform:
                  'translate3d(0, calc((var(--p, 0.5) - 0.5) * var(--shift)), 0)',
              }}
            >
              <Reveal delay={200 + i * 120}>
                <ProductCard product={product} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}