import { useEffect, useRef, useState } from 'react'
import { Shirt } from 'lucide-react'

// Parent `relative` hona chahiye. sources = [main, fallback1, fallback2...]
// Ek fail ho to agli try hoti hai, sab fail to beige placeholder dikhta hai.
export default function SmartImage({ sources, alt, eager = false, className = '' }) {
  const [idx, setIdx] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)
  const failed = idx >= sources.length

  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true)
  }, [idx])

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(160deg,#efe5da,#dccbb9)] text-[#5c4638]/60">
        <div className="flex flex-col items-center gap-2 px-3 text-center">
          <Shirt size={30} strokeWidth={1.3} />
          {alt ? <span className="text-xs">{alt}</span> : null}
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        aria-hidden="true"
        className={`absolute inset-0 animate-pulse bg-[#e6d9cb] transition-opacity duration-700 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        key={sources[idx]}
        ref={imgRef}
        src={sources[idx]}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable="false"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false)
          setIdx((i) => i + 1)
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </>
  )
}