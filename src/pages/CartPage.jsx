import CartHero from '../components/CartHero'
import CartContents from '../components/CartContents'

export default function CartPage() {
  return (
    <main className="bg-[#faf8f5]">
      <CartHero />
      <CartContents />
    </main>
  )
}