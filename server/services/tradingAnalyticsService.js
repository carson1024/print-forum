const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

class TradingAnalyticsService {
  constructor() {
    this.supabase = createClient(
      config.database.url,
      config.database.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  /**
   * Main processing function that runs every 30 seconds
   * Optimized to use database RPCs for most operations
   */
  async processTradingAnalytics() {
    try {
      console.log('Starting trading analytics processing...');

      // Run DB-side tasks in parallel (independent)
      await Promise.all([
        this.updateUserWinRates(),      // week/month/total
        this.updateRanksFromXp(),       // rank + notifications + achievements
        this.handleTimeoutPenalties(),  // expired calls
      ]);

      // Prices depend on external API; keep separate
      await this.updateCallPrices();

      console.log('Trading analytics processing completed');
    } catch (error) {
      console.error('Error in trading analytics processing:', error);
      throw error;
    }
  }

  // --- DB-side RPCs (O(1) round-trip each) ---

  /**
   * Update user win rates using database function
   */
  async updateUserWinRates() {
    const { error } = await this.supabase.rpc('update_user_win_rates');
    if (error) throw new Error(`update_user_win_rates failed: ${error.message}`);
  }

  /**
   * Update user rankings using database function
   */
  async updateRanksFromXp() {
    const { error } = await this.supabase.rpc('update_ranks_from_xp');
    if (error) throw new Error(`update_ranks_from_xp failed: ${error.message}`);
  }

  /**
   * Handle timeout penalties using database function
   */
  async handleTimeoutPenalties() {
    const { error } = await this.supabase.rpc('apply_timeout_penalties');
    if (error) throw new Error(`apply_timeout_penalties failed: ${error.message}`);
  }

  // --- Price & featured processing (batched) ---

  /**
   * Update call prices and featured status with optimized batching
   */
  async updateCallPrices() {
    console.log('Updating call prices...');

    // Only fetch calls that are recent or still unprocessed to keep volume small
    const { data: calls, error } = await this.supabase
      .from('calls')
      .select('id,user_id,token_address,price,changed_price,created_at,xp_check,is_featured,featured,percentage,init_market_cap,supply,decimals')
      .gte('created_at', new Date(Date.now() - 36 * 3600 * 1000).toISOString()); // last 36h

    if (error) throw new Error(`Failed to fetch calls: ${error.message}`);
    if (!calls?.length) { console.log('No calls to process'); return; }

    // Build unique token list (include SOL id for reference if you need it)
    const uniqTokens = Array.from(new Set(calls.map(c => c.token_address))).filter(Boolean);
    if (!uniqTokens.length) return;

    // Batch Jupiter price queries in chunks of 50 tokens (API limit)
    const BATCH_SIZE = 50;
    const priceMap = {};
    
    // Always include SOL as reference
    const allTokens = ['So11111111111111111111111111111111111111112', ...uniqTokens];
    
    for (let i = 0; i < allTokens.length; i += BATCH_SIZE) {
      const batch = allTokens.slice(i, i + BATCH_SIZE);
      const idsParam = encodeURIComponent(batch.join(','));
      const url = `https://lite-api.jup.ag/price/v3?ids=${idsParam}`;

      try {
        // Basic retry for transient failures
        const prices = await this.fetchJsonWithRetry(url, 2);
        if (prices) {
          Object.assign(priceMap, prices);
        }
      } catch (error) {
        console.error(`Failed to fetch prices for batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error);
        // Continue with other batches even if one fails
      }
    }

    // Prepare bulk updates
    const callUpdates = [];
    const userDeltaMap = new Map(); // user_id -> xp delta

    const DAY_MS = 86_400_000;
    const now = Date.now();

    for (const call of calls) {
      const newPrice = priceMap[call.token_address]?.usdPrice;
      if (!newPrice || !call.price) continue;
      
      const priceRatio = newPrice / call.price;
      const timeRemaining = new Date(call.created_at).getTime() + DAY_MS - now;

      // Derived fields
      const changed_cap = (newPrice * call.supply) / Math.pow(10, call.decimals);
      const percentage = Math.ceil(100 * (changed_cap / call.init_market_cap));

      // Decide featured status & XP effects
      const newFeatured = this.calculateFeaturedValue(priceRatio);
      // Include NOT NULL columns to avoid constraint violations if an upsert results in an INSERT
      let callPatch = {
        id: call.id,
        user_id: call.user_id,
        token_address: call.token_address,
        price: call.price,
        supply: call.supply,
        decimals: call.decimals,
        init_market_cap: call.init_market_cap,
        changed_price: newPrice,
        changed_cap,
        percentage,
      };
      let xpDelta = 0;
      let needXpCheck = false;

      // Featured gain within 24h, not yet checked, and strictly higher multiplier
      if (call.xp_check === 0 && timeRemaining >= 0 && call.featured < newFeatured) {
        xpDelta = this.calculateXpReward(newFeatured);
        needXpCheck = true;
        Object.assign(callPatch, {
          add_xp: xpDelta,
          is_featured: true,
          featured: newFeatured,
          xp_check: 1, // mark consumed so we don't double-count
        });
      }
      // Sharp price drop (<= 20x of original price? your rule says <= 0.2x)
      else if (priceRatio <= 0.2 && call.xp_check === 0 && timeRemaining >= 0 && call.is_featured === false) {
        xpDelta = -6;
        needXpCheck = true;
        Object.assign(callPatch, {
          add_xp: -6,
          xp_check: 1,
        });
      }

      callUpdates.push(callPatch);

      if (needXpCheck && xpDelta !== 0) {
        userDeltaMap.set(call.user_id, (userDeltaMap.get(call.user_id) || 0) + xpDelta);
      }
    }

    if (callUpdates.length) {
      // Bulk update calls (upsert updates only specified fields when PK matches)
      const { error: upErr } = await this.supabase.from('calls').upsert(callUpdates, { onConflict: 'id', ignoreDuplicates: false });
      if (upErr) throw new Error(`Bulk calls upsert failed: ${upErr.message}`);
    }

    if (userDeltaMap.size) {
      const items = Array.from(userDeltaMap, ([user_id, delta]) => ({ user_id, delta }));
      const { error: xpErr } = await this.supabase.rpc('bulk_adjust_user_xp', { items });
      if (xpErr) throw new Error(`bulk_adjust_user_xp failed: ${xpErr.message}`);
    }

    console.log(`Call prices updated. Calls touched: ${callUpdates.length}, Users adjusted: ${userDeltaMap.size}`);
  }

  // ---- Helpers ----

  /**
   * Calculate featured value based on price ratio
   */
  calculateFeaturedValue(priceRatio) {
    if (priceRatio >= 1000) return 1000;
    if (priceRatio >= 500)  return 500;
    if (priceRatio >= 200)  return 200;
    if (priceRatio >= 100)  return 100;
    if (priceRatio >= 50)   return 50;
    if (priceRatio >= 30)   return 30;
    if (priceRatio >= 20)   return 20;
    if (priceRatio >= 10)   return 10;
    if (priceRatio >= 5)    return 5;
    if (priceRatio >= 2)    return 2;
    return 0;
  }

  /**
   * Calculate XP reward based on featured value
   */
  calculateXpReward(featuredValue) {
    if (featuredValue >= 10) return 12;
    if (featuredValue === 5) return 10;
    if (featuredValue === 2) return 8;
    return 0;
  }

  /**
   * Fetch JSON with retry logic for external API calls
   */
  async fetchJsonWithRetry(url, retries = 2) {
    let lastErr;
    for (let i = 0; i <= retries; i++) {
      try {
        const res = await fetch(url, { timeout: 10_000 });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (e) {
        lastErr = e;
        if (i < retries) await new Promise(r => setTimeout(r, 300 * (i + 1)));
      }
    }
    throw lastErr;
  }
}

module.exports = TradingAnalyticsService;
