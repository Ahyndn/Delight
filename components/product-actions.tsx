"use client";

import { useState } from "react";
import type { Product } from "../lib/shop";
import { useCart } from "./cart-provider";

export default function ProductActions({
  product,
}: {
  product: Product;
}) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { addToCart } = useCart();

  const available = product.stock > 0;

  function handleAdd() {
    const success = addToCart(product, quantity);

    setMessage(
      success
        ? `${quantity} × ${product.title} added to your cart.`
        : "Unable to add more than the available stock."
    );
  }

  return (
    <div className="mt-6">
      <p className="text-sm text-gray-600" aria-live="polite">
        {available
          ? `${product.stock} in stock`
          : "Currently out of stock"}
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-900"
          >
            Quantity
          </label>

          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="size-10 rounded-md border border-gray-300 disabled:opacity-40"
            >
              −
            </button>

            <input
              id="quantity"
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(event) => {
                const value = Number(event.target.value);
                setQuantity(
                  Number.isFinite(value)
                    ? Math.min(product.stock || 1, Math.max(1, Math.floor(value || 1)))
                    : 1
                );
              }}
              disabled={!available}
              className="h-10 w-16 rounded-md border border-gray-300 text-center"
            />

            <button
              type="button"
              onClick={() =>
                setQuantity((q) => Math.min(product.stock, q + 1))
              }
              disabled={!available || quantity >= product.stock}
              aria-label="Increase quantity"
              className="size-10 rounded-md border border-gray-300 disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!available}
          className="flex-1 rounded-md bg-emerald-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {available ? "Add to cart" : "Out of stock"}
        </button>
      </div>

      <p role="status" aria-live="polite" className="mt-3 text-sm text-emerald-700">
        {message}
      </p>
    </div>
  );
}