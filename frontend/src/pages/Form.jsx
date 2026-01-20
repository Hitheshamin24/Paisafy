import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { TrendingUp, IndianRupee, PieChart, Wallet, ArrowRight, Save, Edit3 } from "lucide-react"; // Added icons for better look

function Form() {
  const [formData, setFormData] = useState({
    income: "",
    amountToInvest: "",
    risk: "medium",
    horizon: "",
    goal: "Wealth Creation",
    preferredTypes: [],
    sectors: [],
    experience: "Beginner",
  });

  const getActualInvested = (label) => {
    if (!result) return 0;
    switch (label) {
      case "Stocks":
        return (
          result.recommendations?.stocks?.reduce(
            (sum, stock) => sum + (stock.amount || 0),
            0
          ) || 0
        );
      case "ETFs":
        return (
          result.recommendations?.etf?.reduce(
            (sum, etf) => sum + (etf.amount || 0),
            0
          ) || 0
        );
      case "SIPs":
        return (
          result.recommendations?.sip?.reduce((sum, sip) => {
            const amount = sip.amount;
            if (amount === "N/A" || amount === null || amount === undefined) {
              return sum + 0;
            }
            const numericAmount = parseFloat(amount);
            return sum + (isNaN(numericAmount) ? 0 : numericAmount);
          }, 0) || 0
        );
      default:
        return 0;
    }
  };

  const [investmentSuggestion, setInvestmentSuggestion] = useState({
    text: "",
    type: "",
  });
  const [incomeSuggestion, setIncomeSuggestion] = useState({
    text: "",
    type: "",
  });
  const [timeFrameSuggestion, setTimeFrameSuggestion] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("Stocks");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  const [recommendationExists, setRecommendationExists] = useState(false);

  useEffect(() => {
    const checkRecommendation = async () => {
      if (!user) return;
      try {
        const token = await getToken();
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/check-recommendation/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecommendationExists(res.data.exists);
      } catch (err) {
        console.error("Error checking recommendation:", err);
      }
    };

    checkRecommendation();
  }, [user, getToken]);

  const handleSaveRecommendation = async () => {
    try {
      const token = await getToken();
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/save-recommendation`,
        { formData, result },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(
        recommendationExists
          ? "Recommendation modified successfully!"
          : "Recommendation saved successfully!"
      );
      setRecommendationExists(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save recommendation");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updateForm = { ...formData, [name]: value };

    if (name === "income") {
      if (value.trim() === "") {
        setIncomeSuggestion({ text: "", type: "" });
      } else {
        const incomeVal = parseFloat(value);
        if (!isNaN(incomeVal) && incomeVal >= 100) {
          const suggest = Math.floor(incomeVal * 0.2);
          setIncomeSuggestion({
            text: `Suggestion: you can consider investing ₹${suggest} for better returns.`,
            type: "success",
          });
        } else if (incomeVal < 0) {
          setIncomeSuggestion({
            text: "Income should not go negatives",
            type: "error",
          });
        } else {
          setIncomeSuggestion({
            text: "Income should be at least 100",
            type: "error",
          });
        }
      }
    }

    if (name === "amountToInvest") {
      if (value.trim() === "") {
        setInvestmentSuggestion({ text: "", type: "" });
      } else {
        const investVal = parseFloat(value);
        if (investVal <= 20) {
          setInvestmentSuggestion({
            text: "Please enter the Valid amount",
            type: "error",
          });
        } else {
          setInvestmentSuggestion({ text: "", type: "success" });
        }
      }
    }

    if (name === "horizon") {
      if (value.trim === "") {
        setTimeFrameSuggestion("");
      } else {
        const horizon = parseFloat(value);
        if (horizon <= 0) {
          setTimeFrameSuggestion("Please Enter the valid Time Frame");
        } else {
          setTimeFrameSuggestion("");
        }
      }
    }
    setFormData(updateForm);
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prevFormData) => {
      const currentValues = prevFormData[name];
      if (checked) {
        return { ...prevFormData, [name]: [...currentValues, value] };
      } else {
        return {
          ...prevFormData,
          [name]: currentValues.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/recommend`, {
        ...formData,
        income: Number(formData.income),
        amountToInvest: Number(formData.amountToInvest),
        horizon: Number(formData.horizon),
      });

      setResult(res.data);

      const token = await getToken();
      const checkRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/check-recommendation/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRecommendationExists(checkRes.data.exists);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        "Error generating recommendations: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 bg-lime-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-32 right-16 w-40 h-40 bg-green-400 rounded-full blur-3xl"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 bg-white/95 backdrop-blur-lg border border-white/50 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl text-gray-800"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-1 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 bg-clip-text text-transparent">
                Get Your{" "}
                <span className="bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent">
                  Personalized
                </span>{" "}
                Recommendations
              </h2>
              <p className="text-sm md:text-base text-gray-600 font-medium">
                Fill the form below to get tailored investment insights.
              </p>
            </div>

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
                      {["Stocks", "SIPs", "ETFs"].map((type) => (
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

            {loading && (
              <div className="mt-8 flex justify-center items-center gap-2 text-green-700 font-bold text-sm bg-gradient-to-r from-green-50 to-lime-50 py-3 rounded-xl border border-green-200">
                <span>Generating recommendations</span>
                <span className="flex space-x-1">
                  <span className="w-2 h-2 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-lime-600 rounded-full animate-bounce"></span>
                </span>
              </div>
            )}

            {result && (
              <div className="mt-8">
                {/* === Portfolio Allocation Section === */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 p-5 rounded-2xl shadow-xl animate-fade-in-up">
                  <h3 className="text-gray-900 text-lg font-bold mb-4 text-center">
                    Portfolio Allocation
                  </h3>

                  {(() => {
                    return (
                      <div className="space-y-4">
                        {[
                          {
                            label: "Stocks",
                            value: result.allocations?.stocks?.percent || 0,
                            color: "bg-gradient-to-r from-lime-500 to-green-600",
                          },
                          {
                            label: "ETFs",
                            value: result.allocations?.etf?.percent || 0,
                            color: "bg-gradient-to-r from-green-500 to-lime-500",
                          },
                          {
                            label: "SIPs",
                            value: result.allocations?.sip?.percent || 0,
                            color: "bg-gradient-to-r from-green-600 to-lime-600",
                          },
                        ].map((item) => {
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
                                ₹{invested.toLocaleString("en-IN")} ({item.value.toFixed(1)}%)
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* === Tabs === */}
                <div className="flex justify-center gap-3 mt-6">
                  {["Stocks", "ETFs", "SIPs"].map((tab) => (
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
                          Invest: ₹{etf.amount}
                        </span>
                      </div>
                    ))}

                  {activeTab === "SIPs" &&
                    result?.recommendations?.sip.map((sip, i) => (
                      <div
                        key={i}
                        className="bg-white/95 backdrop-blur-sm rounded-xl border-l-4 border-green-600 p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                      >
                        <h4 className="text-gray-900 font-bold text-base mb-1">
                          {sip.name}
                        </h4>
                        {sip.symbol && (
                          <p className="text-green-600 text-xs font-semibold mb-1">
                            {sip.symbol}
                          </p>
                        )}
                        {sip.description && (
                          <p className="text-gray-600 mt-1 text-xs leading-relaxed">
                            {sip.description}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs mt-2 font-medium">
                          Price: ₹
                          {sip.price && !isNaN(Number(sip.price))
                            ? Number(sip.price).toFixed(2)
                            : "N/A"}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-lime-100 to-green-100 text-green-700 border border-green-300 text-xs font-bold rounded-lg">
                          Invest: ₹{sip.amount}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Investment Summary Cards */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-lime-500 to-green-600 rounded-xl p-4 text-center shadow-lg transform hover:scale-105 transition-all">
                    <p className="text-xs text-green-100 font-semibold">
                      💸 Total Invested
                    </p>
                    <p className="text-lg font-bold text-white mt-1">
                      ₹ {result.total_invested?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-lime-500 rounded-xl p-4 text-center shadow-lg transform hover:scale-105 transition-all">
                    <p className="text-xs text-lime-100 font-semibold">
                      🧾 Uninvested
                    </p>
                    <p className="text-lg font-bold text-white mt-1">
                      ₹ {result.uninvested_amount?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* === UPDATED PREMIUM Investment Summary Container === */}
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
                        ₹{result.total_principal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Row 2: Expected Return */}
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-gray-100">
                      <span className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                        <TrendingUp className="w-4 h-4 text-blue-500" /> Expected Return
                      </span>
                      <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-xs">
                        {result.expected_return.toFixed(2)}%
                      </span>
                    </div>

                    {/* Row 3: Profit */}
                    <div className="flex justify-between items-center p-3 rounded-xl hover:bg-white/60 transition-colors border border-transparent hover:border-gray-100">
                      <span className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                        <IndianRupee  className="w-4 h-4 text-green-500" /> Est. Profit
                      </span>
                      <span className="text-green-600 font-bold font-mono">
                        +₹{result.profit.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Row 4: Future Value (Highlighted) */}
                    <div className="mt-2 flex justify-between items-center p-4 bg-gradient-to-r from-lime-500 to-green-600 rounded-xl shadow-lg text-white transform transition-transform hover:scale-[1.02]">
                      <span className="flex items-center gap-2 font-semibold text-sm">
                        <ArrowRight className="w-4 h-4" /> Future Value
                      </span>
                      <span className="font-extrabold text-lg tracking-tight">
                        ₹{result.future_value.toLocaleString("en-IN", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Save Recommendation Button */}
                <div className="mt-8 mb-4">
                  <button
                    onClick={handleSaveRecommendation}
                    className="group w-full relative overflow-hidden bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      {recommendationExists ? <Edit3 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {recommendationExists ? "Modify Recommendation" : "Save Recommendation"}
                    </span>
                  </button>
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