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
      // Reduced vertical padding significantly
      className="relative bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20"
      id="About"
    >
      {/* Background decorative elements - Scaled down */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-5 w-20 h-20 bg-lime-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-5 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center mb-8 sm:mb-10 lg:mb-12">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-lime-500 to-green-600 text-white rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          ABOUT US
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          // Reduced font size
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3 sm:mb-4 leading-tight bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 bg-clip-text text-transparent mt-3 sm:mt-4"
        >
          Why Choose Paisafy?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          // Reduced font size & margin
          className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed font-medium"
        >
          Smart, custom investment plans designed to help you grow wealth
          confidently and build your financial future.
        </motion.p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
        {/* Smart Strategies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          // Compact padding
          className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-lime-500 to-green-600 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 group-hover:text-green-800 transition-colors duration-300">
              Smart Strategies
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Generate intelligent investment plans tailored to your income,
              goals, and risk level.
            </p>
          </div>
        </motion.div>

        {/* Maximized Growth */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-lime-500 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 group-hover:text-green-800 transition-colors duration-300">
              Maximized Growth
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Our AI suggests optimal stocks, SIPs, and ETFs to help grow your
              investments.
            </p>
          </div>
        </motion.div>

        {/* Personalized Plans */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-lime-400 to-green-500 p-3 rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <HandCoins className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 group-hover:text-green-800 transition-colors duration-300">
              Personalized Plans
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Each plan is uniquely created for your lifestyle, goals, and
              future.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;