import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function Form() {
  const [formData, setFormData] = useState({
    income: "",
    amountToInvest: "",
    risk: "medium",
    horizon: "",
    goal: "Wealth Creation",
    preferredTypes: [],
    sectors: [],
  });

  const [suggestion, setSuggestion] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("Stocks");

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updateForm = { ...formData, [name]: value };

    if (name === "income") {
      const incomeVal = parseFloat(value);
      if (!isNaN(incomeVal)) {
        const suggest = Math.floor(incomeVal * 0.2);
        setSuggestion(
          `Suggestion: you can consider investing ₹${suggest} for better returns.`
        );
      } else {
        setSuggestion("");
      }
    }
    setFormData(updateForm);
  };

  // New handleChange for checkboxes
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevFormData) => {
      // Create a copy of the array for the specific field (preferredTypes or sectors)
      const currentValues = prevFormData[name];

      if (checked) {
        // If checked, add the value if it's not already there
        return {
          ...prevFormData,
          [name]: [...currentValues, value],
        };
      } else {
        // If unchecked, remove the value
        return {
          ...prevFormData,
          [name]: currentValues.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/recommend", {
        ...formData,
        income: Number(formData.income),
        amountToInvest: Number(formData.amountToInvest),
        horizon: Number(formData.horizon),
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching recommendation");
    }
  };

  return (
    <>
      <SignedIn>
        <div className="w-full min-h-screen bg-[#0B0F19] flex items-center justify-center px-4 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#101624]/60 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-3xl text-white"
          >
            <h2 className="text-3xl font-bold text-center mb-2">
              Get Your{" "}
              <span className="text-blue-500 drop-shadow-glow">
                Personalized
              </span>{" "}
              Recommendations
            </h2>
            <p className="text-sm text-gray-400 text-center mb-8">
              Fill the form below to get tailored investment insights.
            </p>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              onSubmit={handleSubmit}
            >
              <div className="md:col-span-2">
                <label className="block font-medium">Monthly Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="e.g., 25000"
                  className="w-full mt-1 rounded-md bg-white/5 px-4 py-2 text-white placeholder-gray-400 focus:outline-style: none;  focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{suggestion}</p>
              </div>

              <div>
                <label className="block font-medium">
                  Amount to Invest (₹)
                </label>
                <input
                  type="number"
                  name="amountToInvest"
                  value={formData.amountToInvest}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="w-full mt-1 rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Risk Appetite</label>
                <select
                  name="risk"
                  value={formData.risk}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                >
                  {["low", "medium", "high"].map((risk) => (
                    <option
                      key={risk}
                      value={risk}
                      className="bg-gray-800 text-white"
                    >
                      {risk[0].toUpperCase() + risk.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Investment Goal</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                >
                  {[
                    "Wealth Creation",
                    "Retirement",
                    "Child Education",
                    "Short-Term Gains",
                  ].map((goal) => (
                    <option
                      key={goal}
                      value={goal}
                      className="bg-gray-800 text-white"
                    >
                      {goal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Experience Level</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500"
                >
                  {["Beginner", "Intermediate", "Expert"].map((level) => (
                    <option
                      key={level}
                      value={level}
                      className="bg-gray-800 text-white"
                    >
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">
                  Time Frame (in years)
                </label>
                <input
                  type="number"
                  name="horizon"
                  value={formData.horizon}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full mt-1 rounded-md bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Preferred Investment Types
                </label>
                <div className="flex flex-wrap gap-3">
                  {["Stocks", "SIPs", "ETFs"].map((type) => (
                    <label
                      key={type}
                      className="text-gray-300 flex items-center gap-2 mt-3"
                    >
                      <input
                        type="checkbox"
                        name="preferredTypes"
                        value={type}
                        checked={formData.preferredTypes.includes(type)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 accent-blue-500"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Preferred Sectors
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    "IT",
                    "Banking",
                    "FMCG",
                    "Pharma",
                    "Energy",
                    "Automobile",
                    "Healthcare",
                  ].map((sector) => (
                    <label
                      key={sector}
                      className="text-gray-300 flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        name="sectors"
                        value={sector}
                        checked={formData.sectors.includes(sector)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 accent-blue-500"
                      />
                      {sector}
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold py-3 rounded-lg shadow-lg"
                >
                  Generate Recommendations
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-12">
                {/* === Portfolio Allocation Section === */}
                <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Portfolio Allocation
                  </h3>

                  {(() => {
                    const totalAmount = Number(formData.amountToInvest || 0);
                    return (
                      <>
                        <pre className="text-white text-xs">
                          {JSON.stringify(
                            {
                              amountToInvest: formData.amountToInvest,
                              allocations: result.allocations,
                            },
                            null,
                            2
                          )}
                        </pre>

                        <div className="space-y-6">
                          {[
                            {
                              label: "Stocks",
                              value: result.allocations?.stocks || 0,
                              color: "bg-blue-500",
                            },
                            {
                              label: "ETFs",
                              value: result.allocations?.etfs || 0,
                              color: "bg-green-500",
                            },
                            {
                              label: "SIPs",
                              value: result.allocations?.sips || 0,
                              color: "bg-yellow-500",
                            },
                          ].map((item) => {
                            const amount = (
                              (item.value / 100) *
                              totalAmount
                            ).toFixed(0);
                            return (
                              <div key={item.label} className="text-sm">
                                <div className="flex justify-between mb-1">
                                  <span className="text-white font-medium">
                                    {item.label}
                                  </span>
                                  <span className="text-gray-300">
                                    {item.value.toFixed(1)}%
                                  </span>
                                </div>

                                <div className="w-full h-3 bg-gray-700 rounded overflow-hidden">
                                  <div
                                    className={`${item.color} h-3 transition-all duration-300`}
                                    style={{ width: `${item.value}%` }}
                                  ></div>
                                </div>

                                <div className="text-gray-400 mt-2 text-center font-semibold">
                                  ₹{parseInt(amount).toLocaleString("en-IN")} (
                                  {item.value.toFixed(1)}%)
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* === Tabs === */}
                <div className="flex justify-center gap-4 mt-8">
                  {["Stocks", "ETFs", "SIPs"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-md transition ${
                        activeTab === tab
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* === Recommendation Cards === */}
                <div className="mt-6 grid gap-4">
                  {activeTab === "Stocks" &&
                    result.stocks.map((stock, i) => (
                      <div
                        key={i}
                        className="bg-[#111827] rounded-xl border-l-4 border-blue-500 p-4 shadow-lg"
                      >
                        <h4 className="text-white font-semibold text-lg">
                          {stock.name}
                        </h4>
                        {stock.symbol && (
                          <p className="text-blue-400 text-sm">
                            {stock.symbol}
                          </p>
                        )}
                        {stock.description && (
                          <p className="text-gray-300 mt-1">
                            {stock.description}
                          </p>
                        )}
                        <p className="text-gray-400 text-sm mt-2">
                          Price: ₹{stock.price ? stock.price.toFixed(2) : "N/A"}
                        </p>
                        <span className="text-green-400 font-semibold block">
                          Invest: ₹{stock.amount}
                        </span>
                      </div>
                    ))}

                  {activeTab === "ETFs" &&
                    result.etf.map((etf, i) => (
                      <div
                        key={i}
                        className="bg-[#111827] rounded-xl border-l-4 border-blue-500 p-4 shadow-lg"
                      >
                        <h4 className="text-white font-semibold text-lg">
                          {etf.name}
                        </h4>
                        {etf.symbol && (
                          <p className="text-blue-400 text-sm">{etf.symbol}</p>
                        )}
                        {etf.description && (
                          <p className="text-gray-300 mt-1">
                            {etf.description}
                          </p>
                        )}
                        <p className="text-gray-400 text-sm mt-2">
                          Price: ₹{etf.price ? etf.price.toFixed(2) : "N/A"}
                        </p>
                        <span className="text-green-400 font-semibold block">
                          Invest: ₹{etf.amount}
                        </span>
                      </div>
                    ))}

                  {activeTab === "SIPs" &&
                    result.sip.map((sip, i) => (
                      <div
                        key={i}
                        className="bg-[#111827] rounded-xl border-l-4 border-blue-500 p-4 shadow-lg"
                      >
                        <h4 className="text-white font-semibold text-lg">
                          {sip.name}
                        </h4>
                        {sip.symbol && (
                          <p className="text-blue-400 text-sm">{sip.symbol}</p>
                        )}
                        {sip.description && (
                          <p className="text-gray-300 mt-1">
                            {sip.description}
                          </p>
                        )}
                        <p className="text-gray-400 text-sm mt-2">
                          Price: ₹{sip.price ? sip.price.toFixed(2) : "N/A"}
                        </p>
                        <span className="text-green-400 font-semibold block">
                          Invest: ₹{sip.amount}
                        </span>
                      </div>
                    ))}
                </div>

                {/* === Investment Summary === */}
                {/* === Investment Summary with CSS === */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-800/50 border border-blue-400 rounded-lg p-4 text-center shadow-md">
                    <p className="text-sm text-blue-200">💸 Total Invested</p>
                    <p className="text-xl font-semibold text-white">
                      ₹ {result.total_invested?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="bg-yellow-800/50 border border-yellow-400 rounded-lg p-4 text-center shadow-md">
                    <p className="text-sm text-yellow-200">
                      🧾 Uninvested Amount
                    </p>
                    <p className="text-xl font-semibold text-white">
                      ₹ {result.uninvested_amount?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* === Final Return Summary === */}
                <div className="mt-8 text-xl font-bold text-green-400 text-center">
                  📈 Estimated Future Value: ₹
                  {result.future_value.toLocaleString("en-IN", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default Form;
