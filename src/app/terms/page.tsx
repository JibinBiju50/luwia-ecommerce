export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-brand-primary tracking-widest uppercase mb-3">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text">
            Terms & Conditions
          </h1>
          <p className="text-gray-500 mt-3 text-sm">
            By using our website, you agree to the following terms.
          </p>
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-primary/5">
            <h2 className="text-lg font-semibold text-brand-text mb-3">
              1. General
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>All content is owned by Luwia.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>You may not copy, reproduce, or misuse content.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-primary/5">
            <h2 className="text-lg font-semibold text-brand-text mb-3">
              2. Product Information
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>We strive for accuracy, but minor variations may occur.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>Results may vary from person to person.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-primary/5">
            <h2 className="text-lg font-semibold text-brand-text mb-3">
              3. Pricing & Payments
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>Prices are subject to change without notice.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>Payments must be completed before order processing.</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-primary/5">
            <h2 className="text-lg font-semibold text-brand-text mb-3">
              4. Limitation of Liability
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Luwia is not liable for:
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>Any allergic reactions or misuse of products.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                <span>Indirect or incidental damages.</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Last updated: March 2025
        </p>
      </div>
    </div>
  );
}
