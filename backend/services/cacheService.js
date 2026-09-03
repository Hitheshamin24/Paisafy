const NodeCache = require("node-cache");

// Stock prices expire after 15 min, NAV after 60 min (published once a day by AMFI)
const priceCache = new NodeCache({ stdTTL: 900, checkperiod: 120 });
const navCache = new NodeCache({ stdTTL: 3600, checkperiod: 300 });

async function getOrFetch(cache, key, fetchFn) {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const value = await fetchFn();

  // Only store successful results — don't let a transient failure poison the cache
  if (value !== null && value !== undefined) {
    cache.set(key, value);
  }

  return value;
}

function getCacheStats() {
  return {
    prices: {
      keys: priceCache.keys().length,
      hits: priceCache.getStats().hits,
      misses: priceCache.getStats().misses,
    },
    nav: {
      keys: navCache.keys().length,
      hits: navCache.getStats().hits,
      misses: navCache.getStats().misses,
    },
  };
}

module.exports = { priceCache, navCache, getOrFetch, getCacheStats };
