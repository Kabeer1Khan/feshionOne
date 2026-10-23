import { Truck, ShieldCheck, Tag, Headphones } from 'lucide-react'
import heroImg from '../assets/hero/hero_img.webp'

const features = [
  { icon: Truck, title: 'Free Shipping', text: 'On orders over $100' },
  { icon: ShieldCheck, title: 'Secure Payment', text: '100% secure checkout' },
  { icon: Tag, title: 'Trendy Collections', text: 'Fresh styles daily' },
  { icon: Headphones, title: '24/7 Support', text: "We're here for you" },
]

const tagline = "Style isn't just what you wear, it's how you live."

export default function Hero() {
  return (
    <section className="relative isolate flex h-svh min-h-[640px] w-full items-end overflow-hidden bg-[#5c4638] sm:h-auto sm:min-h-0 sm:pt-20 lg:h-svh lg:min-h-[640px] lg:pt-0">
      {/* Blurred copy of the image fills any leftover space */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 scale-125 bg-cover bg-center blur-3xl"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#3b2a20]/10" />

      {/* Soft top shade so the navbar stays readable */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/25 to-transparent" />

      {/* Image stage
          mobile: fills the screen (cropped to the model)
          tablet: 4:3 box
          laptop: exact image ratio, sized to fit the screen height */}
      <div className="relative h-full min-h-[640px] w-full sm:aspect-[4/3] sm:h-auto sm:min-h-0 lg:mx-auto lg:mb-[3svh] lg:aspect-[2.05/1] lg:w-[min(100%,calc((100svh_-_4rem)*2.05))]">
        <img
          src={heroImg}
          alt="Model in a tailored brown blazer with the word STYLE behind her"
          className="hero-fade block h-full w-full animate-hero-settle object-cover object-[62%_center] sm:object-[60%_center] lg:object-center"
        />

        {/* Bottom shade for text contrast on small screens */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/35 to-transparent lg:hidden" />

        {/* Tagline: beside the E on laptop */}
        <p
          className="absolute left-[85.5%] top-[51%] hidden w-[11%] animate-fade-left text-[clamp(10px,0.95vw,15px)] font-light leading-relaxed text-white/75 transition-colors duration-500 hover:text-white lg:block"
          style={{ animationDelay: '1.1s' }}
        >
          {tagline}
        </p>

        {/* Bottom area: tagline (mobile/tablet) + glass feature bar */}
        <div className="absolute inset-x-4 bottom-5 z-20 sm:inset-x-8 sm:bottom-6 lg:inset-x-[6.5%] lg:bottom-[5%]">
          <p
            className="mx-auto mb-3 max-w-xs animate-fade-up text-center text-xs font-light leading-relaxed text-white/90 drop-shadow sm:max-w-sm sm:text-sm lg:hidden"
            style={{ animationDelay: '0.6s' }}
          >
            {tagline}
          </p>

          <div
            className="grid animate-fade-up grid-cols-2 gap-1 rounded-2xl border border-white/25 bg-white/10 p-1.5 shadow-[0_10px_50px_rgba(0,0,0,0.18)] backdrop-blur-md sm:rounded-3xl sm:p-2 lg:grid-cols-4"
            style={{ animationDelay: '0.8s' }}
          >
            {features.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="group flex animate-fade-up items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-all duration-300 hover:bg-white/10 sm:gap-4 sm:rounded-2xl sm:px-5 sm:py-3.5 lg:gap-3 lg:px-4 xl:gap-4 xl:px-5"
                style={{ animationDelay: `${1.1 + i * 0.12}s` }}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/25 text-[#d9b48f] transition-all duration-300 group-hover:-translate-y-1 group-hover:-rotate-6 group-hover:border-[#d9b48f] group-hover:bg-[#d9b48f] group-hover:text-[#3b2a20] sm:h-11 sm:w-11 sm:rounded-xl">
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[12px] font-medium leading-tight text-white sm:text-sm lg:truncate lg:text-[13px] xl:text-sm">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-light leading-snug text-white/60 transition-colors duration-300 group-hover:text-white/85 sm:text-xs lg:truncate">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}