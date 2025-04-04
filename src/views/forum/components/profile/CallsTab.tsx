import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import Token from 'assets/img/sample/token.png';
import IconCopy from 'assets/img/icons/copy.svg';
import { Link } from "react-router-dom";
import { act, useEffect } from "react";
import { supabase } from "lib/supabase";
import { SkeletonList, SkeletonRow } from "../../../../../src/components/skeleton/forum";
import React, { useState } from "react";
import { formatNumber, formatShortAddress, formatTimestamp } from "../../../../utils/blockchain"

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
  };
};
const CallsTab = ({ myprofile }: Props) => {
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
            if(data) {
              const active = (data.filter(call => new Date(call.created_at).getTime() + 86400000 - Date.now() > 0));
              setPrevcall(active);
              const prev = (data.filter(call => new Date(call.created_at).getTime() + 86400000 - Date.now() <= 0));
              setActivecall(prev)
            }
  };
    scan(); 
     setIsLoading(false);
      // Subscribe to real-time changes in the "calls" table
       }, []);
 
  const buttonActive = () => {
    setState(1);
  }
const buttonPrev = () => {
    setState(0);
  }
  return (<>
    <div className="p-4 sm:p-6 h-full flex flex-col gap-3">
      <div className='btn-group primary !hidden sm:!flex'>

        <button className={`btn btn-sm  ${state == 1 ? 'active' : ''}`} onClick={() => buttonActive()}>Active Calls</button>
        <button className={`btn btn-sm  ${state == 0 ? 'active' : ''}`} onClick={() => buttonPrev()}>Previous Calls</button>

      </div>
      <div className="flex-grow overflow-auto">
        <div className='flex flex-col gap-3'>

          {isLoading ? <SkeletonList /> :
            <>
              {state == 0 ? <>
                {
                  !activecall.length ?
                    <>
                      <SkeletonRow opacity={60} />
                      <SkeletonRow opacity={30} />
                    </> : <>{activecall.map((item) => (<Link to="/token/123" key={item.id}>
          <div className="bg-gray-50 p-1.5 pr-3 rounded sm:rounded-[40px] flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-wrap grow">
                <div className="flex grow gap-2 sm:gap-3 items-center">
                  <img src={item.image} className="w-[44px] h-[44px] sm:w-16 sm:h-16 circle"/>
                  <div className="grow space-y-1 sm:space-y-1.5">
                    <div className="flex gap-1.5 sm:gap-2.5 items-center">
                      <span className="text-sm sm:text-base font-bold">{item.name}</span>
                      <span className={`badge-multiplier-${item.featured}`}></span>
                      <div className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1 items-center">
                        <span>CA</span>
                        <span className="truncate text-gray-400">{item.address}</span>
                        <button className="text-gray-400"><img src={IconCopy} className="opacity-40"/></button>
                      </div>
                      <span className="text-sm text-gray-600">{formatTimestamp(item.updated_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <div className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1">
                        Marketcap {formatNumber(item.init_market_cap)} to {formatNumber(item.changedCap)}
                      </div>
                      { 
                        item.percentage > 100 ? 
                        <div className="bg-green-600 px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                          <AiFillCaretUp />
                          <span>{item.percentage}%</span>
                        </div> :
                        <div className="bg-red-400 px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                          <AiFillCaretDown />
                          <span>{item.percentage}%</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-3 justify-between">
                  <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
                    <span className={`badge-rank-${myprofile.rank}`}></span>
                    <div>
                      <div className="text-gray-600">Caller</div>
                      <div className="font-bold text-sm">{myprofile.name} <span className="text-xs text-gray-600">{myprofile.winrate}%</span></div>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
                    <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
                    <span className="text-xs text-gray-600">55%</span>
                  </div>
                </div>
              </div>
              <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item !hidden lg:!flex">
                <FaChevronRight />
              </button>
            </div>
            <div className="flex md:hidden items-center gap-1 sm:gap-3 justify-between">
              <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
                <span className={`badge-rank-${myprofile.rank}`}></span>
                <div>
                  <div className="text-gray-600">Caller</div>
                  <div className="font-bold text-sm">{myprofile.name} <span className="text-xs text-gray-600">{myprofile.winrate}%</span></div>
                </div>
              </div>
              <div className="border border-gray-100 rounded-full px-2.5 py-3.5 flex gap-1 items-center">
                <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
                <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
                <span className="text-xs text-gray-600">70%</span>
              </div>
            </div>
          </div>
        </Link>
        ))}</>
                }
              </>
                : <>
                  {
                    !prevcall.length ?
                      <>
                        <SkeletonRow opacity={60} />
                        <SkeletonRow opacity={30} />
                      </> : <>{prevcall.map((item) => (<Link to="/token/123" key={item.id}>
          <div className="bg-gray-50 p-1.5 pr-3 rounded sm:rounded-[40px] flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-wrap grow">
                <div className="flex grow gap-2 sm:gap-3 items-center">
                  <img src={item.image} className="w-[44px] h-[44px] sm:w-16 sm:h-16 circle"/>
                  <div className="grow space-y-1 sm:space-y-1.5">
                    <div className="flex gap-1.5 sm:gap-2.5 items-center">
                      <span className="text-sm sm:text-base font-bold">{item.name}</span>
                      <span className={`badge-multiplier-${item.featured}`}></span>
                      <div className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1 items-center">
                        <span>CA</span>
                        <span className="truncate text-gray-400">{item.address}</span>
                        <button className="text-gray-400"><img src={IconCopy} className="opacity-40"/></button>
                      </div>
                      <span className="text-sm text-gray-600">{formatTimestamp(item.updated_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <div className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1">
                        Marketcap {formatNumber(item.init_market_cap)} to {formatNumber(item.changedCap)}
                      </div>
                      { 
                        item.percentage > 100 ? 
                        <div className="bg-green-600 px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                          <AiFillCaretUp />
                          <span>{item.percentage}%</span>
                        </div> :
                        <div className="bg-red-400 px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                          <AiFillCaretDown />
                          <span>{item.percentage}%</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-3 justify-between">
                  <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
                    <span className={`badge-rank-${myprofile.rank}`}></span>
                    <div>
                      <div className="text-gray-600">Caller</div>
                      <div className="font-bold text-sm">{myprofile.name} <span className="text-xs text-gray-600">{myprofile.winrate}%</span></div>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
                    <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
                    <span className="text-xs text-gray-600">55%</span>
                  </div>
                </div>
              </div>
              <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item !hidden lg:!flex">
                <FaChevronRight />
              </button>
            </div>
            <div className="flex md:hidden items-center gap-1 sm:gap-3 justify-between">
              <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
                <span className={`badge-rank-${myprofile.rank}`}></span>
                <div>
                  <div className="text-gray-600">Caller</div>
                  <div className="font-bold text-sm">{myprofile.name} <span className="text-xs text-gray-600">{myprofile.winrate}%</span></div>
                </div>
              </div>
              <div className="border border-gray-100 rounded-full px-2.5 py-3.5 flex gap-1 items-center">
                <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
                <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
                <span className="text-xs text-gray-600">70%</span>
              </div>
            </div>
          </div>
        </Link>
        ))}</>
                  }
              
                </>}         
            </>           
          }

        
          

        
        </div>
      </div>
    </div>
  </>);
}

export default CallsTab;