import LeaderboardLayout from "./layout"
import { FaChevronRight } from "react-icons/fa";
import React, { act, useEffect, useState } from "react";
import { supabase } from "lib/supabase";
import { SkeletonList, SkeletonRow } from "../../components/skeleton/forum";
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
      if (data.length > 0) { setUsers(data); setIsLoading(false); }
    }
    fetchCalls();

  }, []);

  return (<LeaderboardLayout>
    <div className="border-r border-gray-800 overflow-auto">
      <div className="grid grid-rows-[76px_1fr] flex-col h-screen border-gray-800">

        <div className="flex border-b border-gray-800 flex items-center px-[18px]">
          <button onClick={() => navigate(-1)} ><img src={Prev} className="w-[24px] h-[24px] mr-[12px] ml-[12px]" /></button>
          <img src={Ranks} className="w-[28px] h-[44px] mr-[12px]" />
          <span className="text-[18px] font-semibold text-white">Ranking</span>
        </div>
        <div className="flex border-b border-gray-800 flex justify-between p-[18px]">
          <div className=" flex flex-col gap-5  flex-grow loading">
            {
              isLoading || !users.length ? (<><SkeletonRow opacity={90} /><SkeletonRow opacity={90} /><SkeletonRow opacity={90} /><SkeletonRow opacity={70} /><SkeletonRow opacity={50} /><SkeletonRow opacity={30} /></>)
                : (
                  <>{users.map((item, index) => (<Link to={`/profile?id=${item.id}&tag=1`} key={index}>
                    <div className="bg-gray-50 p-1.5 circle flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`leader-rank${index + 1}`}>{index + 1}</span>
                        <div className="p-2.5 sm:p-3 circle border border-gray-150 flex items-center gap-2.5">
                          <div className={`circle-item w-7 h-7 bg-red-300 text-black text-sm font-bold badge-rank-${item.rank}`}></div>
                          <div className="space-y-0.5">
                            <div className="text-xs text-gray-600">Rank {item.rank}</div>
                            <div className="flex gap-1 items-center mr-2">
                              <span className="font-bold text-sm">{item.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-3 sm:px-[18px] py-3 circle overflow-auto border border-gray-150 flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Win ratio</span>
                            <div className="text-xs bg-primary/20 px-2 py-1.5 sm:hidden flex items-center gap-1 rounded-full">
                              <span className="text-primary">Calls</span>
                              <span className="text-primary font-bold">{item.callcount}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="text-xs bg-gray-100 px-1 py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 circle">
                              <span className="text-white">Week</span>
                              <span className="text-primary font-bold">{item.weekrate ? item.weekrate : 0}%</span>
                            </div>
                            <div className="text-xs bg-gray-100 px-1 py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 circle">
                              <span className="text-white">Month</span>
                              <span className="text-primary font-bold">{item.monthrate ? item.monthrate : 0}%</span>
                            </div>
                            <div className="text-xs bg-gray-100 px-1 py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 circle">
                              <span className="text-white">All time</span>
                              <span className="text-primary font-bold">{item.winrate ? item.winrate : 0}%</span>
                            </div>
                          </div>
                          <div className="text-xs bg-primary/20 px-1 py-1 sm:px-2 sm:py-1.5 hidden sm:flex items-center gap-1 circle">
                            <span className="text-primary">Calls</span>
                            <span className="text-primary font-bold">{item.callcount ? item.callcount : 0}</span>
                          </div>
                        </div>
                      </div>
                      <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item mr-2.5 !hidden lg:!flex">
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