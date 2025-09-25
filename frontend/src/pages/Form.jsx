import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useAuth, useUser } from "@clerk/clerk-react";
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
  const [timeFrameSuggestion,setTimeFrameSuggestion]=useState("");
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
          `http://localhost:5000/api/check-recommendation/${user.id}`,
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
      const token = await getToken(); // Clerk session token
      await axios.post(
        "http://localhost:5000/api/save-recommendation",
        { formData, result }, // no userId needed
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
        // if input is cleared
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
          // optional: show a gentle error if between 0–99
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
        }
        else{
          setInvestmentSuggestion({text:"",type:"success"})
        }
      }
    }

    if(name==='horizon'){
      if(value.trim===""){
        setTimeFrameSuggestion("");
      }else{
        const horizon=parseFloat(value);
        if(horizon<=0){
          setTimeFrameSuggestion("Please Enter the valid Time Frame");
        }else{
          setTimeFrameSuggestion("");
        }
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
    if (!user) return; // Make sure user is loaded
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:5000/api/recommend", {
        ...formData,
        income: Number(formData.income),
        amountToInvest: Number(formData.amountToInvest),
        horizon: Number(formData.horizon),
      });

      setResult(res.data);

      // Check if this user already has a saved recommendation
      const token = await getToken();
      const checkRes = await axios.get(
        `http://localhost:5000/api/check-recommendation/${user.id}`,
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
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 flex items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-40 h-40 bg-lime-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-32 right-16 w-56 h-56 bg-green-400 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-lime-500 rounded-full blur-2xl"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 bg-white/95 backdrop-blur-lg border border-white/50 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-4xl text-gray-800"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 bg-clip-text text-transparent">
                Get Your{" "}
                <span className="bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent">
                  Personalized
                </span>{" "}
                Recommendations
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                Fill the form below to get tailored investment insights.
              </p>
            </div>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              <div className="md:col-span-2">
                <label className="block text-gray-800 font-semibold text-lg mb-2">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="e.g., 25000"
                  className="w-full rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-4 focus:ring-lime-200 transition-all duration-300 text-lg font-medium shadow-inner"
                  required
                />
                {incomeSuggestion.text && (
                  <p
                    className={`text-sm font-semibold  mt-3 bg-green-50 px-4 py-2 rounded-xl border  ${
                      incomeSuggestion.type == "error"
                        ? "text-red-700 border-red-200"
                        : "text-green-700 border-green-200"
                    }`}
                  >
                    {incomeSuggestion.text}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-800 font-semibold text-lg mb-2">
                  Amount to Invest (₹)
                </label>
                <input
                  type="number"
                  name="amountToInvest"
                  value={formData.amountToInvest}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  className="w-full rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-4 focus:ring-lime-200 transition-all duration-300 text-lg font-medium shadow-inner"
                  required
                />
                {investmentSuggestion.text && (
                  <p
                    className={`text-sm font-semibold  mt-3 px-4 py-2 rounded-xl bg-green-50  text-red-700 border border-red-200 `}
                  >
                    {investmentSuggestion.text}
                  </p>
                )}
                
              </div>

              <div>
                <label className="block text-gray-800 font-semibold text-lg mb-2">
                  Risk Appetite
                </label>
                <select
                  name="risk"
                  value={formData.risk}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-6 py-4 text-gray-800 focus:outline-none focus:border-lime-400 focus:ring-4 focus:ring-lime-200 transition-all duration-300 text-lg font-medium shadow-inner"
                >
                  {["low", "medium", "high"].map((risk) => (
                    <option
                      key={risk}
                      value={risk}
                      className="bg-white text-gray-800 py-2"
                    >
                      {risk[0].toUpperCase() + risk.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold text-lg mb-2">
                  Investment Goal
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-6 py-4 text-gray-800 focus:outline-none focus:border-lime-400 focus:ring-4 focus:ring-lime-200 transition-all duration-300 text-lg font-medium shadow-inner"
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
                      className="bg-white text-gray-800 py-2"
                    >
                      {goal}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold text-lg mb-2">
                  Experience Level
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-6 py-4 text-gray-800 focus:outline-none focus:border-lime-400 focus:ring-4 focus:ring-lime-200 transition-all duration-300 text-lg font-medium shadow-inner"
                >
                  {["Beginner", "Intermediate", "Expert"].map((level) => (
                    <option
                      key={level}
                      value={level}
                      className="bg-white text-gray-800 py-2"
                    >
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold text-lg mb-2">
                  Time Frame (in years)
                </label>
                <input
                  type="number"
                  name="horizon"
                  value={formData.horizon}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 px-6 py-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-4 focus:ring-lime-200 transition-all duration-300 text-lg font-medium shadow-inner"
                  required
                  min="1"
                />
                    {timeFrameSuggestion && (
                  <p
                    className={`text-sm font-semibold  mt-3 px-4 py-2 rounded-xl bg-green-50  text-red-700 border border-red-200 `}
                  >
                    {timeFrameSuggestion}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-800 font-semibold text-lg mb-3">
                  Preferred Investment Types
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Stocks", "SIPs", "ETFs"].map((type) => (
                    <label
                      key={type}
                      className="text-gray-700 cursor-pointer hover:text-green-600  flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 hover:border-lime-300 hover:shadow-md transition-all duration-200"
                    >
                      <input
                        type="checkbox"
                        name="preferredTypes"
                        value={type}
                        checked={formData.preferredTypes.includes(type)}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-lime-600 focus:ring-lime-500 border-2 border-gray-300 rounded-md"
                      />
                      <span className="font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold text-lg mb-3">
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
                      className="text-gray-700 cursor-pointer hover:text-green-600 flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 hover:border-lime-300 hover:shadow-md transition-all duration-200"
                    >
                      <input
                        type="checkbox"
                        name="sectors"
                        value={sector}
                        checked={formData.sectors.includes(sector)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-lime-600 focus:ring-lime-500 border-2 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium">{sector}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 text-white font-bold py-4 rounded-2xl shadow-xl text-lg ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Please wait..." : "Generate Recommendations"}
                </button>
              </div>
            </form>

            {loading && (
              <div className="mt-12 flex justify-center items-center gap-3 text-green-700 font-bold text-xl bg-gradient-to-r from-green-50 to-lime-50 py-6 rounded-2xl border border-green-200">
                <span>Generating recommendations</span>
                <span className="flex space-x-1">
                  <span className="w-3 h-3 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-3 h-3 bg-lime-600 rounded-full animate-bounce"></span>
                </span>
              </div>
            )}

            {result && (
              <div className="mt-16">
                {/* === Portfolio Allocation Section === */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 p-8 rounded-3xl shadow-xl animate-fade-in-up">
                  <h3 className="text-gray-900 text-2xl font-bold mb-6 text-center">
                    Portfolio Allocation
                  </h3>

                  {(() => {
                    const totalAmount = Number(formData.amountToInvest || 0);
                    return (
                      <>
                        <div className="space-y-8">
                          {[
                            {
                              label: "Stocks",
                              value: result.allocations?.stocks?.percent || 0,
                              color:
                                "bg-gradient-to-r from-lime-500 to-green-600",
                            },
                            {
                              label: "ETFs",
                              value: result.allocations?.etf?.percent || 0,
                              color:
                                "bg-gradient-to-r from-green-500 to-lime-500",
                            },
                            {
                              label: "SIPs",
                              value: result.allocations?.sip?.percent || 0,
                              color:
                                "bg-gradient-to-r from-green-600 to-lime-600",
                            },
                          ].map((item) => {
                            const invested = getActualInvested(item.label);

                            return (
                              <div key={item.label} className="text-base">
                                <div className="flex justify-between mb-2">
                                  <span className="text-gray-900 font-bold text-lg">
                                    {item.label}
                                  </span>
                                  <span className="text-gray-700 font-semibold">
                                    {item.value.toFixed(1)}%
                                  </span>
                                </div>

                                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                  <div
                                    className={`${item.color} h-4 transition-all duration-500 shadow-sm`}
                                    style={{ width: `${item.value}%` }}
                                  ></div>
                                </div>

                                <div className="text-gray-700 mt-3 text-center font-bold text-lg bg-white px-4 py-2 rounded-xl border border-gray-200">
                                  ₹{invested.toLocaleString("en-IN")} (
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
                <div className="flex justify-center gap-4 mt-10">
                  {["Stocks", "ETFs", "SIPs"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 rounded-2xl transition-all duration-300 font-semibold text-lg ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-lime-500 to-green-600 text-white shadow-xl transform scale-105"
                          : "bg-white text-gray-700 border-2 border-gray-200 hover:border-lime-300 hover:shadow-lg"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/*  Recommendation Cards  */}
                <div className="mt-8 grid gap-6">
                  {activeTab === "Stocks" &&
                    result?.recommendations?.stocks?.map((stock, i) => (
                      <div
                        key={i}
                        className="bg-white/95 backdrop-blur-sm rounded-2xl border-l-8 border-lime-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <h4 className="text-gray-900 font-bold text-xl mb-2">
                          {stock.name}
                        </h4>
                        {stock.symbol && (
                          <p className="text-green-600 text-base font-semibold mb-2">
                            {stock.symbol}
                          </p>
                        )}
                        {stock.description && (
                          <p className="text-gray-600 mt-2 text-base leading-relaxed">
                            {stock.description}
                          </p>
                        )}
                        <p className="text-gray-500 text-base mt-3 font-medium">
                          Price: ₹{stock.price ? stock.price.toFixed(2) : "N/A"}
                        </p>
                        <span className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-lime-100 to-green-100 text-green-700 border-2 border-green-300 font-bold rounded-xl">
                          Invest: ₹{stock.amount}
                        </span>
                      </div>
                    ))}

                  {activeTab === "ETFs" &&
                    result?.recommendations?.etf?.map((etf, i) => (
                      <div
                        key={i}
                        className="bg-white/95 backdrop-blur-sm rounded-2xl border-l-8 border-green-500 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <h4 className="text-gray-900 font-bold text-xl mb-2">
                          {etf.name}
                        </h4>
                        {etf.symbol && (
                          <p className="text-green-600 text-base font-semibold mb-2">
                            {etf.symbol}
                          </p>
                        )}
                        {etf.description && (
                          <p className="text-gray-600 mt-2 text-base leading-relaxed">
                            {etf.description}
                          </p>
                        )}
                        <p className="text-gray-500 text-base mt-3 font-medium">
                          Price: ₹{etf.price ? etf.price.toFixed(2) : "N/A"}
                        </p>
                        <span className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-green-100 to-lime-100 text-green-700 border-2 border-green-300 font-bold rounded-xl">
                          Invest: ₹{etf.amount}
                        </span>
                      </div>
                    ))}

                  {activeTab === "SIPs" &&
                    result?.recommendations?.sip.map((sip, i) => (
                      <div
                        key={i}
                        className="bg-white/95 backdrop-blur-sm rounded-2xl border-l-8 border-green-600 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <h4 className="text-gray-900 font-bold text-xl mb-2">
                          {sip.name}
                        </h4>
                        {sip.symbol && (
                          <p className="text-green-600 text-base font-semibold mb-2">
                            {sip.symbol}
                          </p>
                        )}
                        {sip.description && (
                          <p className="text-gray-600 mt-2 text-base leading-relaxed">
                            {sip.description}
                          </p>
                        )}
                        <p className="text-gray-500 text-base mt-3 font-medium">
                          Price: ₹
                          {sip.price && !isNaN(Number(sip.price))
                            ? Number(sip.price).toFixed(2)
                            : "N/A"}
                        </p>
                        <span className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-lime-100 to-green-100 text-green-700 border-2 border-green-300 font-bold rounded-xl">
                          Invest: ₹{sip.amount}
                        </span>
                      </div>
                    ))}
                </div>

                {/*  Investment Summary   */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-lime-500 to-green-600 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
                    <p className="text-base text-green-100 font-semibold">
                      💸 Total Invested
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">
                      ₹ {result.total_invested?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-lime-500 rounded-2xl p-6 text-center shadow-xl transform hover:scale-105 transition-all duration-300">
                    <p className="text-base text-lime-100 font-semibold">
                      🧾 Uninvested Amount
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">
                      ₹ {result.uninvested_amount?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* === Final Return Summary === */}
                <div className="mt-12 bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 p-8 rounded-3xl shadow-xl max-w-2xl mx-auto">
                  <h4 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    Investment Summary
                  </h4>

                  <div className="space-y-4 text-lg font-semibold">
                    {/* 💰 Total Invested */}
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl shadow-sm">
                      <span className="flex items-center gap-3 text-gray-800">
                        💰 <span>Total Principal:</span>
                      </span>
                      <span className="text-green-700 font-bold">
                        ₹{result.total_principal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* 📊 Expected Return */}
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl shadow-sm">
                      <span className="flex items-center gap-3 text-gray-800">
                        📊 <span>Expected Return:</span>
                      </span>
                      <span className="text-green-700 font-bold">
                        {result.expected_return.toFixed(2)}%
                      </span>
                    </div>

                    {/* 💵 Profit */}
                    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-xl shadow-sm">
                      <span className="flex items-center gap-3 text-gray-800">
                        💵 <span>Profit:</span>
                      </span>
                      <span className="text-green-700 font-bold">
                        ₹{result.profit.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* 📈 Future Value */}
                    <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-lime-100 to-green-100 rounded-xl border-2 border-green-300 shadow-sm">
                      <span className="flex items-center gap-3 text-gray-900 font-bold">
                        📈 <span>Estimated Future Value:</span>
                      </span>
                      <span className="text-green-800 font-extrabold text-xl">
                        ₹
                        {result.future_value.toLocaleString("en-IN", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Save Recommendation Button */}
                <div className="mt-10">
                  <button
                    onClick={handleSaveRecommendation}
                    className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 text-white font-bold py-4 rounded-2xl shadow-xl text-lg"
                  >
                    {recommendationExists
                      ? "Modify Recommendation "
                      : "Save Recommendation"}
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
