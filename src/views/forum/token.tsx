import React, { useState } from "react";
import ForumLayout from "./layout"
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import Token from 'assets/img/sample/token.png';
import IconCopy from 'assets/img/icons/copy.svg';
import IconSend from 'assets/img/icons/send.svg';
import IconDiscussion from 'assets/img/icons/discussion.svg';
import { Link, useNavigate } from "react-router-dom";
import Dexscreener from 'assets/img/sample/dexscreener.png';
import Photon from 'assets/img/sample/photon.png';
import { FaExternalLinkAlt } from "react-icons/fa";
import IconUser from 'assets/img/icons/user.svg';

const TokenDetail = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Ranks");
  const [isDiscussionOpen, setDiscussionOpen] = useState(false);

  return <ForumLayout>
    <div className="card flex-grow p-0 flex flex-col overflow-hidden">
      <div className="px-4 py-4 sm:px-6 sm:py-2.5 border-b-[1px] border-gray-100 flex 2xl:justify-between items-center gap-3">
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate(-1)} className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
            <FaChevronLeft />
          </button>
          <img src={Token} className="w-8 h-8 sm:w-[59px] sm:h-[59px] circle"/>
          <div className="flex gap-3">
            <span className="font-bold text-base sm:text-lg">$PEPESI</span>
            <div className="hidden md:flex gap-3 flex-wrap">
              <span className={`badge-multiplier-200X`}></span>
              <div className="bg-gray-100 px-2 py-1.5 rounded-full flex text-xs gap-1">
                Marketcap 475.5k to 880.4k
              </div>
              <div className="bg-green-600 px-2 py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                <AiFillCaretUp />
                <span>519%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="flex gap-1 items-center">
            <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
            <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
            <span className="text-xs text-gray-600">55%</span>
          </div>
        </div>
        <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 circle-item !flex 2xl:!hidden ml-auto" onClick={() => setDiscussionOpen(!isDiscussionOpen)}>
          <img src={IconDiscussion} className="w-4 h-4"/>
        </button>
      </div>
      
      <div className="flex-grow relative overflow-hidden">
        <div className={`${isDiscussionOpen ? 'hidden 2xl:block' : ''} p-4 sm:p-6 overflow-auto h-full`}>
          <div className="2xl:grid grid-cols-10 gap-6">
            <div className="col-span-6 flex flex-col gap-5">
              {/* Price Information */}
              <div className="space-y-3 block md:hidden">
                <p className="text-white text-sm font-bold">Price information</p>
                <div className="flex gap-3 flex-wrap">
                  <span className={`badge-multiplier-200X`}></span>
                  <div className="bg-gray-100 px-2 py-1.5 rounded-full flex text-xs gap-1">
                    Marketcap 475.5k to 880.4k
                  </div>
                  <div className="bg-green-600 px-2 py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                    <AiFillCaretUp />
                    <span>519%</span>
                  </div>
                </div>
              </div>
              <div className="border-b-[1px] border-gray-100 md:hidden"></div>
              {/* Holders & Callers */}
              <div className="flex flex-col gap-3">
                <p className="block sm:hidden text-sm font-bold">Holders</p>
                <div className="hidden sm:flex gap-2">
                  <span>Callers</span> 
                  <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">72</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-base">Top 10 holders</span> 
                  <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">22.4% ($20m)</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-base">Top 3 holders</span>
                  <div className="flex gap-2"> 
                    {Array(3).fill(0).map((holder, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">3.3% ($1.3m)</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-b-[1px] border-gray-100 sm:hidden"></div>
              <div className="space-y-3 sm:max-w-[300px]">
                <p className="block sm:hidden text-sm font-bold">Links</p>
                <div className="bg-black px-5 py-2.5 rounded-full text-sm text-gray-600 flex items-center justify-between gap-20">
                  <span>
                    <span className="font-semibold text-white text-base">CA</span> Gmx…AyW
                  </span>
                  <button><img src={IconCopy} className="text-white w-6 h-6 brightness-100"/></button>
                </div>
                <button className="flex items-center justify-between w-full bg-black px-5 py-2.5 rounded-full">
                  <span className="flex items-center gap-2">
                    <img src={Dexscreener} alt="DEX Screener" className="w-6 h-6" /> <span className="text-sm">DEX Screener</span>
                  </span>
                  <FaExternalLinkAlt className="text-white" />
                </button>
                <button className="flex items-center justify-between w-full bg-black px-5 py-2.5 rounded-full">
                  <span className="flex items-center gap-2">
                    <img src={Photon} alt="Photon-SOL" className="w-6 h-6" /> <span className="text-sm">Photon-SOL</span>
                  </span>
                  <FaExternalLinkAlt className="text-white" />
                </button>
              </div>
              <div className="flex gap-2 sm:hidden">
                <span>Callers</span> 
                <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">72</span>
              </div>
              <h3 className="text-md hidden sm:block">Top Callers</h3>
              <div className="flex">
                <div className="flex flex-col gap-3 w-full">
                  {Array(6).fill(0).map((item, index) => (<Link to="/profile/123" key={index}>
                    <div className="bg-gray-50 px-2 md:px-4 py-2 rounded flex items-center gap-2 xl:gap-3 flex-wrap">
                      <span className="leader-rank1 2xl:leader-rank-none font-semibold w-[36px]">#{index+1}</span>
                      <div className="p-3 rounded-full border border-gray-150 flex items-center gap-2.5">
                        <div className="circle-item w-7 h-7 bg-red-300 text-black text-sm font-bold">V</div>
                        <div className="space-y-0.5">
                          <div className="flex gap-1 items-center">
                            <span className="font-bold text-sm">UsernameLong</span>
                            <span className="text-xs text-gray-600">55%</span>
                          </div>
                          <div className="text-xs text-gray-600">1 min ago</div>
                        </div>
                      </div>
                      <div className="px-2 py-2 2xl:px-5 2xl:py-3 rounded-full bg-gray-100 flex 2xl:flex-col gap-1 mr-auto">
                        <div className="flex gap-1">
                          <span className="text-xs">Marketcap</span>
                          <span className="text-xs text-primary font-semibold">200X</span>
                        </div>
                        <span className="text-xs text-white"><b>475.5k</b> to <b>880.4k</b></span>
                      </div>
                      <div className="">
                        <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">+10 XP</span>
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
              <div className="overflow-auto h-full space-y-3">
                {
                  Array(3).fill(0).map(() => <><div className="flex gap-4">
                    <div>
                      <div className="w-8 h-8 sm:w-[50px] sm:h-[50px] bg-black circle-item">
                        <img src={IconUser} className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1 items-center">
                          <span className="font-bold text-sm text-gray-600">UsernameLong</span>
                          <span className="text-xs text-gray-600">55%</span>
                          <div className="circle-item w-6 h-6 sm:w-7 sm:h-7 bg-red-300 text-black text-sm font-bold">V</div>
                        </div>
                        <span className="text-sm text-gray-600">3m</span>
                      </div>
                      <p className="text-sm sm:text-base leading-snug">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet interdum nisi. Phasellus id pretium arcu, ac elementum eros. Nulla vulputate lacus ac erat maximus consectetur. 
                      </p>
                    </div>
                  </div>
                  <div className="border-b-[1px] border-gray-100"></div>
                  </>)
                }
              </div>
            </div>
            <div className="relative rounded-full bg-gray-100 px-12 mx-1 sm:mx-3 py-2 flex items-center">
              <div className="absolute left-1 flex items-center">
                <div className="relative w-8 h-8 bg-black circle-item">
                  <img src={IconUser} className="w-2.5 h-2.5" />
                </div>
              </div>
              <input type="text" className="w-full bg-transparent outline-none text-white" placeholder="Add a comment..." />
              <div className="absolute right-3 flex items-center">
                <button>
                  <img src={IconSend} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ForumLayout>
}

export default TokenDetail;