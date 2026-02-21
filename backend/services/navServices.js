const axios = require("axios");

async function getMutualFundNAV(amfiCode) {
  try {
    const url = "https://api.mfapi.in/mf/" + amfiCode;
    const res = await axios.get(url, { timeout: 6000 });

    // console.log("NAV API:", amfiCode, res.data?.data?.[0]);

    return parseFloat(res.data?.data?.[0]?.nav);
  } catch (err) {
    console.error("NAV fetch failed:", amfiCode, err.message);
    return null;
  }
}

module.exports = { getMutualFundNAV };
