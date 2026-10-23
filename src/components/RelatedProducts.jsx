import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, formatPrice } from '../data/products'
import useInView from '../hooks/useInView'
import SmartImage from './SmartImage'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'
const sized = (url, w, h) => url.replace('w=800&h=960', `w=${w}&h=${h}`)

function RelatedCard({ product, index }) {
  const [ref, inView] = useInView()
  const sources = product.images.map((u) => sized(u, 600, 720))
  const delay = index * 110

  return (
    <li
      ref={ref}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
      className={`transition-[opacity,translate] duration-[900ms] ${EASE} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#eadfd3] shadow-[0_10px_30px_-20px_rgba(59,42,32,0.4)] ring-1 ring-[#efe8df]">
          <div
            style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
            className={`absolute inset-0 transition-[scale] duration-[1400ms] ease-out motion-reduce:scale-100 motion-reduce:transition-none ${
              inView ? 'scale-100' : 'scale-[1.15]'
            }`}
          >
            <SmartImage
              sources={sources}
              alt={product.name}
              className="transition-[opacity,scale] duration-700 group-hover:scale-[1.07]"
            />
          </div>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-[linear-gradient(to_top,rgba(59,42,32,0.4),transparent)] px-3 pb-3 pt-12 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="translate-y-3 rounded-full bg-white/95 px-4 py-1.5 text-xs font-medium text-[#3b2a20] shadow-md transition-[translate] duration-500 group-hover:translate-y-0">
              View details
            </span>
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3 px-0.5">
          <h3 className="truncate text-[13px] font-medium text-[#3b2a20] transition-colors duration-300 group-hover:text-[#c9a27a] sm:text-sm">
            {product.name}
          </h3>
          <p className="shrink-0 text-[13px] font-semibold text-[#3b2a20] sm:text-sm">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </li>
  )
}

export default function RelatedProducts({ product }) {
  const [headRef, headIn] = useInView()
  const label = CATEGORIES.find((c) => c.id === product.category)?.label || 'collection'

  const list = useMemo(() => {
    const same = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
    const rest = PRODUCTS.filter((p) => p.category !== product.category)
    return [...same, ...rest].slice(0, 4)
  }, [product])

  return (
    <section aria-labelledby="related-title" className="mt-20 sm:mt-28">
      <div ref={headRef} className="flex items-end justify-between gap-4">
        <h2 id="related-title" className="font-display text-3xl text-[#3b2a20] sm:text-4xl">
          {'You may also like'.split(' ').map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <span
                style={{ transitionDelay: headIn ? `${i * 90}ms` : '0ms' }}
                className={`inline-block pb-1 transition-[translate] duration-[900ms] ${EASE} ${
                  headIn ? 'translate-y-0' : 'translate-y-[115%]'
                }`}
              >
                {w}
              </span>
            </span>
          ))}
        </h2>
        <Link
          to={`/shop?category=${product.category}`}
          className={`shrink-0 text-sm text-[#3b2a20] underline underline-offset-4 transition-[opacity,color] duration-700 hover:text-[#c9a27a] ${
            headIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          View all {label}
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {list.map((p, i) => (
          <RelatedCard key={p.id} product={p} index={i} />
        ))}
      </ul>
    </section>
  )
}