"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = {
  '/': {
    name: 'Portfolio',
  },
  '/contact': {
    name: 'Kontakt',
  },
}

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <aside className="-ml-[12px] tracking-tight">
      <div className="lg:sticky lg:top-20">
        <div className="text-xl mt-2 ml-3 -mb-[10px]">Dudunur Isik</div>
        <nav
          className="flex flex-row items-start justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10 text-xl font-light">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`transition-all hover:text-neutral-700 dark:hover:text-neutral-300 flex align-middle relative py-1 px-2 m-1 ${isActive ? '' : 'text-neutral-300 dark:text-neutral-600'}`}
                >
                  {name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}
