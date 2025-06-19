import React, { Component } from 'react';
import { formatTimestamp } from "../../../../utils/blockchain";
import { useAuth } from "../../../../contexts/AuthContext";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Telegram from 'assets/img/telegram.png';
import Twitter from 'assets/img/twitter.png';
import Solana from 'assets/img/solana.png';
import { useState } from "react";
import { MdCheck } from "react-icons/md";
import { showToastr } from "components/toastr";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { act, useEffect } from "react";
import { supabase } from "lib/supabase";
import { SkeletonList, SkeletonRow } from "../../../../../src/components/skeleton/forum";
import { CallsTab } from "./CallsTab";

type Props = {
  myprofile: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    xp: string;
    rank: string;
    winrate: string;
    callcount: string;
    achievements: string;
    created_at: string;
    taddress: string;
    xaddress: string;
    saddress: string;
    bio: string;
  };
};

const ProfileTab = ({ myprofile }: Props) => {
  const { isLogin, session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [prevcall, setPrevcall] = useState([]);
  const [activecall, setActivecall] = useState([]);
  const [state, setState] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const scan = async () => {
      const { data, error } = await supabase
        .from("calls")
        .select("*, users(*)")
        .eq("user_id", myprofile.id)
        .order("updated_at", { ascending: false })
        .limit(20);
      if (error) {
        console.error("Error fetching calls:", error.message);
        return;
      }
      if (data) {
        const active = (data.filter(call => new Date(call.created_at).getTime() + 86400000 - Date.now() > 0));
        setPrevcall(active);
        const prev = (data.filter(call => new Date(call.created_at).getTime() + 86400000 - Date.now() <= 0));
        setActivecall(prev)
        setIsLoading(false);
      }
    };
    scan();
  }, []);

  const buttonActive = () => {
    setState(1);
  }
  const buttonPrev = () => {
    setState(0);
  }
  function formatSinceDate(timestamp?: string): string {
    if (!timestamp) return ""; // or return a fallback like "Unknown"
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return ""; // Invalid date fallback
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return `Since ${new Intl.DateTimeFormat("en-US", options).format(date)}`;
  }

  return (<>
    <div className="grid h-screen" style={{ gridTemplateColumns: 'calc((100vw - 501px) / 2) 1fr' }}>
      <div className="border-r border-gray-800 flex flex-col h-screen">
        <div className="grid grid-rows-[50px_1fr] border-gray-800 ">
          <div className="border-b items-center flex">
            <div className="m-[18px] text-[14px] font-semibold text-white items-center flex">About User</div>
          </div>
          <div className="flex-1 overflow-y-auto h-[calc(100vh-202px)]">
            <div className='m-[18px]'>
              <div className='text-[14px] font-Medium text-white items-center mb-[8px]'>Bio</div>
              <div className='text-[12px] font-Medium text-gray-600 items-center mb-[12px]'>{myprofile.bio}</div>
              <div className='flex mt-[16px] mb-[16px] '>
                <span className="token_info text-gray-600 text-[12px] font-Medium mr-[8px] space-x-[5px]">Followers<span className="token_border text-primary">12</span></span>
                <span className="token_info text-gray-600 text-[12px] font-Medium mr-[8px] space-x-[5px]">Win&nbsp;Rate<span className="token_border text-gray-600">{myprofile.winrate}%</span></span>
                <span className="token_info text-gray-600 text-[12px] font-Medium mr-[8px] space-x-[5px]">Calls<span className="token_border text-white">{myprofile.callcount}</span></span>
                <span className="token_info text-gray-600 text-[12px] font-Medium mr-[8px] space-x-[5px]">Account&nbsp;Age<span className="token_border text-white">{formatTimestamp(myprofile.created_at)}</span></span>
              </div>
              <div className="border-b border-gray-800 mb-[16px]"></div>
              <div className="flex items-center profileXP mb-[16px]">
                <span className={`badge-rank-1 w-[36px] h-[36px] mr-[6px]`}></span>
                <span className="text-[14px] font-semibold text-white flex items-center justify-center">Rank {myprofile.rank}</span>
                <span className="text-[12px] font-Medium text-gray-600 flex items-center ml-auto">{formatSinceDate(myprofile?.created_at)}</span>
              </div>
              <div className="border-b border-gray-800 mb-[16px]"></div>
              <div className='text-[14px] font-Medium text-white items-center mb-[8px]'>Achievements</div>
              <div className=" space-x-[6px] mb-[16px]">
                {/* <button className="w-[32px] h-[32px] text-xs font-bold bg-gray-900 circle-item text-white">+5</button> */}
                <Tippy theme="yellowTooltip" content="You reached rank 1" delay={[0, 0]}>
                  {myprofile?.achievements.includes("1x") ? <button className="text-yellow-400">
                    <span className="badge-rank-1 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 2" delay={[0, 0]}>
                  {myprofile?.achievements.includes("2x") ? <button className="text-yellow-400">
                    <span className="badge-rank-2 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 3" delay={[0, 0]}>
                  {myprofile?.achievements.includes("3x") ? <button className="text-yellow-400">
                    <span className="badge-rank-3 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 4" delay={[0, 0]}>
                  {myprofile?.achievements.includes("4x") ? <button className="text-yellow-400">
                    <span className="badge-rank-4 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 5" delay={[0, 0]}>
                  {myprofile?.achievements.includes("5x") ? <button className="text-yellow-400">
                    <span className="badge-rank-5 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 6" delay={[0, 0]}>
                  {myprofile?.achievements.includes("6x") ? <button className="text-yellow-400">
                    <span className="badge-rank-6 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 7" delay={[0, 0]}>
                  {myprofile?.achievements.includes("7x") ? <button className="text-yellow-400">
                    <span className="badge-rank-7 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 8" delay={[0, 0]}>
                  {myprofile?.achievements.includes("8x") ? <button className="text-yellow-400">
                    <span className="badge-rank-8 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 9" delay={[0, 0]}>
                  {myprofile?.achievements.includes("9x") ? <button className="text-yellow-400">
                    <span className="badge-rank-9 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 10" delay={[0, 0]}>
                  {myprofile?.achievements.includes("10x") ? <button className="text-yellow-400">
                    <span className="badge-rank-10 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Telegram address" delay={[0, 0]}>
                  {myprofile?.achievements.includes("t") ? <button className="text-yellow-400">
                    <span className="badge-social-telegram w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Twitter address" delay={[0, 0]}>
                  {myprofile?.achievements.includes("x") ? <button className="text-yellow-400">
                    <span className="badge-social-twitter w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Solana address" delay={[0, 0]}>
                  {myprofile?.achievements.includes("s") ? <button className="text-yellow-400">
                    <span className="badge-social-solana w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 5X marketCap" delay={[0, 0]}>
                  {myprofile?.achievements.includes("c5x") ? <button className="text-yellow-400">
                    <span className="badge-call-5X w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 10X marketCap" delay={[0, 0]}>
                  {myprofile?.achievements.includes("c10x") ? <button className="text-yellow-400">
                    <span className="badge-call-10X w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 50X marketCap" delay={[0, 0]}>
                  {myprofile?.achievements.includes("c50x") ? <button className="text-yellow-400">
                    <span className="badge-call-50X w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 100X marketCap" delay={[0, 0]}>
                  {myprofile?.achievements.includes("c100x") ? <button className="text-yellow-400">
                    <span className="badge-call-100X w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="10 people copytrade you" delay={[0, 0]}>
                  {myprofile?.achievements.includes("u10") ? <button className="text-yellow-400">
                    <span className="badge-user-10 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="50 people copytrade you" delay={[0, 0]}>
                  {myprofile?.achievements.includes("u50") ? <button className="text-yellow-400">
                    <span className="badge-user-50 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="100 people copytrade you" delay={[0, 0]}>
                  {myprofile?.achievements.includes("u100") ? <button className="text-yellow-400">
                    <span className="badge-user-100 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 50K-money" delay={[0, 0]}>
                  {myprofile?.achievements.includes("m50k") ? <button className="text-yellow-400">
                    <span className="badge-money-50k w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 100K-money" delay={[0, 0]}>
                  {myprofile?.achievements.includes("m100k") ? <button className="text-yellow-400">
                    <span className="badge-money-100k w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 500K-money" delay={[0, 0]}>
                  {myprofile?.achievements.includes("m500k") ? <button className="text-yellow-400">
                    <span className="badge-money-500k w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 1m-money" delay={[0, 0]}>
                  {myprofile?.achievements.includes("m1m") ? <button className="text-yellow-400">
                    <span className="badge-money-1m w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 1 month history" delay={[0, 0]}>
                  {myprofile?.achievements.includes("reg1m") ? <button className="text-yellow-400">
                    <span className="badge-register-1m w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 3 months history" delay={[0, 0]}>
                  {myprofile?.achievements.includes("reg3m") ? <button className="text-yellow-400">
                    <span className="badge-register-3m w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 1 year history" delay={[0, 0]}>
                  {myprofile?.achievements.includes("reg1y") ? <button className="text-yellow-400">
                    <span className="badge-register-1y w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You are a influencer" delay={[0, 0]}>
                  {myprofile?.achievements.includes("influ") ? <button className="text-yellow-400">
                    <span className="badge-other-influencer w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Alpha action" delay={[0, 0]}>
                  {myprofile?.achievements.includes("alpha") ? <button className="text-yellow-400">
                    <span className="badge-other-alpha w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You have a best partner" delay={[0, 0]}>
                  {myprofile?.achievements.includes("partner") ? <button className="text-yellow-400">
                    <span className="badge-other-partner w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You never did skip" delay={[0, 0]}>
                  {myprofile?.achievements.includes("never") ? <button className="text-yellow-400">
                    <span className="badge-other-neverskip w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You found some bugs of this site" delay={[0, 0]}>
                  {myprofile?.achievements.includes("bug") ?
                    <button className="text-yellow-400">
                      <span className="badge-other-bughunter w-[32px] h-[32px]"></span>
                    </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You registered on this site" delay={[0, 0]}>
                  {myprofile?.achievements.includes("OG") ?
                    <button className="text-yellow-400">
                      <span className="badge-other-og w-[32px] h-[32px]"></span>
                    </button> : <></>}
                </Tippy>
              </div>
              <div className="border-b border-gray-800 mb-[16px]"></div>
              <a className='flex' href={`https://explorer.solana.com/address/${myprofile.saddress}`} target="_blank" rel="noopener noreferrer" ><button className='btn_link mainhover text-[14px] font-semibold text-[#FFFFFF] mb-[12px]'><img className='mr-[8px]' src={Solana} />Follow&nbsp;on&nbsp;Solana</button></a>
              <a className='flex' href={`https://x.com/${myprofile.xaddress}`} target="_blank" rel="noopener noreferrer" ><button className='btn_link mainhover text-[14px] font-semibold text-[#FFFFFF] mb-[12px]'><img className='mr-[8px]' src={Twitter} />Follow&nbsp;on&nbsp;X</button></a>
              <a className='flex' href={`https://t.me/${myprofile.taddress}`} target="_blank" rel="noopener noreferrer" ><button className='btn_link mainhover text-[14px] font-semibold text-[#FFFFFF] '><img className='mr-[4px]' src={Telegram} />Follow&nbsp;on&nbsp;Telegram</button></a>

            </div>
          </div>
        </div>
      </div>
      <div className="border-gray-800 h-screen flex flex-col">
        <div className="grid grid-rows-[50px_1fr] border-gray-800">
          <div className="border-b items-center flex">
            <div className="m-[18px] text-[14px] font-semibold text-white items-center flex">Latest Calls</div>
          </div>
          <div className="flex-1 overflow-y-auto h-[calc(100vh-202px)]">
            <div
              className={`flex-1 overflow-auto flex flex-col ${isLoading ? "overflow-hidden loading" : "overflow-auto"}`}>
              {isLoading || (!activecall.length && !prevcall.length) ? (
                <div className=' p-2 sm:p-4 pb-24'><SkeletonList /></div>
              ) : (
                <>
                  {prevcall?.map((aitem) => (
                    <CallsTab call={aitem} key={aitem.id} active="1" />
                  ))}
                  {activecall?.map((pitem) => (
                    <CallsTab call={pitem} key={pitem.id} active="0" />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default ProfileTab;





