import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, IndianRupee, PieChart, Wallet, ArrowRight } from "lucide-react";

function InvestmentSummary({ result }) {
  if (!result) return null;

  return (
    <>
      {/* Investment Summary Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-lime-500 to-green-600 rounded-xl p-4 text-center shadow-lg transform hover:scale-105 transition-all">
          <p className="text-xs text-green-100 font-semibold">Total Invested</p>
          <p className="text-lg font-bold text-white mt-1">
            ₹ {(result.total_invested ?? 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-lime-500 rounded-xl p-4 text-center shadow-lg transform hover:scale-105 transition-all">
          <p className="text-xs text-lime-100 font-semibold">🧾 Uninvested</p>
          <p className="text-lg font-bold text-white mt-1">
            ₹ {(result.uninvested_amount ?? 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Premium Investment Summary Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white/80 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-2xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 rounded-full blur-3xl -z-10 transition-all duration-500 group-hover:bg-lime-400/20"></div>

        <h4 className="text-xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2">
          <PieChart className="w-5 h-5 text-lime-600" /> Investment Summary
        </h4>

        <div className="space-y-3">
          {/* Row 1: Principal */}
          <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-gray-100">
            <span className="flex items-center gap-3 text-gray-600 font-medium text-sm">
              <Wallet className="w-4 h-4 text-gray-400" /> Total Principal
            </span>
            <span className="text-gray-900 font-bold font-mono">
              ₹{(result.total_principal ?? 0).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Row 2: Expected Return */}
          <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-gray-100">
            <span className="flex items-center gap-3 text-gray-600 font-medium text-sm">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Expected Return
            </span>
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-xs">
              {result.expected_return?.toFixed(2) ?? "0.00"}%
            </span>
          </div>

          {/* Row 3: Profit */}
          <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-gray-100">
            <span className="flex items-center gap-3 text-gray-600 font-medium text-sm">
              <IndianRupee className="w-4 h-4 text-green-500" /> Est. Profit
            </span>
            <span className="text-green-600 font-bold font-mono">
              +₹{(result.profit ?? 0).toLocaleString("en-IN")}
            </span>
          </div>

          {/* Row 4: Future Value (Highlighted) */}
          <div className="mt-2 flex justify-between items-center p-4 bg-gradient-to-r from-lime-500 to-green-600 rounded-xl shadow-lg text-white transform transition-transform hover:scale-[1.02]">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <ArrowRight className="w-4 h-4" /> Future Value
            </span>
            <span className="font-extrabold text-lg tracking-tight">
              ₹
              {(result.future_value ?? 0).toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default InvestmentSummary;
