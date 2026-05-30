// loading.tsx — shown instantly while products/[id]/page.tsx server-renders.
// Next.js App Router automatically wraps this in a Suspense boundary.

export default function ProductPageLoading() {
  return (
    <div className="bg-white min-h-screen animate-pulse">
      {/* Sales banner placeholder */}
      <div className="h-10 bg-brand-primary/80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>

        {/* Product grid */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery skeleton */}
          <div className="space-y-3">
            <div className="aspect-square bg-gray-100 rounded-3xl" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-5 pt-2">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-5 bg-gray-200 rounded-lg w-1/2" />
            </div>
            {/* Stars */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
              ))}
              <div className="w-10 h-4 bg-gray-200 rounded ml-1" />
            </div>
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {[80, 100, 90, 110, 95].map((w, i) => (
                <div key={i} className="h-7 bg-gray-100 rounded-full" style={{ width: w }} />
              ))}
            </div>
            {/* Price */}
            <div className="h-9 w-32 bg-gray-200 rounded-lg" />
            {/* Coupon box */}
            <div className="h-16 bg-gray-100 rounded-xl" />
            {/* Delivery */}
            <div className="h-10 bg-gray-100 rounded-xl" />
            {/* Qty + Buttons */}
            <div className="h-10 w-36 bg-gray-100 rounded-full" />
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gray-100 rounded-full" />
              <div className="flex-1 h-12 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
