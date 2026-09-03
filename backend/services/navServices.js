const axios = require("axios");
const { navCache, getOrFetch } = require("./cacheService");

async function getMutualFundNAV(amfiCode) {
  return getOrFetch(navCache, `nav:${amfiCode}`, async () => {
    try {
      const url = "https://api.mfapi.in/mf/" + amfiCode;
      const res = await axios.get(url, { timeout: 6000 });

      return parseFloat(res.data?.data?.[0]?.nav);
    } catch (err) {
      console.error("NAV fetch failed:", amfiCode, err.message);
      return null;
    }
  });
}

module.exports = { getMutualFundNAV };
