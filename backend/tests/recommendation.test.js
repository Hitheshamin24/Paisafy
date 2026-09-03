

jest.mock("axios");
const axios = require("axios");

// Mock the DB connection so we don't need a real MongoDB in CI
jest.mock("../config/db", () => jest.fn());

// Mock node-cache so we don't need native bindings in the test env
jest.mock("node-cache", () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnValue(undefined),
    set: jest.fn(),
    keys: jest.fn().mockReturnValue([]),
    getStats: jest.fn().mockReturnValue({ hits: 0, misses: 0 }),
  }));
});

// Mock the data universes
jest.mock("../data/stocks", () => ({
  IT: [{ name: "TCS", symbol: "TCS.NS" }],
}));
jest.mock("../data/mutualFunds", () => ({ index: [] }));
jest.mock("../data/etfs", () => ({ index: [] }));

const request = require("supertest");
const express = require("express");
const recommendationRoutes = require("../routes/recommendationRoutes");

// Minimal Express app for testing (no DB, no Clerk auth for public route)
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/api", recommendationRoutes);
  return app;
}

// Mock Flask responses 

const mockFlaskPredict = {
  data: {
    expected_return: 12.5,
    allocations: { stocks: 60, mutualfund: 30, etf: 10 },
  },
};

const mockFlaskExplain = {
  data: {
    drivers: [
      {
        feature: "risk",
        label: "your risk appetite",
        importance: 0.42,
        direction: "increased",
        summary: "Your risk appetite increased stock allocation",
      },
    ],
  },
};

const mockFlaskForecast = {
  data: {
    p10: 80000,
    p50: 120000,
    p90: 180000,
    yearly_bands: [
      { year: 1, p10: 75000, p50: 110000, p90: 160000 },
      { year: 2, p10: 80000, p50: 120000, p90: 180000 },
    ],
  },
};

// ─── Valid payload ─────────────────────────────────────────────────────────────

const validPayload = {
  income: 80000,
  amountToInvest: 20000,
  horizon: 5,
  risk: "medium",
  goal: "Wealth Creation",
  experience: "Intermediate",
  preferredTypes: ["Stocks"],
  sectors: ["IT"],
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/recommend", () => {
  let app;

  beforeAll(() => {
    app = buildApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: all Flask calls succeed instantly
    axios.post.mockImplementation((url) => {
      if (url.includes("/predict")) return Promise.resolve(mockFlaskPredict);
      if (url.includes("/explain")) return Promise.resolve(mockFlaskExplain);
      if (url.includes("/forecast")) return Promise.resolve(mockFlaskForecast);
      return Promise.reject(new Error(`Unmocked URL: ${url}`));
    });
  });

  // ── Validation (Zod) ───────────────────────────────────────────────────────

  test("returns 400 when income is missing", async () => {
    const { income, ...payload } = validPayload;
    const res = await request(app).post("/api/recommend").send(payload);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
    expect(res.body.details.some((d) => d.field === "income")).toBe(true);
  });

  test("returns 400 when amountToInvest is negative", async () => {
    const res = await request(app)
      .post("/api/recommend")
      .send({ ...validPayload, amountToInvest: -500 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("returns 400 when risk is an invalid enum", async () => {
    const res = await request(app)
      .post("/api/recommend")
      .send({ ...validPayload, risk: "extreme" });
    expect(res.status).toBe(400);
    expect(res.body.details.some((d) => d.field === "risk")).toBe(true);
  });

  test("returns 400 when horizon exceeds 30 years", async () => {
    const res = await request(app)
      .post("/api/recommend")
      .send({ ...validPayload, horizon: 35 });
    expect(res.status).toBe(400);
  });

  test("returns 400 when amountToInvest exceeds 90% of income", async () => {
    const res = await request(app)
      .post("/api/recommend")
      .send({ ...validPayload, income: 10000, amountToInvest: 9500 });
    expect(res.status).toBe(400);
    expect(res.body.details.some((d) => d.field === "amountToInvest")).toBe(true);
  });

  // ── Successful responses ───────────────────────────────────────────────────

  test("returns 200 with expected_return for a valid payload", async () => {
    const res = await request(app).post("/api/recommend").send(validPayload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("expected_return");
  });

  test("returns allocations object with stocks, mutualfund, etf", async () => {
    const res = await request(app).post("/api/recommend").send(validPayload);
    expect(res.body.allocations).toEqual(
      expect.objectContaining({
        stocks: expect.any(Number),
        mutualfund: expect.any(Number),
        etf: expect.any(Number),
      })
    );
  });

  test("attaches explanation array from /explain", async () => {
    const res = await request(app).post("/api/recommend").send(validPayload);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.explanation)).toBe(true);
  });

  test("attaches forecast object from /forecast", async () => {
    const res = await request(app).post("/api/recommend").send(validPayload);
    expect(res.status).toBe(200);
    expect(res.body.forecast).toHaveProperty("p10");
    expect(res.body.forecast).toHaveProperty("p50");
    expect(res.body.forecast).toHaveProperty("p90");
  });

  // Increase timeout to 20s — callFlask retries 3× with 3s delay on failure
  test(
    "still returns 200 when /explain Flask call fails (graceful fallback)",
    async () => {
      axios.post.mockImplementation((url) => {
        if (url.includes("/predict")) return Promise.resolve(mockFlaskPredict);
        if (url.includes("/explain")) return Promise.reject(new Error("SHAP failed"));
        if (url.includes("/forecast")) return Promise.resolve(mockFlaskForecast);
      });

      const res = await request(app).post("/api/recommend").send(validPayload);
      expect(res.status).toBe(200);
      expect(res.body.explanation).toEqual([]);
    },
    20000
  );

  test(
    "still returns 200 when /forecast Flask call fails (graceful fallback)",
    async () => {
      axios.post.mockImplementation((url) => {
        if (url.includes("/predict")) return Promise.resolve(mockFlaskPredict);
        if (url.includes("/explain")) return Promise.resolve(mockFlaskExplain);
        if (url.includes("/forecast")) return Promise.reject(new Error("Monte Carlo failed"));
      });

      const res = await request(app).post("/api/recommend").send(validPayload);
      expect(res.status).toBe(200);
      expect(res.body.forecast).toBeNull();
    },
    20000
  );
});

// ─── GET /api/cache/stats ─────────────────────────────────────────────────────

describe("GET /api/cache/stats", () => {
  test("returns cache statistics object", async () => {
    const app = buildApp();
    const res = await request(app).get("/api/cache/stats");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("prices");
    expect(res.body).toHaveProperty("nav");
  });
});
