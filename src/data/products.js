// Pexels CDN helper: sirf photo ID se URL banata hai
const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=960&fit=crop`

// ids[0] = main image, baaki fallback (pehli fail ho to agli try hoti hai)
const item = (slug, name, category, price, ids) => ({
  id: slug,
  slug,
  name,
  category,
  price,
  images: ids.map((id) => px(id)),
})

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'footwear', label: 'Footwear' },
]

export const PRODUCTS = [
  // ---------- Page 1 (reference screenshot jaisa order) ----------
  item('linen-blazer-set', 'Linen Blazer Set', 'women', 129, [39705635, 15991060, 13751241]),
  item('classic-shirt', 'Classic Shirt', 'men', 69, [18178903, 20143006, 33422452]),
  item('leather-handbag', 'Leather Handbag', 'accessories', 149, [2433862, 6650009, 4339598]),
  item('satin-dress', 'Satin Dress', 'women', 89, [12240187, 11787521, 27098937]),
  item('trench-coat', 'Trench Coat', 'women', 199, [36800324, 28838792, 8765332]),
  item('knit-sweater', 'Knit Sweater', 'men', 79, [12056637, 3754247, 8422392]),
  item('shoulder-bag', 'Shoulder Bag', 'accessories', 119, [4339598, 6649429, 1152077]),
  item('heeled-boots', 'Heeled Boots', 'footwear', 139, [27596491, 27256471, 26856061]),
  item('wide-leg-pants', 'Wide Leg Pants', 'women', 99, [27098937, 9899346, 39705635]),

  // ---------- Page 2 ----------
  item('tailored-blazer', 'Tailored Blazer', 'women', 159, [13751241, 4355901, 15991060]),
  item('linen-trousers', 'Linen Trousers', 'men', 85, [12661575, 10679231, 3754247]),
  item('suede-ankle-boots', 'Suede Ankle Boots', 'footwear', 129, [27256471, 27381293, 27256457]),
  item('leather-satchel', 'Leather Satchel', 'accessories', 169, [1152077, 6650009, 2433862]),
  item('pleated-midi-skirt', 'Pleated Midi Skirt', 'women', 75, [11787521, 9899346, 12240187]),
  item('beige-linen-suit', 'Beige Linen Suit', 'men', 249, [10679231, 12056637, 12661575]),
  item('belted-coat', 'Belted Coat', 'women', 189, [32271695, 36352974, 8765332]),
  item('stiletto-boots', 'Stiletto Boots', 'footwear', 149, [27289124, 27381293, 26856061]),
  item('knit-polo', 'Knit Polo', 'men', 59, [8422392, 9322629, 29381847]),

  // ---------- Page 3 ----------
  item('plaid-cotton-shirt', 'Plaid Cotton Shirt', 'women', 64, [9899346, 11787520, 27098937]),
  item('camel-overcoat', 'Camel Overcoat', 'women', 229, [36352974, 36800324, 28838792]),
  item('messenger-bag', 'Messenger Bag', 'accessories', 139, [6649429, 2433862, 4339598]),
  item('ankle-boots', 'Ankle Boots', 'footwear', 119, [26856061, 27381284, 27256455]),
  item('oxford-shirt', 'Oxford Shirt', 'men', 65, [33422452, 18178903, 8732957]),
  item('blue-blazer', 'Blue Blazer', 'women', 149, [11787520, 15991060, 13751241]),
  item('essential-tee', 'Essential Tee', 'men', 39, [18339041, 9322629, 19964280]),
  item('tall-leather-boots', 'Tall Leather Boots', 'footwear', 189, [27596491, 27256473, 26712437]),
  item('mini-chain-bag', 'Mini Chain Bag', 'accessories', 99, [4339598, 6650009, 2433862]),

    // ---------- New Arrivals ----------
  item('tailored-blazer-set', 'Tailored Blazer Set', 'women', 129, [15991060, 13751241, 39705635]),
  item('linen-shirt-trousers', 'Linen Shirt & Trousers', 'men', 89, [20143006, 18178903, 33422452]),
  item('leather-tote-bag', 'Leather Tote Bag', 'accessories', 149, [6650009, 6649429, 5591920]),
  item('satin-midi-dress', 'Satin Midi Dress', 'women', 99, [12240187, 11766631, 18909296]),
  item('leather-loafers', 'Leather Loafers', 'footwear', 79, [27204303, 15127353, 31935098]),
  item('classic-trench-coat', 'Classic Trench Coat', 'women', 159, [36800324, 36946580, 9968540, 8765332]),
  item('ribbed-knit-sweater', 'Knit Sweater', 'men', 69, [7576509, 6643012, 3170635, 3754247]),
  item('structured-handbag', 'Structured Handbag', 'accessories', 119, [5591912, 5591920, 8989582]),
]

export const formatPrice = (n) => `$${n.toFixed(2)}`

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug)