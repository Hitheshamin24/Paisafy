import React from "react";

function RecommendationForm({
  formData,
  handleChange,
  handleCheckboxChange,
  handleSubmit,
  incomeSuggestion,
  investmentSuggestion,
  timeFrameSuggestion,
  loading,
}) {
  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={handleSubmit}
    >
      <div className="md:col-span-2">
        <label className="block text-gray-800 font-semibold text-sm mb-1 ml-1">
          Monthly Income (₹)
        </label>
        <div className="relative">
          <input
            type="number"
            name="income"
            value={formData.income}
            onChange={handleChange}
            placeholder="e.g., 25000"
            className="w-full rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-sm font-medium shadow-inner"
            required
          />
          {incomeSuggestion.text && (
            <p
              className={`text-[10px] sm:text-xs font-semibold mt-1 ml-1 ${
                incomeSuggestion.type === "error"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {incomeSuggestion.text}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-800 font-semibold text-sm mb-1 ml-1">
          Amount to Invest (₹)
        </label>
        <div className="relative">
          <input
            type="number"
            name="amountToInvest"
            value={formData.amountToInvest}
            onChange={handleChange}
            placeholder="e.g., 5000"
            className="w-full rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-sm font-medium shadow-inner"
            required
          />
          {investmentSuggestion.text && (
            <p className="text-[10px] sm:text-xs font-semibold mt-1 ml-1 text-red-600">
              {investmentSuggestion.text}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-gray-800 font-semibold text-sm mb-1 ml-1">
          Risk Appetite
        </label>
        <select
          name="risk"
          value={formData.risk}
          onChange={handleChange}
          className="w-full rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-4 py-2.5 text-gray-800 focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-sm font-medium shadow-inner"
        >
          {["low", "medium", "high"].map((risk) => (
            <option key={risk} value={risk}>
              {risk[0].toUpperCase() + risk.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-800 font-semibold text-sm mb-1 ml-1">
          Investment Goal
        </label>
        <select
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          className="w-full rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-4 py-2.5 text-gray-800 focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-sm font-medium shadow-inner"
        >
          {[
            "Wealth Creation",
            "Retirement",
            "Child Education",
            "Short-Term Gains",
          ].map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-800 font-semibold text-sm mb-1 ml-1">
          Experience Level
        </label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-4 py-2.5 text-gray-800 focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-sm font-medium shadow-inner"
        >
          {["Beginner", "Intermediate", "Expert"].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-800 font-semibold text-sm mb-1 ml-1">
          Time Frame (years)
        </label>
        <div className="relative">
          <input
            type="number"
            name="horizon"
            value={formData.horizon}
            onChange={handleChange}
            placeholder="e.g., 5"
            className="w-full rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-200 transition-all duration-300 text-sm font-medium shadow-inner"
            required
            min="1"
          />
          {timeFrameSuggestion && (
            <p className="text-[10px] sm:text-xs font-semibold mt-1 ml-1 text-red-600">
              {timeFrameSuggestion}
            </p>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-800 font-semibold text-sm mb-2 ml-1">
              Preferred Types
            </label>
            <div className="flex flex-wrap gap-2">
              {["Stocks", "ETFs", "Mutual Funds"].map((type) => (
                <label
                  key={type}
                  className="text-gray-700 cursor-pointer hover:text-green-600 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-lime-300 hover:shadow-sm transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    name="preferredTypes"
                    value={type}
                    checked={formData.preferredTypes.includes(type)}
                    onChange={handleCheckboxChange}
                    className="h-3.5 w-3.5 text-lime-600 focus:ring-lime-500 border-2 border-gray-300 rounded"
                  />
                  <span className="text-xs font-medium">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-gray-800 font-semibold text-sm mb-2 ml-1">
              Preferred Sectors
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                "IT",
                "Banking",
                "FMCG",
                "Pharma",
                "Energy",
                "Auto",
                "Health",
              ].map((sector) => (
                <label
                  key={sector}
                  className="text-gray-700 cursor-pointer hover:text-green-600 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:border-lime-300 hover:shadow-sm transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    name="sectors"
                    value={sector}
                    checked={formData.sectors.includes(sector)}
                    onChange={handleCheckboxChange}
                    className="h-3.5 w-3.5 text-lime-600 focus:ring-lime-500 border-2 border-gray-300 rounded"
                  />
                  <span className="text-xs font-medium">{sector}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 mt-2">
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 text-white font-bold py-3 rounded-xl shadow-md text-base ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Please wait..." : "Generate Recommendations"}
        </button>
      </div>
    </form>
  );
}

export default RecommendationForm;
