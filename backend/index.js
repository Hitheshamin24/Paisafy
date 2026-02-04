require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

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
    const flaskRes = await axios.post(
      `${process.env.FLASK_URL}/predict`,
      req.body,
    );
    console.log("Calling Flask at:", process.env.FLASK_URL);

    const { allocations, expected_return } = flaskRes.data;
    const totalAmount = req.body.amountToInvest;

    let recommendations = {
      stocks: [],
      sip: [],
      etf: [],
    };

    // 2️⃣ STOCKS
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
      for (const stock of selectedStocks) {
        const price = await getStockPrice(stock.symbol);
        if (!price || price <= 0) continue;

        const quantity = Math.floor(perStockBudget / price);
        if (quantity === 0) continue;

        const actualAmount = quantity * price;

        recommendations.stocks.push({
          name: stock.name,
          symbol: stock.symbol,
          price: Number(price.toFixed(2)),
          quantity,
          amount: Number(actualAmount.toFixed(2)),
        });
      }

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

      for (const fund of sipList) {
        const nav = await getMutualFundNAV(fund.amfi);
        if (!nav) continue;

        const units = perFund / nav;

        recommendations.sip.push({
          name: fund.name,
          price: Number(nav.toFixed(2)),
          units: Number(units.toFixed(3)),
          amount: Number(perFund.toFixed(2)),
        });
      }
    }

    // 4️⃣ ETFs
    if (allocations.etf > 0) {
      const etfList = etfUniverse.index;

      const investAmount = (allocations.etf / 100) * totalAmount;
      const perETF = investAmount / etfList.length;

      for (const etf of etfList) {
        const price = await getStockPrice(etf.symbol);
        if (!price) continue;

        const units = Math.floor(perETF / price);
        if (units === 0) continue;

        const actualAmount = units * price;

        recommendations.etf.push({
          name: etf.name,
          symbol: etf.symbol,
          price,
          quantity: units,
          amount: actualAmount,
        });
      }
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
    console.error(
      "Recommendation Error:",
      err.response?.status,
      err.response?.data || err.message,
      err.config?.url,
    );

    res.status(500).json({ error: "Failed to get recommendation" });
  }
});

// Use recommendation routes
app.use("/api", require("./routes/recommendationRoutes"));

// Use the user routes under
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
