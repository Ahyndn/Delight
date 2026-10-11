import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/navbar";

type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
  category: string;
};

type SearchResponse = {
  products: Product[];
  total: number;
};

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q?.trim() ? `Search: ${q.trim()}` : "Search products",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  let products: Product[] = [];
  let total = 0;

  if (query) {
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=0`,
      { next: { revalidate: 3600 } },
    );

    if (!response.ok) {
      throw new Error("Failed to search products.");
    }

    const data: SearchResponse = await response.json();
    products = data.products;
    total = data.total;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          {query ? `Search results for "${query}"` : "Search products"}
        </h1>

        {!query ? (
          <p className="mt-4 text-gray-600">
            Enter a product name in the search bar above.
          </p>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              No products found
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Try a different search term.
            </p>
            <Link href="/" className="mt-4 inline-block text-sm text-emerald-700 underline">
              Browse categories
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-gray-500">
              {total} {total === 1 ? "result" : "results"}
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <li key={product.id}>
                  <Link href={`/product/${product.id}`} className="group block">
                    <div className="overflow-hidden rounded-lg bg-gray-100">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          loading="lazy"
                          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center text-sm text-gray-500">
                          No image available
                        </div>
                      )}
                    </div>

                    <h2 className="mt-3 text-sm font-medium text-gray-900 group-hover:text-emerald-700">
                      {product.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                      {product.description}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Rating: {product.rating.toFixed(1)} / 5
                    </p>
                    <span className="mt-2 inline-block text-xs text-emerald-700">
                      {product.category.replaceAll("-", " ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}