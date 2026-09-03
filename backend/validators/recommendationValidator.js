const { z } = require("zod");

const recommendSchema = z
  .object({
    income: z
      .number({ invalid_type_error: "income must be a number" })
      .positive("income must be a positive number"),

    amountToInvest: z
      .number({ invalid_type_error: "amountToInvest must be a number" })
      .positive("amountToInvest must be a positive number")
      .min(100, "amountToInvest must be at least ₹100"),

    horizon: z
      .number({ invalid_type_error: "horizon must be a number" })
      .int("horizon must be a whole number")
      .min(1, "horizon must be at least 1 year")
      .max(30, "horizon cannot exceed 30 years"),

    risk: z.enum(["low", "medium", "high"], {
      errorMap: () => ({ message: "risk must be one of: low, medium, high" }),
    }),

    goal: z.enum(
      ["Wealth Creation", "Retirement", "Child Education", "Short-Term Gains"],
      {
        errorMap: () => ({
          message:
            "goal must be one of: Wealth Creation, Retirement, Child Education, Short-Term Gains",
        }),
      }
    ),

    experience: z.enum(["Beginner", "Intermediate", "Expert"], {
      errorMap: () => ({
        message: "experience must be one of: Beginner, Intermediate, Expert",
      }),
    }),

    preferredTypes: z
      .array(z.enum(["Stocks", "Mutual Funds", "ETFs"]))
      .optional()
      .default([]),

    sectors: z.array(z.string()).optional().default([]),
  })
  .refine(
    (data) => data.amountToInvest <= data.income * 0.9,
    {
      message: "amountToInvest should not exceed 90% of income",
      path: ["amountToInvest"],
    }
  );

// Validates req.body and returns structured 400 errors on failure
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Zod v4 uses .issues; .errors is the v3 fallback
      const issues = result.error.issues ?? result.error.errors ?? [];
      const errors = issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    req.body = result.data;
    next();
  };
}

module.exports = { recommendSchema, validate };
