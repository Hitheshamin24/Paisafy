import { BarChart3, ShieldCheck, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import laptop from "../assets/laptop.jpeg"; // Your hero image
import { useInView } from "../hooks/useInView";

const Hero = ({onGetStartedClick}) => {
  return (
    <section className="min-h-screen md:mt-0 mt-15 flex flex-col justify-center items-center text-white bg-gradient-to-br from-black to-gray-900 px-6 py-16">
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* LEFT: Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl font-bold leading-tight mb-6"
          >
            Build Your Wealth <br />
            with <span className="text-blue-500">Paisafy</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-gray-300 mb-8"
          >
            Get personalized investment suggestions based on your income, goals,
            and risk level.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button
                onClick={onGetStartedClick}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Get Started
            </button>
          </motion.div>

          {/* Icons Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center sm:items-start gap-6"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-950 rounded-full p-3">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <span className="font-medium">Data-Driven Insights</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-950 rounded-full p-3">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
              </div>
              <span className="font-medium">Risk Assessment</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-950 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <span className="font-medium">Growth Potential</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="md:w-1/2 w-full"
        >
          <img
            src={laptop}
            alt="Investment Dashboard"
            className="rounded-xl shadow-lg w-full object-cover max-h-[500px] "
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
