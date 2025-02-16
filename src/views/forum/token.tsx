import React, { useState } from "react";
import ForumLayout from "./layout"
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import Token from 'assets/img/sample/token.png';
import IconCopy from 'assets/img/icons/copy.svg';
import IconSend from 'assets/img/icons/send.svg';
import { Link, useNavigate } from "react-router-dom";
import Dexscreener from 'assets/img/sample/dexscreener.png';
import Photon from 'assets/img/sample/photon.png';
import { FaExternalLinkAlt } from "react-icons/fa";
import IconUser from 'assets/img/icons/user.svg';

const TokenDetail = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Ranks");
  const forumData = [
    { id: 1, name: "$PEPESI", multiplier: "10X", rank: "1", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 2, name: "$PEPESI", multiplier: "100X", rank: "2", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 3, name: "$PEPESI", multiplier: "20X", rank: "3", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 4, name: "$PEPESI", multiplier: "10X", rank: "4", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 5, name: "$PEPESI", multiplier: "100X", rank: "6", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 6, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 6, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 6, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    
  ];

  return <ForumLayout>
    <div className="card flex-grow p-0 flex flex-col overflow-hidden">
      <div className="px-6 py-2.5 border-b-[1px] border-gray-100 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate(-1)} className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
            <FaChevronLeft />
          </button>
          <img src={Token} className="w-[59px] h-[59px] circle"/>
          <div className="flex gap-3">
            <div className="flex gap-3 items-center">
              <span className="font-bold text-lg">$PEPESI</span>
              <span className={`badge-multiplier-200X`}></span>
            </div>
            <div className="flex gap-3 flex-wrap">
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
        <div className="flex gap-1 items-center">
          <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
          <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
          <span className="text-xs text-gray-600">55%</span>
        </div>
      </div>
      
      <div className="flex-grow relative overflow-hidden">
        <div className="p-6 overflow-auto h-full">
          <div className="grid grid-cols-10 gap-6">
            <div className="col-span-6 flex flex-col gap-5">
              {/* Holders & Callers */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <span>Callers</span> 
                  <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">72</span>
                </div>
                <div className="flex gap-2">
                  <span>Top 10 holders</span> 
                  <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">22.4% ($20m)</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span>Top 3 holders</span>
                  <div className="flex gap-2"> 
                    {Array(3).fill(0).map((holder, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">3.3% ($1.3m)</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="space-y-3">
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
              </div>
              <h3 className="text-md">Top Callers</h3>
              <div className="flex">
                <div className="flex flex-col gap-3">
                  {Array(6).fill(0).map((item, index) => (<Link to="/profile/123" key={index}>
                    <div className="bg-gray-50 px-4 py-1.5 rounded-full flex items-center">
                      <p className="font-semibold w-[36px]">#{index+1}</p>
                      <div className="flex items-center gap-4">
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
                        <div className="px-5 py-3 rounded-full bg-gray-100 flex flex-col gap-1">
                          <div className="flex gap-1">
                            <span className="text-xs">Marketcap</span>
                            <span className="text-xs text-primary font-semibold">200X</span>
                          </div>
                          <span className="text-xs text-white"><b>475.5k</b> to <b>880.4k</b></span>
                        </div>
                        <div>
                          <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">+10 XP</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-6 h-full w-[38%] py-6">
          <div className="rounded bg-gray-100 w-full h-full px-3 py-6 flex flex-col gap-5">
            <div className="flex-grow overflow-hidden">
              <div className="overflow-auto h-full px-3">
                {
                  Array(3).fill(0).map(() => <div className="flex gap-4 border-b-[1px] border-gray-100 py-3">
                    <div>
                      <div className="w-[50px] h-[50px] bg-black circle-item">
                        <img src={IconUser} className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <div className="space-y-1 flex-grow">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1 items-center">
                          <span className="font-bold text-sm text-gray-600">UsernameLong</span>
                          <span className="text-xs text-gray-600">55%</span>
                          <div className="circle-item w-7 h-7 bg-red-300 text-black text-sm font-bold">V</div>
                        </div>
                        <span className="text-sm text-gray-600">3m</span>
                      </div>
                      <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet interdum nisi. Phasellus id pretium arcu, ac elementum eros. Nulla vulputate lacus ac erat maximus consectetur. 
                      </p>
                    </div>
                  </div>)
                }
              </div>
            </div>
            <div className="relative rounded-full bg-gray-100 px-12 mx-3 py-2 flex items-center">
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