import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/home/ProductCard";

export const metadata = {
  title: "Our Products | Luwia Skin Science",
  description: "Shop Luwia Skin Science premium products for skin brightening and repair.",
};

export default function ProductsPage() {
  return (
    <main className="bg-gray-50/50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-text mb-4">
            Our Products
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Discover our range of advanced skin brightening and repair formulas tailored for glowing, healthy skin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 bg-transparent gap-8 md:gap-12 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <div key={product.id}>
              {/* ProductCard component wraps itself in a <section>, which might look slightly odd in a grid, but it handles layout internally.*/}
              {/* Let's extract the inner card or just use ProductCard with customized padding */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
