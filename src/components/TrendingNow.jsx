import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Shirt, User, Briefcase } from 'lucide-react'
import Reveal from './Reveal'
import useScrollProgress from '../hooks/useScrollProgress'

const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`

// Each product has backup photos: if one fails to load, the next is used
const products = [
  {
    slug: 'trench-coat',
    name: 'Trench Coat',
    price: 158,
    icon: Shirt,
    position: 'center 12%',
    images: [px(19313971), px(20002322), px(19537755)],
  },
  {
    slug: 'knit-sweater',
    name: 'Knit Sweater',
    price: 79,
    icon: User,
    position: 'center 15%',
    images: [px(12056637), px(10679231), px(6626056)],
  },
  {
    slug: 'shoulder-bag',
    name: 'Shoulder Bag',
    price: 119,
    icon: Briefcase,
    position: 'center center',
    images: [px(5591912), px(5591920), px(2433862)],
  },
  {
    slug: 'heeled-boots',
    name: 'Heeled Boots',
    price: 128,
    icon: Shirt,
    position: 'center 20%',
    images: [px(13049643), px(19456445), px(5822223)],
  },
]

const titleWords = ['Most', 'Loved', 'This', 'Week']

function ProductImage({ images, name, position, Icon }) {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

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
      style={{
        objectPosition: position,
        transform:
          'translate3d(0, calc((var(--p, 0.5) - 0.5) * -26px), 0) scale(1.12)',
      }}
      className={`h-full w-full object-cover transition-opacity duration-1000 will-change-transform ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const { slug, name, price, images, icon: Icon, position } = product

  // 3D tilt that follows the cursor (desktop only)
  const handleMove = (e) => {
    if (
      !window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)')
        .matches
    )
      return
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${(-y * 9).toFixed(2)}deg`)
    el.style.setProperty('--ty', '-8px')
  }

  const handleLeave = (e) => {
    const el = e.currentTarget
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--ty', '0px')
  }

  return (
    <article
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform:
          'perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(var(--ty, 0px))',
      }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_6px_24px_rgba(70,45,25,0.07)] ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[0_28px_55px_rgba(70,45,25,0.2)] hover:ring-[#c9a27a]/50"
    >
      {/* Image */}
      <Link
        to={`/product/${slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#e8d8c8] to-[#d4b8a0]"
      >
        <ProductImage images={images} name={name} position={position} Icon={Icon} />

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

export default function TrendingNow() {
  const sectionRef = useScrollProgress()

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#faf8f5] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-28"
    >
      {/* Big ghost word that slides sideways as you scroll */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-2 right-0 select-none whitespace-nowrap font-display text-[26vw] leading-none text-[#f1e7dc] sm:text-[18vw] lg:text-[190px]"
        style={{
          transform: 'translate3d(calc((var(--p, 0.5) - 0.5) * -260px), 0, 0)',
        }}
      >
        Trending
      </span>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading row */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 origin-right scale-x-0 bg-[#c9a27a] transition-transform delay-500 duration-1000 group-data-[visible=true]/reveal:scale-x-100 sm:w-8" />
                <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-700 sm:text-xs">
                  Trending Now
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
          </div>

          <Reveal delay={300} direction="right" className="shrink-0 pb-1">
            <Link
              to="/shop"
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
                '--shift': i % 2 === 0 ? '-48px' : '-20px',
                transform:
                  'translate3d(0, calc((var(--p, 0.5) - 0.5) * var(--shift)), 0)',
              }}
            >
              <Reveal delay={200 + i * 120} direction="up">
                <ProductCard product={product} />
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}