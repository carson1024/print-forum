import { supabase } from "lib/supabase";

export const checkPrice = async () => {
  try {
    //update the weeklt and monthly winrate
     const { data: allusers, error: allusererror } = await supabase.from("users").select("*").order("created_at");
     allusers.map(async (user) => { 
       const { data: owncalls, error: owncallerror } = await supabase.from("calls").select("*").order("created_at").eq("user_id", user.id);
       if (owncalls.length == 0) {
        const { error: updatewinrateError } = await supabase
          .from("users")
          .update({ weekrate: 0, monthrate: 0 })
          .eq("id", user.id);
        if (updatewinrateError) {
          console.error("Update failed:", updatewinrateError);
        } else {
          console.log("weekrateUpdate successful");
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
        const { error: updatewinrateError } = await supabase
          .from("users")
          .update({ weekrate: weekrate, monthrate: monthrate })
          .eq("id", user.id);
        if (updatewinrateError) {
          console.error("Update failed:", updatewinrateError);
        } else {
          console.log("weekrateUpdate successful");
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
      if (364 <= user.xp ) { newrank = 10 }
      const { data: owncalls, error: owncallerror } = await supabase.from("calls").select("*").order("created_at").eq("user_id", user.id);
      let counts = owncalls.length;
      let wincalls = (owncalls.filter(call => call.is_featured === true)).length
      if (newrank !== user.rank) { 
        const { error: updatenotificationError } = await supabase
          .from("notifications")
          .insert({ user_id: user.id, type: "rankup", title: `Rank${newrank} reached`,value:`${newrank}`,content:`Congraturation! You reached to Rank${newrank}.` });
        if (updatenotificationError) {
          console.error("Update failed:", updatenotificationError);
        } 
        const { error: updateError } = await supabase
          .from("users")
          .update({rank:newrank })
          .eq("id", user.id);
        if (updateError) {
          console.error("Update failed:", updateError);
        } else {
          console.log("winrateUpdate successful");
        }
      }

      if (wincalls > 0) {
        let winrate = wincalls * 100 / counts;
        let rounded = Math.ceil(winrate);
        const { error: updatewinrateError } = await supabase
          .from("users")
          .update({ winrate: rounded,callcount:counts,rank:newrank })
          .eq("id", user.id);
        if (updatewinrateError) {
          console.error("Update failed:", updatewinrateError);
        } else {
          console.log("winrateUpdate successful");
        }
      }
       else if(wincalls == 0) {
        const { error: updatewinrateError } = await supabase
          .from("users")
          .update({ callcount:counts,rank:newrank })
          .eq("id", user.id);
        if (updatewinrateError) {
          console.error("Update failed:", updatewinrateError);
        } else {
          console.log("winrateUpdate successful");
        }
      }


    })
    // Fetch all calls ordered by created_at
    const { data: calls, error } = await supabase.from("calls").select("*, users(*)").order("created_at");
    if (error) {
      console.error("Error fetching data:", error);
      return 0;
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
    if (timelimit>=0 && calls[index].featured < newFeatured) {
        // Update the call record
    const { error: updateError } = await supabase
      .from("calls")
      .update({ changedPrice:newPrice, changedCap: newPrice * calls[index].supply / (Math.pow(10,calls[index].decimals)), is_featured: true, featured: newFeatured,percentage:Math.ceil(100 * (newPrice * calls[index].supply / (Math.pow(10,calls[index].decimals)))/(calls[index].init_market_cap) )})
      .eq("id", calls[index].id);
       if (updateError) {
          console.error("Update failed:", updateError);
        } else {
          console.log("Update successful");
        }
      }
    else {
        // Update the call record
        const { error: updateError } = await supabase
          .from("calls")
          .update({changedPrice:newPrice, changedCap: newPrice * calls[index].supply / (Math.pow(10,calls[index].decimals)), percentage:Math.ceil(100 * (newPrice * calls[index].supply / (Math.pow(10,calls[index].decimals)))/(calls[index].init_market_cap))})
          .eq("id", calls[index].id);
        if (updateError) {
            console.error("Update failed:", updateError);
        } else {
          console.log("Update successful");
        }
        }
    }
    calls.map(async(call, index) => {
      const time = new Date(call.created_at).getTime() + 86400000 - Date.now();    
      let xpmark = call.users.xp;
      if (call.xpCheck == 0 && time < 0) {
        if (call.featured == 2) {
          xpmark += 8;
          const { error: updateError } = await supabase
            .from("calls")
            .update({ addXP: 8 })
            .eq("id", call.id);
          if (updateError) {
            console.error("Update failed:", updateError);
          } else {
            console.log("Update successful");
          }
        }
        else if (call.featured == 5) {
          xpmark += 10;
          const { error: updateError } = await supabase
            .from("calls")
            .update({ addXP: 10 })
            .eq("id", call.id);
          if (updateError) {
            console.error("Update failed:", updateError);
          } else {
            console.log("Update successful");
          }
        }
        else if (call.featured >= 10) {
          xpmark += 12;
          const { error: updateError } = await supabase
            .from("calls")
            .update({ addXP: 12 })
            .eq("id", call.id);
          if (updateError) {
            console.error("Update failed:", updateError);
          } else {
            console.log("Update successful");        
          }
        }
        else if (call.featured == 1) {
          xpmark -= 6;
          const { error: updateError } = await supabase
            .from("calls")
            .update({ addXP: -6 })
            .eq("id", call.id);
          if (updateError) {
            console.error("Update failed:", updateError);
          } else {
            console.log("Update successful");        
          }
        }
        if (xpmark < 0) { xpmark = 0; }
        const { error: updateError } = await supabase
          .from("calls")
          .update({ xpCheck: 1 })
          .eq("id", call.id);
        if (updateError) {
          console.error("Update failed:", updateError);
        } else {
          console.log("Update successful");
        }    
        const { error: updateError1 } = await supabase
          .from("users")
          .update({ xp: xpmark })
          .eq("id", call.user_id);
        if (updateError1) {
          console.error("Update failed:", updateError1);
        } else {
          console.log("Update successful");
        }
      }
    })
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};