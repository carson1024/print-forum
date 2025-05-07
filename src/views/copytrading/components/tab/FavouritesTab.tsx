import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdStar } from "react-icons/md";
import React, { useEffect, useRef } from 'react';
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { supabase } from "lib/supabase";
import { formatNumber, formatShortAddress, formatTimestamp } from "utils/blockchain"

const FavouritesTab = ({
  users
}: {
  users: any[]
  }) => {
  const [favo, setFavo] = useState([]);
    const { isLogin, session, user } = useAuth();
    useEffect(() => {
      if (isLogin && user) {
        const rawFavos = user.favos;
        // Safely parse if it's a string
        const parsedFavos = typeof rawFavos === "string" ? JSON.parse(rawFavos) : rawFavos;
        setFavo(parsedFavos || []);
      }
    }, [user]);
  return (<>
    {users.map((user, index) => (<Link to={`/profile?id=${user.id}&tag=2`} key={index}>
          <div className="trading_border  flex items-center justify-between">
            <div className="flex items-center ">
              <div className="trade_number_border items-center text-gray-600 text-bold text-[10px] mr-[6px]">{index + 1}</div>
              <span className={`badge-rank-${user.rank} w-[20px] h-[20px] items-center mr-[6px]`}></span>
              <span className="text-[12px] font-semibold text-white mr-[6px]">{user.name}</span>
              <span className="text-[12px] font-Medium text-gray-600 mr-[6px]">{user.winrate}%</span>
              <span className="text-[12px] font-Medium text-gray-600 mr-[6px]">{formatTimestamp(user.created_at)}</span>
              <span className="text-[12px] font-Medium text-gray-600 mr-[6px]">PnL</span>
              <span className="text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">2.01 SOL</span>
              <span className="text-[12px] font-Medium text-gray-600 mr-[6px]">ROI</span>
              <span className="text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">+64.31%</span>
              <span className="text-[12px] font-Medium text-gray-600 mr-[6px]">Win Ratio</span>
              <span className="text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">{user.winrate}%</span>
              <span className="text-[12px] font-Medium text-gray-600 mr-[6px]">TFA</span>
              <span className="text-[12px] border_num_white font-Medium text-white mr-[10px]">0 SOL</span>
              <span className="text-[12px] font-Medium text-gray-600 mr-[6px]">Followers</span>
              <span className="text-[12px] border_num_white font-Medium text-[#59FFCB] mr-[10px]">3</span>
            </div>
            <div className="hidden sm:flex gap-2">
              
                <button className="bg-gray-100 text-primary w-8 h-8 circle-item" >
                <MdStar size={20} />
                </button> 
              <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
                <FaChevronRight />
              </button>
            </div>
          </div>
        </Link>
        ))}
  </>);
}

export default FavouritesTab;