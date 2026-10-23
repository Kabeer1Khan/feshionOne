import AboutHero from '../components/AboutHero'
import AboutBeginning from '../components/AboutBeginning'
import AboutValues from '../components/AboutValues'
import AboutVision from '../components/AboutVision'

export default function AboutPage() {
  return (
    <main className="bg-[#faf8f5]">
      <AboutHero />
      <AboutBeginning />
      <AboutValues />
      <AboutVision />
    </main>
  )
}