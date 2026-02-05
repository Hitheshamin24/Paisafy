require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
// Connect to MongoDB
connectDB();

// Import user routes
const userRoutes = require("./routes/userRoutes");

const etfUniverse = require("./data/etfs");
const sipUniverse = require("./data/mutualFunds");

const { getMutualFundNAV } = require("./services/navServices");

const { getStockPrice } = require("./services/priceServices");
const stockUniverse = require("./data/stocks");

app.post("/api/recommend", async (req, res) => {
  try {
    // 1️⃣ Call Flask ML
    async function callFlask(payload) {
      for (let i = 0; i < 3; i++) {
        try {
          return await axios.post(`${process.env.FLASK_URL}/predict`, payload, {
            timeout: 60000,
          });
        } catch (err) {
          if (i === 2) throw err;
          await new Promise((r) => setTimeout(r, 3000));
        }
      }
    }

    // 👇 use here
    const flaskRes = await callFlask(req.body);

    console.log("Calling Flask at:", process.env.FLASK_URL);

    const { allocations, expected_return } = flaskRes.data;
    const totalAmount = req.body.amountToInvest;

    let recommendations = {
      stocks: [],
      sip: [],
      etf: [],
    };

    // 2️⃣ STOCKS
    if (allocations.stocks > 0) {
      const sectors = req.body.sectors || [];
      let selectedStocks = [];

      sectors.forEach((sector) => {
        if (stockUniverse[sector]) {
          selectedStocks.push(...stockUniverse[sector]);
        }
      });

      const investAmount = (allocations.stocks / 100) * totalAmount;
      const perStockBudget = investAmount / selectedStocks.length;

      // MAIN BUY LOOP
      const stockResults = await Promise.allSettled(
        selectedStocks.map(async (stock) => {
          const price = await getStockPrice(stock.symbol);
          if (!price || price <= 0) return null;

          const quantity = Math.floor(perStockBudget / price);
          if (!quantity) return null;

          return {
            name: stock.name,
            symbol: stock.symbol,
            price: Number(price.toFixed(2)),
            quantity,
            amount: Number((quantity * price).toFixed(2)),
          };
        }),
      );

      recommendations.stocks = stockResults
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);

      // 🔥 FALLBACK — IF NOTHING WAS BOUGHT
      if (recommendations.stocks.length === 0 && selectedStocks.length > 0) {
        let cheapest = null;

        for (const stock of selectedStocks) {
          const price = await getStockPrice(stock.symbol);
          if (!price) continue;

          if (!cheapest || price < cheapest.price) {
            cheapest = { ...stock, price };
          }
        }

        if (cheapest) {
          const qty = Math.floor(investAmount / cheapest.price);

          if (qty > 0) {
            recommendations.stocks.push({
              name: cheapest.name,
              symbol: cheapest.symbol,
              price: Number(cheapest.price.toFixed(2)),
              quantity: qty,
              amount: Number((qty * cheapest.price).toFixed(2)),
            });
          }
        }
      }
    }

    // 3️⃣ SIPs (REAL MUTUAL FUNDS)
    if (allocations.sip > 0) {
      const sipList = sipUniverse.index;

      const investAmount = (allocations.sip / 100) * totalAmount;
      const perFund = investAmount / sipList.length;

      const sipResults = await Promise.allSettled(
        sipList.map(async (fund) => {
          const nav = await getMutualFundNAV(fund.amfi);
          if (!nav) return null;

          const units = perFund / nav;

          return {
            name: fund.name,
            price: Number(nav.toFixed(2)),
            units: Number(units.toFixed(3)),
            amount: Number(perFund.toFixed(2)),
          };
        }),
      );

      recommendations.sip = sipResults
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);
    }

    // 4️⃣ ETFs
    if (allocations.etf > 0) {
      const etfList = etfUniverse.index;

      const investAmount = (allocations.etf / 100) * totalAmount;
      const perETF = investAmount / etfList.length;

      const etfResults = await Promise.allSettled(
        etfList.map(async (etf) => {
          const price = await getStockPrice(etf.symbol);
          if (!price) return null;

          const units = Math.floor(perETF / price);
          if (!units) return null;

          return {
            name: etf.name,
            symbol: etf.symbol,
            price,
            quantity: units,
            amount: units * price,
          };
        }),
      );

      recommendations.etf = etfResults
        .filter((r) => r.status === "fulfilled" && r.value)
        .map((r) => r.value);
    }

    // ===== FINAL TOTAL CALCULATIONS =====

    const stockInvested = recommendations.stocks.reduce(
      (sum, s) => sum + s.amount,
      0,
    );

    const sipInvested = recommendations.sip.reduce(
      (sum, s) => sum + s.amount,
      0,
    );

    const etfInvested = recommendations.etf.reduce(
      (sum, s) => sum + s.amount,
      0,
    );

    const totalPrincipal = stockInvested + sipInvested + etfInvested;

    const uninvested = totalAmount - totalPrincipal;

    const months = Number(req.body.horizon || 1) * 12;

    const monthlyInvestment = totalPrincipal;

    const annualRate = expected_return / 100;
    const monthlyRate = annualRate / 12;

    // SIP future value formula
    const futureValue =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const principalOverTime = monthlyInvestment * months;

    const profit = futureValue - principalOverTime;

    res.json({
      expected_return,

      allocations: {
        stocks: { percent: allocations.stocks },
        sip: { percent: allocations.sip },
        etf: { percent: allocations.etf },
      },

      recommendations,

      total_principal: Math.round(principalOverTime),
      profit: Math.round(profit),
      future_value: Math.round(futureValue),

      total_invested: Math.round(totalPrincipal),
      uninvested_amount: Math.round(uninvested),
    });
  } catch (err) {
    console.error("===== RECOMMEND ERROR =====");

    if (err.response) {
      console.error("URL:", err.config?.url);
      console.error("STATUS:", err.response.status);
      console.error("HEADERS:", err.response.headers);
      console.error("DATA:", err.response.data);
    } else {
      console.error("NO RESPONSE ERROR:", err.message);
    }

    console.error("===========================");

    res.status(500).json({ error: "Failed to get recommendation" });
  }
});

// Use recommendation routes
app.use("/api", require("./routes/recommendationRoutes"));

// Use the user routes under
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
