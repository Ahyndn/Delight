import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/navbar";

type Category = {
  slug: string;
  name: string;
  url: string;
};

type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  discountPercentage?: number;
};

type ProductsResponse = {
  products: Product[];
  total: number;
};

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

const PAGE_SIZE = 12;

async function getCategories(): Promise<Category[]> {
  const response = await fetch(
    "https://dummyjson.com/products/categories",
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error("Failed to load categories.");
  }

  return response.json();
}

async function getProducts(slug: string): Promise<Product[]> {
  const response = await fetch(
    `https://dummyjson.com/products/category/${encodeURIComponent(slug)}?limit=0`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error("Failed to load category products.");
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

function parsePrice(value?: string): number | null {
  if (value === undefined || value.trim() === "") return null;

  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  return {
    title: category?.name ?? "Category",
    description: category
      ? `Browse products in ${category.name} at Delight.`
      : "Browse product categories at Delight.",
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const [{ slug }, query, categories] = await Promise.all([
    params,
    searchParams,
    getCategories(),
  ]);

  const category = categories.find((item) => item.slug === slug);

  if (!category) notFound();

  const allProducts = await getProducts(slug);

  const minPrice = parsePrice(query.minPrice);
  const maxPrice = parsePrice(query.maxPrice);

  const validSorts = ["popular", "price-asc", "price-desc", "rating"];
  const sort = validSorts.includes(query.sort ?? "")
    ? query.sort!
    : "popular";

  const filteredProducts = allProducts.filter((product) => {
    if (minPrice !== null && product.price < minPrice) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts];

  switch (sort) {
    case "price-asc":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    default:
      sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  const total = sortedProducts.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const requestedPage = Number(query.page ?? "1");
  const currentPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, Math.max(1, totalPages))
      : 1;

  const products = sortedProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function pageUrl(page: number) {
    const search = new URLSearchParams();

    if (sort !== "popular") search.set("sort", sort);
    if (query.minPrice) search.set("minPrice", query.minPrice);
    if (query.maxPrice) search.set("maxPrice", query.maxPrice);
    search.set("page", String(page));

    return `/category/${encodeURIComponent(slug)}?${search.toString()}`;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-900">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-gray-900">
              {category.name}
            </li>
          </ol>
        </nav>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
              {category.name}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Explore our {category.name.toLowerCase()} collection.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {total} {total === 1 ? "result" : "results"}
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-4">
          <aside>
            <form
              action={`/category/${encodeURIComponent(slug)}`}
              method="get"
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="sort"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sort by
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={sort}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="popular">Most popular</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                  <option value="rating">Highest rated</option>
                </select>
              </div>

              <fieldset className="border-t border-gray-200 pt-5">
                <legend className="text-sm font-medium text-gray-700">
                  Price range
                </legend>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    min="0"
                    step="0.01"
                    defaultValue={query.minPrice}
                    placeholder="Min $"
                    aria-label="Minimum price"
                    className="min-w-0 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <span>–</span>
                  <input
                    type="number"
                    name="maxPrice"
                    min="0"
                    step="0.01"
                    defaultValue={query.maxPrice}
                    placeholder="Max $"
                    aria-label="Maximum price"
                    className="min-w-0 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </fieldset>

              <button
                type="submit"
                className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Apply filters
              </button>

              <Link
                href={`/category/${encodeURIComponent(slug)}`}
                className="block text-center text-sm text-gray-600 underline"
              >
                Clear filters
              </Link>
            </form>

            <div className="mt-8 border-t border-gray-200 pt-5">
              <h2 className="text-sm font-medium text-gray-900">
                Browse categories
              </h2>
              <ul className="mt-3 space-y-2">
                {categories.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/category/${item.slug}`}
                      aria-current={item.slug === slug ? "page" : undefined}
                      className={`text-sm hover:text-emerald-700 ${
                        item.slug === slug
                          ? "font-semibold text-emerald-700"
                          : "text-gray-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section
            aria-label={`${category.name} products`}
            className="min-w-0 lg:col-span-3"
          >
            {products.length > 0 ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                {products.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.id}`}
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-lg bg-gray-100">
                        <span
                          className={`absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-[10px] font-medium ${
                            product.stock > 0
                              ? "bg-white text-gray-900"
                              : "bg-gray-900 text-white"
                          }`}
                        >
                          {product.stock > 0 ? "In stock" : "Out of stock"}
                        </span>

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

                      <h2 className="mt-3 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-emerald-700">
                        {product.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {product.description}
                      </p>
                           <p className="mt-2 text-xs text-gray-500">
                        Rating: {product.rating.toFixed(1)} / 5
                      </p>
                     <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      ${(
                        product.category.toLowerCase() === "groceries"
                          ? product.price * (
                              1 - (product.discountPercentage ?? 10) / 100
                            )
                          : product.price
                      ).toFixed(2)}
                    </span>

                    {product.category.toLowerCase() === "groceries" && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                    </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-gray-200 px-6 py-16 text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  No products found
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Try changing your price range.
                </p>
                <Link
                  href={`/category/${slug}`}
                  className="mt-4 inline-block text-sm text-emerald-700 underline"
                >
                  Clear filters
                </Link>
              </div>
            )}

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
              >
                {currentPage > 1 && (
                  <Link
                    href={pageUrl(currentPage - 1)}
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <Link
                      key={page}
                      href={pageUrl(page)}
                      aria-current={page === currentPage ? "page" : undefined}
                      className={`flex size-9 items-center justify-center rounded-md text-sm ${
                        page === currentPage
                          ? "bg-emerald-700 font-medium text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </Link>
                  );
                })}

                {currentPage < totalPages && (
                  <Link
                    href={pageUrl(currentPage + 1)}
                    className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}