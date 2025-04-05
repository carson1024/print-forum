import React, { useEffect, useState } from "react";
import ForumLayout from "./layout"
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import Token from 'assets/img/sample/token.png';
import IconCopy from 'assets/img/icons/copy.svg';
import IconSend from 'assets/img/icons/send.svg';
import IconDiscussion from 'assets/img/icons/discussion.svg';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dexscreener from 'assets/img/sample/dexscreener.png';
import Photon from 'assets/img/sample/photon.png';
import { FaExternalLinkAlt } from "react-icons/fa";
import IconUser from 'assets/img/icons/user.svg';
import { TopHolderType } from "components/modal/CallModal";
import { checkCall, formatNumber, formatShortAddress, formatTimestamp } from "utils/blockchain";
import { SkeletonList, SkeletonRow } from "components/skeleton/forum";
import { MdCheck } from "react-icons/md";
import { CallReportType } from "types/calls";
import { SkeletonDiscussionList } from "components/skeleton/discussion";
import { showToastr } from "components/toastr";
import { supabase } from "lib/supabase";
import { useAuth } from "contexts/AuthContext";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { getRankChar } from "../../utils/style";
import { useSearchParams } from "react-router-dom";

const TokenDetail = () => {
  const { isLogin,session } = useAuth();
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
  const [isDiscussionOpen, setDiscussionOpen] = useState(false);
  const [top3Holders, setTop3Holders] = useState<TopHolderType[]>([]);
  const [top10HolderInfo, setTop10HolderInfo] = useState<TopHolderType>({ pct: 0, uiAmount: 0 });
  const [callersCount, setCallersCount] = useState(0);
  const [callReport, setCallReport] = useState<CallReportType | null>(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
   const [xLoading, setXLoading] = useState(true);
  const [topCallers, setTopCallers] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [sitem, setSitem] = useState([]);
  const [scall, setScall] = useState([]);
  const [me, setMe] = useState([]);
  const [confirmVote, setConfirmVote] = useState(0);
  const [ratioVote, setRatioVote] = useState(0);
  const [paddress, setPaddress] = useState('');  
  const [myid, setMyid] = useState('');  
  const [comment, setComment] = useState('');  
  const [commentstore, setCommentstore] = useState('');  
  const [added, setAdded] = useState(false);
  const [preshow, setPreshow] = useState(false);
  const handleCopy = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCopied) return;
    setIsCopied(true);
    await navigator.clipboard.writeText(callReport.pairAddress);
    showToastr("Address copied to clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  }

  useEffect(() => {
    if (isLogin) {
      if (!session) {
        return;
      }
      else {
        setIsLoading(true);
        const fetchCall = async () => {
          const pairAddress = location.pathname.substring(location.pathname.lastIndexOf('/') + 1).split('?')[0];
          const params = new URLSearchParams(window.location.search);
          const id = params.get("id");
          const myuser = params.get("user");
          if (localStorage.getItem(pairAddress + myuser) == "yes") { setConfirmVote(1) }
          if (localStorage.getItem(pairAddress + myuser) == "no") { setConfirmVote(2) }
          if (isLogin) {
            if (!session.user) return;
            else setMyid(session.user.id);
          }

          if (isLogin) {
            setXLoading(true);
            const { data: mine, error: findmine } = await supabase
              .from("users")
              .select("*")
              .eq("id", myid)
              .order("created_at", { ascending: false });
            if (findmine) {
              console.error("Error fetching calls:", findmine.message);
            } else {
              setMe(mine)
            }
            setXLoading(false);
          }
      


          const { data: ratio, error: ratioerror } = await supabase
            .from("vote")
            .select("*")
            .match({ "call_name": pairAddress, user_id: myuser });
          if (ratioerror) {
            console.error("Fetch failed:", ratioerror);
            return; // Stop execution if there's an error
          }
          if (ratio.length > 0) {
            setRatioVote(ratio[0].ratio)
          } else {
            setRatioVote(0)
          };

          setUserid(myuser);
          setPaddress(pairAddress)
          let result = await checkCall(pairAddress);
          if (!result) {
            console.log("Invalid CA", pairAddress);
            return;
          }

          const { data, error } = await supabase
            .from("callers")
            .select("user_id, created_at, users(*)")
            .eq("address", pairAddress)
            .order("created_at", { ascending: false });
          if (error) {
            console.error("Error fetching calls:", error.message);
          } else {
            setCallersCount(data.length);
            const uniqueCallers = Array.from(new Map(data.map(item => [item.user_id, item])).values());
            setTopCallers(uniqueCallers);
          }

          const { error: saveerror } = await supabase
            .from("calls")
            .update({ supply: result.token.supply })
            .eq("address", pairAddress);
          if (saveerror) {
            console.error("Error fetching calls:", error.message);
          } else {
            console.log("upgrade supply seccessful")
          }
    
          const { data: item, error: itemerror } = await supabase
            .from("calls")
            .select("*")
            .eq("id", id)
            .order("created_at", { ascending: false });
          if (itemerror) {
            console.error("Error fetching calls:", itemerror.message);
          } else {
            setSitem(item);
          }

          const { data: findcall, error: findcallerror } = await supabase
            .from("calls")
            .select("*, users(*)")
            .eq("address", pairAddress)
            .order("created_at", { ascending: false });
          if (findcallerror) {
            console.error("Error fetching calls:", error.message);
          } else {
            setScall(findcall)
          }

          const { data: findcomment, error: commenterror } = await supabase
            .from("comments")
            .select("*, users(*)")
            .eq("address", pairAddress)
            .order("created_at", { ascending: false });
          if (commenterror) {
            console.error("Error fetching calls:", error.message);
          } else {
            setDiscussions(findcomment)
            
              let mycomment = (findcomment.filter(com => com.user_id === myid)).length
              if (mycomment > 0) {
                setAdded(true)
              }
            
          }


          let _top3Holders: TopHolderType[] = [];
          let _top10HolderInfo: TopHolderType = { pct: 0, uiAmount: 0 };
          result.topHolders.map((holder, index) => {
            if (index < 3) {
              _top3Holders.push(holder);
            }
            if (index < 10) {
              _top10HolderInfo.pct += holder.pct;
              _top10HolderInfo.uiAmount += holder.uiAmount;
            }
          });
          setCallReport(result);
          setTop3Holders(_top3Holders);
          setTop10HolderInfo(_top10HolderInfo);
          setIsLoading(false);
        }
        fetchCall();
      }
    }
    else { 
       setIsLoading(true);
        const fetchCall = async () => {
          const pairAddress = location.pathname.substring(location.pathname.lastIndexOf('/') + 1).split('?')[0];
          const params = new URLSearchParams(window.location.search);
          const id = params.get("id");
          const myuser = params.get("user");
          if (localStorage.getItem(pairAddress + myuser) == "yes") { setConfirmVote(1) }
          if (localStorage.getItem(pairAddress + myuser) == "no") { setConfirmVote(2) }
      
          const { data: ratio, error: ratioerror } = await supabase
            .from("vote")
            .select("*")
            .match({ "call_name": pairAddress, user_id: myuser });
          if (ratioerror) {
            console.error("Fetch failed:", ratioerror);
            return; // Stop execution if there's an error
          }
          if (ratio.length > 0) {
            setRatioVote(ratio[0].ratio)
          } else {
            setRatioVote(0)
          };

          setUserid(myuser);
          setPaddress(pairAddress)
          let result = await checkCall(pairAddress);
          if (!result) {
            console.log("Invalid CA", pairAddress);
            return;
          }

          const { data, error } = await supabase
            .from("callers")
            .select("user_id, created_at, users(*)")
            .eq("address", pairAddress)
            .order("created_at", { ascending: false });
          if (error) {
            console.error("Error fetching calls:", error.message);
          } else {
            setCallersCount(data.length);
            const uniqueCallers = Array.from(new Map(data.map(item => [item.user_id, item])).values());
            setTopCallers(uniqueCallers);
          }

          const { error: saveerror } = await supabase
            .from("calls")
            .update({ supply: result.token.supply })
            .eq("address", pairAddress);
          if (saveerror) {
            console.error("Error fetching calls:", error.message);
          } else {
            console.log("upgrade supply seccessful")
          }
    
          const { data: item, error: itemerror } = await supabase
            .from("calls")
            .select("*")
            .eq("id", id)
            .order("created_at", { ascending: false });
          if (itemerror) {
            console.error("Error fetching calls:", itemerror.message);
          } else {
            setSitem(item);
          }

          const { data: findcall, error: findcallerror } = await supabase
            .from("calls")
            .select("*, users(*)")
            .eq("address", pairAddress)
            .order("created_at", { ascending: false });
          if (findcallerror) {
            console.error("Error fetching calls:", error.message);
          } else {
            setScall(findcall)
          }

          const { data: findcomment, error: commenterror } = await supabase
            .from("comments")
            .select("*, users(*)")
            .eq("address", pairAddress)
            .order("created_at", { ascending: false });
          if (commenterror) {
            console.error("Error fetching calls:", error.message);
          } else {
            setDiscussions(findcomment)
      
            
          }


          let _top3Holders: TopHolderType[] = [];
          let _top10HolderInfo: TopHolderType = { pct: 0, uiAmount: 0 };
          result.topHolders.map((holder, index) => {
            if (index < 3) {
              _top3Holders.push(holder);
            }
            if (index < 10) {
              _top10HolderInfo.pct += holder.pct;
              _top10HolderInfo.uiAmount += holder.uiAmount;
            }
          });
          setCallReport(result);
          setTop3Holders(_top3Holders);
          setTop10HolderInfo(_top10HolderInfo);
          setIsLoading(false);
        }
        fetchCall();



    }
  }, [session]);

   const handleVotelike = () => {
      localStorage.setItem(paddress + sitem[0].user_id, "yes")
     setConfirmVote(1)
    let v2 = [];
    const insertUser = async () => {
     const { data, error } = await supabase
        .from("vote")
        .select("*")
        .match({ "call_name": paddress, user_id: sitem[0].user_id });
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
           .match({ "call_name": paddress, user_id: sitem[0].user_id });
            if (updateError) {
            console.error("Update failed:", updateError);
            } else {
            console.log("delete vote successful");
           
            }
              const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: paddress,user_id: sitem[0].user_id, like_number: v2[0].like_number+1, dislike_number: v2[0].dislike_number, ratio:Math.ceil((v2[0].like_number+1)*100/((v2[0].like_number+1+v2[0].dislike_number))) }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                console.log("Insert successful");
              }  
      }
      else {
            const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: paddress,user_id: sitem[0].user_id, like_number: 1, dislike_number: 0, ratio:100 }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                setRatioVote(100)
                console.log("Insert successful");
              }
    }
    };
    insertUser();  
    }
    
    const handleVotedislike = () => {
      localStorage.setItem(paddress + sitem[0].user_id, "no")
       setConfirmVote(2)
     let v1 = [];
     const insertdislikeUser = async () => {
     const { data, error } = await supabase
         .from("vote")
         .select("*")
         .match({ "call_name": paddress, user_id: sitem[0].user_id });
     if (error) {
         console.error("Fetch failed:", error);
         return; }
       if (data.length > 0) {
         v1 = data;
        setRatioVote(Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))));
       const { error: updateError } = await supabase
           .from('vote')
           .delete()
            .match({ "call_name": paddress, user_id: sitem[0].user_id });
        if (updateError) {
             console.error("Update failed:", updateError);
         } else {
           console.log("delete successful");
        }
       const { error: insertError } = await supabase
               .from("vote")
               .insert([{ call_name: paddress,user_id: sitem[0].user_id, like_number: v1[0].like_number, dislike_number: v1[0].dislike_number+1, ratio:Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))) }]);
               if (insertError) {
                console.error("Insert failed:", insertError);
               } else {
                 console.log("Insert successful");
               }
         } else {
        
         const { error: insertError } = await supabase
             .from("vote")
             .insert([{ call_name: paddress,user_id: sitem[0].user_id, like_number: 0, dislike_number: 1, ratio:0 }]);
         if (insertError) {
             console.error("Insert failed:", insertError);
         } else { 
           console.log("Insert successful");
           setRatioVote(0);
       }
        }
    };
     insertdislikeUser();
    }
    
  const saveComment = async () => {  
    setAdded(true);
    setCommentstore(comment);
    setPreshow(true);
      const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          user_id: myid,
          comment: comment,
          address: paddress    
        },
      ]);
    if (error) { showToastr("Can't send your comment!", "error"); }
    else {
      setComment('');
    }
  }

  return <ForumLayout>
    <div className={`card flex-grow p-0 flex flex-col overflow-hidden ${isLoading ? 'loading' : ''}`}>
      <div className="px-4 py-4 sm:px-6 sm:py-2.5 border-b-[1px] border-gray-100 flex 2xl:justify-between items-center gap-3">
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate(-1)} className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
            <FaChevronLeft />
          </button>
          {
            isLoading ? <div className="w-8 h-8 sm:w-[59px] sm:h-[59px] circle skeleton"/> :
            <img src={callReport?.info.imageUrl} className="w-8 h-8 sm:w-[59px] sm:h-[59px] circle"/>
          }
          {
            isLoading ? <div className="skeleton w-24 h-4 sm:w-60 sm:h-6 rounded"></div> :
            <div className="flex gap-3">
              <span className="font-bold text-base sm:text-lg">${callReport?.baseToken.symbol}</span>
                <div className="hidden md:flex gap-3 flex-wrap">
                  {sitem[0].is_featured ? <>
                    <span className={`badge-multiplier-${sitem[0].featured}X`}></span> </> :
                    <></>
                  }       
                <div className="bg-gray-100 px-2 py-1.5 rounded-full flex text-xs gap-1">
                  Marketcap {formatNumber(sitem[0].init_market_cap)} to {formatNumber(sitem[0].changedCap)}
                </div>
                  {sitem[0].percentage >= 100 ? <><div className="bg-green-600 px-2 py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                    <AiFillCaretUp />
                    <span>{sitem[0].percentage}%</span>
                  </div></> :
                    <><div className="bg-green-600 px-2 py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                    <AiFillCaretDown />
                      <span>{ sitem[0].percentage}%</span>
                  </div></>}
              </div>
            </div>
          }
        </div>
        <div className={`flex gap-1 ${isLoading ? 'hidden' : ''}`}>
          <div className="flex gap-1 items-center">
             {  confirmVote ==0?
                          <div className="flex gap-1 items-center">
                            <button className="circle-item w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]" ><AiFillCaretUp onClick={handleVotelike} />
                            </button>
                            <button className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" onClick={handleVotedislike} ><AiFillCaretDown />
                            </button>
                            <span className="text-xs text-gray-600">{ratioVote}%</span>
                          </div> : <>
                            { 
                              confirmVote == 1 ?
                               <div className="flex gap-1 items-center">
                               <button className="circle-item w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]" ><FaThumbsUp className="text-green-500 cursor-pointer hover:scale-110 transition-transform" />
                               </button>
                                <button className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" ><AiFillCaretDown />
                               </button>
                                <span className="text-xs text-gray-600">{ratioVote}%</span>
                                </div> :
                                
                                <div className="flex gap-1 items-center">
                               <button className="circle-item w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]" ><AiFillCaretUp />
                               </button>
                                <button className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" ><FaThumbsDown className="text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                               </button>
                                <span className="text-xs text-gray-600">{ratioVote}%</span>
                             </div>
                            }
                          
                          </>
                        }
          </div>
        </div>
        <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 circle-item !flex 2xl:!hidden ml-auto" onClick={() => setDiscussionOpen(!isDiscussionOpen)}>
          <img src={IconDiscussion} className="w-4 h-4"/>
        </button>
      </div>
      
      <div className="flex-grow relative overflow-hidden">
        <div className={`${isDiscussionOpen ? 'hidden 2xl:block' : ''} p-4 sm:p-6 h-full ${isLoading || !topCallers.length ? 'overflow-hidden' : 'overflow-auto'}`}>
          <div className="2xl:grid grid-cols-10 gap-6">
            <div className="col-span-6 flex flex-col gap-5">
              {/* Price Information */}
              <div className="space-y-3 block md:hidden">
                <p className="text-white text-sm font-bold">Price information</p>
                {
                  isLoading ? <div className="skeleton w-3/4 h-5 rounded"></div> :
                  <div className="flex gap-3 flex-wrap">
                    <span className={`badge-multiplier-200X`}></span>
                    <div className="bg-gray-100 px-2 py-1.5 rounded-full flex text-xs gap-1">
                      Marketcap {formatNumber(sitem[0].init_market_cap)} to {formatNumber(sitem[0].changedcap)}
                    </div>
                    {sitem[0].percentage >= 100 ? <><div className="bg-green-600 px-2 py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                    <AiFillCaretUp />
                    <span>{sitem[0].percentage}%</span>
                     </div></> :
                    <><div className="bg-green-600 px-2 py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                    <AiFillCaretDown />
                      <span>{ sitem[0].percentage}%</span>
                     </div></>}
                  </div>
                }

              </div>
              <div className="border-b-[1px] border-gray-100 md:hidden"></div>
              {/* Holders & Callers */}
              <div className="flex flex-col gap-3">
                <p className="block sm:hidden text-sm font-bold">Holders</p>
                <div className="hidden sm:flex gap-2">
                  <span>Callers</span> 
                  {
                    isLoading ? <div className="w-10 h-5 rounded skeleton"></div> :
                    <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">{callersCount}</span>
                  }
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-base">Top 10 holders</span> 
                  {
                    isLoading ? <div className="w-20 h-5 rounded skeleton"></div> :
                    <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">{top10HolderInfo.pct.toFixed(2)}% (${formatNumber(top10HolderInfo.uiAmount*sitem[0].changedPrice)})</span>
                  }
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-base">Top 3 holders</span>
                  <div className="flex gap-2">
                    {
                      isLoading ? <>
                        <div className="w-20 h-5 rounded skeleton"></div>
                        <div className="w-20 h-5 rounded skeleton"></div>
                        <div className="w-20 h-5 rounded skeleton"></div>
                      </> :
                      top3Holders.map((holder, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">{holder.pct.toFixed(2)}% (${formatNumber(holder.uiAmount*sitem[0].changedPrice)})</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-b-[1px] border-gray-100 sm:hidden"></div>
              <div className="space-y-3 sm:max-w-[300px]">
                <p className="block sm:hidden text-sm font-bold">Links</p>
                <div onClick={handleCopy} className="cursor-pointer bg-black px-5 py-2.5 rounded-full text-sm text-gray-600 flex items-center justify-between gap-20">
                  <span>
                    <span className="font-semibold text-white text-base">CA</span> {formatShortAddress(callReport?.pairAddress)}
                  </span>
                  <button>{
                      !isCopied ? <img src={IconCopy} className="text-white w-6 h-6 brightness-100"/>
                      : <span className='text-[#06cf9c]'><MdCheck size={24} /></span>
                    }
                  </button>
                </div>
                <a href={`https://dexscreener.com/solana/${callReport?.pairAddress.toLocaleLowerCase()}`} target="_blank" className="flex items-center justify-between w-full bg-black px-5 py-2.5 rounded-full">
                  <span className="flex items-center gap-2">
                    <img src={Dexscreener} alt="DEX Screener" className="w-6 h-6" /> <span className="text-sm">DEX Screener</span>
                  </span>
                  <FaExternalLinkAlt className="text-white" />
                </a>
                <a href={`https://photon-sol.tinyastro.io/en/lp/${callReport?.pairAddress.toLowerCase()}`} target="_blank" className="flex items-center justify-between w-full bg-black px-5 py-2.5 rounded-full">
                  <span className="flex items-center gap-2">
                    <img src={Photon} alt="Photon-SOL" className="w-6 h-6" /> <span className="text-sm">Photon-SOL</span>
                  </span>
                  <FaExternalLinkAlt className="text-white" />
                </a>
              </div>
              <div className="flex gap-2 sm:hidden">
                <span>Callers</span> 
                <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">72</span>
              </div>
              <h3 className="text-md hidden sm:block">Top Callers</h3>
              <div className="flex">
                <div className={`flex flex-col gap-3 w-full`}>
                  {isLoading ? <SkeletonList /> : 
                    !topCallers.length ? <>
                      <SkeletonRow opacity={60} /> 
                      <SkeletonRow opacity={30} />
                    </> :
                      topCallers.map((caller, index) => (<Link to={`/profile/123 ?id=${caller.users.id}`} key={index}>
                      <div className="bg-gray-50 px-2 md:px-4 py-2 rounded sm:rounded-[40px] flex items-center gap-2 xl:gap-3 flex-wrap">
                        <span className="leader-rank1 2xl:leader-rank-none font-semibold w-[36px]">#{index+1}</span>
                        <div className="p-3 rounded-full border border-gray-150 flex items-center gap-2.5">
                          <div className="circle-item w-7 h-7 bg-red-300 text-black text-sm font-bold">V</div>
                          <div className="space-y-0.5">
                            <div className="flex gap-1 items-center">
                              <span className="font-bold text-sm">{caller.users.name}</span>
                              <span className="text-xs text-gray-600">{ caller.users.winrate}%</span>
                            </div>
                            <div className="text-xs text-gray-600">{formatTimestamp(caller.created_at)} ago</div>
                          </div>
                        </div>
                        <div className="px-2 py-2 2xl:px-5 2xl:py-3 rounded-full bg-gray-100 flex 2xl:flex-col gap-1 mr-auto">
                          <div className="flex gap-1">
                            <span className="text-xs">Marketcap</span>
                            { 
                             scall[index].featured > 1?<><span className="text-xs text-primary font-semibold">{scall[index].featured}X</span></>:<></>
                            }
                          </div>
                          <span className="text-xs text-white"><b>{formatNumber(scall[index].init_market_cap)}</b> to <b>{formatNumber(scall[index].changedCap)}</b></span>
                        </div>
                        <div className="">
                          {scall[index].addXP > 5 ? <> <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">{scall[index].addXP}XP +</span></>:<></> }
                         
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${isDiscussionOpen ? '' : 'hidden '} 2xl:block 2xl:absolute top-0 right-6 h-full w-full 2xl:w-[39%] pl-4 pr-4 2xl:pr-0 py-4 2xl:py-6`}>
          <div className="rounded bg-gray-100 w-full h-full p-4 sm:p-6 flex flex-col gap-5">
            <div className="flex-grow overflow-hidden">
              <div className={`${isLoading ? 'overflow-hidden' : 'overflow-auto'} h-full space-y-3`}>
                 { 
              ! isLoading && preshow ? <>
                <div className="flex gap-4">
                    <div>
                      <div className="w-8 h-8 sm:w-[50px] sm:h-[50px] bg-black circle-item">
                        <img src={IconUser} className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1 items-center">
                          <span className="font-bold text-sm text-gray-600">{me[0].name}</span>
                          <span className="text-xs text-gray-600">{ me[0].winrate}%</span>
                          <div className="circle-item w-6 h-6 sm:w-7 sm:h-7 bg-red-300 text-black text-sm font-bold">{getRankChar(me[0].rank)}</div>
                        </div>
                        <span className="text-sm text-gray-600">{formatTimestamp(me[0].created_at)}</span>
                      </div>
                      <p className="text-sm sm:text-base !leading-[135%]">
                        { commentstore}  </p>
                    </div>
                  </div>
                  <div className="border-b-[1px] border-gray-100"></div>
                        </> : <></>
               }
                  {
                isLoading || !discussions.length ? <SkeletonDiscussionList /> :
                    discussions.map((discussion) => <>
                  <div className="flex gap-4">
                    <div>
                      <div className="w-8 h-8 sm:w-[50px] sm:h-[50px] bg-black circle-item">
                        <img src={IconUser} className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1 items-center">
                          <span className="font-bold text-sm text-gray-600">{discussion.users.name }</span>
                          <span className="text-xs text-gray-600">{ discussion.users.winrate}%</span>
                          <div className="circle-item w-6 h-6 sm:w-7 sm:h-7 bg-red-300 text-black text-sm font-bold">{getRankChar(discussion.users.rank)}</div>
                        </div>
                        <span className="text-sm text-gray-600">{formatTimestamp(discussion.created_at)}</span>
                         </div>
                         <p className="text-sm sm:text-base !leading-[135%]">
                        { discussion.comment}  </p>
                        </div>
                      </div>
                     <div className="border-b-[1px] border-gray-100"></div>
                    </>)   
                }
              
              </div>
            </div>
            {
            ! isLoading && isLogin && <div className="relative rounded-full bg-gray-100 px-12 mx-1 sm:mx-3 py-2 flex items-center">
                <div className="absolute left-1 flex items-center">
                  <div className="relative w-8 h-8 bg-black circle-item">
                    <img src={IconUser} className="w-2.5 h-2.5" />
                  </div>
                </div>
                <input type="text" className="w-full bg-transparent outline-none text-white" id="com"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..." disabled={added} />
                <div className="absolute right-3 flex items-center">
                  <button disabled={added} onClick={saveComment} >
                    <img src={IconSend} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  </ForumLayout>
}

export default TokenDetail;