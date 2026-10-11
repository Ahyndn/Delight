import Link from "next/link";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        className="size-5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://www.pinterest.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.8.2-2.7l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.3 1 .5 1.8 1.5 1.8 1.8 0 3-2.3 3-5 0-2-1.4-3.5-3.8-3.5-2.8 0-4.5 2.1-4.5 4.4 0 .8.2 1.4.6 1.9.2.2.2.3.1.6l-.2.8c-.1.3-.3.4-.6.3-1.3-.5-1.9-1.9-1.9-3.5 0-2.6 2.2-5.7 6.7-5.7 3.6 0 6 2.6 6 5.4 0 3.7-2 6.5-5 6.5-1 0-2-.6-2.3-1.2l-.7 2.7c-.2 1-.7 1.9-1.1 2.6A10 10 0 1 0 12 2Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
        aria-hidden="true"
      >
        <path d="M19.6 7.1a5.5 5.5 0 0 1-3.4-1.2v7.5a6.1 6.1 0 1 1-6.1-6.1c.4 0 .8 0 1.2.1v3.4a2.8 2.8 0 1 0 1.7 2.6V2h3.2a5.5 5.5 0 0 0 3.4 5.1v0Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-gray-900"
            >
              Delight
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-600">
              Discover quality products at great prices. Shop your
              favorites in one convenient place.
            </p>
          </div>

          {/* Shopping */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Shopping
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-gray-900">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-gray-900">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Customer Service
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/#contact" className="hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-gray-900">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Information and Social Media */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Information
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Browse our latest products and discover something
              you&apos;ll love.
            </p>

            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>
                <Link href="/careers" className="hover:text-gray-900">
                  Careers
                </Link>
              </li>
            </ul>

            <h3 className="mt-6 text-sm font-semibold text-gray-900">
              Follow us
            </h3>

            <ul className="mt-3 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.name}`}
                    title={social.name}
                    className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Ahyndn. MIT license.
          </p>
        </div>
      </div>
    </footer>
  );
}