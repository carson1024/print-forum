import React, { useEffect, useState } from "react";
import ForumLayout from "./layout"
import { AiFillCaretDown, AiFillCaretUp, AiFillCaretRight} from "react-icons/ai";
import IconCopy from 'assets/img/icons/copy.svg';
import IconSend from 'assets/img/icons/send.svg';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Dexscreener from 'assets/img/sample/dexscreener.png';
import Photon from 'assets/img/sample/photon.png';
import { TopHolderType } from "components/modal/CallModal";
import { checkCall, formatNumber, formatShortAddress, formatTimestamp } from "utils/blockchain";
import { SkeletonList, SkeletonRow } from "components/skeleton/forum";
import { MdCheck } from "react-icons/md";
import { CallReportType } from "types/calls";
import { SkeletonDiscussionList } from "components/skeleton/discussion";
import { showToastr } from "components/toastr";
import { supabase } from "lib/supabase";
import { useAuth } from "contexts/AuthContext";
import Prev from 'assets/img/prev.png';
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const TokenDetail = () => {
  const { isLogin,session,user } = useAuth();
  const navigate = useNavigate();
  const [userid, setUserid] = useState("");
  const [isDiscussionOpen, setDiscussionOpen] = useState(false);
  const [top3Holders, setTop3Holders] = useState<TopHolderType[]>([]);
  const [top10HolderInfo, setTop10HolderInfo] = useState<TopHolderType>({ pct: 0, uiAmount: 0 });
  const [callersCount, setCallersCount] = useState(0);
  const [callReport, setCallReport] = useState<CallReportType | null>(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isTopLoading, setIsTopLoading] = useState(true);
  const [xLoading, setXLoading] = useState(true);
  const [topCallers, setTopCallers] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [admindiscussions, setAdminDiscussions] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [sitem, setSitem] = useState<any>({});
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
  const fetchData = async () => {
    const pairAddress = location.pathname.substring(location.pathname.lastIndexOf('/') + 1).split('?')[0];
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const myuser = params.get("user");

    setConfirmVote(localStorage.getItem(pairAddress + myuser) === "yes" ? 1 : localStorage.getItem(pairAddress + myuser) === "no" ? 2 : 0);
    setUserid(myuser);
    setPaddress(pairAddress);
    setIsLoading(true);

    const fetchCalls = supabase
      .from("calls")
      .select("*, users(*)")
      .eq("address", pairAddress)
      .order("addXP", { ascending: false });

    const fetchItem = supabase
      .from("calls")
      .select("*")
      .eq("id", id)
      .order("created_at", { ascending: false })
      .single();

    const fetchVoteRatio = supabase
      .from("vote")
      .select("*")
      .match({ "call_name": pairAddress, user_id: myuser });

    const fetchAdminComments = supabase
      .from("admincomments")
      .select("*")
      .eq("address", pairAddress)
      .order("created_at", { ascending: false });

    const fetchComments = supabase
      .from("comments")
      .select("*, users(*)")
      .eq("address", pairAddress)
      .order("created_at", { ascending: false });

    checkCall(pairAddress).then(async (result) => {
      if (!result) {
        console.log("Invalid CA", pairAddress);
      } else {
        setCallReport(result);
  
        const top3 = result.topHolders.slice(0, 3);
        const top10 = result.topHolders.slice(0, 10).reduce((acc, holder) => {
          acc.pct += holder.pct;
          acc.uiAmount += holder.uiAmount;
          return acc;
        }, { pct: 0, uiAmount: 0 });
  
        setTop3Holders(top3);
        setTop10HolderInfo(top10);
  
        const { error: updateError } = await supabase
          .from("calls")
          .update({ supply: result.token.supply })
          .eq("address", pairAddress);
  
        if (updateError) console.error("Error updating supply:", updateError.message);
        else console.log("Supply updated successfully");
      }
      setIsTopLoading(false);
    })

    let userFetch;
    if (isLogin && session?.user) {
      setMyid(session.user.id);
      setXLoading(true);
      userFetch = supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .order("created_at", { ascending: false });
    }

    const [
      { data: calls, error: callsError },
      { data: item, error: itemError },
      { data: ratio, error: ratioError },
      { data: adminComments, error: adminCommentsError },
      { data: comments, error: commentsError },
      userResult
    ] = await Promise.all([
      fetchCalls,
      fetchItem,
      fetchVoteRatio,
      fetchAdminComments,
      fetchComments,
      userFetch ?? Promise.resolve({ data: null,error:null })
    ]);

    // Handle user info
    if (userResult?.error) {
      console.error("User fetch error:", userResult.error.message);
    } else if (userResult?.data) {
      setMe(userResult.data);
    }
    setXLoading(false);

    // Handle other fetch results
    if (!ratioError && ratio.length > 0) setRatioVote(ratio[0].ratio);
    else setRatioVote(0);

    if (!callsError && calls) {
      setCallersCount(calls.length);
      const uniqueCallers = Array.from(new Map(calls.map(item => [item.user_id, item])).values());
      setTopCallers(uniqueCallers);
    }

    if (!itemError && item) setSitem(item);
    if (!adminCommentsError && adminComments) setAdminDiscussions(adminComments);
    if (!commentsError && comments) {
      setDiscussions(comments);
      if (session?.user) {
        const userCommented = comments.some(com => com.user_id === session.user.id);
        if (userCommented) setAdded(true);
      }
    }

    setIsLoading(false);
  };

  fetchData();
}, [session]);

   const handleVotelike = () => {
      localStorage.setItem(paddress + sitem?.user_id, "yes")
     setConfirmVote(1)
    let v2 = [];
    const insertUser = async () => {
     const { data, error } = await supabase
        .from("vote")
        .select("*")
        .match({ "call_name": paddress, user_id: sitem?.user_id });
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
           .match({ "call_name": paddress, user_id: sitem?.user_id });
            if (updateError) {
            console.error("Update failed:", updateError);
            } else {
            console.log("delete vote successful");
           
            }
              const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: paddress,user_id: sitem?.user_id, like_number: v2[0].like_number+1, dislike_number: v2[0].dislike_number, ratio:Math.ceil((v2[0].like_number+1)*100/((v2[0].like_number+1+v2[0].dislike_number))) }]);
              if (insertError) {
               console.error("Insert failed:", insertError);
              } else {
                console.log("Insert successful");
              }  
      }
      else {
            const { error: insertError } = await supabase
              .from("vote")
              .insert([{ call_name: paddress,user_id: sitem?.user_id, like_number: 1, dislike_number: 0, ratio:100 }]);
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
      localStorage.setItem(paddress + sitem?.user_id, "no")
       setConfirmVote(2)
     let v1 = [];
     const insertdislikeUser = async () => {
     const { data, error } = await supabase
         .from("vote")
         .select("*")
         .match({ "call_name": paddress, user_id: sitem?.user_id });
     if (error) {
         console.error("Fetch failed:", error);
         return; }
       if (data.length > 0) {
         v1 = data;
        setRatioVote(Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))));
       const { error: updateError } = await supabase
           .from('vote')
           .delete()
            .match({ "call_name": paddress, user_id: sitem?.user_id });
        if (updateError) {
             console.error("Update failed:", updateError);
         } else {
           console.log("delete successful");
        }
       const { error: insertError } = await supabase
               .from("vote")
               .insert([{ call_name: paddress,user_id: sitem?.user_id, like_number: v1[0].like_number, dislike_number: v1[0].dislike_number+1, ratio:Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))) }]);
               if (insertError) {
                console.error("Insert failed:", insertError);
               } else {
                 console.log("Insert successful");
               }
         } else {
        
         const { error: insertError } = await supabase
             .from("vote")
             .insert([{ call_name: paddress,user_id: sitem?.user_id, like_number: 0, dislike_number: 1, ratio:0 }]);
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
    <div className={`border-r border-gray-800 overflow-hidden ${isTopLoading || isLoading ? 'loading' : ''}`}>
      <div className="grid grid-rows-[90px_76px_1fr] flex-col h-screen border-gray-800">
        <div className="flex border-b border-gray-800 flex items-center ">
          <button onClick={() => navigate(-1)} ><img src={Prev} className="w-[24px] h-[24px] mr-[12px] ml-[12px]" /></button>
          {
            isLoading ? <div className="w-8 h-8 sm:w-[52px] sm:h-[52px] circle skeleton mr-[12px]"/> :
            <img src={callReport?.info.imageUrl} className="w-8 h-8 sm:w-[52px] sm:h-[52px] circle mr-[12px]"/>
          }
          <div className="space-y-[5px]">
            {
              isLoading ? <div className="skeleton w-24 h-4 sm:w-[300px] sm:h-[20px] rounded"></div> :
                <div className="flex space-x-[12px] items-center">
                  <span className="text-sm text-[14px] font-semibold items-center text-white">${callReport?.baseToken.symbol}</span>
                  <div className="text-gray-600 text-[12px] font-Medium flex">
                    MCAP {formatNumber(sitem?.init_market_cap)}<span className="text-sm items-center flex"><AiFillCaretRight /></span> {formatNumber(sitem?.changedCap)}&nbsp;<span className="text-sm items-center flex font-Regular text-white">
                      {
                        sitem?.percentage == 100 ? <></> : sitem?.percentage > 100 ?
                          <div className="flex text-green-600">
                            <AiFillCaretUp className="text-green-600" />
                            <span>{Number(sitem?.percentage) - 100}%</span>
                          </div> :
                          <div className="flex text-red-400">
                            <AiFillCaretDown className="text-red-400" />
                            <span>{100 - Number(sitem?.percentage)}%</span>
                          </div>
                      }
                      {/* <AiFillCaretUp /> 121% */}
                    </span>
                  </div>
                  {
                    sitem?.is_featured ? <div>
                      <span className={`badge-multiplier-${sitem?.featured}X w-[35px] h-[21px]  text-[#59FFCB] text-[12px] font-semibold items-center flex`}></span>
                    </div> :
                    <></>
                  }
                </div>}
            {
              isTopLoading ? <div className="skeleton w-24 h-4 sm:w-[600px] sm:h-[20px] rounded"></div> :
                <div className="flex space-x-[6px] items-center">
                  <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Callers<span className="token_border text-white">{callersCount}</span></span>
                  <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Top&nbsp;10&nbsp;holders<span className="token_border text-white space-x-[5px]">{top10HolderInfo.pct.toFixed(2)}%<span className="text-gray-600">${formatNumber(top10HolderInfo.uiAmount*sitem?.changedPrice)}</span></span></span>
                  <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Top&nbsp;3&nbsp;holders
                    {top3Holders.map((holder, index) => (
                      <span className="token_border text-white space-x-[5px]">{holder.pct.toFixed(2)}%<span className="text-gray-600">${formatNumber(holder.uiAmount*sitem?.changedPrice)}</span></span>
                    ))}
                  </span>
                </div> }
          </div>
        </div>

        <div className="flex border-b border-gray-800 flex items-center ">
         <a href={`https://dexscreener.com/solana/${callReport?.pairAddress.toLocaleLowerCase()}`} target="_blank" className="ml-[18px] items-center flex token_outsite "><img src={Dexscreener} alt="DEX Screener" className="w-[17px] h-[20px]" /><span className="text-[14px] font-semibold items-center text-white">Dex Screener</span></a>
         <a href={`https://photon-sol.tinyastro.io/en/lp/${callReport?.pairAddress.toLowerCase()}`} target="_blank" className="ml-[12px] items-center flex token_outsite "><img src={Photon} alt="Photon-SOL" className="w-[17px] h-[20px]" /><span className="text-[14px] font-semibold items-center text-white">Photon-SOL</span></a>
          <div onClick={handleCopy} className="ml-[12px] items-center flex token_outsite "><span className="text-[14px] flex font-semibold items-center text-white">CA</span><span className="text-gray-600 text-[12px] font-Medium">{formatShortAddress(callReport?.pairAddress)}
            <button>{
                      !isCopied ? <img src={IconCopy} className="ml-[6px] text-white w-[12px] h-[12px] brightness-50"/>
                      : <span className='ml-[6px] text-[#06cf9c] items-center flex'><MdCheck size={16} /></span>
                    }
            </button></span></div>
         <div className={`flex gap-1 ml-auto mr-[18px] justify-end ${isLoading ? 'hidden' : ''}`}>
                   <div className="flex gap-1 items-center">
                      {  confirmVote ==0?
                                   <div className="flex gap-1 items-center">
                                     <button className="circle-reitem w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]" ><AiFillCaretUp onClick={handleVotelike} />
                                     </button>
                                     <button className="circle-reitem w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" onClick={handleVotedislike} ><AiFillCaretDown />
                                     </button>
                                     <span className="text-xs text-gray-600">{ratioVote}%</span>
                                   </div> : <>
                                     { 
                                       confirmVote == 1 ?
                                        <div className="flex gap-1 items-center">
                                        <button className="circle-reitem w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]" ><FaThumbsUp className="text-green-500 cursor-pointer hover:scale-110 transition-transform" />
                                        </button>
                                         <button className="circle-reitem w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" ><AiFillCaretDown />
                                        </button>
                                         <span className="text-xs text-gray-600">{ratioVote}%</span>
                                         </div> :
                                         
                                         <div className="flex gap-1 items-center">
                                        <button className="circle-reitem w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]" ><AiFillCaretUp />
                                        </button>
                                         <button className="circle-reitem w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" ><FaThumbsDown className="text-red-500 cursor-pointer hover:scale-110 transition-transform" />
                                        </button>
                                         <span className="text-xs text-gray-600">{ratioVote}%</span>
                                      </div>
                                     }
                                   
                                   </>
                        }
                   </div>
          </div>
        </div>
        <div className="grid h-screen" style={{ gridTemplateColumns: 'calc((100vw - 501px) / 2) 1fr' }}>
          <div className="border-r border-gray-800 flex flex-col h-screen">
            <div className="grid grid-rows-[50px_1fr] border-gray-800 ">
              <div className="border-b items-center flex">
                <div className="m-[18px] text-[14px] font-semibold text-white items-center flex">Top Callers</div>
              </div>
              <div className="flex-1 overflow-y-auto h-[calc(100vh-292px)]">
                <div className="m-[18px] items-center flex">
                  <div
                    className={`flex-1 overflow-auto flex flex-col ${isLoading ? "overflow-hidden loading" : "overflow-auto"}`}>
                    {isLoading || !topCallers.length ? (
                      <div className=''><SkeletonList /></div>
                    ) : (
                        topCallers.map((caller, index) => (<Link to={`/profile?id=${caller.users.id}&tag=1`} key={index}>
                          <div className="mb-[18px]">
                          <div className="topcaller_border items-center flex flex-1 grid flex-col">
                    <div className="number_border text-[12px] font-Medium text-white">#{index+1}</div>
                    <div className="items-center">
                      <div className="flex items-center space-x-[6px]">
                        <span className={`badge-rank-${caller.users.rank} w-[20px] h-[20px]`}></span>
                        <span className="text-[12px] font-Medium text-white">{caller.users.name}</span>
                        <span className="text-[12px] font-Medium text-[#76767E]">{ caller.users.winrate}%</span>
                      </div>
                      <div className="flex items-center space-x-[6px]">
                        <div className="flex space-x-[12px] items-center">
                          <div className="text-[#76767E] text-[12px] font-Medium flex">
                            MCAP&nbsp;{formatNumber(caller.init_market_cap)}<span className="text-sm items-center flex"><AiFillCaretRight /></span>{formatNumber(caller.changedCap)}&nbsp;<span className="text-sm items-center flex font-Regular text-white">
                              {
                                caller?.percentage == 100 ? <></> : caller?.percentage > 100 ?
                                  <div className="flex text-[#76767E] text-[12px]">
                                    <AiFillCaretUp className="text-[#76767E]" />
                                    <span>{Number(caller?.percentage) - 100}%</span>
                                  </div> :
                                  <div className="flex text-red-400 text-[12px]">
                                    <AiFillCaretDown className="text-red-400" />
                                    <span>{100 - Number(caller?.percentage)}%</span>
                                  </div>
                              }
                            </span>
                          </div>
                          {
                            caller.users?.is_featured ? <div>
                              <span className={`badge-multiplier-${caller.users?.featured}X w-[35px] h-[21px]  text-[#59FFCB] text-[12px] font-semibold items-center flex`}></span>
                            </div> :
                              <></>
                          }
                        </div>
                      </div>
                      </div>
                      <div className="ml-auto flex">
                      {caller.addXP > 5 ? <> <div className="caller_rise flex items-center mr-[18px]"><span className="text-[12px] font-semibold text-primary">+{caller.addXP}XP</span></div></> :
                      caller.addXP ==0 ?<></>:
                      <> <div className="caller_rise flex items-center mr-[18px]"><span className="text-[12px] font-semibold text-red-300">{caller.addXP}XP</span></div></>}
                              <span className="text-[#76767E] text-[12px] font-semibold items-center flex ">{formatTimestamp(caller.created_at)}</span>
                      </div>
                      </div>
                      </div>
                  </Link>)
                        )
                    )}
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
          <div className="border-gray-800 h-screen flex flex-col">
            <div className="grid grid-rows-[50px_1fr] border-gray-800 ">
              <div className="border-b items-center flex">
                <div className="m-[18px] text-[14px] font-semibold text-white items-center flex">Discussion</div>
              </div>
              <div className="grid grid-rows-[1fr_50px] h-[calc(100vh-292px)] ">
                <main className="overflow-y-auto m-[18px]">
                  { 
              ! isLoading && preshow ? <>
                <div className="">
                      <div className="flex items-center mb-[2px]">
                          <span className={`badge-rank-${me[0].rank} w-[20px] h-[20px] mr-[6px]`}></span>
                          <span className="text-[14px] font-Medium text-white mr-[6px]">{me[0].name}</span>
                        <span className="text-[12px] font-Medium text-[#76767E] mr-[6px]">{me[0].winrate}%</span>
                        <span className="text-[12px] font-Medium text-[#76767E] ml-auto">{formatTimestamp(me[0].created_at)} ago</span>
                      </div>
                      <div className="items-center">
                        <span className="text-[12px] font-Medium text-gray-600">{commentstore}</span>
                      </div>
                      <div className="border-b border-gray-800 mt-[18px] mb-[18px]"></div>
                    </div>
                </> : <></>
               }
              {
                isLoading || !discussions.length ? <SkeletonDiscussionList /> :
                    discussions.map((discussion) => <>
                     <div className="">
                      <div className="flex items-center mb-[2px]">
                          <span className={`badge-rank-${discussion.users.rank} w-[20px] h-[20px] mr-[6px]`}></span>
                          <span className="text-[14px] font-Medium text-white mr-[6px]">{discussion.users.name}</span>
                        <span className="text-[12px] font-Medium text-[#76767E] mr-[6px]">{discussion.users.winrate}%</span>
                        <span className="text-[12px] font-Medium text-[#76767E] ml-auto">{formatTimestamp(discussion.created_at)} ago</span>
                      </div>
                      <div className="items-center">
                        <span className="text-[12px] font-Medium text-gray-600">{ discussion.comment}</span>
                      </div>
                      <div className="border-b border-gray-800 mt-[18px] mb-[18px]"></div>
                    </div>
                    </>) 
              }
                  {isLoading? <></>:
                  admindiscussions?.map((admindiscussion) => <>
                     <div className="">
                      <div className="flex items-center mb-[2px]">
                          <span className={`badge-rank-10 w-[20px] h-[20px] mr-[6px]`}></span>
                          <span className="text-[14px] font-Medium text-white mr-[6px]">Administrator</span>
                        <span className="text-[12px] font-Medium text-[#76767E] ml-auto">{formatTimestamp(admindiscussion.created_at)} ago</span>
                      </div>
                      <div className="items-center">
                        <span className="text-[12px] font-Medium text-gray-600">{ admindiscussion.comment}</span>
                      </div>
                      <div className="border-b border-gray-800 mt-[18px] mb-[18px]"></div>
                    </div>
                    </>) 
                }
            </main>

              {/* Fixed bottom input bar */}
              <div className="mt-auto">
              {
              ! isLoading && isLogin && <div className="relative rounded-full bg-gray-100 px-[12px]  circle py-2 flex items-center">
                  
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
        </div>
      </div>
    </div>
  </ForumLayout>
}

export default TokenDetail;