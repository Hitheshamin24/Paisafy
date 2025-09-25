import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useUser, SignInButton, SignedOut } from "@clerk/clerk-react";

import seniorCouple from "../assets/senior.jpg";
import kids from "../assets/child.jpg";

const Hero = ({ onGetStartedClick }) => {
  const { isSignedIn } = useUser();

  // ✅ Shared click handler
  const handleClick = () => {
    if (isSignedIn) {
      onGetStartedClick(); 
    } else {
      document.getElementById("hero-signin")?.click();
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#f8f9f3] via-[#f6f7f1] to-[#f4f5ef] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        {/* Heading Section */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight"
          >
            Unlock Your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-gray-900">Financial</span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute left-0 -bottom-2 h-3 lg:h-4 bg-lime-300 z-0 rounded-full"
              />
            </span>{" "}
            <br className="hidden sm:block" />
            Investment{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-gray-900">Opportunity</span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute left-0 -bottom-2 h-3 lg:h-4 bg-lime-300 z-0 rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 lg:mt-8 text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium"
          >
            Get personalized investment suggestions tailored to your income,
            goals, and risk level. Whether you're planning for retirement,
            building wealth, or securing the future for your family —{" "}
            <span className="font-bold text-gray-800 bg-lime-100 px-2 py-1 rounded-md">
              Paisafy
            </span>{" "}
            is your trusted partner.
          </motion.p>
        </div>

        {/* Cards Layout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr"
        >
          {/* Left Card */}
          <motion.div
            whileHover={{ scale: 1.02, rotateY: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-white transform-gpu perspective-1000"
          >
            <div className="relative h-60 sm:h-72 lg:h-80 xl:h-96 overflow-hidden">
              <img
                src={seniorCouple}
                alt="Golden Years"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 opacity-90 group-hover:opacity-60 transition-opacity duration-500" />

              {/* Floating Arrow Button */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 15 }}
                className="absolute top-4 right-4 lg:top-6 lg:right-6 bg-white/90 backdrop-blur-sm rounded-full p-2 lg:p-3 shadow-lg transition-all duration-300 group-hover:bg-lime-300 group-hover:shadow-xl"
              >
                <ArrowUpRight className="h-5 w-5 lg:h-6 lg:w-6 text-gray-800" />
              </motion.div>
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-bold text-lg lg:text-xl xl:text-2xl leading-tight mb-2">
                Navigating the Golden Years
              </h3>
              <p className="text-white/80 text-sm lg:text-base">
                Secure retirement planning
              </p>
            </div>
          </motion.div>

          {/* Center Column */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {/* CTA Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClick}
              className="bg-gradient-to-br from-lime-600 via-lime-600 to-lime-600 rounded-3xl p-6 lg:p-8 xl:p-10 shadow-2xl flex justify-between items-center cursor-pointer group relative overflow-hidden flex-1"
            >
              <div className="relative z-10 flex-1 pr-4">
                <h3 className="font-bold text-gray-900 text-lg lg:text-xl xl:text-2xl leading-tight mb-2">
                  Your Pathway to Financial Prosperity
                </h3>
                <p className="text-gray-800 font-medium text-base lg:text-lg">
                  Starts Here!
                </p>
              </div>

              <motion.div
                whileHover={{ rotate: 45, scale: 1.1 }}
                className="flex-shrink-0 bg-white/20 rounded-full p-2 lg:p-3"
              >
                <ArrowUpRight className="text-gray-900 h-6 w-6 lg:h-8 lg:w-8" />
              </motion.div>
            </motion.div>

            {/* Get Started Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 xl:p-10 shadow-2xl flex flex-col justify-center items-center space-y-4 lg:space-y-6 border border-gray-100 flex-1">
              <div className="text-center">
                <h4 className="text-gray-700 font-bold text-lg lg:text-xl xl:text-2xl mb-2">
                  Ready to take the next step?
                </h4>
                <p className="text-gray-500 text-sm lg:text-base xl:text-lg">
                  Join thousands of investors
                </p>
              </div>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(163, 230, 53, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className="bg-gradient-to-r from-lime-400 via-lime-500 to-lime-600 text-gray-900 px-8 py-3 lg:px-12 lg:py-4 xl:px-16 xl:py-5 rounded-2xl text-base lg:text-lg xl:text-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 transform-gpu"
              >
                <span className="flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowUpRight className="h-4 w-4 lg:h-5 lg:w-5" />
                </span>
              </motion.button>
            </div>
          </div>

          {/* Right Card */}
          <motion.div
            whileHover={{ scale: 1.02, rotateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClick}
            className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer bg-white transform-gpu perspective-1000"
          >
            <div className="relative h-64 sm:h-72 lg:h-80 xl:h-96 overflow-hidden">
              <img
                src={kids}
                alt="Next Generation"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-bold text-lg lg:text-xl xl:text-2xl leading-tight mb-2">
                Growing Wealth for the Next Generation
              </h3>
              <p className="text-white/80 text-sm lg:text-base mb-4">
                Secure your family's future
              </p>

              <motion.div
                whileHover={{ x: 4, scale: 1.1 }}
                className="inline-flex items-center space-x-2 text-lime-300"
              >
                <ArrowUpRight className="h-4 w-4 lg:h-5 lg:w-5" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Hidden SignInButton */}
      <SignedOut>
        <SignInButton mode="modal">
          <button id="hero-signin" className="hidden" />
        </SignInButton>
      </SignedOut>
    </section>
  );
};

export default Hero;