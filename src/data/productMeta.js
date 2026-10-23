// Product detail page ke liye extra info (description, rating, colors, sizes).
// products.js ko chherne ki zaroorat nahi: yahan category + slug se sab bante hain.

const hash = (s) => [...s].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 100003, 7)

const PALETTES = {
  women: [
    { name: 'Cream', hex: '#e8dccd' },
    { name: 'Espresso', hex: '#4a3426' },
    { name: 'Mocha', hex: '#6b4a38' },
  ],
  men: [
    { name: 'Sand', hex: '#d8c7ae' },
    { name: 'Espresso', hex: '#4a3426' },
    { name: 'Stone', hex: '#9a8f84' },
  ],
  accessories: [
    { name: 'Cognac', hex: '#a8683c' },
    { name: 'Espresso', hex: '#4a3426' },
    { name: 'Cream', hex: '#e8dccd' },
  ],
  footwear: [
    { name: 'Cognac', hex: '#a8683c' },
    { name: 'Espresso', hex: '#4a3426' },
    { name: 'Sand', hex: '#d8c7ae' },
  ],
}

const COPY = {
  women:
    'A timeless {n} crafted for modern elegance. Cut from soft, breathable fabric, it moves easily from the office to the weekend and layers with the rest of your wardrobe.',
  men: 'A refined {n} made for everyday ease. Clean lines and a comfortable, structured fit keep it sharp enough for work and relaxed enough for the weekend.',
  accessories:
    'A {n} finished by hand in soft, structured leather. Roomy enough for your daily essentials, with considered hardware and a shape that holds over time.',
  footwear:
    'A pair of {n} built on a stable heel with a soft leather lining. Polished enough for evening, comfortable enough to wear all day.',
}

const DETAILS = {
  women: [
    'Relaxed, tailored fit',
    'Breathable natural-blend fabric',
    'Soft lining for all-day comfort',
    'Model is 5 ft 9 in and wears size S',
  ],
  men: [
    'Regular fit with a clean drape',
    'Soft cotton-blend fabric',
    'Reinforced seams for daily wear',
    'Model is 6 ft 1 in and wears size M',
  ],
  accessories: [
    'Genuine leather with a soft finish',
    'Interior zip pocket and slip pocket',
    'Gold-tone hardware',
    'Fits a phone, wallet and daily essentials',
  ],
  footwear: [
    'Genuine leather upper',
    'Cushioned insole with soft lining',
    'Stable block heel',
    'True to size. If you are between sizes, go up one.',
  ],
}

const CARE = {
  women:
    'Machine wash cold on a gentle cycle with similar colors. Do not bleach. Line dry in the shade and iron on low heat, or steam to keep the fabric fresh.',
  men: 'Machine wash cold on a gentle cycle with similar colors. Do not bleach. Line dry in the shade and iron on low heat.',
  accessories:
    'Wipe with a soft dry cloth and keep away from water. Store in the dust bag and condition the leather twice a year.',
  footwear:
    'Brush off dust with a soft brush and use a leather conditioner now and then. Keep away from heavy rain and store with shoe trees.',
}

const SHIPPING =
  'Free standard shipping on orders over $150. Orders ship within 2 business days and arrive in 3 to 6. Not quite right? Return unworn items within 30 days for a full refund.'

// Reference screenshot wale product ke exact numbers / text
const OVERRIDES = {
  'linen-blazer-set': {
    description:
      'A timeless linen blazer set crafted for modern elegance. Perfect for both work and weekend looks, this set offers comfort and style in every detail.',
    rating: 4.8,
    reviews: 124,
  },
}

export function getMeta(product) {
  const cat = product.category
  const h = hash(product.slug)
  const o = OVERRIDES[product.slug] || {}

  const sizeKind = cat === 'footwear' ? 'footwear' : cat === 'accessories' ? 'one' : 'clothing'
  const sizes =
    sizeKind === 'footwear' ? ['6', '7', '8', '9', '10'] : sizeKind === 'one' ? ['One Size'] : ['XS', 'S', 'M', 'L', 'XL']
  const defaultSize = sizeKind === 'footwear' ? '8' : sizeKind === 'one' ? 'One Size' : 'S'

  return {
    description: o.description || COPY[cat].replace('{n}', product.name.toLowerCase()),
    rating: o.rating ?? Number((4.5 + (h % 5) / 10).toFixed(1)),
    reviews: o.reviews ?? 48 + ((h * 7) % 260),
    colors: PALETTES[cat],
    sizes,
    sizeKind,
    defaultSize,
    details: DETAILS[cat],
    care: CARE[cat],
    shipping: SHIPPING,
  }
}