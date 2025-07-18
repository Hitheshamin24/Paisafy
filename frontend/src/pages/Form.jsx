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
        <div className="relative w-screen min-h-screen bg-cover bg-center flex items-center justify-center bg-gradient-to-br from-black to-gray-800">
          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#0d1422] p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-white mt-15 mb-15"
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
                  placeholder="eg:,25000"
                  className="mt-1 w-full border border-white/20 placeholder-gray-600  rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300" // Added text-black for visibility
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
                  placeholder="eg:5000"
                  className="mt-1 w-full border border-white/20  placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Risk Appetite</label>
                <select
                  name="risk"
                  value={formData.risk}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
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
                  className="mt-1 w-full border border-white/20 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" // Added text-black
                  placeholder="e.g., 5"
                  required
                  min="1"
                />
              </div>
              {/* Investment Goal */}
              <div>
                <label className="block font-medium">Investment Goal</label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="mt-1 w-full bg-white/0 border border-white/20 rounded px-3 py-2 text-white"
                >
                  <option value="Wealth Creation" className="bg-gray-700">
                    Wealth Creation
                  </option>
                  <option value="Retirement" className="bg-gray-700">
                    Retirement
                  </option>
                  <option value="Child Education" className="bg-gray-700">
                    Child Education
                  </option>
                  <option value="Short-Term Gains" className="bg-gray-700">
                    Short-Term Gains
                  </option>
                </select>
              </div>

              {/* Preferred Investment Types as Checkboxes */}
              <div>
                <label className="block font-medium mb-1">
                  Preferred Investment Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Stocks", "SIPs", "ETFs"].map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={type}
                        name="preferredTypes"
                        value={type}
                        checked={formData.preferredTypes.includes(type)}
                        onChange={handleCheckboxChange}
                        className="mr-2 form-checkbox h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor={type} className="text-gray-200">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block font-medium">Experience Level</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="mt-1 w-full bg-transparent border border-white/10 rounded px-3 py-2 text-white"
                >
                  <option value="Beginner" className="bg-gray-700">
                    Beginner
                  </option>
                  <option value="Intermediate" className="bg-gray-700">
                    Intermediate
                  </option>
                  <option value="Expert" className="bg-gray-700">
                    Expert
                  </option>
                </select>
              </div>

              {/* Sector Preferences as Checkboxes */}
              <div>
                <label className="block font-medium mb-1">
                  Preferred Sectors
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "IT",
                    "Banking",
                    "FMCG",
                    "Pharma",
                    "Energy",
                    "Automobile",
                    "Healthcare",
                  ].map((sector) => (
                    <div key={sector} className="flex items-center">
                      <input
                        type="checkbox"
                        id={sector}
                        name="sectors"
                        value={sector}
                        checked={formData.sectors.includes(sector)}
                        onChange={handleCheckboxChange}
                        className="mr-2 form-checkbox h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor={sector} className="text-gray-200">
                        {sector}
                      </label>
                    </div>
                  ))}
                </div>
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
              <div className="mt-12">
                {/* === Portfolio Allocation Section === */}
                <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Portfolio Allocation
                  </h3>

                  <div className="space-y-4">
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
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>{item.label}</span>
                          <span>{item.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded">
                          <div
                            className={`${item.color} h-2 rounded`}
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                          ₹
                          {(
                            (item.value / 100) *
                            formData.amountToInvest
                          ).toFixed(0)}
                        </div>
                      </div>
                    ))}
                  </div>
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
                        <span className="text-green-400 font-semibold block mt-2">
                          ₹{stock.amount}
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
                        <span className="text-green-400 font-semibold block mt-2">
                          ₹{etf.amount}
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
                        <span className="text-green-400 font-semibold block mt-2">
                          ₹{sip.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>

                {/* === Final Return Summary === */}
                <div className="mt-8 text-xl font-bold text-green-400 text-center">
                  📈 Estimated Future Value: ₹
                  {result.future_value.toLocaleString()}
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