import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  TrendingUp,
  IndianRupee,
  PieChart,
  Wallet,
  ArrowRight,
  Save,
  Edit3,
  Download,
} from "lucide-react"; // Added icons for better look

import RecommendationForm from "../components/recommendation/RecommendationForm";
import PortfolioAllocation from "../components/recommendation/PortfolioAllocation";
import RecommendationTabs from "../components/recommendation/RecommendationTabs";
import InvestmentSummary from "../components/recommendation/InvestmentSummary";

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
            0,
          ) || 0
        );
      case "ETFs":
        return (
          result.recommendations?.etf?.reduce(
            (sum, etf) => sum + (etf.amount || 0),
            0,
          ) || 0
        );
      case "Mutual Funds":
        return (
          result.recommendations?.mutualfund?.reduce((sum, mf) => {
            const amount = mf.amount;
            if (amount === "N/A" || amount == null) return sum;
            const num = parseFloat(amount);
            return sum + (isNaN(num) ? 0 : num);
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
          { headers: { Authorization: `Bearer ${token}` } },
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
        },
      );
      alert(
        recommendationExists
          ? "Recommendation modified successfully!"
          : "Recommendation saved successfully!",
      );
      setRecommendationExists(true);
    } catch (error) {
      console.error(error);
      alert("Failed to save recommendation");
    }
  };

  const handleFetchRecommendation = async () => {
    if (!user) return;
    try {
      const token = await getToken();
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/fetch-recommendation/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data && res.data.recommendation) {
        const fetchedResult = res.data.recommendation.result;
        
        // Backward compatibility: map 'sip' to 'mutualfund' for older saved records
        if (fetchedResult?.allocations?.sip) {
          fetchedResult.allocations.mutualfund = fetchedResult.allocations.sip;
        }
        if (fetchedResult?.recommendations?.sip) {
          fetchedResult.recommendations.mutualfund = fetchedResult.recommendations.sip;
        }

        setFormData(res.data.recommendation.formData);
        setResult(fetchedResult);
        alert("Previous recommendation loaded successfully!");
      }
    } catch (err) {
      console.error("Error fetching recommendation:", err);
      alert("Failed to fetch previous recommendation");
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
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/recommend`,
        {
          ...formData,
          income: Number(formData.income),
          amountToInvest: Number(formData.amountToInvest),
          horizon: Number(formData.horizon),
        },
      );

      setResult(res.data);

      const token = await getToken();
      const checkRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/check-recommendation/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRecommendationExists(checkRes.data.exists);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        "Error generating recommendations: " +
          (err.response?.data?.message || err.message),
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

            {recommendationExists && (
              <div className="mb-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleFetchRecommendation}
                  className="group relative overflow-hidden bg-white text-lime-600 font-bold py-2 px-6 rounded-xl shadow-md border border-lime-200 transition-all duration-300 hover:shadow-lg hover:border-lime-400 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 group-hover:animate-bounce" />
                  Fetch Previous Recommendation
                </button>
              </div>
            )}

            <RecommendationForm
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              handleSubmit={handleSubmit}
              incomeSuggestion={incomeSuggestion}
              investmentSuggestion={investmentSuggestion}
              timeFrameSuggestion={timeFrameSuggestion}
              loading={loading}
            />

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
                <PortfolioAllocation 
                  result={result} 
                  getActualInvested={getActualInvested} 
                />

                <RecommendationTabs result={result} />

                <InvestmentSummary result={result} />

                {/* Save Recommendation Button */}
                <div className="mt-8 mb-4">
                  <button
                    onClick={handleSaveRecommendation}
                    className="group w-full relative overflow-hidden bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      {recommendationExists ? (
                        <Edit3 className="w-4 h-4" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {recommendationExists
                        ? "Modify Recommendation"
                        : "Save Recommendation"}
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
