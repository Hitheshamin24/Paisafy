const axios = require("axios");

const getStockPrice = async (symbol) => {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;

    const res = await axios.get(url, {
      headers: {
        // 👇 THIS IS THE MAGIC FIX
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const price =
      res.data?.chart?.result?.[0]?.meta?.regularMarketPrice;

    return price ?? null;
  } catch (err) {
    console.error(`Price fetch failed for ${symbol}`);
    return null;
  }
};

module.exports = { getStockPrice };
