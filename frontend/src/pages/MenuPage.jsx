import { useRef } from 'react'
import { MenuItem } from '../components/MenuItem'
import { MenuSectionTitle } from '../components/MenuSectionTitle'
import { useMenu } from '../hooks/useMenu'
import { PageTransition } from '../components/PageTransition'

export const MenuPage = () => {
  const { menuData, categories, loading } = useMenu()
  const sectionRefs = useRef({})
  const scrollContainerRef = useRef(null)

  const scrollToCategory = (cat) => {
    const container = scrollContainerRef.current
    const section = sectionRefs.current[cat]
    if (!container || !section) return
    const offset = section.offsetTop - container.offsetTop
    container.scrollTo({ top: offset, behavior: 'smooth' })
  }

  return (
    <PageTransition>
      <div className="min-h-screen p-4 font-sans text-white pb-20 md:pb-4">

        {/* Mobile/tablet: stacked. lg: 4-col grid */}
        <div className="flex flex-col md:flex-row lg:grid lg:grid-cols-4 lg:grid-rows-4 gap-4 h-auto lg:h-[calc(100vh-2rem)]">

          {/* Hero Image */}
          <div className="md:w-1/2 lg:w-auto lg:col-span-2 lg:row-span-4 relative rounded-3xl overflow-hidden h-[40vh] md:h-auto">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/menuside.avif')" }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20"></div>
            </div>
            <h1 className="absolute bottom-8 left-8 text-7xl sm:text-8xl lg:text-9xl font-serif text-[#f4ecd8] tracking-tight">
              MENU
            </h1>
          </div>

          {/* Menu Content */}
          <div
            ref={scrollContainerRef}
            className="md:w-1/2 lg:w-auto lg:col-span-2 lg:row-span-4 rounded-3xl border border-white/10 bg-transparent flex flex-col items-center py-10 px-4 sm:px-8 overflow-y-auto custom-scrollbar"
          >

            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8 shrink-0 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className="px-4 sm:px-6 py-2 rounded-lg text-xs tracking-widest uppercase border border-white/30 bg-transparent text-white hover:border-white transition-all duration-300"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* All categories and their items */}
            <div className="w-full flex flex-col gap-12 px-4 sm:px-10 lg:px-25">
              {loading && <p className="text-white/40 text-sm">Loading...</p>}
              {categories.map((cat) => (
                <div
                  key={cat}
                  data-category={cat}
                  ref={(el) => (sectionRefs.current[cat] = el)}
                  className="flex flex-col gap-8"
                >
                  <MenuSectionTitle title={cat} />
                  {menuData[cat]?.map((item) => (
                    <MenuItem key={item._id} {...item} />
                  ))}
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  )
}
