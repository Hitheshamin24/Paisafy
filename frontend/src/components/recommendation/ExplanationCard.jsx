import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  IndianRupee,
  BarChart2,
  CalendarDays,
  Zap,
  Target,
  GraduationCap,
  MapPin,
} from "lucide-react";

// Maps each ML feature to a Lucide icon component a colour pair
const FEATURE_ICON_MAP = {
  income:         { Icon: IndianRupee,   bg: "from-emerald-400 to-teal-500",   ring: "border-emerald-100" },
  amountToInvest: { Icon: BarChart2,     bg: "from-blue-400 to-cyan-500",      ring: "border-blue-100"    },
  horizon:        { Icon: CalendarDays,  bg: "from-amber-400 to-orange-500",   ring: "border-amber-100"   },
  risk:           { Icon: Zap,           bg: "from-rose-400 to-pink-500",      ring: "border-rose-100"    },
  goal:           { Icon: Target,        bg: "from-violet-400 to-purple-500",  ring: "border-violet-100"  },
  experience:     { Icon: GraduationCap, bg: "from-lime-400 to-green-500",     ring: "border-lime-100"    },
};

const FALLBACK = { Icon: MapPin, bg: "from-gray-400 to-slate-500", ring: "border-gray-100" };

function FeatureIcon({ feature }) {
  const { Icon, bg } = FEATURE_ICON_MAP[feature] ?? FALLBACK;
  return (
    <div
      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bg} flex items-center justify-center flex-shrink-0 shadow-sm`}
    >
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}

function DirectionIcon({ direction }) {
  if (direction === "increased") {
    return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  }
  if (direction === "decreased") {
    return <TrendingDown className="w-4 h-4 text-rose-500" />;
  }
  return <Minus className="w-4 h-4 text-gray-400" />;
}

export default function ExplanationCard({ explanations }) {
  if (!explanations || explanations.length === 0) return null;

  // Normalize importance scores to 0–100 for bar widths
  const maxImportance = Math.max(...explanations.map((d) => d.importance), 0.0001);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-6 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border border-violet-200 rounded-2xl p-6 shadow-md"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5">
            Why this allocation?
            <Sparkles className="w-4 h-4 text-violet-500" />
          </h3>
          <p className="text-xs text-gray-500">
            AI-powered explanation of how your inputs shaped this portfolio
          </p>
        </div>
      </div>

      {/* Drivers */}
      <div className="space-y-3.5">
        {explanations.map((driver, idx) => {
          const { ring } = FEATURE_ICON_MAP[driver.feature] ?? FALLBACK;
          const barWidth = Math.max(
            8,
            Math.round((driver.importance / maxImportance) * 100)
          );

          return (
            <motion.div
              key={driver.feature}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
              className={`bg-white/80 backdrop-blur-sm border ${ring} rounded-xl p-3.5`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <FeatureIcon feature={driver.feature} />
                  <span className="text-sm font-semibold text-gray-800 capitalize">
                    {driver.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DirectionIcon direction={driver.direction} />
                  <span
                    className={`text-xs font-medium ${
                      driver.direction === "increased"
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {driver.direction === "increased"
                      ? "Boosted stocks"
                      : "Reduced stocks"}
                  </span>
                </div>
              </div>

              {/* Importance bar */}
              <div className="w-full bg-violet-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.7, delay: 0.3 + idx * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-indigo-500"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Powered by SHAP (SHapley Additive exPlanations)
      </p>
    </motion.div>
  );
}
