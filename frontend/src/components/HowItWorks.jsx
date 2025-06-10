import { User, Settings, BadgeCheck } from "lucide-react";
import { useInView } from "../hooks/useInView";
import{motion} from "framer-motion"
const HowItWorks = () => {
  const [ref,isInView]=useInView()
  return (
    <motion.section
     ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
     className="bg-[#0f172a] text-white py-16 px-6 " id="how-it-works">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          How Paisafy Works
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Get personalized investment plans in three simple steps – no finance degree needed.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        {/* Step 1 - Input */}
        <div className="bg-[#1e293b] rounded-xl p-6 hover:shadow-lg transition">
          <div className="flex justify-center mb-4">
            <User className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Step 1: Enter Your Info</h3>
          <p className="text-gray-400">
            Tell us about your income, investment amount, risk level, and goals.
          </p>
        </div>

        {/* Step 2 - Process */}
        <div className="bg-[#1e293b] rounded-xl p-6 hover:shadow-lg transition">
          <div className="flex justify-center mb-4">
            <Settings className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Step 2: We Analyze</h3>
          <p className="text-gray-400">
            Our ML model processes your data and matches it with optimal investment strategies.
          </p>
        </div>

        {/* Step 3 - Result */}
        <div className="bg-[#1e293b] rounded-xl p-6 hover:shadow-lg transition">
          <div className="flex justify-center mb-4">
            <BadgeCheck className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Step 3: Get Plan</h3>
          <p className="text-gray-400">
            Instantly view a plan with recommended stocks, SIPs, and ETFs to start investing.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
