"use client";

import Link from "next/link";
import { useRef } from "react";

type CarouselItem = {
  slug: string;
  name: string;
  title: string;
  thumbnail: string;
};

export default function CategoriesCarousel({
  items,
}: {
  items: CarouselItem[];
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scrollCarousel(direction: "left" | "right") {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left:
        direction === "left"
          ? -carousel.clientWidth * 0.8
          : carousel.clientWidth * 0.8,
      behavior: "smooth",
    });
  }

  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="category-carousel-heading"
      className="mt-16"
    >
      {/* Heading and carousel controls */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id="category-carousel-heading"
          className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl"
        >
          <span>Hello</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 shrink-0"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
          </svg>
        </h2>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollCarousel("left")}
            className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-emerald-700 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-700"
          >
            <span aria-hidden="true">←</span>
          </button>

          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollCarousel("right")}
            className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-emerald-700 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-700"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Category carousel */}
      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/category/${item.slug}`}
            className="group w-[75%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]"
          >
            <div className="overflow-hidden rounded-xl bg-gray-100">
              <img
                src={item.thumbnail}
                alt={item.title || item.name}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <h3 className="mt-3 text-base font-semibold text-gray-900 transition group-hover:text-emerald-700">
              {item.title || item.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}