import { useState, useEffect } from 'react';

const TAMAGO_IMAGES = [
  { src: "https://framerusercontent.com/images/I8AGYbzHAG3DaCqU2wYCmWnrFLw.webp?width=1600&height=1600", alt: "Customers Dining" },
  { src: "https://framerusercontent.com/images/InB1qO4eodYHQXKOVBszhLURHE.webp?scale-down-to=1024&width=1600&height=1280", alt: "Restaurant Interior" },
  { src: "https://framerusercontent.com/images/jFLjtiNrSbyMi9cGMowrM7Pc7Bg.webp?scale-down-to=1024&width=1600&height=1600", alt: "Outer Lounge" },
];

const TOFU_IMAGES = [
  { src: "https://framerusercontent.com/images/G4pBdBCgBUC7XWv710nE2LXLUTs.webp?scale-down-to=512&width=1600&height=1600", alt: "Chefs Preparing Sushi" },
  { src: "https://framerusercontent.com/images/CFQGdIzQBxhDDSuVq7NiPP3wI.webp?scale-down-to=1024&width=1600&height=1600", alt: "Sushi Platter" },
  { src: "https://framerusercontent.com/images/eN3OMUIE7k3yknjR7LKFRc8TlU.webp?scale-down-to=1024&width=1600&height=1600", alt: "Sushi Artistry" },
];

const Carousel = ({ images, className }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#111] shadow-lg ${className}`}>
      {images.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === current ? 'opacity-80' : 'opacity-0'
          }`}
        />
      ))}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-colors hover:bg-black/60"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-colors hover:bg-black/60"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export const AboutPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#070707] p-4 font-sans text-[#e8e6e3]">
      <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-4 rounded-xl">

        {/* Salmon: Main "ABOUT" Image */}
        <div className="group relative col-span-2 row-span-5 flex items-end overflow-hidden rounded-2xl border border-white/5 bg-[#111] shadow-lg">
          <img
            src="https://framerusercontent.com/images/SMJY8uQcFDPv5vRNMRmZijjygkM.webp?scale-down-to=2048&width=2000&height=2400"
            alt="Restaurant Bar"
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
          <h1 className="relative z-10 p-8 font-serif text-7xl tracking-widest text-[#e8e4dc]">
            ABOUT
          </h1>
        </div>

        {/* Broccoli: Sushi Artistry Redefined */}
        <div className="col-span-2 row-span-2 flex flex-col justify-center rounded-2xl border border-white/5 bg-[#0c0c0c] p-10 shadow-lg">
          <h2 className="mb-12 font-serif text-2xl uppercase leading-snug tracking-widest text-[#d8d3c5]">
            Sushi Artistry <br /> Redefined
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-gray-400">
            Where culinary craftsmanship meets modern elegance. Indulge in the finest sushi, expertly curated to elevate your dining experience.
          </p>
        </div>

        {/* Tamago: Carousel */}
        <Carousel images={TAMAGO_IMAGES} className="col-span-1 row-span-2" />

        {/* Pork: Trip Advisor */}
        <div className="col-span-1 row-span-1 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0c0c0c] p-4 text-center shadow-lg">
          <div className="mb-2 flex gap-1 text-[10px] text-[#d8d3c5]">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <h3 className="font-serif text-sm tracking-[0.2em] text-[#d8d3c5]">TRIP ADVISOR</h3>
          <p className="mt-2 text-[8px] tracking-[0.2em] text-gray-500">BEST SUSHI</p>
        </div>

        {/* Edamame: Michelin Guide */}
        <div className="col-span-1 row-span-1 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0c0c0c] p-4 text-center shadow-lg">
          <div className="mb-2 flex gap-1 text-[10px] text-[#d8d3c5]">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <h3 className="font-serif text-sm tracking-[0.2em] text-[#d8d3c5]">MICHELIN GUIDE</h3>
          <p className="mt-2 text-[8px] tracking-[0.2em] text-gray-500">QUALITY FOOD</p>
        </div>

        {/* Tomato: Start Dining */}
        <div className="col-span-1 row-span-1 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0c0c0c] p-4 text-center shadow-lg">
          <div className="mb-2 flex gap-1 text-[10px] text-[#d8d3c5]">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <h3 className="font-serif text-sm tracking-[0.2em] text-[#d8d3c5]">START DINING</h3>
          <p className="mt-2 text-[8px] tracking-[0.2em] text-gray-500">COOL VIBE</p>
        </div>

        {/* Tofu: Carousel */}
        <Carousel images={TOFU_IMAGES} className="col-span-1 row-span-3" />

        {/* Tempura: Our Story */}
        <div className="col-span-2 row-span-3 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0c0c0c] p-8 text-center shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-[1px] w-4 bg-[#d8d3c5]/30"></div>
            <h3 className="font-serif text-sm tracking-[0.2em] text-[#d8d3c5]">OUR STORY</h3>
            <div className="h-[1px] w-4 bg-[#d8d3c5]/30"></div>
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            Founded with a passion for culinary excellence, Soirée's journey began in the heart of the city. Over years, it evolved into a haven for sushi enthusiasts, celebrated for its artful mastery and devotion to redefining gastronomy.
          </p>
        </div>

      </div>
    </div>
  );
};
