import { useCallback, useEffect, useState } from 'react'

const KEY = 'fashionia_wishlist'

const read = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Module-level store: provider ki zaroorat nahi, Navbar / Wishlist page bhi isi ko use kar sakte hain
let store = read()
const listeners = new Set()

const commit = (next) => {
  store = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage blocked ho to bhi memory mein chalta rahega */
  }
  listeners.forEach((fn) => fn(store))
}

export default function useWishlist() {
  const [ids, setIds] = useState(store)

  useEffect(() => {
    listeners.add(setIds)
    setIds(store)
    return () => {
      listeners.delete(setIds)
    }
  }, [])

  const toggle = useCallback((id) => {
    commit(store.includes(id) ? store.filter((x) => x !== id) : [...store, id])
  }, [])

  return { ids, toggle, count: ids.length }
}