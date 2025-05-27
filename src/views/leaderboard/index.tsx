import LeaderboardLayout from "./layout"
import { FaChevronRight } from "react-icons/fa";
import React, { act, useEffect, useState } from "react";
import { supabase } from "lib/supabase";
import { SkeletonList,SkeletonRow } from "../../components/skeleton/forum";
import Ranks from 'assets/img/Ranks.png';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Prev from 'assets/img/prev.png';
const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
  setIsLoading(true);
  const fetchCalls = async () => {
  const { data, error } = await supabase
        .from("users")
        .select("*")
        .order('rank', { ascending: false })  // higher rank first
        .order('winrate', { ascending: false }); 
      if (error) {
        console.error("Error fetching calls:", error.message);
        return;
      }
    if (data.length > 0) { setUsers(data);setIsLoading(false); }
     }
    fetchCalls();   
    
  }, []);
  
  return (<LeaderboardLayout>
    <div className="border-r border-gray-800 overflow-auto">
      <div className="grid grid-rows-[76px_1fr] flex-col h-screen border-gray-800">
        
        <div className="hidden lg:flex border-b border-gray-800 flex items-center px-[18px]">
          <button onClick={() => navigate(-1)} ><img src={Prev} className="w-[24px] h-[24px] mr-[12px] ml-[12px]" /></button>
          <img src={Ranks} className="w-[28px] h-[44px] mr-[12px]" />
          <span className="text-[18px] font-semibold text-[#76767E] lg:text-white">Ranking</span>
        </div>
        <div className="  p-[18px]">
          <div className=" flex flex-col gap-2.5 lg:gap-5 pb-[80px] lg:pb-0 lg:flex-grow loading">
        { 
          isLoading || !users.length ? (<><SkeletonRow opacity={90} /><SkeletonRow opacity={90} /><SkeletonRow opacity={90} /><SkeletonRow opacity={70} /><SkeletonRow opacity={50} /><SkeletonRow opacity={30} /></>)
            : (
          <>{users.map((item, index) => (<Link to={`/profile?id=${item.id}&tag=1`} key={index}>
          <div className="lg:bg-gray-50 bg-transparent border border-[#FFFFFF1A] lg:border-none p-2.5 lg:p-1.5 circle flex items-center justify-between">
            <div className="lg:flex flex-wrap items-center gap-3">
              <div className="flex gap-1.5 items-center">

              <span className={`leader-rank${index+1}`}>{index+1}</span>
              <div className="lg:p-2.5 lg::p-3 lg:circle lg:border lg:border-gray-150 flex items-center gap-2.5">
                <div className={`circle-item lg:w-7 lg:h-7 w-[18px] h-[18px] bg-red-300 text-black text-[9px] lg text-[10px]:md:text-sm font-bold badge-rank-${item.rank}`}></div>
                <div className="space-y-0.5  flex   items-center gap-1">
                  <div className=" text-[10px] lg:flex hidden md:text-xs text-gray-600">Rank { item.rank}</div>
                  <div className="flex gap-1 items-center lg:mr-2">
                    <span className="font-bold text-[10px] md:text-sm">{ item.name}</span>
                  </div>
                  <span className="text-[#76767E] lg:hidden text-[10px] font-medium">
                  55%
                  </span>
                </div>
              </div>
              </div>

              <div className="lg:px-3 lg:sm:px-[18px] pt-2 lg:py-3 circle overflow-auto lg:border border-gray-150 flex-col lg:flex-row flex lg:items-center gap-1 lg:gap-2 lg:flex-wrap">
                <div className="flex items-center gap-2">
                  <span className=" text-[10px] md:text-xs text-gray-600">Win ratio :</span>
                  <div className=" text-[10px] md:text-xs bg-primary/20 px-2 py-1.5 sm:hidden hidden lg:flex items-center gap-1 rounded-full">
                    <span className="text-primary">Calls</span>
                    <span className="text-primary font-bold">{item.callcount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-2">
                  <div className=" text-[10px] md:text-xs lg:bg-gray-100 lg:px-1 lg:py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 circle">
                    <span className="text-[#76767E] lg:text-white">Week</span>
                    <div className="px-[3px] rounded-[3px] h-[16px] bg-[#59FFCB33] lg:bg-transparent flex items-center">

                    <span className="text-[#59FFCB] text-[10px] lg:text-sm lg:text-primary font-bold">{item.weekrate?item.weekrate : 0}%</span>
                    </div>
                  </div>
                  <div className=" text-[10px] md:text-xs lg:bg-gray-100 lg:px-1 lg:py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 circle">
                    <span className="text-[#76767E] lg:text-white">Month</span>
                    <div className="px-[3px] rounded-[3px] h-[16px] bg-[#59FFCB33] lg:bg-transparent flex items-center">

                    <span className="text-[#59FFCB] text-[10px] lg:text-sm lg:text-primary font-bold">{item.monthrate?item.monthrate : 0}%</span>
                    </div>
                  </div>
                  <div className=" text-[10px] md:text-xs lg:bg-gray-100 lg:px-1 lg:py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 circle">
                    <span className="text-[#76767E] lg:text-white">All time</span>
                    <div className="px-[3px] rounded-[3px] h-[16px] bg-[#59FFCB33] lg:bg-transparent flex items-center">

                    <span className="text-[#59FFCB] text-[10px] lg:text-sm lg:text-primary font-bold">{item.winrate?item.winrate : 0 }%</span>
                    </div>
                  </div>
                  <div className=" text-[10px] md:text-xs lg:bg-gray-100 lg:px-1 lg:py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 circle">
                    <span className="text-[#76767E] lg:text-white">Calls</span>
                    <div className="px-[3px] rounded-[3px] h-[16px] bg-[#1C1B1F] lg:bg-transparent flex items-center">

                    <span className="text-[#FFFFFF] text-[10px] lg:text-sm lg:text-primary font-bold">{item.callcount?item.callcount : 0 }%</span>
                    </div>
                  </div>
                </div>
                <div className=" text-[10px] md:text-xs bg-primary/20 lg:px-1 lg:py-1 sm:px-2 sm:py-1.5 hidden lg::flex items-center gap-1 circle">
                  <span className="text-primary">Calls</span>
                  <span className="text-[#59FFCB] text-[10px] lg:text-sm lg:text-primary font-bold">{item.callcount?item.callcount : 0}</span>
                </div>
              </div>
            </div>
            <button className="bg-gray-100 text-gray-400 lg:w-8 lg:h-8 w-[26px] h-[26px]  circle-item lg:mr-2.5  !flex">
              <FaChevronRight />
            </button>
          </div>
        </Link>
        ))}</>)
     }  
     </div>
        </div>
      </div>
    </div>
  </LeaderboardLayout>)
}

export default Leaderboard;