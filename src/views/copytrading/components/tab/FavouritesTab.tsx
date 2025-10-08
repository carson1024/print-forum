import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdStar } from "react-icons/md";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { supabase } from "lib/supabase";
import {
  formatNumber,
  formatShortAddress,
  formatTimestamp,
} from "utils/blockchain";

const FavouritesTab = ({ users }: { users: any[] }) => {
  const [favo, setFavo] = useState<string[]>([]);
  const { isLogin, session, user } = useAuth();
  useEffect(() => {
    const loadFavourites = async () => {
      if (!isLogin || !session?.user?.id) return;
      const { data, error } = await supabase
        .from("favourites")
        .select("target_user_id")
        .eq("user_id", session.user.id);
      if (!error && data) setFavo(data.map((r: any) => r.target_user_id));
    };
    loadFavourites();
  }, [user]);
  return (
    <>
      {users
        .filter((u) => favo.includes(u.id))
        .map((user, index) => (
          <Link to={`/profile?id=${user.id}&tag=2`} key={index}>
            <div className="trading_border  flex items-center justify-between">
              <div className="flex  md:flex-wrap md:flex-wrap flex-col gap-3 lg:flex-row lg:items-center ">
                <div className="flex gap-[2px] items-center  ">
                  <div className="trade_number_border items-center text-gray-600 text-bold text-[10px] mr-[6px]">
                    {index + 1}
                  </div>
                  <span
                    className={`badge-rank-${user.rank} w-[20px] h-[20px] items-center mr-[6px]`}
                  ></span>
                  <span className="text-[10px] lg:text-[12px] font-semibold text-white mr-[6px]">
                    {user.display_name || user.username}
                  </span>
                  <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">
                    {user.winrate}%
                  </span>
                </div>
                <div className="flex gap-[2px] items-center  ">
                  <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">
                    {formatTimestamp(user.created_at)}
                  </span>
                  <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">
                    PnL
                  </span>
                  <span className="text-[10px] lg:text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">
                    2.01 SOL
                  </span>
                  <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">
                    ROI
                  </span>
                </div>
                <div className="flex gap-[2px] items-center  ">
                  <span className="text-[10px] lg:text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">
                    +64.31%
                  </span>
                  <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">
                    Win Ratio
                  </span>
                  <span className="text-[10px] lg:text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">
                    {user.winrate}%
                  </span>
                  <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">
                    TFA
                  </span>
                </div>
                <div className="flex gap-[2px] items-center  ">
                  <span className="text-[10px] lg:text-[12px] border_num_white font-Medium text-white mr-[10px]">
                    0 SOL
                  </span>
                  <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">
                    Followers
                  </span>
                  <span className="text-[10px] lg:text-[12px] border_num_white font-Medium text-[#59FFCB] mr-[10px]">
                    3
                  </span>
                </div>
              </div>
              <div className=" flex gap-2">
                <button className="bg-gray-100 text-primary w-8 h-8 circle-item">
                  <MdStar size={20} />
                </button>
                <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </Link>
        ))}
    </>
  );
};

export default FavouritesTab;
