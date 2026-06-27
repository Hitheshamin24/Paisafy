import React from "react";

function PortfolioAllocation({ result, getActualInvested }) {
  if (!result) return null;

  const allocationItems = [
    {
      label: "Stocks",
      value:
        result.allocations?.stocks?.percent ??
        result.allocations?.stocks ??
        0,
      color: "bg-gradient-to-r from-lime-500 to-green-600",
    },
    {
      label: "ETFs",
      value:
        result.allocations?.etf?.percent ?? result.allocations?.etf ?? 0,
      color: "bg-gradient-to-r from-green-500 to-lime-500",
    },
    {
      label: "Mutual Funds",
      value:
        result.allocations?.mutualfund?.percent ??
        result.allocations?.mutualfund ??
        0,
      color: "bg-gradient-to-r from-green-600 to-lime-600",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 p-5 rounded-2xl shadow-xl animate-fade-in-up">
      <h3 className="text-gray-900 text-lg font-bold mb-4 text-center">
        Portfolio Allocation
      </h3>

      <div className="space-y-4">
        {allocationItems.map((item) => {
          const invested = getActualInvested(item.label);

          return (
            <div key={item.label} className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-900 font-bold text-sm">
                  {item.label}
                </span>
                <span className="text-gray-700 font-semibold">
                  {item.value.toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`${item.color} h-3 transition-all duration-500 shadow-sm`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>

              <div className="text-gray-700 mt-2 text-center font-bold text-xs bg-white px-2 py-1 rounded-lg border border-gray-200 inline-block w-full">
                ₹{(invested ?? 0).toLocaleString("en-IN")} (
                {item.value.toFixed(1)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PortfolioAllocation;
