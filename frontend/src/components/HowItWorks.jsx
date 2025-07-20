import { User, Settings, BadgeCheck } from "lucide-react";
import { useInView } from "../hooks/useInView";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const [ref, isInView] = useInView();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-br from-black to-gray-900 text-white py-20 px-6 md:px-16"
      id="how-it-works"
    >
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-snug">
          How Paisafy Works
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Get personalized investment plans in three simple steps – no finance degree needed.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        {/* Step 1 */}
        <div className="bg-[#111827] rounded-2xl p-8 hover:shadow-xl transition duration-300">
          <div className="flex justify-center mb-5">
            <div className="bg-blue-950 p-4 rounded-full">
              <User className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Step 1: Enter Your Info</h3>
          <p className="text-gray-400 text-base">
            Tell us about your income, investment amount, risk level, and goals.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#111827] rounded-2xl p-8 hover:shadow-xl transition duration-300">
          <div className="flex justify-center mb-5">
            <div className="bg-blue-950 p-4 rounded-full">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Step 2: We Analyze</h3>
          <p className="text-gray-400 text-base">
            Our ML model processes your data and matches it with optimal investment strategies.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#111827] rounded-2xl p-8 hover:shadow-xl transition duration-300">
          <div className="flex justify-center mb-5">
            <div className="bg-blue-950 p-4 rounded-full">
              <BadgeCheck className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Step 3: Get Plan</h3>
          <p className="text-gray-400 text-base">
            Instantly view a plan with recommended stocks, SIPs, and ETFs to start investing.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
