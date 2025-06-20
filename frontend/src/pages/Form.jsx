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
  });
  const [suggestion, setSuggestion] = useState("");
  const [result, setResult] = useState(null);

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
        <div className="relative w-screen h-screen bg-cover bg-center flex items-center justify-center bg-gradient-to-br from-black to-gray-800">
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#0d1422] p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-white"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
              Get Your <span className="text-blue-400">Personalized</span>{" "}
              Recommendations
            </h2>
            <p className="text-sm text-gray-300 text-center mb-6">
              Fill out the form below to receive tailored investment advice
              based on your financial situation and goals.
            </p>

            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={handleSubmit}
            >
              <div className="col-span-1 md:col-span-2">
                <label className="block font-medium">Monthly Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1 break-words">
                  {suggestion}
                </p>
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
                  className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Risk Appetite</label>
                <select
                  name="risk"
                  value={formData.risk}
                  onChange={handleChange}
                  // Applied bg-white/10 and text-white to the select itself
                  className="mt-1 w-full bg-white/10 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  {/* Added className to each option for consistent styling */}
                  <option value="low" className="bg-gray-700 text-white">
                    Low
                  </option>
                  <option value="medium" className="bg-gray-700 text-white">
                    Medium
                  </option>
                  <option value="high" className="bg-gray-700 text-white">
                    High
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium">
                  Time Frame (in years)
                </label>
                <input
                  type="number"
                  name="horizon"
                  value={formData.horizon}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5"
                  required
                  min="1"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition mt-4"
                >
                  Generate Recommendations
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">
                  Recommended Portfolio
                </h3>
                <div>
                  <strong>Stocks:</strong>
                  <ul className="list-disc ml-5">
                    {result.stocks.map((s, i) => (
                      <li key={i}>
                        {s.name} - ₹{s.amount}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <strong>SIPs:</strong>
                  <ul className="list-disc ml-5">
                    {result.sip.map((s, i) => (
                      <li key={i}>
                        {s.name} - ₹{s.amount.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <strong>ETFs:</strong>
                  <ul className="list-disc ml-5">
                    {result.etf.map((s, i) => (
                      <li key={i}>
                        {s.name} - ₹{s.amount}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 text-lg font-semibold text-green-400">
                  📈 Estimated Future Value (after inflation): ₹
                  {result.expected_return.toLocaleString()}
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
