import { useEffect, useRef, useState } from 'react'

const hidden = {
  up: 'translate-y-12 opacity-0 blur-[2px]',
  left: '-translate-x-12 opacity-0 blur-[2px]',
  right: 'translate-x-12 opacity-0 blur-[2px]',
  scale: 'scale-95 opacity-0 blur-[2px]',
}

export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={{ transitionDelay: `${delay}ms` }}
      className={`group/reveal transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0'
          : hidden[direction]
      } ${className}`}
    >
      {children}
    </div>
  )
}