"use client";

import Link from "next/link";
import { useCart } from "./cart-provider";

export default function CartIndicator() {
  const { count, hydrated } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${hydrated ? count : 0} items`}
      className="relative rounded-md p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1-1.5 0Z"
        />
      </svg>

      {hydrated && count > 0 && (
        <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-emerald-700 text-[10px] font-medium text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}