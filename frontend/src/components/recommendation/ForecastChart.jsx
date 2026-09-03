import { motion } from "framer-motion";
import { TrendingUp, BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function formatINR(value) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${Math.round(value)}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-xs">
        <p className="font-bold text-gray-700 mb-2">Year {label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: entry.color }}
            />
            <span className="text-gray-500">{entry.name}:</span>
            <span className="font-semibold text-gray-800">
              {formatINR(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ForecastChart({ forecast, horizon }) {
  if (!forecast || !forecast.yearly_bands || forecast.yearly_bands.length === 0) {
    return null;
  }

  const data = forecast.yearly_bands.map((band) => ({
    year: band.year,
    "Optimistic (90th %)": band.p90,
    "Realistic (50th %)": band.p50,
    "Pessimistic (10th %)": band.p10,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-6 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 border border-slate-200 rounded-2xl p-6 shadow-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-100">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5">
              Portfolio Forecast
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </h3>
            <p className="text-xs text-gray-500">
              Monte Carlo simulation across {horizon} year{horizon > 1 ? "s" : ""} (1,000 paths)
            </p>
          </div>
        </div>

        {/* Final value summary pills */}
        <div className="hidden sm:flex flex-col gap-1 text-right">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
            Best: {formatINR(forecast.p90)}
          </span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1">
            Likely: {formatINR(forecast.p50)}
          </span>
          <span className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1">
            Conservative: {formatINR(forecast.p10)}
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorRealistic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorPessimistic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

          <XAxis
            dataKey="year"
            tickFormatter={(v) => `Yr ${v}`}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatINR}
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={60}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            iconType="circle"
            iconSize={8}
          />

          <Area
            type="monotone"
            dataKey="Optimistic (90th %)"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorOptimistic)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="Realistic (50th %)"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="url(#colorRealistic)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="Pessimistic (10th %)"
            stroke="#f43f5e"
            strokeWidth={2}
            fill="url(#colorPessimistic)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <p className="mt-3 text-xs text-gray-400 text-center">
        Based on historical Indian equity volatility (~14% annualised σ). Not financial advice.
      </p>
    </motion.div>
  );
}
