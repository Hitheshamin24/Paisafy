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
      // Significantly reduced vertical padding
      className="relative bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20"
      id="how-it-works"
    >
      {/* Background decorative elements - Scaled down */}
      <div className="absolute inset-0 opacity-8">
        <div className="absolute top-16 right-16 w-24 h-24 bg-lime-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-12 w-32 h-32 bg-green-300 rounded-full blur-3xl"></div>
      </div>

      {/* Connecting lines - Adjusted for compactness */}
      <div className="hidden md:block absolute inset-0 z-5 pointer-events-none">
        <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl">
          <div className="flex justify-between items-center px-12 lg:px-16">
            <div className="w-24 lg:w-32 h-0.5 bg-gradient-to-r from-lime-400 to-green-500 opacity-60"></div>
            <div className="w-24 lg:w-32 h-0.5 bg-gradient-to-r from-green-500 to-lime-500 opacity-60"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-10 sm:mb-12">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-lime-500 to-green-600 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          HOW IT WORKS
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          // Reduced font size
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 leading-tight bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 bg-clip-text text-transparent mt-3 sm:mt-4"
        >
          How Paisafy Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          // Reduced font size
          className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed font-medium"
        >
          Get personalized investment plans in three simple steps – no finance degree needed.
        </motion.p>
      </div>

      <div className="relative z-10 grid md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto text-center">
        {/* Step 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          // Compact padding
          className="group relative bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          {/* Step number */}
          <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-lime-500 to-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
            1
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-lime-100 to-green-100 group-hover:from-lime-500 group-hover:to-green-600 p-3 sm:p-4 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-500">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-lime-600 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-800 transition-colors duration-300">
              Enter Your Info
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Tell us about your income, investment amount, risk level, and goals.
            </p>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="group relative bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-green-500 to-lime-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
            2
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-100 to-lime-100 group-hover:from-green-500 group-hover:to-lime-600 p-3 sm:p-4 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-500">
                  <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-800 transition-colors duration-300">
              We Analyze
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Our ML model processes your data and matches it with optimal investment strategies.
            </p>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="group relative bg-white/90 backdrop-blur-sm border border-white/60 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-lime-600 to-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
            3
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-lime-100 to-green-100 group-hover:from-lime-600 group-hover:to-green-500 p-3 sm:p-4 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-500">
                  <BadgeCheck className="w-6 h-6 sm:w-8 sm:h-8 text-lime-600 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-800 transition-colors duration-300">
              Get Your Plan
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Instantly view a plan with recommended stocks, SIPs, and ETFs to start investing.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;