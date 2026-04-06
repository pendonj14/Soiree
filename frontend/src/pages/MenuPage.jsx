import { useState } from 'react';
import { Navbar } from '../components/NavBar';
import { MenuItem } from '../components/MenuItem';
import { MenuSectionTitle } from '../components/MenuSectionTitle';

// ---------------------------------------------------------
// 1. Mock Data (Ideally fetched from an API/Backend)
// ---------------------------------------------------------
const MENU_DATA = {
  maki: [
    {
      id: 'm1',
      name: 'SPICY TUNA MAKI',
      description: 'A tantalizing blend of spicy tuna, cucumber, and avocado, harmoniously rolled in nori and seasoned rice.',
      price: 5,
      image: '/images/spicy-tuna.png' // Replace with your image
    },
    {
      id: 'm2',
      name: 'MANGO MAKI',
      description: 'Tempura-fried shrimp, cucumber, and cream cheese embrace a center of fresh avocado, delivering a satisfying contrast of textures.',
      price: 5,
      image: '/images/mango-maki.png'
    },
    {
      id: 'm3',
      name: 'SALMON MAKI',
      description: 'Shiitake mushrooms, avocado, and pickled daikon radish nestle within a roll of seasoned rice, coated with nutty sesame seeds.',
      price: 5,
      image: '/images/salmon-maki.png'
    },
    {
      id: 'm4',
      name: 'TUNA MAKI',
      description: 'A vibrant assortment of julienned carrots, bell peppers, and cucumber, tightly encased in a nori-wrapped rice roll.',
      price: 5,
      image: '/images/tuna-maki.png'
    }
  ],
  uramaki: [
    {
      id: 'u1',
      name: 'VOLCANO DELIGHT',
      description: 'Creamy crab salad, avocado, and cucumber rolled inside, topped with spicy tuna and drizzled with fiery sriracha sauce.',
      price: 12,
      image: '/images/volcano-delight.png'
    }
  ]
};



export const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('MAKI');

  return (
    <div className="h-screen bg-[#0a0a0a] p-4 font-sans text-white">
      <div className="grid grid-cols-4 grid-rows-4 gap-4 h-full">

        {/* LEFT HALF: Hero Image */}
        <div className="col-span-2 row-span-4 relative rounded-3xl overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/menuside.png')" }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20"></div>
          </div>
          <h1 className="absolute bottom-8 left-8 text-8xl lg:text-9xl font-serif text-[#f4ecd8] tracking-tight">
            MENU
          </h1>
        </div>

        {/* RIGHT HALF: Menu Content */}
        <div className="col-span-2 row-span-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center py-10 px-8 overflow-y-auto">

          {/* Category Pills */}
          <div className="flex items-center gap-2 mb-8 bg-white/5 p-1 rounded-full border border-white/10 shrink-0">
            {['MAKI', 'URAMAKI', 'SPECIAL ROLLS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="w-full flex flex-col gap-8">
            <MenuSectionTitle title="MAKI" />
            {MENU_DATA.maki.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}

            <MenuSectionTitle title="URAMAKI" />
            {MENU_DATA.uramaki.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}