import NewArrivalsHero from '../components/NewArrivalsHero'
import NewArrivalsGrid from '../components/NewArrivalsGrid'
import SignatureEdit from '../components/SignatureEdit'

export default function NewArrivalsPage() {
  return (
    <main className="bg-[#faf8f5]">
      <NewArrivalsHero />
      <NewArrivalsGrid />
      <SignatureEdit />
    </main>
  )
}