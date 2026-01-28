export default function CTA() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of developers and companies who are already building amazing things with our platform.
        </p>

        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 sm:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors whitespace-nowrap">
                Get Started
              </button>
            </div>
            <p className="mt-4 text-indigo-100 text-sm">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <div className="text-4xl font-bold text-indigo-600">10K+</div>
            <div className="text-gray-600 dark:text-gray-400 mt-1">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">99.9%</div>
            <div className="text-gray-600 dark:text-gray-400 mt-1">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">50+</div>
            <div className="text-gray-600 dark:text-gray-400 mt-1">Countries</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-indigo-600">24/7</div>
            <div className="text-gray-600 dark:text-gray-400 mt-1">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
