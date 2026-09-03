"""
Tests for run_monte_carlo() in monte_carlo.py
Run from the ml-server/ directory: pytest tests/ -v
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from monte_carlo import run_monte_carlo


class TestMonteCarlo:
    def test_returns_required_keys(self):
        result = run_monte_carlo(100000, 12.0, 5)
        assert "p10" in result
        assert "p50" in result
        assert "p90" in result
        assert "yearly_bands" in result

    def test_percentile_order(self):
        """p10 < p50 < p90 always."""
        result = run_monte_carlo(100000, 12.0, 10)
        assert result["p10"] < result["p50"] < result["p90"]

    def test_yearly_bands_length_matches_horizon(self):
        horizon = 7
        result = run_monte_carlo(50000, 10.0, horizon)
        assert len(result["yearly_bands"]) == horizon

    def test_yearly_bands_have_correct_keys(self):
        result = run_monte_carlo(100000, 10.0, 3)
        for band in result["yearly_bands"]:
            assert "year" in band
            assert "p10" in band
            assert "p50" in band
            assert "p90" in band

    def test_band_percentile_order_every_year(self):
        result = run_monte_carlo(100000, 12.0, 5)
        for band in result["yearly_bands"]:
            assert band["p10"] <= band["p50"] <= band["p90"]

    def test_final_value_exceeds_principal_for_positive_return(self):
        """With a 12% expected return over 10 years, the median should beat principal."""
        principal = 100000
        result = run_monte_carlo(principal, 12.0, 10)
        assert result["p50"] > principal

    def test_yearly_bands_years_are_sequential(self):
        result = run_monte_carlo(100000, 10.0, 5)
        years = [band["year"] for band in result["yearly_bands"]]
        assert years == list(range(1, 6))

    def test_horizon_one_year(self):
        """Edge case: single year horizon should still work."""
        result = run_monte_carlo(100000, 8.0, 1)
        assert len(result["yearly_bands"]) == 1
        assert result["p10"] < result["p50"] < result["p90"]

    def test_all_values_are_positive(self):
        result = run_monte_carlo(100000, 10.0, 5)
        assert result["p10"] > 0
        assert result["p50"] > 0
        assert result["p90"] > 0
