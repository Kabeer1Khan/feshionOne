import Hero from '../components/Hero'
import Categories from '../components/Categories'
import BrandStory from '../components/BrandStory'
import NewArrivals from '../components/NewArrivals'
import AutumnBanner from '../components/AutumnBanner'
import TrendingNow from '../components/TrendingNow'
import OurStory from '../components/OurStory'
import Testimonials from '../components/Testimonials'

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <BrandStory />
      <NewArrivals />
      <AutumnBanner />
      <TrendingNow />
      <OurStory />
      <Testimonials />
    </main>
  )
}