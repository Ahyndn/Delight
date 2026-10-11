"use client";

import Link from "next/link"; 
import { useState } from "react"; 
import Search from "./search"; 
import CartIndicator from "./cart-indicator";

export default function Navbar() 
  { const [menuOpen, setMenuOpen] = useState(false);

  return ( 
    <div> <div className="flex min-h-16 flex-wrap items-center gap-4"> 
      <Link href="/" className="flex shrink-0 items-center gap-2 text-emerald-700" >
      <span className="text-sm font-semibold tracking-tight text-gray-900"> Delight </span> 
      </Link>

    <nav aria-label="Global" className="hidden md:block"> 
      <ul className="flex items-center gap-6 text-sm text-gray-600"> 
        <li> <Link href="/" className="font-normal text-gray-600 transition hover:text-gray-900"> Shop </Link> 
          </li> 
        <li> <Link href="/#categories-heading" className="transition hover:text-gray-900" > Categories </Link> 
        </li> 
        <li>
        <Link
          href="/careers"
          className="transition hover:text-gray-900"
        >
          Careers
        </Link>
      </li>
      </ul> 
    </nav>

<div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 sm:flex-initial"> <Search />

{/* Dynamic cart icon and item count */} <CartIndicator />

{/* Existing mobile menu toggle */} 
    <button type="button" aria-label={ menuOpen ? "Close navigation menu" : "Open navigation menu" } aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen((open) => !open)} className="rounded-md p-2 text-gray-600 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-emerald-700 md:hidden" > 
      {menuOpen ? ( <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true" > 
      <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /> </svg> ) : ( 
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5" aria-hidden="true" > 
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /> 
      </svg> )} 
    </button> 
  </div> 
</div>

    {menuOpen && ( <nav id="mobile-nav" aria-label="Mobile navigation" className="border-t border-gray-100 py-3 md:hidden" > 
      <ul className="space-y-1 text-sm"> 
        <li> <Link href="/" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50" > Shop </Link> </li> 
        <li> <Link href="/#categories-heading" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50" > Categories </Link> </li> 
          <li>
          <Link
            href="/careers"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-50"
          >
            Careers
          </Link>
        </li>
      </ul> 
  </nav> )} 
</div> ); }