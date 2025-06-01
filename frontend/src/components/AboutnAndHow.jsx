const AboutnAndHow = () => {
  return (
    <div>
      <section id="about" className="bg-gray-900 text-white py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why <span className="text-blue-500">Paisafy</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            We help you make smarter investments by analyzing your income, risk
            appetite, and goals. Our AI-driven engine suggests the best mix of
            stocks, SIPs, and ETFs just for you.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Card 1 */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-400 "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M13 16h-1v-4h-1m1-4h.01M12 6a9 9 0 100 18 9 9 0 000-18z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-400">
                Smart Suggestions
              </h3>
              <p className="text-gray-300">
                AI-backed recommendations tailored to your financial profile.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-400">
                Simple & Transparent
              </h3>
              <p className="text-gray-300">
                Clean and easy interface — no hidden jargon, just insights.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3v18h18M9 17v-6m4 6V9m4 8v-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-400">
                All-in-One Planning
              </h3>
              <p className="text-gray-300">
                We combine SIPs, ETFs, and stocks in one smart plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-gray-950 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="bg-[#0D1B2A] p-8 rounded-xl shadow-md relative hover:shadow-xl transition">
              <div className="w-16 h-16 bg-[#112240] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                {/* SVG Icon */}
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12h6m-6 4h6M5 8h14v12H5z" />
                </svg>
                {/* Step Badge */}
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  1
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Define Your Financial Goals
              </h3>
              <p className="text-gray-300 text-sm">
                Input your investment amount, risk tolerance, and financial
                objectives.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0D1B2A] p-8 rounded-xl shadow-md relative hover:shadow-xl transition">
              <div className="w-16 h-16 bg-[#112240] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 18V5a1 1 0 011-1h2a1 1 0 011 1v13M13 18V9a1 1 0 011-1h2a1 1 0 011 1v9M20 18v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  2
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
              <p className="text-gray-300 text-sm">
                Our algorithms analyze market data and your preferences to
                generate personalized recommendations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0D1B2A] p-8 rounded-xl shadow-md relative hover:shadow-xl transition">
              <div className="w-16 h-16 bg-[#112240] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 11V5a1 1 0 012 0v6h6a1 1 0 010 2h-6v6a1 1 0 01-2 0v-6H5a1 1 0 010-2h6z" />
                </svg>
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  3
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                Get Your Investment Plan
              </h3>
              <p className="text-gray-300 text-sm">
                Receive a detailed breakdown of recommended stocks, ETFs, and
                SIPs tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutnAndHow;
