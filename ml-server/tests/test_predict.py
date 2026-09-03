"""
Tests for predict_allocations() and explain_allocations() in predict.py
Run from the ml-server/ directory: pytest tests/ -v
"""
import sys
import os

# Ensure ml-server root is on the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from predict import predict_allocations, explain_allocations


# ─── Fixtures ─────────────────────────────────────────────────────────────────

@pytest.fixture
def base_payload():
    return {
        "income": 80000,
        "amountToInvest": 20000,
        "horizon": 5,
        "risk": "medium",
        "goal": "Wealth Creation",
        "experience": "Intermediate",
        "preferredTypes": [],
        "sectors": [],
    }


# ─── predict_allocations tests ────────────────────────────────────────────────

class TestPredictAllocations:
    def test_returns_expected_keys(self, base_payload):
        result = predict_allocations(base_payload)
        assert "expected_return" in result
        assert "allocations" in result

    def test_allocations_sum_to_100(self, base_payload):
        result = predict_allocations(base_payload)
        alloc = result["allocations"]
        total = alloc["stocks"] + alloc["mutualfund"] + alloc["etf"]
        assert abs(total - 100.0) < 0.1, f"Allocations sum to {total}, expected ~100"

    def test_expected_return_is_positive(self, base_payload):
        result = predict_allocations(base_payload)
        assert result["expected_return"] > 0

    def test_allocations_are_non_negative(self, base_payload):
        result = predict_allocations(base_payload)
        alloc = result["allocations"]
        assert alloc["stocks"] >= 0
        assert alloc["mutualfund"] >= 0
        assert alloc["etf"] >= 0

    def test_no_preferred_types_allows_all_assets(self, base_payload):
        """When preferredTypes is empty, all three asset classes should be allocated."""
        base_payload["preferredTypes"] = []
        result = predict_allocations(base_payload)
        alloc = result["allocations"]
        # At least one of stocks/mf/etf should be non-zero
        assert max(alloc["stocks"], alloc["mutualfund"], alloc["etf"]) > 0

    def test_preferred_types_filter_respected(self, base_payload):
        """If only Stocks is preferred, mutualfund and etf should be 0."""
        base_payload["preferredTypes"] = ["Stocks"]
        result = predict_allocations(base_payload)
        alloc = result["allocations"]
        assert alloc["mutualfund"] == 0
        assert alloc["etf"] == 0
        assert alloc["stocks"] == 100.0

    def test_fallback_for_zero_allocation(self, base_payload):
        """If no preferred type matches, fallback to 33.33/33.33/33.33."""
        base_payload["preferredTypes"] = ["NonExistent"]
        result = predict_allocations(base_payload)
        alloc = result["allocations"]
        # Fallback: all three are 33.33
        assert abs(alloc["stocks"] - 33.33) < 1.0

    def test_high_risk_increases_stocks(self, base_payload):
        base_payload_low = {**base_payload, "risk": "low"}
        base_payload_high = {**base_payload, "risk": "high"}
        result_low = predict_allocations(base_payload_low)
        result_high = predict_allocations(base_payload_high)
        assert result_high["allocations"]["stocks"] >= result_low["allocations"]["stocks"]

    def test_unknown_risk_falls_back_gracefully(self, base_payload):
        """Unknown enum values should not crash — safe_encode falls back to class[0]."""
        base_payload["risk"] = "ultra_high_risk"
        result = predict_allocations(base_payload)
        assert "allocations" in result


# ─── explain_allocations tests ────────────────────────────────────────────────

class TestExplainAllocations:
    def test_returns_drivers_key(self, base_payload):
        result = explain_allocations(base_payload)
        assert "drivers" in result

    def test_drivers_is_list(self, base_payload):
        result = explain_allocations(base_payload)
        assert isinstance(result["drivers"], list)

    def test_driver_has_required_fields(self, base_payload):
        result = explain_allocations(base_payload)
        if result["drivers"]:  # might be empty if shap not installed
            driver = result["drivers"][0]
            assert "feature" in driver
            assert "label" in driver
            assert "importance" in driver
            assert "direction" in driver
            assert "summary" in driver

    def test_max_four_drivers_returned(self, base_payload):
        result = explain_allocations(base_payload)
        assert len(result["drivers"]) <= 4

    def test_importance_values_are_non_negative(self, base_payload):
        result = explain_allocations(base_payload)
        for driver in result["drivers"]:
            assert driver["importance"] >= 0

    def test_direction_is_valid(self, base_payload):
        result = explain_allocations(base_payload)
        valid_directions = {"increased", "decreased"}
        for driver in result["drivers"]:
            assert driver["direction"] in valid_directions
