
"use client";

import Link from "next/link";
import Navbar from "../../components/navbar";
import { useCart } from "../../components/cart-provider";

export default function CartPage() {
  const {
    items,
    subtotal,
    hydrated,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!hydrated) {
    return <main className="p-8">Loading cart...</main>;
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your cart
        </h1>

        {items.length === 0 ? (
          <div className="mt-8 rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Your cart is empty.</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-md bg-emerald-700 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-gray-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap gap-4 py-5 sm:flex-nowrap"
                >
                  <Link href={`/product/${item.id}`}>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="size-24 rounded-lg bg-gray-100 object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.id}`}
                      className="font-medium text-gray-900 hover:text-emerald-700"
                    >
                      {item.title}
                    </Link>

                    <p className="mt-1 text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <label
                        htmlFor={`quantity-${item.id}`}
                        className="text-sm text-gray-600"
                      >
                        Quantity
                      </label>

                      <input
                        id={`quantity-${item.id}`}
                        type="number"
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(
                            item.id,
                            Number(event.target.value)
                          )
                        }
                        className="w-20 rounded-md border border-gray-300 px-2 py-1 text-sm"
                      />

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-600 underline"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      Available stock: {item.stock}
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Shipping and taxes are not included.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Continue shopping
                </Link>

                <button
                  type="button"
                  onClick={clearCart}
                  className="rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear cart
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}