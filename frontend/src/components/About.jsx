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
      className="relative bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden scroll-mt-20 lg:scroll-mt-24"
      id="About"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-lime-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 sm:w-48 h-32 sm:h-48 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 sm:w-24 h-16 sm:h-24 bg-lime-500 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-block px-4 sm:px-6 py-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-lime-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          ABOUT US
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 bg-clip-text text-transparent mt-4 sm:mt-6"
        >
          Why Choose Paisafy?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl leading-relaxed font-medium"
        >
          Smart, custom investment plans designed to help you grow wealth confidently and build your financial future.
        </motion.p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {/* Smart Strategies */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 text-center overflow-hidden"
        >
          {/* Card gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-lime-500 to-green-600 p-3 sm:p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-green-800 transition-colors duration-300">
              Smart Strategies
            </h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Generate intelligent investment plans tailored to your income, goals, and risk level.
            </p>
          </div>
        </motion.div>

        {/* Maximized Growth */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 text-center overflow-hidden"
        >
          {/* Card gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-green-500 to-lime-500 p-3 sm:p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-green-800 transition-colors duration-300">
              Maximized Growth
            </h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Our AI suggests optimal stocks, SIPs, and ETFs to help grow your investments.
            </p>
          </div>
        </motion.div>

        {/* Personalized Plans */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="group relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 text-center overflow-hidden"
        >
          {/* Card gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-lime-500/5 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-lime-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-lime-400 to-green-500 p-3 sm:p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <HandCoins className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-green-800 transition-colors duration-300">
              Personalized Plans
            </h3>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              Each plan is uniquely created for your lifestyle, goals, and future.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;