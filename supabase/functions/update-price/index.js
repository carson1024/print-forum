import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    console.log("Starting call price updates...");

    // Only handle call price updates
    await updateCallPrices(supabase);

    console.log("Call price updates completed successfully");

    return new Response(JSON.stringify({
      success: true,
      message: "Call price updates completed",
      timestamp: new Date().toISOString()
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error in call price updates:", err);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal Server Error",
      details: err.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});

async function updateCallPrices(supabase) {
  console.log("Processing call price updates...");
  
  // Only fetch calls that are recent or still unprocessed to keep volume small
  const { data: calls, error } = await supabase
    .from("calls")
    .select("id,user_id,token_address,price,changed_price,created_at,xp_check,is_featured,featured,percentage,init_market_cap,supply,decimals")
    .gte("created_at", new Date(Date.now() - 36 * 3600 * 1000).toISOString()); // last 36h

  if (error) throw new Error(`Failed to fetch calls: ${error.message}`);
  if (!calls?.length) { console.log("No calls to process"); return; }

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
      const prices = await fetchJsonWithRetry(url, 2);
      if (prices?.data) {
        Object.assign(priceMap, prices.data);
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
    const newPrice = priceMap[call.token_address]?.price;
    if (!newPrice || !call.price) continue;

    const priceRatio = newPrice / call.price;
    const timeRemaining = new Date(call.created_at).getTime() + DAY_MS - now;

    // Derived fields
    const changed_cap = (newPrice * call.supply) / Math.pow(10, call.decimals);
    const percentage = Math.ceil(100 * (changed_cap / call.init_market_cap));

    // Decide featured status & XP effects
    const newFeatured = calculateFeaturedValue(priceRatio);
    let callPatch = { id: call.id, changed_price: newPrice, changed_cap, percentage };
    let xpDelta = 0;
    let needXpCheck = false;

    // Featured gain within 24h, not yet checked, and strictly higher multiplier
    if (call.xp_check === 0 && timeRemaining >= 0 && call.featured < newFeatured) {
      xpDelta = calculateXpReward(newFeatured);
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
    const { error: upErr } = await supabase.from('calls').upsert(callUpdates, { onConflict: 'id', ignoreDuplicates: false });
    if (upErr) throw new Error(`Bulk calls upsert failed: ${upErr.message}`);
  }

  if (userDeltaMap.size) {
    const items = Array.from(userDeltaMap, ([user_id, delta]) => ({ user_id, delta }));
    const { error: xpErr } = await supabase.rpc('bulk_adjust_user_xp', { items });
    if (xpErr) throw new Error(`bulk_adjust_user_xp failed: ${xpErr.message}`);
  }

  console.log(`Call prices updated. Calls touched: ${callUpdates.length}, Users adjusted: ${userDeltaMap.size}`);
}

function calculateFeaturedValue(priceRatio) {
  if (priceRatio >= 1000) return 1000;
  if (priceRatio >= 500) return 500;
  if (priceRatio >= 200) return 200;
  if (priceRatio >= 100) return 100;
  if (priceRatio >= 50) return 50;
  if (priceRatio >= 30) return 30;
  if (priceRatio >= 20) return 20;
  if (priceRatio >= 10) return 10;
  if (priceRatio >= 5) return 5;
  if (priceRatio >= 2) return 2;
  return 0;
}

function calculateXpReward(featuredValue) {
  if (featuredValue >= 10) return 12;
  if (featuredValue === 5) return 10;
  if (featuredValue === 2) return 8;
  return 0;
}

/**
 * Fetch JSON with retry logic for external API calls
 */
async function fetchJsonWithRetry(url, retries = 2) {
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
