import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../components/navbar";
import ProductActions from "../../../components/product-actions";
import ProductReviews from "../../../components/product-reviews";
import { getProduct, getProductPrice, isGrocery } from "../../../lib/shop";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const price = getProductPrice(product);
  const discounted = isGrocery(product);
  const images = Array.from(
    new Set([product.thumbnail, ...(product.images ?? [])].filter(Boolean))
  );

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          {" / "}
          <Link
            href={`/category/${product.category}`}
            className="hover:text-gray-900"
          >
            {product.category}
          </Link>
          {" / "}
          <span className="text-gray-800">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <img
                src={images[0] || "/placeholder.png"}
                alt={product.title}
                className="aspect-square w-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <ul className="mt-3 grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((image, index) => (
                  <li key={`${image}-${index}`}>
                    <img
                      src={image}
                      alt={`${product.title} image ${index + 1}`}
                      loading="lazy"
                      className="aspect-square w-full rounded-md bg-gray-100 object-cover"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              {product.category}
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
              {product.title}
            </h1>

            <a href="#reviews" className="mt-3 inline-block text-sm text-gray-600 underline">
              ★ {product.rating.toFixed(1)} / 5 · Read reviews
            </a>

            <div className="mt-4 flex items-center gap-3">
              <p className="text-2xl font-semibold text-gray-900">
                ${price.toFixed(2)}
              </p>

              {discounted && (
                <>
                  <p className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </p>
                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                    Grocery deal
                  </span>
                </>
              )}
            </div>

            <p className="mt-4 leading-7 text-gray-600">
              {product.description}
            </p>

              {/* Product identification */}
            <dl className="mt-5 space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-gray-500">SKU</dt>
                <dd className="font-medium text-gray-900">
                  {(product as typeof product & { sku?: string }).sku || "N/A"}
                </dd>
              </div>

              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-gray-500">Barcode</dt>
                <dd className="font-mono text-gray-900">
                  {(product as typeof product & {
                    meta?: { barcode?: string };
                  }).meta?.barcode || "N/A"}
                </dd>
              </div>
            </dl>

            <ProductActions product={product} />

            <ul className="mt-6 space-y-2 border-t border-gray-200 pt-6 text-sm text-gray-600">
              <li>
                {product.stock > 0
                  ? `${product.stock} units currently listed in stock`
                  : "Currently out of stock"}
              </li>
              <li>Prices are shown in USD.</li>
            </ul>
          </div>
        </div>

        <ProductReviews product={product} />
      </div>
    </main>
  );
}