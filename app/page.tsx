import Navbar from "../components/navbar";
import Categories from "../components/categories";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Navbar />
        </div>
      </header>

      <Categories />
    </main>
  );
}