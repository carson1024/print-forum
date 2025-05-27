import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdStar } from "react-icons/md";
import React, { useEffect, useRef } from 'react';
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { supabase } from "lib/supabase";
import { formatNumber, formatShortAddress, formatTimestamp } from "utils/blockchain"
const PortfoliosTab = ({
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

  const handleFavorite = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLogin || !user) return;
    const userId = e.currentTarget.id;

    // Clone and add
    let updatedFavos = Array.isArray(favo) ? [...favo] : [];
    if (!updatedFavos.includes(userId)) {
      updatedFavos.push(userId);
    }

    setFavo(updatedFavos);

    // Optional: update local user
    user.favos = updatedFavos;
    const { error: favoerror } = await supabase
      .from("users")
      .update({ favos: updatedFavos }) // ❗ Do NOT stringify
      .eq("id", user.id);

    if (favoerror) {
      console.error("Error updating favorites:", favoerror.message);
    }
  };

  return (<>
    {users.map((user, index) => (<Link to={`/profile?id=${user.id}&tag=2`} key={index}>
      <div className="trading_border  flex items-center justify-between">
        <div className="flex flex-col md:flex-wrap gap-[5px] lg:gap-3 lg:flex-row lg:items-center ">
          <div className="flex gap-[6px] items-center ">

            <div className="trade_number_border items-center text-gray-600 text-bold text-[10px] lg:mr-[6px]">{index + 1}</div>
            <div className="flex gap-[4px] items-center">

            <span className={`badge-rank-${user.rank} w-[20px] h-[20px] items-center lg:mr-[6px]`}></span>
            <span className="text-[10px] lg:text-[12px] font-semibold text-white lg:mr-[6px]">{user.name}</span>
            <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 lg:mr-[6px]">{user.winrate}%</span>
            </div>

          </div>
          <div className="flex gap-[2px] items-center">

            <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">{formatTimestamp(user.created_at)}</span>
            <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">PnL</span>
            <span className="text-[10px] lg:text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">2.01 SOL</span>
            <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">ROI</span>
            <span className="text-[10px] lg:text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">+64.31%</span>
          </div>
          <div className="flex gap-[2px] items-center">

            <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">Win Ratio</span>
            <span className="text-[10px] lg:text-[12px] border_number font-Medium text-[#59FFCB] mr-[10px]">{user.winrate}%</span>
            <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">TFA</span>
            <span className="text-[10px] lg:text-[12px] border_num_white font-Medium text-white mr-[10px]">0 SOL</span>
            <span className="text-[10px] lg:text-[12px] font-Medium text-gray-600 mr-[6px]">Followers</span>
            <span className="text-[10px] lg:text-[12px] border_num_white font-Medium text-[#59FFCB] mr-[10px]">3</span>
          </div>
        </div>
        <div className=" flex gap-2">
          {
            favo.includes(user.id) ? <button className="bg-gray-100 text-primary w-8 h-8 circle-item" >
              <MdStar size={20} />
            </button> :
              <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item" id={user.id} onClick={handleFavorite}>
                <MdStar size={20} />
              </button>
          }
          <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </Link>
    ))}
  </>);
}

export default PortfoliosTab;