import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching recommendation");
    }
  };

  return (
    // Outer container: Full viewport height & width, consistent dark background
    <div
      className="w-screen h-screen bg-gray-950 flex items-center justify-center overflow-x-hidden"
    >
      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-xl text-white max-h-[90vh] overflow-y-auto
                   border border-blue-800/50" 
                   >
        {/* Added a subtle border */}
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-200">
          {/* Changed text-blue-200 for consistency */}
          Paisafy - Smart Investment Planner
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="col-span-1 md:col-span-2">
            <label className="block font-medium mb-1">Monthly Income (₹)</label> {/* Added mb-1 for label spacing */}
            <input
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              // Themed input field styles
              className="mt-1 w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
            <p className="text-sm text-blue-300/80 mt-1 break-words"> {/* Themed suggestion text */}
              {suggestion}
            </p>
          </div>

          <div>
            <label className="block font-medium mb-1">Amount to Invest (₹)</label> {/* Added mb-1 */}
            <input
              type="number"
              name="amountToInvest"
              value={formData.amountToInvest}
              onChange={handleChange}
              // Themed input field styles
              className="mt-1 w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Risk Appetite</label> {/* Added mb-1 */}
            <select
              name="risk"
              value={formData.risk}
              onChange={handleChange}
              // Themed select field styles
              className="mt-1 w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" // appearance-none for custom arrow if needed
            >
              {/* Options are styled with background and text color to ensure visibility */}
              <option value="low" className="bg-gray-800 text-white">
                Low
              </option>
              <option value="medium" className="bg-gray-800 text-white">
                Medium
              </option>
              <option value="high" className="bg-gray-800 text-white">
                High
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Time Frame (in years)</label> {/* Added mb-1 */}
            <input
              type="number"
              name="horizon"
              value={formData.horizon}
              onChange={handleChange}
              // Themed input field styles
              className="mt-1 w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="e.g., 5"
              required
              min="1"
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-2"> {/* Added mt-2 for button spacing */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Get Recommendation
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 text-blue-100"> {/* Themed result section heading */}
            <h3 className="text-xl font-semibold mb-3">
              Recommended Portfolio
            </h3>
            <div className="space-y-4"> {/* Added spacing between result sections */}
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
              <div>
                <strong>SIPs:</strong>
                <ul className="list-disc ml-5">
                  {result.sip.map((s, i) => (
                    <li key={i}>
                      {s.name} - ₹{s.amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>ETFs:</strong>
                <ul className="list-disc ml-5">
                  {result.etf.map((s, i) => (
                    <li key={i}>
                      {s.name} - ₹{s.amount}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default Form;