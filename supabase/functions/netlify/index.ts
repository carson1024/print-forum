import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: allusers, error: allusererror } = await supabase.from("users").select("*").order("created_at");
    allusers.map(async (user) => {
      const { data: owncalls, error: owncallerror } = await supabase.from("calls").select("*").order("created_at").eq("user_id", user.id);
      if (owncalls.length == 0) {
        const { error: updateweekrateError } = await supabase
          .from("users")
          .update({ weekrate: 0, monthrate: 0 })
          .eq("id", user.id);
        if (updateweekrateError) {
          return new Response(
            JSON.stringify({ success: false, error: updateweekrateError.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
      else {
        const monthcalls = owncalls.filter(call => new Date(call.created_at).getTime() + 2592000000 > Date.now());
        let winmonthcallcounts = monthcalls.filter(monthcall => monthcall.is_featured === true).length;
        let monthcallcounts = monthcalls.length;
        let monthrate = Math.ceil(winmonthcallcounts * 100 / monthcallcounts);
        const weekcalls = owncalls.filter(call => new Date(call.created_at).getTime() + 604800000 > Date.now());
        let winweekcallcounts = weekcalls.filter(weekcall => weekcall.is_featured === true).length;
        let weekcallcounts = weekcalls.length;
        let weekrate = Math.ceil(winweekcallcounts * 100 / weekcallcounts);
        const { error: updatemonthrateError } = await supabase
          .from("users")
          .update({ weekrate: weekrate, monthrate: monthrate })
          .eq("id", user.id);
        if (updatemonthrateError) {
          return new Response(
            JSON.stringify({ success: false, error: updatemonthrateError.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    })

    //winrate Update process
    const { data: users, error: usererror } = await supabase.from("users").select("*").order("created_at");
    users.map(async (user) => {
      let newrank = 1;
      if (20 <= user.xp && user.xp < 44) { newrank = 2 }
      if (44 <= user.xp && user.xp < 72) { newrank = 3 }
      if (72 <= user.xp && user.xp < 104) { newrank = 4 }
      if (104 <= user.xp && user.xp < 144) { newrank = 5 }
      if (144 <= user.xp && user.xp < 184) { newrank = 6 }
      if (184 <= user.xp && user.xp < 244) { newrank = 7 }
      if (244 <= user.xp && user.xp < 292) { newrank = 8 }
      if (292 <= user.xp && user.xp < 364) { newrank = 9 }
      if (364 <= user.xp) { newrank = 10 }
      const { data: owncalls, error: owncallerror } = await supabase.from("calls").select("*").order("created_at").eq("user_id", user.id);
      let counts = owncalls.length;
      let wincalls = (owncalls.filter(call => call.is_featured === true)).length
      if (newrank !== user.rank) {
        const { error: updatenotificationError } = await supabase
          .from("notifications")
          .insert({ user_id: user.id, type: "rankup", title: `Rank${newrank} reached`, value: `${newrank}`, content: `Congraturation! You reached to Rank${newrank}.` });
        if (updatenotificationError) {
          return new Response(
            JSON.stringify({ success: false, error: updatenotificationError.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        const { error: rankupdateError } = await supabase
          .from("users")
          .update({ rank: newrank })
          .eq("id", user.id);
        if (rankupdateError) {
          return new Response(
            JSON.stringify({ success: false, error: rankupdateError.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        //add achievements
        let achieve = [];
        achieve = user.achievements ? [...user.achievements] : [];
        achieve.push(`${newrank}x`);

        const { error: achieveerror } = await supabase
          .from("users")
          .update({ achievements: achieve })
          .eq("id", user.id);

      }

      if (wincalls > 0) {
        let winrate = wincalls * 100 / counts;
        let rounded = Math.ceil(winrate);
        const { error: updatewinError } = await supabase
          .from("users")
          .update({ winrate: rounded, callcount: counts, rank: newrank })
          .eq("id", user.id);
        if (updatewinError) {
          return new Response(
            JSON.stringify({ success: false, error: updatewinError.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
      else if (wincalls == 0) {
        const { error: updatewinrankError } = await supabase
          .from("users")
          .update({ winrate: 0, callcount: counts, rank: newrank })
          .eq("id", user.id);
        if (updatewinrankError) {
          return new Response(
            JSON.stringify({ success: false, error: updatewinrankError.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }


    })
    // Fetch all calls ordered by created_at
    const { data: calls, error } = await supabase.from("calls").select("*, users(*)").order("created_at");
    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!calls || calls.length === 0) return;
    const responses = await Promise.all(
      calls.map(call => fetch(`https://api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112,` + call.token_address))
    );
    const results = await Promise.all(responses.map(res => res.json()));
    for (const [index, resave] of results.entries()) {
      if (!resave?.data || resave.data.length === 0) continue;
      const tokenId = calls[index].token_address;
      const newPrice = resave.data[tokenId].price;
      const oldPrice = calls[index].price;
      const priceRatio = newPrice / oldPrice;
      const timelimit = new Date(calls[index].created_at).getTime() + 86400000 - Date.now()

      // Determine new `featured` value
      let newFeatured = 0;
      if (priceRatio >= 2 && priceRatio < 5) newFeatured = 2;
      else if (priceRatio >= 5 && priceRatio < 10) newFeatured = 5;
      else if (priceRatio >= 10 && priceRatio < 20) newFeatured = 10;
      else if (priceRatio >= 20 && priceRatio < 30) newFeatured = 20;
      else if (priceRatio >= 30 && priceRatio < 50) newFeatured = 30;
      else if (priceRatio >= 50 && priceRatio < 100) newFeatured = 50;
      else if (priceRatio >= 100 && priceRatio < 200) newFeatured = 100;
      else if (priceRatio >= 200 && priceRatio < 500) newFeatured = 200;
      else if (priceRatio >= 500 && priceRatio < 1000) newFeatured = 500;
      else if (priceRatio >= 1000) newFeatured = 1000;

      const { data: featureduser, error: featuredusererror } = await supabase.from("users").select("*").eq("id", calls[index].user_id).order("created_at");
      const newxp = featureduser[0].xp;
      if (calls[index].xpCheck == 0 && timelimit >= 0 && calls[index].featured < newFeatured) {
        // Update the call record
        const newaddxp = 0;
        if (newFeatured == 2) { newaddxp = 8; }
        else if (newFeatured == 5) { newaddxp = 10; }
        else if (newFeatured >= 10) { newaddxp = 12; }
        const { error: userinfoerror } = await supabase
          .from("calls")
          .update({ changedPrice: newPrice, addXP: newaddxp, changedCap: newPrice * calls[index].supply / (Math.pow(10, calls[index].decimals)), is_featured: true, featured: newFeatured, percentage: Math.ceil(100 * (newPrice * calls[index].supply / (Math.pow(10, calls[index].decimals))) / (calls[index].init_market_cap)) })
          .eq("id", calls[index].id);
        if (userinfoerror) {
          return new Response(
            JSON.stringify({ success: false, error: userinfoerror.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        if (newFeatured == 2) { newxp += 8; }
        else if (newFeatured == 5) { newxp += 10; }
        else if (newFeatured >= 10) { newxp += 12; }
        const { error: newxperror } = await supabase
          .from("users")
          .update({ xp: newxp })
          .eq("id", calls[index].user_id);
        if (newxperror) {
          return new Response(
            JSON.stringify({ success: false, error: newxperror.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      else if (priceRatio <= 0.2 && calls[index].xpCheck == 0 && timelimit >= 0 && calls[index].is_featured == false) {
        const fallxp = newxp - 6;
        if (fallxp < 0) { fallxp = 0; }
        const { error: fallxperror } = await supabase
          .from("users")
          .update({ xp: fallxp })
          .eq("id", calls[index].user_id);
        if (fallxperror) {
          return new Response(
            JSON.stringify({ success: false, error: fallxperror.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        const { error: badstateerror } = await supabase
          .from("calls")
          .update({ xpCheck: 1, addXP: -6, changedPrice: newPrice, changedCap: newPrice * calls[index].supply / (Math.pow(10, calls[index].decimals)), percentage: Math.ceil(100 * (newPrice * calls[index].supply / (Math.pow(10, calls[index].decimals))) / (calls[index].init_market_cap)) })
          .eq("id", calls[index].id);
        if (badstateerror) {
          return new Response(
            JSON.stringify({ success: false, error: badstateerror.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
      else {
        // Update the call record
        const { error: normallerror } = await supabase
          .from("calls")
          .update({ changedPrice: newPrice, changedCap: newPrice * calls[index].supply / (Math.pow(10, calls[index].decimals)), percentage: Math.ceil(100 * (newPrice * calls[index].supply / (Math.pow(10, calls[index].decimals))) / (calls[index].init_market_cap)) })
          .eq("id", calls[index].id);
        if (normallerror) {
          return new Response(
            JSON.stringify({ success: false, error: normallerror.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    //timeout handle
    calls.map(async (call, index) => {
      const time = new Date(call.created_at).getTime() + 86400000 - Date.now();
      let xpmark = call.users.xp;

      if (call.xpCheck == 0 && time < 0 && call.featured == 1) {
        const { error: callxperror } = await supabase
          .from("calls")
          .update({ addXP: -6, xpCheck: 1 })
          .eq("id", call.id);
        if (callxperror) {
          return new Response(
            JSON.stringify({ success: false, error: callxperror.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
        xpmark -= 6;
        if (xpmark < 0) { xpmark = 0; }
        const { error: updateError1 } = await supabase
          .from("users")
          .update({ xp: xpmark })
          .eq("id", call.user_id);
        if (updateError1) {
          return new Response(
            JSON.stringify({ success: false, error: updateError1.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
      else if (call.xpCheck == 0 && time < 0 && call.featured !== 1) {
        const { error: callxperror } = await supabase
          .from("calls")
          .update({ xpCheck: 1 })
          .eq("id", call.id);
        if (callxperror) {
          return new Response(
            JSON.stringify({ success: false, error: callxperror.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }

    })

    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: "Hello, World!" }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    // Handle unexpected errors
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});