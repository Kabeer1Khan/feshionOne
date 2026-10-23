import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
]

const iconStyle =
  'relative grid h-10 w-10 cursor-pointer place-items-center rounded-full text-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:text-white active:scale-95'

function Logo() {
  return (
    <Link
      to="/"
      className="group flex items-center gap-2.5 text-white"
      aria-label="FashiOnia home"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 transition-transform duration-700 ease-out group-hover:rotate-90"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" />
      </svg>
      <span className="font-display text-[26px] font-normal leading-none tracking-wide">
        FashiOnia
      </span>
    </Link>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const hasHero = ['/', '/shop', '/new-arrivals', '/collections', '/about', '/wishlist', '/cart']

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [pathname])

  // Focus input when search opens + close with Escape
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    setQuery('')
    setSearchOpen(false)
  }

  return (
    <header
      className={`z-30 ${
        hasHero ? 'absolute inset-x-0 top-0' : 'relative bg-[#5c4638]'
      }`}
    >
      <div className="mx-auto grid max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-5 py-5 sm:px-8 lg:px-12 lg:py-6">
        {/* Logo */}
        <div className="animate-fade-down justify-self-start">
          <Logo />
        </div>

        {/* Desktop links */}
        <nav className="hidden lg:block" aria-label="Main">
          <ul className="flex items-center gap-10">
            {links.map(({ label, to }, i) => (
              <li
                key={label}
                className="animate-fade-down"
                style={{ animationDelay: `${150 + i * 90}ms` }}
              >
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `group relative block py-2 text-[13px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-white/80 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-[2px] bg-white transition-all duration-500 ease-out ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons */}
        <div
          className="flex animate-fade-down items-center gap-1 justify-self-end sm:gap-2"
          style={{ animationDelay: '300ms' }}
        >
          <button
            type="button"
            aria-label="Search"
            onClick={() => {
              setSearchOpen((v) => !v)
              setMenuOpen(false)
            }}
            className={iconStyle}
          >
            {searchOpen ? (
              <X size={19} strokeWidth={1.6} />
            ) : (
              <Search size={19} strokeWidth={1.6} />
            )}
          </button>

          <Link to="/account" aria-label="Account" className={`${iconStyle} hidden sm:grid`}>
            <User size={19} strokeWidth={1.6} />
          </Link>

          <Link to="/wishlist" aria-label="Wishlist" className={`${iconStyle} hidden sm:grid`}>
            <Heart size={19} strokeWidth={1.6} />
          </Link>

          <Link to="/cart" aria-label="Cart" className={iconStyle}>
            <ShoppingBag size={19} strokeWidth={1.6} />
            <span
              className="absolute right-1.5 top-1.5 h-2.5 w-2.5 animate-pop rounded-full bg-white"
              style={{ animationDelay: '1.2s' }}
            />
          </Link>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((v) => !v)
              setSearchOpen(false)
            }}
            className={`${iconStyle} lg:hidden`}
          >
            {menuOpen ? (
              <X size={21} strokeWidth={1.6} />
            ) : (
              <Menu size={21} strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div
        className={`absolute inset-x-4 top-full z-40 mx-auto max-w-2xl transition-all duration-500 sm:inset-x-8 ${
          searchOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 rounded-full border border-white/25 bg-[#3b2a20]/75 px-5 py-2 backdrop-blur-xl"
        >
          <Search size={18} strokeWidth={1.6} className="text-white/70" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for clothes, brands, styles..."
            className="w-full bg-transparent py-2 text-sm font-light text-white outline-none placeholder:text-white/50"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-white px-5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#3b2a20] transition-all duration-300 hover:bg-[#d9b48f] active:scale-95"
          >
            Search
          </button>
        </form>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute inset-x-4 top-full z-40 rounded-2xl border border-white/15 bg-[#3b2a20]/80 p-3 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          menuOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <ul className="flex flex-col">
          {links.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white/10 hover:pl-6 ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/70'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="mt-2 flex gap-2 border-t border-white/10 px-1 pt-3 sm:hidden">
            <Link to="/account" className="flex-1 rounded-xl py-3 text-center text-xs uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10">
              Account
            </Link>
            <Link to="/wishlist" className="flex-1 rounded-xl py-3 text-center text-xs uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10">
              Wishlist
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}