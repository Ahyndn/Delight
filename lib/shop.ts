export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  reviews?: ProductReview[];
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  sku?: string;
  meta?: {
    barcode?: string;
    qrCode?: string;
  };
};

export function isGrocery(product: Pick<Product, "category">) {
  return product.category.toLowerCase() === "groceries";
}

export function getProductPrice(product: Product): number {
  if (!isGrocery(product)) {
    return product.price;
  }

  // Apply a 10% grocery discount when the API has no discount.
  const discount = product.discountPercentage ?? 10;

  return Number(
    (product.price * (1 - discount / 100)).toFixed(2)
  );
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!/^\d+$/.test(id)) return null;

  const response = await fetch(
    `https://dummyjson.com/products/${id}`,
    { next: { revalidate: 3600 } }
  );

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Unable to load this product.");
  }

  return response.json();
}