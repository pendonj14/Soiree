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
      <div className="min-h-screen p-3 font-sans text-white sm:p-4">

        {/* Mobile/tablet: stacked. lg: 4-col grid */}
        <div className="flex h-auto flex-col gap-4 md:flex-row lg:grid lg:h-[calc(100vh-2rem)] lg:grid-cols-4 lg:grid-rows-4">

          {/* Hero Image */}
          <div className="relative h-[42svh] min-h-[22rem] overflow-hidden rounded-3xl md:h-auto md:w-1/2 lg:col-span-2 lg:row-span-4 lg:min-h-0 lg:w-auto">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/menuside.png')" }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20"></div>
            </div>
            <h1 className="absolute bottom-8 left-6 font-serif text-6xl tracking-tight text-[#f4ecd8] sm:left-8 sm:text-8xl lg:text-9xl">
              MENU
            </h1>
          </div>

          {/* Menu Content */}
          <div
            ref={scrollContainerRef}
            className="flex flex-col items-center overflow-y-auto rounded-3xl border border-white/10 bg-transparent px-4 py-8 sm:px-8 sm:py-10 md:w-1/2 lg:col-span-2 lg:row-span-4 lg:w-auto"
          >

            {/* Category Buttons */}
            <div className="mb-8 flex w-full shrink-0 flex-wrap items-center justify-center gap-3 lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className="shrink-0 rounded-lg border border-white/30 bg-transparent px-4 py-2 text-xs uppercase tracking-widest text-white transition-all duration-300 hover:border-white sm:px-6"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* All categories and their items */}
            <div className="flex w-full flex-col gap-10 px-0 sm:gap-12 sm:px-10 lg:px-25">
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
