import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"
import { Link } from "react-router-dom"
import { formatNumber, formatShortAddress, formatTimestamp } from "utils/blockchain"
import IconCopy from 'assets/img/icons/copy.svg';
import { FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { MdCheck } from "react-icons/md";
import { showToastr } from "components/toastr";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import React, { act, useEffect } from "react";
import { supabase } from "lib/supabase";
import {checkPrice}  from "../../../components/cron/netlify";

export const CallRow = ({
  call
}: {
  call: any
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [confirmVote, setConfirmVote] = useState(0);
  const [ratioVote, setRatioVote] = useState(0);
  const [timelimit, setTimeLimit] = useState(false);
  const [featured, setFeatured] = useState(0);
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    if (localStorage.getItem(call.address + call.user_id) == "yes") { setConfirmVote(1) }
    if (localStorage.getItem(call.address + call.user_id) == "no") { setConfirmVote(2) }

      setTimeLimit(true);
      if (call.is_featured == true) {
        setFeatured(call.featured)
      }
    
    
  const voteratio = async () => {
    const { data, error } = await supabase
        .from("vote")
        .select("*")
        .match({ "call_name": call.address, user_id: call.user_id });
    if (error) {
        console.error("Fetch failed:", error);
        return; // Stop execution if there's an error
         }
    if (data.length > 0) {
      setRatioVote(data[0].ratio)
    } else {
       setRatioVote(0)
    }};
    voteratio(); 

    // Subscribe to real-time changes in the "calls" table
     }, []);

  const handleCopy = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCopied) return;
    setIsCopied(true);
    await navigator.clipboard.writeText(call.address);
    showToastr("Address copied to clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  }

  const handleVotelike =async (e: React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault();
     e.stopPropagation();
    localStorage.setItem(call.address + call.user_id, "yes")
    setConfirmVote(1)
    let v2 = [];
    const insertUser = async () => {
     const { data, error } = await supabase
        .from("vote")
        .select("*")
        .match({ "call_name": call.address, user_id: call.user_id });
    if (error) {
        console.error("Fetch failed:", error);
        return; // Stop execution if there's an error
        }
      if (data.length > 0) {
        v2 = data;
        setRatioVote(Math.ceil((v2[0].like_number+1)*100/((v2[0].like_number+1+v2[0].dislike_number))));
        const { error: updateError } = await supabase
           .from('vote')
           .delete()
           .match({ "call_name": call.address, user_id: call.user_id });
            if (updateError) {
            console.error("Update failed:", updateError);
            } else {
            console.log("delete vote successful");
           
            }
              const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: call.address,user_id: call.user_id, like_number: v2[0].like_number+1, dislike_number: v2[0].dislike_number, ratio:Math.ceil((v2[0].like_number+1)*100/((v2[0].like_number+1+v2[0].dislike_number))) }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                console.log("Insert successful");
                  setCounter(counter + 1);
              }  
      }
      else {
            const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: call.address,user_id: call.user_id, like_number: 1, dislike_number: 0, ratio:100 }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                setRatioVote(100)
                console.log("Insert successful");
                  setCounter(counter + 1);
              }
    }
    };
    insertUser();  
  }
  
  const handleVotedislike =async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
     e.stopPropagation();
    localStorage.setItem(call.address + call.user_id, "no")
    setConfirmVote(2)
    let v1 = [];
    const insertdislikeUser = async () => {
    const { data, error } = await supabase
        .from("vote")
        .select("*")
        .match({ "call_name": call.address, user_id: call.user_id });
    if (error) {
        console.error("Fetch failed:", error);
        return; }
      if (data.length > 0) {
        v1 = data;
       setRatioVote(Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))));
      const { error: updateError } = await supabase
          .from('vote')
          .delete()
           .match({ "call_name": call.address, user_id: call.user_id });
       if (updateError) {
            console.error("Update failed:", updateError);
        } else {
          console.log("delete successful");
       }
      const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: call.address,user_id: call.user_id, like_number: v1[0].like_number, dislike_number: v1[0].dislike_number+1, ratio:Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))) }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                console.log("Insert successful");
                  setCounter(counter + 1);
              }
        } else {
       
        const { error: insertError } = await supabase
            .from("vote")
            .insert([{ call_name: call.address,user_id: call.user_id, like_number: 0, dislike_number: 1, ratio:0 }]);
        if (insertError) {
            console.error("Insert failed:", insertError);
        } else {  setCounter(counter + 1);
          console.log("Insert successful");
          setRatioVote(0);
      }
       }
   };
    insertdislikeUser();
  }

  const handlekeep =async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCounter(counter + 1)
  }

  const profilepage =async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href=`/profile?id=${call.users.id}`;
  }

  const handleVotelikemobile =async (e: React.MouseEvent<HTMLDivElement>) => {
     e.preventDefault();
     e.stopPropagation();
    localStorage.setItem(call.address + call.user_id, "yes")
    setConfirmVote(1)
    let v2 = [];
    const insertUser = async () => {
     const { data, error } = await supabase
        .from("vote")
        .select("*")
        .match({ "call_name": call.address, user_id: call.user_id });
    if (error) {
        console.error("Fetch failed:", error);
        return; // Stop execution if there's an error
        }
      if (data.length > 0) {
        v2 = data;
        setRatioVote(Math.ceil((v2[0].like_number+1)*100/((v2[0].like_number+1+v2[0].dislike_number))));
        const { error: updateError } = await supabase
           .from('vote')
           .delete()
           .match({ "call_name": call.address, user_id: call.user_id });
            if (updateError) {
            console.error("Update failed:", updateError);
            } else {
            console.log("delete vote successful");
           
            }
              const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: call.address,user_id: call.user_id, like_number: v2[0].like_number+1, dislike_number: v2[0].dislike_number, ratio:Math.ceil((v2[0].like_number+1)*100/((v2[0].like_number+1+v2[0].dislike_number))) }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                console.log("Insert successful");
                  setCounter(counter + 1);
              }  
      }
      else {
            const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: call.address,user_id: call.user_id, like_number: 1, dislike_number: 0, ratio:100 }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                setRatioVote(100)
                console.log("Insert successful");
                  setCounter(counter + 1);
              }
    }
    };
    insertUser();  
  }
  
  const handleVotedislikemobile =async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
     e.stopPropagation();
    localStorage.setItem(call.address + call.user_id, "no")
    setConfirmVote(2)
    let v1 = [];
    const insertdislikeUser = async () => {
    const { data, error } = await supabase
        .from("vote")
        .select("*")
        .match({ "call_name": call.address, user_id: call.user_id });
    if (error) {
        console.error("Fetch failed:", error);
        return; }
      if (data.length > 0) {
        v1 = data;
       setRatioVote(Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))));
      const { error: updateError } = await supabase
          .from('vote')
          .delete()
           .match({ "call_name": call.address, user_id: call.user_id });
       if (updateError) {
            console.error("Update failed:", updateError);
        } else {
          console.log("delete successful");
       }
      const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: call.address,user_id: call.user_id, like_number: v1[0].like_number, dislike_number: v1[0].dislike_number+1, ratio:Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))) }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                console.log("Insert successful");
                  setCounter(counter + 1);
              }
        } else {
       
        const { error: insertError } = await supabase
            .from("vote")
            .insert([{ call_name: call.address,user_id: call.user_id, like_number: 0, dislike_number: 1, ratio:0 }]);
        if (insertError) {
            console.error("Insert failed:", insertError);
        } else {  setCounter(counter + 1);
          console.log("Insert successful");
          setRatioVote(0);
      }
       }
   };
    insertdislikeUser();
  }


  const gotoenpage = () => {
   window.location.href=`/token/${call.address}?id=${call.id} &user=${call.user_id}`; 
  }
  


  return <>
    <div className="bg-gray-50 p-1.5 pr-3 rounded sm:rounded-[40px] flex flex-col gap-2 sm:gap-3 cursor-pointer" onClick={gotoenpage}>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-wrap grow">
            <div className="flex grow gap-2 sm:gap-3 items-center">
              <img src={call.image} className="w-[44px] h-[44px] sm:w-16 sm:h-16 circle"/>
              <div className="grow space-y-1 sm:space-y-1.5">
                <div className="flex gap-1.5 sm:gap-2.5 items-center">
                <span className="text-sm sm:text-base font-bold">${call.symbol} </span>
                { 
                  featured > 1 ? <div>
                  <span className={`badge-multiplier-${featured}X`}></span> 
                  </div> :
                  <></>
                }
                  <div onClick={handleCopy} className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1 items-center">
                  <span>CA</span>
                    <span className="truncate text-gray-400">{formatShortAddress(call.address)}</span>
                    <button className="text-gray-400">{
                      !isCopied ? <img src={IconCopy} className="opacity-40"/>
                      : <span className='text-[#06cf9c]'><MdCheck size={16} /></span>
                    }</button>
                  </div>
                  <span className="text-sm text-gray-600">{formatTimestamp(call.updated_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1">
                    Marketcap {formatNumber(call.init_market_cap)} to {formatNumber(call.changedCap)}
                </div>
                  {
                    call.percentage==100?<></>:call.percentage>100?
                    <div className="bg-green-600 px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                      <AiFillCaretUp />
                      <span>{call.percentage}%</span>
                    </div> :
                    <div className="bg-red-400 px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                      <AiFillCaretDown />
                      <span>{call.percentage}%</span>
                    </div>
                  }
                </div>
              </div>
          </div>
          {/* <div className="hidden md:flex items-center gap-3 justify-between">
            Forum gives you good Luck
          </div> */}
            <div className="hidden md:flex items-center gap-3 justify-between">
              {
              call.users && 
              <Link to={`/profile?id=${call.users.id}`} key={call.id}>
                  <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs" onClick={profilepage}>
                    <span className={`badge-rank-${call.users.rank}`}></span>
                    <div>
                      <div className="text-gray-600">Caller</div>
                      <div className="font-bold text-sm">{call.users.name} <span className="text-xs text-gray-600">{call.users.winrate}%</span></div>
                    </div>
                </div>
               </Link>
              }
            
            {  confirmVote ==0?
              <div className="flex gap-1 items-center">
                <button className="circle-item w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]" onClick={handleVotelike}><AiFillCaretUp  />
                </button>
                <button className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" onClick={handleVotedislike} ><AiFillCaretDown />
                </button>
                <span className="text-xs text-gray-600">{ratioVote}%</span>
              </div> : <>
                { 
                  confirmVote == 1 ?
                   <div className="flex gap-1 items-center" onClick={handlekeep} >
                   <button className="circle-item w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]" ><FaThumbsUp className="w-3 h-3 text-green-500  cursor-pointer hover:scale-110 transition-transform" />
                   </button>
                    <button className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown />
                   </button>
                    <span className="text-xs text-gray-600">{ratioVote}%</span>
                    </div> :
                    
                    <div className="flex gap-1 items-center" onClick={handlekeep} >
                   <button className="circle-item w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]"><AiFillCaretUp />
                   </button>
                    <button className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><FaThumbsDown className="w-3 h-3 text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                   </button>
                    <span className="text-xs text-gray-600">{ratioVote}%</span>
                 </div>
                }
              </>
            }
          </div>
        </div>
        <Link to={`/token/${call.address}?id=${call.id} &user=${call.user_id}`} key={call.id}>
          <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item !hidden lg:!flex">
            <FaChevronRight />
          </button>
      </Link>
        </div>
        <div className="flex md:hidden items-center gap-1 sm:gap-3 justify-between">
          {
          call.users && 
          <Link to={`/profile?id=${call.users.id}`} key={call.id}>
            <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
              <span className={`badge-rank-${call.users.rank}`}></span>
              <div className="">
                <div className="text-gray-600">Caller</div>
                <div className="font-bold text-sm">{call.users.name} <span className="text-xs text-gray-600">{call.users.winrate}%</span></div>
              </div>
              </div>
          </Link>
        }
        {  confirmVote ==0?<><div className="border border-gray-100 rounded-full px-2.5 py-3.5 flex gap-1 items-center">
            <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]" onClick={handleVotelikemobile}><AiFillCaretUp  /></div>
            <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" onClick={handleVotedislikemobile}><AiFillCaretDown /></div>
            <span className="text-xs text-gray-600">{ratioVote}%</span>
        </div></> : <>
            { 
             confirmVote ==1?<><div className="border border-gray-100 rounded-full px-2.5 py-3.5 flex gap-1 items-center" onClick={handlekeep}>
            <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"  ><FaThumbsUp className="w-3 h-3 text-green-500  cursor-pointer hover:scale-110 transition-transform" /></div>
            <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" ><AiFillCaretDown /></div>
            <span className="text-xs text-gray-600">{ratioVote}%</span>
        </div></>:<><div className="border border-gray-100 rounded-full px-2.5 py-3.5 flex gap-1 items-center" onClick={handlekeep} >
            <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]" ><AiFillCaretUp  /></div>
            <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" ><FaThumbsDown className="w-3 h-3 text-red-500 cursor-pointer hover:scale-110 transition-transform" /></div>
            <span className="text-xs text-gray-600">{ratioVote}%</span>
        </div></>

            }
          
          </> 
        }
        </div>
      </div>
       </>

}