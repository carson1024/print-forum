import React, { act, useState } from "react";
import ForumLayout from "./layout"
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import Token from 'assets/img/sample/token.png';
import IconCopy from 'assets/img/icons/copy.svg';
import { Link } from "react-router-dom";

const ForumList = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'latest'>('featured');
  const [filter, setFilter] = useState("All Ranks");
  const forumData = [
    { id: 1, name: "$PEPESI", multiplier: "10X", rank: "1", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 2, name: "$PEPESI", multiplier: "100X", rank: "2", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 3, name: "$PEPESI", multiplier: "20X", rank: "3", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 4, name: "$PEPESI", multiplier: "10X", rank: "4", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 5, name: "$PEPESI", multiplier: "100X", rank: "6", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 6, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 7, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 8, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
  ];

  return <ForumLayout>
    <div className="card flex-grow p-0 flex flex-col overflow-hidden">
      <div className="px-6 py-6 border-b-[1px] border-gray-100 flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <h2 className="text-lg font-semibold">Forum Listing</h2>
          <div className="btn-group">
            <button className={`btn ${activeTab == 'featured' ? 'active' : ''}`} onClick={() => setActiveTab('featured')}>Featured</button>
            <button className={`btn ${activeTab == 'latest' ? 'active' : ''}`} onClick={() => setActiveTab('latest')}>Latest</button>
          </div>
        </div>
        <button className="flex rounded-full items-center bg-primary/20 text-primary px-3 py-2 hover:bg-primary/30">
          <span className="text-primary/30 mr-2">Show</span> <span>{filter}</span> <AiFillCaretDown className="text-primary/30 ml-1" />
        </button>
      </div>
      
      <div className="p-6 flex flex-col gap-5 overflow-auto flex-grow">
        {forumData.map((item) => (<Link to="/token/123" key={item.id}>
          <div className="bg-gray-50 p-1.5 rounded-full flex items-center gap-2.5">
            <div className="flex flex-wrap grow">
              <div className="flex grow gap-3 items-center">
                <img src={Token} className="w-16 h-16 circle"/>
                <div className="grow space-y-1.5">
                  <div className="flex gap-2.5 items-center">
                    <span className="font-bold">{item.name}</span>
                    <span className={`badge-multiplier-${item.multiplier}`}></span>
                    <div className="bg-gray-100 px-2 py-1.5 rounded-full flex text-xs gap-1 items-center">
                      <span>CA</span>
                      <span className="truncate text-gray-400">Gmx…AyW</span>
                      <button className="text-gray-400"><img src={IconCopy} className="opacity-40"/></button>
                    </div>
                    <span className="text-sm text-gray-600">3m</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="bg-gray-100 px-2 py-1.5 rounded-full flex text-xs gap-1">
                      Marketcap {item.marketcap}
                    </div>
                    <div className="bg-green-600 px-2 py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                      <AiFillCaretUp />
                      <span>{item.percentage}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
                  <span className={`badge-rank-${item.rank}`}></span>
                  <div>
                    <div className="text-gray-600">Caller</div>
                    <div className="font-bold text-sm">{item.caller} <span className="text-xs text-gray-600">55%</span></div>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
                  <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
                  <span className="text-xs text-gray-600">55%</span>
                </div>
              </div>
            </div>
            <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item mr-4">
              <FaChevronRight />
            </button>
          </div>
        </Link>
        ))}
      </div>
    </div>
  </ForumLayout>
}

export default ForumList;