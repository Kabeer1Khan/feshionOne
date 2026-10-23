import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mail, Check } from 'lucide-react'
import Reveal from './Reveal'
import useScrollProgress from '../hooks/useScrollProgress'

const shopLinks = [
  { label: 'Women', to: '/shop?category=women' },
  { label: 'Men', to: '/shop?category=men' },
  { label: 'Accessories', to: '/shop?category=accessories' },
  { label: 'Footwear', to: '/shop?category=footwear' },
]

const quickLinks = [
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

// Inline icons (no extra packages needed)
const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    icon: (
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/',
    icon: (
      <>
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </>
    ),
  },
]

const titleWords = ['Join', 'Our', 'Newsletter']

// Same side spacing as the navbar, so the logo lines up with the top of the page.
// Remove "max-w-[1500px]" if you want the content to touch the screen edges on huge monitors.
const inner = 'mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12'

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group/link relative inline-block py-1 text-[12px] font-light text-white/60 transition-all duration-300 hover:translate-x-1 hover:text-white sm:text-[13px]"
    >
      {children}
      <span className="absolute -bottom-px left-0 h-px w-0 bg-[#c9a27a] transition-all duration-500 ease-out group-hover/link:w-full" />
    </Link>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
    if (!valid) {
      setStatus('error')
      return
    }
    setStatus('loading')
    // Demo only: replace this timeout with your real API call
    timer.current = setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 1000)
  }

  if (status === 'success') {
    return (
      <div className="flex animate-fade-up items-center gap-3 rounded-full border border-[#c9a27a]/40 bg-white/5 px-5 py-3.5">
        <span className="grid h-8 w-8 shrink-0 animate-pop place-items-center rounded-full bg-[#c9a27a] text-[#2b1b12]">
          <Check size={17} strokeWidth={2.4} />
        </span>
        <p className="text-[13px] text-white/90">
          Thanks for subscribing! You&apos;re on the list.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="ml-auto shrink-0 cursor-pointer text-xs text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Undo
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        className={`flex items-center gap-2 rounded-full border bg-black/20 p-1.5 transition-all duration-300 focus-within:border-[#c9a27a] focus-within:shadow-[0_0_0_4px_rgba(201,162,122,0.18)] ${
          status === 'error' ? 'border-[#e59a86]' : 'border-white/20'
        }`}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="Your email address"
          aria-label="Email address"
          aria-invalid={status === 'error'}
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-[13px] font-light text-white outline-none placeholder:text-white/45"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group/sub relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full bg-[#f3e7da] px-5 py-2.5 text-[13px] font-medium text-[#3b2a20] transition-all duration-300 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] active:scale-95 disabled:cursor-wait disabled:opacity-80 sm:px-7"
        >
          {/* Shine sweep on hover */}
          <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent transition-all duration-700 group-hover/sub:left-[120%]" />
          {status === 'loading' ? (
            <span className="relative h-4 w-4 animate-spin rounded-full border-2 border-[#3b2a20]/30 border-t-[#3b2a20]" />
          ) : (
            <span className="relative">Subscribe</span>
          )}
        </button>
      </div>

      {status === 'error' && (
        <p role="alert" className="mt-2 animate-fade-in pl-4 text-xs text-[#f1b4a6]">
          Please enter a valid email address.
        </p>
      )}
    </form>
  )
}

export default function Footer() {
  const sectionRef = useScrollProgress()
  const { pathname } = useLocation()

  return (
    <section ref={sectionRef} className="bg-[#faf8f5]">
      <Reveal direction="up">
        <footer className="relative isolate w-full overflow-hidden bg-[linear-gradient(135deg,#4a3326_0%,#33231a_50%,#2a1c14_100%)] text-white">
          {/* Soft glows that drift as you scroll */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#c9a27a]/15 blur-3xl"
            style={{
              transform:
                'translate3d(calc(var(--p, 0.2) * 220px), calc(var(--p, 0.2) * 80px), 0)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#a8764c]/15 blur-3xl"
            style={{
              transform:
                'translate3d(calc(var(--p, 0.2) * -200px), calc(var(--p, 0.2) * -60px), 0)',
            }}
          />

          {/* Big faint brand word that slides sideways on scroll */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -bottom-[0.14em] -z-10 select-none text-center"
            style={{
              transform: 'translate3d(calc(var(--p, 0.2) * -420px + 90px), 0, 0)',
            }}
          >
            <span className="whitespace-nowrap font-display text-[24vw] leading-none text-white/[0.04] lg:text-[280px]">
              FashiOnia
            </span>
          </div>

          {/* Newsletter (border spans the full width) */}
          <div className="group/news border-b border-white/10">
            <div
              className={`${inner} flex flex-col gap-6 py-7 sm:py-8 lg:flex-row lg:items-center lg:gap-10`}
            >
              <div className="flex items-start gap-4 lg:w-[54%]">
                <Reveal delay={200}>
                  <Mail
                    size={30}
                    strokeWidth={1.3}
                    className="mt-1 shrink-0 text-white/85 transition-transform duration-500 group-hover/news:-translate-y-1 group-hover/news:rotate-[-6deg]"
                  />
                </Reveal>
                <div>
                  <Reveal delay={250}>
                    <h2 className="font-display text-[24px] font-normal leading-tight sm:text-[28px]">
                      {titleWords.map((word, i) => (
                        <span
                          key={word}
                          className="mr-[0.22em] inline-block overflow-hidden pb-[0.12em] align-bottom last:mr-0"
                        >
                          <span
                            className="inline-block translate-y-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[visible=true]/reveal:translate-y-0"
                            style={{ transitionDelay: `${350 + i * 120}ms` }}
                          >
                            {word}
                          </span>
                        </span>
                      ))}
                    </h2>
                  </Reveal>
                  <Reveal delay={500}>
                    <p className="mt-1.5 max-w-md text-[12px] font-light leading-relaxed text-white/60 sm:text-[13px]">
                      Be the first to know about new arrivals, exclusive offers
                      and more.
                    </p>
                  </Reveal>
                </div>
              </div>

              <Reveal
                delay={600}
                direction="right"
                className="lg:flex-1 lg:border-l lg:border-white/15 lg:pl-10"
              >
                <Newsletter />
              </Reveal>
            </div>
          </div>

          {/* Main footer */}
          <div
            className={`${inner} grid grid-cols-2 gap-x-6 gap-y-9 py-9 sm:py-11 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]`}
          >
            {/* Logo */}
            <Reveal delay={100} className="col-span-2 md:col-span-1">
              <Link
                to="/"
                onClick={() => {
                  if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="group/logo inline-flex items-center gap-2.5"
                aria-label="FashiOnia home"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 transition-transform duration-700 ease-out group-hover/logo:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                >
                  <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
                </svg>
                <span className="font-display text-[26px] leading-none tracking-wide">
                  FashiOnia
                </span>
              </Link>
            </Reveal>

            {/* Shop */}
            <Reveal delay={220}>
              <h3 className="font-display text-[15px] text-white">Shop</h3>
              <span className="mt-2 block h-px w-6 bg-[#c9a27a]/70" />
              <ul className="mt-3 flex flex-col">
                {shopLinks.map((l) => (
                  <li key={l.label}>
                    <FooterLink to={l.to}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Quick links */}
            <Reveal delay={340}>
              <h3 className="font-display text-[15px] text-white">Quick Links</h3>
              <span className="mt-2 block h-px w-6 bg-[#c9a27a]/70" />
              <ul className="mt-3 flex flex-col">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <FooterLink to={l.to}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Follow us */}
            <Reveal delay={460} className="col-span-2 md:col-span-1">
              <h3 className="font-display text-[15px] text-white">Follow Us</h3>
              <span className="mt-2 block h-px w-6 bg-[#c9a27a]/70" />
              <ul className="mt-4 flex items-center gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 transition-all duration-300 hover:-translate-y-1 hover:rotate-6 hover:border-[#c9a27a] hover:bg-[#c9a27a] hover:text-[#2b1b12] hover:shadow-[0_10px_24px_rgba(201,162,122,0.35)] active:scale-90"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {s.icon}
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Bottom bar (border spans the full width) */}
          <Reveal delay={300}>
            <div className="border-t border-white/10">
              <div
                className={`${inner} flex flex-col items-center justify-between gap-3 py-4 text-[11px] font-light text-white/55 sm:flex-row`}
              >
                <p>
                  &copy; {new Date().getFullYear()} FashiOnia. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    to="/privacy"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  <span className="h-3 w-px bg-white/25" />
                  <Link
                    to="/terms"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Terms &amp; Conditions
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </footer>
      </Reveal>
    </section>
  )
}