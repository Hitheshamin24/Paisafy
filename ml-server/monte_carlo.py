import numpy as np


def run_monte_carlo(principal, expected_return_pct, horizon_years, n_simulations=1000):
    np.random.seed(None)

    annual_return = expected_return_pct / 100.0
    monthly_return = annual_return / 12.0
    monthly_volatility = 0.04  # roughly 14% annualised, typical for Indian equities
    total_months = horizon_years * 12

    monthly_returns = np.random.normal(
        loc=monthly_return,
        scale=monthly_volatility,
        size=(n_simulations, total_months),
    )

    growth_factors = np.cumprod(1 + monthly_returns, axis=1)
    portfolio_values = principal * growth_factors

    # Snapshot the portfolio at the end of each year
    yearly_bands = []
    for year in range(1, horizon_years + 1):
        month_idx = year * 12 - 1
        values_at_year = portfolio_values[:, month_idx]
        yearly_bands.append({
            "year": year,
            "p10": round(float(np.percentile(values_at_year, 10)), 2),
            "p50": round(float(np.percentile(values_at_year, 50)), 2),
            "p90": round(float(np.percentile(values_at_year, 90)), 2),
        })

    final_values = portfolio_values[:, -1]

    return {
        "p10": round(float(np.percentile(final_values, 10)), 2),
        "p50": round(float(np.percentile(final_values, 50)), 2),
        "p90": round(float(np.percentile(final_values, 90)), 2),
        "yearly_bands": yearly_bands,
    }
