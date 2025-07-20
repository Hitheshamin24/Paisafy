import { Lightbulb, TrendingUp, HandCoins } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "../hooks/useInView";

const About = () => {
  const [ref, isInView] = useInView();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#0B0F19] text-white py-20 px-6"
      id="About"
    >
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
          Why Choose Paisafy?
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Smart, custom investment plans designed to help you grow wealth confidently.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Smart Strategies */}
        <div className="bg-[#101624]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-center mb-6">
            <Lightbulb className="w-12 h-12 text-blue-500 drop-shadow-glow" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-white">
            Smart Strategies
          </h3>
          <p className="text-gray-400 text-md">
            Generate intelligent investment plans tailored to your income, goals, and risk level.
          </p>
        </div>

        {/* Maximized Growth */}
        <div className="bg-[#101624]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-center mb-6">
            <TrendingUp className="w-12 h-12 text-green-500 drop-shadow-glow" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-white">
            Maximized Growth
          </h3>
          <p className="text-gray-400 text-md">
            Our AI suggests optimal stocks, SIPs, and ETFs to help grow your investments.
          </p>
        </div>

        {/* Personalized Plans */}
        <div className="bg-[#101624]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-center mb-6">
            <HandCoins className="w-12 h-12 text-yellow-500 drop-shadow-glow" />
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-white">
            Personalized Plans
          </h3>
          <p className="text-gray-400 text-md">
            Each plan is uniquely created for your lifestyle, goals, and future.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
