import { useCallback, useEffect, useState } from 'react'

const KEY = 'fashionia_cart'
const MAX_QTY = 10

const read = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// Module-level store: provider ki zaroorat nahi. Navbar badge aur Cart page bhi isi hook se chalenge
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

export default function useCart() {
  const [items, setItems] = useState(store)

  useEffect(() => {
    listeners.add(setItems)
    setItems(store)
    return () => {
      listeners.delete(setItems)
    }
  }, [])

  // item: { id, slug, name, price, image, color, size, qty }
  const add = useCallback((item) => {
    const key = `${item.id}|${item.color}|${item.size}`
    const found = store.find((i) => i.key === key)
    commit(
      found
        ? store.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, i.qty + item.qty) } : i))
        : [...store, { ...item, key, qty: Math.min(MAX_QTY, item.qty) }],
    )
  }, [])

  const setQty = useCallback((key, qty) => {
    commit(
      qty <= 0
        ? store.filter((i) => i.key !== key)
        : store.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
    )
  }, [])

  const remove = useCallback((key) => commit(store.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => commit([]), [])

  const count = items.reduce((n, i) => n + i.qty, 0)
  const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0)

  return { items, count, subtotal, add, setQty, remove, clear }
}