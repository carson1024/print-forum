import { AiFillCaretDown, AiFillCaretUp, AiFillCaretRight } from "react-icons/ai"
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
import LoginFromVoteModal from "components/modal/LoginFromVoteModal";
import { login, logout } from "utils/auth";
import { useAuth } from "contexts/AuthContext";
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
  const [isLoginFromVoteModalOpen, setIsLoginFromVoteModalOpen] = useState(false);
  const { isLogin, session, user } = useAuth();
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
      }
    };
    voteratio();
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

  const handleVotelike = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        setRatioVote(Math.ceil((v2[0].like_number + 1) * 100 / ((v2[0].like_number + 1 + v2[0].dislike_number))));
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
          .insert([{ call_name: call.address, user_id: call.user_id, like_number: v2[0].like_number + 1, dislike_number: v2[0].dislike_number, ratio: Math.ceil((v2[0].like_number + 1) * 100 / ((v2[0].like_number + 1 + v2[0].dislike_number))) }]);
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
          .insert([{ call_name: call.address, user_id: call.user_id, like_number: 1, dislike_number: 0, ratio: 100 }]);
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

  const handleVotedislike = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        return;
      }
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
          .insert([{ call_name: call.address, user_id: call.user_id, like_number: v1[0].like_number, dislike_number: v1[0].dislike_number + 1, ratio: Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))) }]);
        if (insertError) {
          console.error("Insert failed:", insertError);
        } else {
          console.log("Insert successful");
          setCounter(counter + 1);
        }
      } else {
        const { error: insertError } = await supabase
          .from("vote")
          .insert([{ call_name: call.address, user_id: call.user_id, like_number: 0, dislike_number: 1, ratio: 0 }]);
        if (insertError) {
          console.error("Insert failed:", insertError);
        } else {
          setCounter(counter + 1);
          console.log("Insert successful");
          setRatioVote(0);
        }
      }
    };
    insertdislikeUser();
  }

  const handlekeep = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCounter(counter + 1)
  }

  const handleVotelikemobile = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLogin) { setIsLoginFromVoteModalOpen(true) }
    else {
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
          setRatioVote(Math.ceil((v2[0].like_number + 1) * 100 / ((v2[0].like_number + 1 + v2[0].dislike_number))));
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
            .insert([{ call_name: call.address, user_id: call.user_id, like_number: v2[0].like_number + 1, dislike_number: v2[0].dislike_number, ratio: Math.ceil((v2[0].like_number + 1) * 100 / ((v2[0].like_number + 1 + v2[0].dislike_number))) }]);
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
            .insert([{ call_name: call.address, user_id: call.user_id, like_number: 1, dislike_number: 0, ratio: 100 }]);
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
  }

  const handleVotedislikemobile = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLogin) { setIsLoginFromVoteModalOpen(true) }
    else {
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
          return;
        }
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
            .insert([{ call_name: call.address, user_id: call.user_id, like_number: v1[0].like_number, dislike_number: v1[0].dislike_number + 1, ratio: Math.ceil(((v1[0].like_number) * 100 / ((v1[0].dislike_number + 1 + v1[0].like_number)))) }]);
          if (insertError) {
            console.error("Insert failed:", insertError);
          } else {
            console.log("Insert successful");
            setCounter(counter + 1);
          }
        } else {
          const { error: insertError } = await supabase
            .from("vote")
            .insert([{ call_name: call.address, user_id: call.user_id, like_number: 0, dislike_number: 1, ratio: 0 }]);
          if (insertError) {
            console.error("Insert failed:", insertError);
          } else {
            setCounter(counter + 1);
            console.log("Insert successful");
            setRatioVote(0);
          }
        }
      };
      insertdislikeUser();
    }
  }

  return <><Link to={`/token/${call.address}?id=${call.id} &user=${call.user_id}`}>
    <div className="bg-black text-white">
      <div className="mt-[18px] ml-[18px] mr-[18px] grid items-center bg-black raw_border" style={{ gridTemplateColumns: '320px 1fr 37px' }}>
        <div className="flex mr-[32px] items-center bg-black">
          <img src={call.image} className="w-[69px] h-[69px] circle-item" />
          <div className="flex flex-col items-start token_data mr-[8px] ml-[12px]">
            <div className="data1 text-sm text-[14px] font-semibold items-center flex">${call.symbol}
              {
                featured > 1 ? <div>
                  <span className={`badge-multiplier-${featured}X w-[35px] h-[21px]  text-[#59FFCB] text-[12px] font-semibold items-center flex`}></span>
                </div> :
                  <></>
              }
              {/* <span className="badge-multiplier-10X w-[35px] h-[21px]  text-[#59FFCB] text-[12px] font-semibold items-center flex"></span>  */}
              <span onClick={handleCopy} className="token_address text-[12px] font-Medium text-gray-500">
                <span className="truncate text-gray-400">{formatShortAddress(call.address)}</span>
                <button className="text-gray-400">{
                  !isCopied ? <img src={IconCopy} className="opacity-40" />
                    : <span className='text-[#06cf9c]'><MdCheck size={16} /></span>
                }</button>
              </span>
              <span className="font-Regular text-gray-600">{formatTimestamp(call.updated_at)}</span>
            </div>
            <div className="text-gray-600 text-[12px] font-Medium flex">
              MCAP&nbsp;{formatNumber(call.init_market_cap)}<span className="text-sm items-center flex"><AiFillCaretRight /></span>{formatNumber(call.changedCap)}&nbsp;<span className="text-sm items-center flex font-Regular text-white">
                {
                  call.percentage == 100 ? <></> : call.percentage > 100 ?
                    <div className="flex text-green-600">
                      <AiFillCaretUp className="text-green-600" />
                      <span>{Number(call.percentage) - 100}%</span>
                    </div> :
                    <div className="flex text-red-400">
                      <AiFillCaretDown className="text-red-400" />
                      <span>{100 - Number(call.percentage)}%</span>
                    </div>
                }
                {/* <AiFillCaretUp /> 121% */}
              </span>
            </div>
            <div className="items-center flex text-sm space-x-[8px]">
              <span className={`badge-rank-${call.users.rank} w-[20px] h-[20px]`}></span>
              <Link to={`/profile?id=${call.users.id}&tag=1`} key={call.id}>
                <div className=" text-sm text-[12px] font-semibold items-center">{call.users.name}</div>
              </Link>
              <div className="text-gray-600 text-[12px] font-Medium flex">{call.users.winrate}%</div>
            </div>
          </div>
        </div>
        <div className="bg-black"></div>
        <div className="flex items-center bg-black ml-auto">
          {
            confirmVote == 0 ? <><div className="space-y-[3px]">
              <div className="circle-reitem w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px] " onClick={handleVotelikemobile}><AiFillCaretUp /> </div>
              <div className="circle-reitem w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" onClick={handleVotedislikemobile}><AiFillCaretDown /></div>
              <span className="text-xs text-gray-600  select-none m-0 p-0 leading-none">{ratioVote}%</span>
            </div></> : <>
              {
                confirmVote == 1 ? <><div className="space-y-[3px]" onClick={handlekeep}>
                  <button className="circle-reitem w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]"><FaThumbsUp className="w-3 h-3 text-green-500  cursor-pointer hover:scale-110 transition-transform" /> </button>
                  <button className="circle-reitem w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></button>
                  <span className="text-xs text-gray-600  select-none m-0 p-0 leading-none">{ratioVote}%</span>
                </div></> :
                  <div className="space-y-[3px]" onClick={handlekeep}>
                    <div className="circle-reitem w-6 h-6 bg-gray-100 hover:bg-gray-50 text-green-600 text-sm pb-[2px]"  ><AiFillCaretUp /> </div>
                    <div className="circle-reitem w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]" ><FaThumbsDown className="w-3 h-3 text-red-500 cursor-pointer hover:scale-110 transition-transform" /></div>
                    <span className="text-xs text-gray-600  select-none m-0 p-0 leading-none">{ratioVote}%</span>
                  </div>
              }</>
          }
        </div>
      </div>
    </div>
  </Link>
    <LoginFromVoteModal
      isOpen={isLoginFromVoteModalOpen}
      onClose={() => setIsLoginFromVoteModalOpen(false)}
      login={login}
    />
  </>
}