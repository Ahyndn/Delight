import type { Product } from "../lib/shop";

export default function ProductReviews({
  product,
}: {
  product: Product;
}) {
  const reviews = product.reviews ?? [];

  return (
    <section id="reviews" className="mt-16 scroll-mt-24">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Customer reviews
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Rating: {product.rating.toFixed(1)} / 5
          {" · "}
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
      </div>

      {reviews.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {reviews.map((review, index) => (
            <li
              key={`${product.id}-${index}`}
              className="rounded-lg border border-gray-200 p-5"
            >
              <p className="text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                {"★".repeat(Math.max(0, Math.min(5, Math.round(review.rating))))}
                <span className="text-gray-300">
                  {"★".repeat(5 - Math.max(0, Math.min(5, Math.round(review.rating))))}
                </span>
              </p>

              <p className="mt-2 text-sm text-gray-800">
                {review.comment}
              </p>

              <p className="mt-3 text-xs text-gray-500">
                {review.reviewerName}
                {review.date
                  ? ` · ${new Date(review.date).toLocaleDateString()}`
                  : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-sm text-gray-600">
          No reviews are available for this product yet.
        </p>
      )}
    </section>
  );
}