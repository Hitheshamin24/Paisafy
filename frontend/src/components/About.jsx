import { Lightbulb, TrendingUp, HandCoins } from "lucide-react";

const About = () => {
  return (
    <section className="bg-[#0f172a] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Why Choose Paisafy?
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          We simplify investing by providing smart, tailored strategies that match your financial goals, risk tolerance, and time frame.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        {/* Insightful Planning */}
        <div className="bg-[#1e293b] rounded-xl p-6 hover:shadow-lg transition">
          <div className="flex justify-center mb-4">
            <Lightbulb className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Smart Strategies</h3>
          <p className="text-gray-400">
            Generate investment plans using insights from your income, goals, and risk level.
          </p>
        </div>

        {/* Growth Forecasting */}
        <div className="bg-[#1e293b] rounded-xl p-6 hover:shadow-lg transition">
          <div className="flex justify-center mb-4">
            <TrendingUp className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Maximized Growth</h3>
          <p className="text-gray-400">
            Our AI evaluates the best stocks, SIPs, and ETFs to help grow your wealth faster.
          </p>
        </div>

        {/* Personalized Planning */}
        <div className="bg-[#1e293b] rounded-xl p-6 hover:shadow-lg transition">
          <div className="flex justify-center mb-4">
            <HandCoins className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Personalized Plans</h3>
          <p className="text-gray-400">
            Every plan is custom-built around your financial situation and future goals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
