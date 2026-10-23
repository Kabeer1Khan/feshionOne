import { useEffect, useRef, useState } from 'react'

const OPTS = { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }

// Element scroll karke screen mein aaye to ek baar true ho jata hai
export default function useInView() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return undefined
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, OPTS)
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return [ref, inView]
}