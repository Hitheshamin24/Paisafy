import React, { useState } from "react";

function RecommendationTabs({ result }) {
  const [activeTab, setActiveTab] = useState("Stocks");

  if (!result) return null;

  return (
    <>
      {/* Tabs */}
      <div className="flex justify-center gap-3 mt-6">
        {["Stocks", "ETFs", "Mutual Funds"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-sm ${
              activeTab === tab
                ? "bg-gradient-to-r from-lime-500 to-green-600 text-white shadow-md transform scale-105"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-lime-300 hover:shadow-sm"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Recommendation Cards */}
      <div className="mt-4 grid gap-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === "Stocks" &&
          result?.recommendations?.stocks?.map((stock, i) => (
            <div
              key={i}
              className="bg-white/95 backdrop-blur-sm rounded-xl border-l-4 border-lime-500 p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
            >
              <h4 className="text-gray-900 font-bold text-base mb-1">
                {stock.name}
              </h4>
              {stock.symbol && (
                <p className="text-green-600 text-xs font-semibold mb-1">
                  {stock.symbol}
                </p>
              )}
              {stock.description && (
                <p className="text-gray-600 mt-1 text-xs leading-relaxed">
                  {stock.description}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2 font-medium">
                Price: ₹{stock.price ? stock.price.toFixed(2) : "N/A"}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-lime-100 to-green-100 text-green-700 border border-green-300 text-xs font-bold rounded-lg">
                Invest: ₹{stock.amount}
              </span>
            </div>
          ))}

        {activeTab === "ETFs" &&
          result?.recommendations?.etf?.map((etf, i) => (
            <div
              key={i}
              className="bg-white/95 backdrop-blur-sm rounded-xl border-l-4 border-green-500 p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
            >
              <h4 className="text-gray-900 font-bold text-base mb-1">
                {etf.name}
              </h4>
              {etf.symbol && (
                <p className="text-green-600 text-xs font-semibold mb-1">
                  {etf.symbol}
                </p>
              )}
              {etf.description && (
                <p className="text-gray-600 mt-1 text-xs leading-relaxed">
                  {etf.description}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2 font-medium">
                Price: ₹{etf.price ? etf.price.toFixed(2) : "N/A"}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-green-100 to-lime-100 text-green-700 border border-green-300 text-xs font-bold rounded-lg">
                Invest: ₹{etf.amount.toFixed(2)}
              </span>
            </div>
          ))}

        {activeTab === "Mutual Funds" &&
          result?.recommendations?.mutualfund?.map((mf, i) => (
            <div
              key={i}
              className="bg-white/95 backdrop-blur-sm rounded-xl border-l-4 border-green-600 p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
            >
              <h4 className="text-gray-900 font-bold text-base mb-1">
                {mf.name}
              </h4>
              {mf.symbol && (
                <p className="text-green-600 text-xs font-semibold mb-1">
                  {mf.symbol}
                </p>
              )}
              {mf.description && (
                <p className="text-gray-600 mt-1 text-xs leading-relaxed">
                  {mf.description}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-2 font-medium">
                Price: ₹
                {mf.price && !isNaN(Number(mf.price))
                  ? Number(mf.price).toFixed(2)
                  : "N/A"}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-lime-100 to-green-100 text-green-700 border border-green-300 text-xs font-bold rounded-lg">
                Invest: ₹{mf.amount}
              </span>
            </div>
          ))}
      </div>
    </>
  );
}

export default RecommendationTabs;
