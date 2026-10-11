"use client";

import { useState, type FormEventHandler } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const query = search.trim();
    if (!query) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex min-w-0 items-center"
    >
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>

      <input
        id="site-search"
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products..."
        className="w-28 rounded-l-md border border-gray-300 px-2 py-2 text-sm outline-none focus:border-emerald-600 sm:w-44"
      />

      <button
        type="submit"
        aria-label="Search products"
        className="rounded-r-md border border-l-0 border-gray-300 p-2 text-gray-700 hover:bg-gray-100"
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
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </form>
  );
}