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
const mutualFundUniverse = require("./data/mutualFunds");

const { getMutualFundNAV } = require("./services/navServices");
const { getStockPrice } = require("./services/priceServices");

const stockUniverse = require("./data/stocks");

app.post("/api/recommend", async (req, res) => {
  try {
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

    const flaskRes = await callFlask(req.body);
    const { allocations, expected_return } = flaskRes.data;

    const totalAmount = Number(req.body.amountToInvest);

    let recommendations = {
      stocks: [],
      mutualfund: [],
      etf: [],
    };

    // ================= STOCKS =================
    if (allocations.stocks > 0) {
      const sectors = req.body.sectors || [];
      let selectedStocks = [];

      sectors.forEach((sector) => {
        if (stockUniverse[sector]) {
          selectedStocks.push(...stockUniverse[sector]);
        }
      });

      const investAmount = Number(
        ((allocations.stocks / 100) * totalAmount).toFixed(2),
      );

      let remaining = investAmount;
      let results = [];

      const prices = await Promise.all(
        selectedStocks.map(async (stock) => {
          const price = await getStockPrice(stock.symbol);
          return { ...stock, price };
        }),
      );

      const validStocks = prices.filter((s) => s.price && s.price > 0);

      if (validStocks.length > 0) {
        const perStock = investAmount / validStocks.length;

        for (const stock of validStocks) {
          const qty = Math.floor(perStock / stock.price);

          if (qty > 0) {
            const amount = qty * stock.price;
            remaining -= amount;

            results.push({
              name: stock.name,
              symbol: stock.symbol,
              price: Number(stock.price.toFixed(2)),
              quantity: qty,
              amount: Number(amount.toFixed(2)),
            });
          }
        }

        // second pass
        for (const stock of validStocks) {
          if (remaining < stock.price) continue;

          const qty = Math.floor(remaining / stock.price);

          if (qty > 0) {
            const amount = qty * stock.price;
            remaining -= amount;

            const existing = results.find((r) => r.symbol === stock.symbol);

            if (existing) {
              existing.quantity += qty;
              existing.amount += amount;
            } else {
              results.push({
                name: stock.name,
                symbol: stock.symbol,
                price: Number(stock.price.toFixed(2)),
                quantity: qty,
                amount: Number(amount.toFixed(2)),
              });
            }
          }
        }
      }

      recommendations.stocks = results;
    }

    // ================= MUTUAL FUNDS =================
    // ================= MUTUAL FUNDS =================
    if (allocations.mutualfund > 0) {
      const fundList = mutualFundUniverse.index || [];

      if (fundList.length > 0) {
        const investAmount = Number(
          ((allocations.mutualfund / 100) * totalAmount).toFixed(2),
        );

        const perFundRaw = investAmount / fundList.length;

        // 🔥 round to nearest 500
        const roundTo500 = (amount) => {
          return Math.max(500, Math.round(amount / 500) * 500);
        };

        let fundResults = [];
        let usedAmount = 0;

        const results = await Promise.allSettled(
          fundList.map(async (fund) => {
            const nav = await getMutualFundNAV(fund.amfi);
            if (!nav) return null;

            let amount = roundTo500(perFundRaw);

            return {
              name: fund.name,
              price: Number(nav.toFixed(2)),
              amount,
            };
          }),
        );

        const validFunds = results
          .filter((r) => r.status === "fulfilled" && r.value)
          .map((r) => r.value);

        // 🔥 Adjust total to not exceed allocation
        for (let fund of validFunds) {
          if (usedAmount + fund.amount > investAmount) {
            let remaining = investAmount - usedAmount;

            if (remaining >= 500) {
              fund.amount = Math.floor(remaining / 500) * 500;
            } else {
              fund.amount = 0;
            }
          }

          if (fund.amount >= 500) {
            const units = fund.amount / fund.price;

            fund.units = Number(units.toFixed(3));
            fund.amount = Number(fund.amount.toFixed(2));

            fundResults.push(fund);
            usedAmount += fund.amount;
          }
        }

        recommendations.mutualfund = fundResults;
      }
    }

    // ================= ETF =================
    if (allocations.etf > 0) {
      const etfList = etfUniverse.index || [];

      const investAmount = Number(
        ((allocations.etf / 100) * totalAmount).toFixed(2),
      );

      let remaining = investAmount;
      let results = [];

      const prices = await Promise.all(
        etfList.map(async (etf) => {
          const price = await getStockPrice(etf.symbol);
          return { ...etf, price };
        }),
      );

      const validETFs = prices.filter((e) => e.price && e.price > 0);

      if (validETFs.length > 0) {
        const perETF = investAmount / validETFs.length;

        for (const etf of validETFs) {
          const qty = Math.floor(perETF / etf.price);

          if (qty > 0) {
            const amount = qty * etf.price;
            remaining -= amount;

            results.push({
              name: etf.name,
              symbol: etf.symbol,
              price: etf.price,
              quantity: qty,
              amount,
            });
          }
        }

        // second pass
        for (const etf of validETFs) {
          if (remaining < etf.price) continue;

          const qty = Math.floor(remaining / etf.price);

          if (qty > 0) {
            const amount = qty * etf.price;
            remaining -= amount;

            const existing = results.find((r) => r.symbol === etf.symbol);

            if (existing) {
              existing.quantity += qty;
              existing.amount += amount;
            } else {
              results.push({
                name: etf.name,
                symbol: etf.symbol,
                price: etf.price,
                quantity: qty,
                amount,
              });
            }
          }
        }
      }

      recommendations.etf = results;
    }

    // ================= FINAL CALCULATION =================

    let stockInvested = recommendations.stocks.reduce(
      (sum, s) => sum + s.amount,
      0,
    );
    let mfInvested = recommendations.mutualfund.reduce(
      (sum, s) => sum + s.amount,
      0,
    );
    let etfInvested = recommendations.etf.reduce((sum, s) => sum + s.amount, 0);

    let totalPrincipal = stockInvested + mfInvested + etfInvested;
    let uninvested = totalAmount - totalPrincipal;

    // 🔥 Adjust leftover
    // 🔥 Adjust leftover (ONLY in multiples of 500)
    if (uninvested >= 500 && recommendations.mutualfund.length > 0) {
      const mf = recommendations.mutualfund[0];

      // round leftover to nearest 500
      const extraAmount = Math.floor(uninvested / 500) * 500;

      if (extraAmount >= 500) {
        const extraUnits = extraAmount / mf.price;

        mf.units += Number(extraUnits.toFixed(3));
        mf.amount += Number(extraAmount.toFixed(2));

        totalPrincipal += extraAmount;
        uninvested -= extraAmount;
      }
    }

    // final rounding
    totalPrincipal = Number(totalPrincipal.toFixed(2));
    uninvested = Number(uninvested.toFixed(2));

    // ================= RETURNS =================

    const months = Number(req.body.horizon || 1) * 12;
    const monthlyRate = expected_return / 100 / 12;

    const futureValue =
      totalPrincipal *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const principalOverTime = totalPrincipal * months;
    const profit = futureValue - principalOverTime;

    res.json({
      expected_return,
      allocations,
      recommendations,
      total_principal: Math.round(principalOverTime),
      profit: Math.round(profit),
      future_value: Math.round(futureValue),
      total_invested: Math.round(totalPrincipal),
      uninvested_amount: Math.round(uninvested),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get recommendation" });
  }
});

// Use recommendation routes
app.use("/api", require("./routes/recommendationRoutes"));

// Use the user routes
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
