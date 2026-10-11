import Link from "next/link";
import CategoriesCarousel from "./CategoriesCarousel";

type Category = {
  slug: string;
  name: string;
  url: string;
};

type Product = {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
};

type ProductsResponse = {
  products: Product[];
};

async function getCategories() {
  const [categoryResponse, productResponse] = await Promise.all([
    fetch("https://dummyjson.com/products/categories", {
      next: { revalidate: 3600 },
    }),
    fetch(
      "https://dummyjson.com/products?limit=0&select=id,title,category,thumbnail",
      {
        next: { revalidate: 3600 },
      },
    ),
  ]);

  if (!categoryResponse.ok || !productResponse.ok) {
    throw new Error("Unable to load product categories.");
  }

  const categories: Category[] = await categoryResponse.json();
  const { products }: ProductsResponse = await productResponse.json();

  return categories.map((category) => {
    const categoryProducts = products.filter(
      (product) => product.category === category.slug,
    );

    // Keep the first product for the existing category grid.
    const gridProduct = categoryProducts[0];

    // Choose the last product with a different thumbnail for the carousel.
    const carouselProduct = [...categoryProducts]
      .reverse()
      .find(
        (product) =>
          product.thumbnail &&
          product.thumbnail !== gridProduct?.thumbnail,
      );

    return {
      ...category,
      product: gridProduct,
      carouselProduct: carouselProduct ?? null,
    };
  });
}

export default async function Categories() {
  const categories = await getCategories();

  const carouselItems = categories
    .filter((category) => category.carouselProduct?.thumbnail)
    .map((category) => ({
      slug: category.slug,
      name: category.name,
      title: category.carouselProduct!.title,
      thumbnail: category.carouselProduct!.thumbnail,
    }));

  return (
    <section
      aria-labelledby="categories-heading"
      className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Separate carousel; the grid above remains unchanged */}
      <CategoriesCarousel items={carouselItems} />
      {/* Existing category grid */}
      <div className="mb-8">
        <h2
          id="categories-heading"
          className="text-2xl font-bold text-gray-900 sm:text-3xl"
        >
          Shop by Category
        </h2>

        <p className="mt-2 text-gray-600">
          Explore our collection across all categories.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(({ slug, name, product }) => (
          <Link
            key={slug}
            href={`/category/${slug}`}
            className="group block"
          >
            <div className="overflow-hidden rounded-lg bg-gray-100">
              {product?.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  loading="lazy"
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-80 lg:h-96"
                />
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-gray-500 sm:h-80 lg:h-96">
                  Image unavailable
                </div>
              )}
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900 transition group-hover:text-emerald-700 sm:text-xl">
              {name}
            </h3>

            <p className="mt-2 max-w-sm text-gray-700">
              Explore our {name.toLowerCase()} collection and discover
              products selected for you.
            </p>

            <span className="mt-3 inline-block text-sm font-medium text-emerald-700">
              Browse category →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}