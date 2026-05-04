import { Carousel } from '../components/Carousel'
import { PageTransition } from '../components/PageTransition'

const TAMAGO_IMAGES = [
  { src: "https://framerusercontent.com/images/I8AGYbzHAG3DaCqU2wYCmWnrFLw.webp?width=1600&height=1600", alt: "Customers Dining" },
  { src: "https://framerusercontent.com/images/InB1qO4eodYHQXKOVBszhLURHE.webp?scale-down-to=1024&width=1600&height=1280", alt: "Restaurant Interior" },
  { src: "https://framerusercontent.com/images/jFLjtiNrSbyMi9cGMowrM7Pc7Bg.webp?scale-down-to=1024&width=1600&height=1600", alt: "Outer Lounge" },
]

const TOFU_IMAGES = [
  { src: "https://framerusercontent.com/images/G4pBdBCgBUC7XWv710nE2LXLUTs.webp?scale-down-to=512&width=1600&height=1600", alt: "Chefs Preparing Sushi" },
  { src: "https://framerusercontent.com/images/CFQGdIzQBxhDDSuVq7NiPP3wI.webp?scale-down-to=1024&width=1600&height=1600", alt: "Sushi Platter" },
  { src: "https://framerusercontent.com/images/eN3OMUIE7k3yknjR7LKFRc8TlU.webp?scale-down-to=1024&width=1600&height=1600", alt: "Sushi Artistry" },
]

export const AboutPage = () => {
  return (
    <PageTransition>
      <div className="w-full bg-transparent p-3 font-sans text-[#e8e6e3] sm:p-4">

        {/* Mobile/tablet: stacked flex. lg: bento grid */}
        <div className="flex flex-col gap-4 lg:grid lg:h-[calc(100vh-2rem)] lg:w-full lg:grid-cols-6 lg:grid-rows-6 lg:rounded-xl">

          {/* Hero Image — full width on mobile, left half on lg */}
          <div className="group relative flex h-[42svh] min-h-[22rem] items-end overflow-hidden rounded-2xl border border-white/5 bg-[#111] shadow-lg sm:h-80 lg:col-span-3 lg:row-span-6 lg:h-auto lg:min-h-0">
            <img
              src="https://framerusercontent.com/images/SMJY8uQcFDPv5vRNMRmZijjygkM.webp?scale-down-to=2048&width=2000&height=2400"
              alt="Restaurant Bar"
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
            <h1 className="relative z-10 p-6 font-serif text-6xl tracking-widest text-[#e8e4dc] sm:p-8 sm:text-9xl">
              ABOUT
            </h1>
          </div>

          {/* Mobile/tablet two-column grid for remaining cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:contents">

            {/* Sushi Artistry Redefined */}
            <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-transparent p-6 shadow-lg sm:p-8 lg:col-span-2 lg:row-span-2">
              <h2 className="mb-6 font-noto-serif-jp text-2xl uppercase leading-snug tracking-widest text-[#d8d3c5] sm:text-3xl lg:mb-12">
                Sushi Artistry <br /> Redefined
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-gray-400 font-hanken-grotesk">
                Where culinary craftsmanship meets modern elegance. Indulge in the finest sushi, expertly curated to elevate your dining experience.
              </p>
            </div>

            {/* Tamago Carousel */}
            <Carousel images={TAMAGO_IMAGES} className="lg:col-span-1 lg:row-span-2 h-48 sm:h-auto" />

            {/* Awards row — 3 cols on mobile, individual cells on lg */}
            <div className="grid grid-cols-3 gap-4 sm:contents lg:contents">
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-transparent p-4 text-center shadow-lg lg:col-span-1 lg:row-span-1">
                <div className="mb-2 flex gap-1 text-[15px] text-[#d8d3c5]">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <h3 className="font-serif text-s tracking-[0.2em] text-[#d8d3c5]">TRIP ADVISOR</h3>
                <p className="mt-2 text-[10px] tracking-[0.2em] text-gray-500">BEST SUSHI</p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-transparent p-4 text-center shadow-lg lg:col-span-1 lg:row-span-1">
                <div className="mb-2 flex gap-1 text-[15px] text-[#d8d3c5]">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <h3 className="font-serif text-s tracking-[0.2em] text-[#d8d3c5]">MICHELIN GUIDE</h3>
                <p className="mt-2 text-[10px] tracking-[0.2em] text-gray-500">QUALITY FOOD</p>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-transparent p-4 text-center shadow-lg lg:col-span-1 lg:row-span-1">
                <div className="mb-2 flex gap-1 text-[15px] text-[#d8d3c5]">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <h3 className="font-serif text-s tracking-[0.2em] text-[#d8d3c5]">START DINING</h3>
                <p className="mt-2 text-[10px] tracking-[0.2em] text-gray-500">COOL VIBE</p>
              </div>
            </div>

            {/* Tofu Carousel */}
            <Carousel images={TOFU_IMAGES} className="lg:col-span-1 lg:row-span-3 h-48 sm:h-auto" />

            {/* Our Story */}
            <div className="flex flex-col items-center justify-between rounded-2xl border border-white/10 bg-transparent p-8 text-center shadow-lg py-10 lg:py-15 lg:col-span-2 lg:row-span-3">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-[1px] w-4 bg-[#d8d3c5]/30"></div>
                <h3 className="font-noto-serif-jp text-2xl sm:text-3xl tracking-[0.2em] text-[#d4ccb6]">OUR STORY</h3>
                <div className="h-[1px] w-4 bg-[#d8d3c5]/30"></div>
              </div>
              <p className="mb-6 font-hanken-grotesk text-sm leading-relaxed text-gray-400 lg:mb-20 lg:text-base">
                Founded with a passion for culinary excellence, Soirée's journey began in the heart of the city. Over years, it evolved into a haven for sushi enthusiasts, celebrated for its artful mastery and devotion to redefining gastronomy.
              </p>
            </div>

          </div>
        </div>
      </div>
    </PageTransition>
  )
}
