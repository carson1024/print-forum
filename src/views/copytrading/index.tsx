import { useState } from "react";
import CopyTradingLayout from "./layout"
import { MdCandlestickChart } from "react-icons/md";
import { MdStar } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import {useSearchParams } from 'react-router-dom';
import { AiFillCaretDown } from "react-icons/ai";
import PortfoliosTab from "./components/tab/PortfoliosTab";
import TradersTab from "./components/tab/TradersTab";
import FavouritesTab from "./components/tab/FavouritesTab";
import { IoSearchSharp } from "react-icons/io5";
import { MdFilterListAlt } from "react-icons/md";
import CopyFilterModal from "components/modal/CopyFilterModal";
import React, { useEffect,useRef  } from 'react';
import { supabase } from "lib/supabase";
import { SkeletonList, SkeletonRow } from "../../components/skeleton/forum";
import Bag from 'assets/img/bag.png';
import Bag_R from 'assets/img/bag_r.png';
import Star from 'assets/img/star.png';
import Star_R from 'assets/img/star_r.png';
import User_face from 'assets/img/user_face.png';
import User_face_R from 'assets/img/user_faceR.png';

interface SubTabType {
  portfolios: string;
  traders: string;
  favorites: string;
}

const options = ["7 days", "30 days", "90 days"];

function useOutsideAlerter(ref: any, setX: any): void {
  React.useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setX(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
    // Unbind the event listener on clean up
    document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setX]);
}

const CopyTrading = () => {
  const [users, setUsers] = useState([]);
  const [saveusers, setSaveUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState(searchParams.get('day') || "7 days");
    const wrapperRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState<'public' | 'trader' | 'favo'>('public');
  const [activeTag, setActiveTag] = useState<'pnl' | 'rol' | 'total'>('pnl');

  const [activeSubTab, setActiveSubTab] = useState<SubTabType>({
    portfolios: 'pnl',
    traders: 'pnl',
    favorites: 'pnl'
  });

  const updateSubTab = (tab: 'portfolios' | 'traders' | 'favorites', subTab: string) => {
    setActiveSubTab((prev) => ({
      ...prev,
      [tab]: subTab
    }));
  }
  useOutsideAlerter(wrapperRef, setIsOpen);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (op: string): void =>{
    setFilters(op);
    setSearchParams({ type:activeTab, day: op });
    setIsOpen(false);
  };
  
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
      if (data.length > 0) {
        setUsers(data);
        setSaveUsers(data);
        setIsLoading(false); 
      }
       }
      fetchCalls();   
      
    }, []);
  
    const handleSearch = () => { 
    const newdata = saveusers.filter(user => user.name.includes(filter) === true);
    setUsers(newdata);
  }

  return <CopyTradingLayout>
    <div className="border-r border-gray-800 grow loading flex-col h-screen">
      <div className="grid grid-rows-[76px_64px_1fr] flex-col h-screen border-gray-800"> 
        <div className="flex border-b border-gray-800 flex items-center">
         <div className=" flex text-[14px] font-semibold text-gray-500">
            {
              activeTab == 'public' ? <button className="ml-[18px] repause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('public')}>
              <img src={Bag} className=""/>
              <span className="text-primary">Public Portfolios</span>
              </button>:
              <button className="ml-[20px] pause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('public')}>
              <img src={Bag_R} className=""/>
              <span >Public Portfolios</span>
              </button>
            }
            {
              activeTab == 'trader' ? <button className="ml-[20px] repause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('trader')}>
              <img src={User_face_R} className=""/>
              <span className="text-primary">My Traders</span>
              </button>:
              <button className="ml-[20px] pause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('trader')}>
              <img src={User_face} className=""/>
              <span>My Traders</span>
            </button>
            }
            {
              activeTab == 'favo' ? <button className="ml-[20px] repause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('favo')}>
              <img src={Star_R} className=""/>
              <span className="text-primary">My Favorites</span>
              </button>:
              <button className="ml-[20px] pause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('favo')}>
              <img src={Star} className=""/>
              <span>My Favorites</span>
            </button>
            }
         </div>
         <div className="ml-auto mr-[18px]">
            <button className=" btn_newtrade font-semibold text-black text-[14px] flex items-center justify-center flex" >
              <FaPlus className="text-xs lg:text-base" />New Trade
            </button>
         </div>
        </div>
        <div className="flex border-b border-gray-800 flex items-center">
         <div className=" flex px-[18px]">
          {
             activeTag == 'pnl' ? <button className="mr-[8px] btn_filter font-semibold text-white text-[12px] flex items-center justify-center flex" onClick={() => setActiveTag('pnl')} >
              PnL
              </button> :
              <button className="mr-[8px] btn_filter_before font-semibold text-gray-600 text-[12px] flex items-center justify-center flex" onClick={() => setActiveTag('pnl')} >
              PnL
          </button>
          }
          {
            activeTag == 'rol' ?  <button className="mr-[8px] btn_filter font-semibold text-white text-[12px] flex items-center justify-center flex" onClick={() => setActiveTag('rol')}>
              ROL
            </button> :
            <button className="mr-[8px] btn_filter_before font-semibold text-gray-600 text-[12px] flex items-center justify-center flex" onClick={() => setActiveTag('rol')}>
              ROL
          </button>
          }
          {
            activeTag == 'total' ?<button className="mr-[8px] btn_filter font-semibold text-white text-[12px] flex items-center justify-center flex" onClick={() => setActiveTag('total')} >
              Total Copiers
            </button> :
            <button className="mr-[8px] btn_filter_before font-semibold text-gray-600 text-[12px] flex items-center justify-center flex" onClick={() => setActiveTag('total')} >
              Total Copiers
            </button>
            }
          </div>
          <div className="ml-auto">
             <div className="flex gap-2 sm:gap-3">
                       <div className="px-3 py-1 md:py-2 round_filter text-white flex items-center gap-2">
                         <IoSearchSharp className="text-gray-600 text-md md:text-base"/>
                         <input 
                           type="text" 
                           className="bg-transparent outline-none text-white flex-grow text-xs md:text-sm max-w-[100px] sm:max-w-[140px]"
                           placeholder="Search user"
                           onChange={(e) => setFilter(e.target.value)}
                           onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                handleSearch();
                             }
                             }}
                         />
                       </div>
                       <div className="flex">
                         <button className="text-gray-600 w-[28px] y-[28px] sm:w-8 sm:y-8 round_filter hover:text-primary hover:bg-gray-200" onClick={() => setIsFilterModalOpen(true)}>
                           <MdFilterListAlt />
                         </button>
                       </div>
                       <div ref={wrapperRef} className="relative inline-block text-left mr-[18px]">
                             <button
                           className="flex round_filter items-center text-white  px-3 py-2 hover:bg-primary/30 text-xs md:text-base"
                             onClick={toggleDropdown}>
                             <span>{filters}</span>
                             <AiFillCaretDown className="text-primary/30 ml-1" /></button>
                             {isOpen && (
                               <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-36 text-white overflow-hidden rounded-sm pb-2 z-10 text-sm bg-neutral-800 shadow-lg w-full" >
                               {options.map((op) => (
                                 <button
                                   key={op}
                                   className={`block w-full px-4 py-2.5 text-left hover:text-black hover:bg-primary/50 ${filters == op ? 'bg-primary/50 text-black' : ''}`}
                                   onClick={() => handleSelect(op)}
                                 >
                                   {op}
                                 </button>
                                   ))}
                               </div>
                             )}
                         </div>
              </div>
          </div>
        </div>
        <div className="flex border-b border-gray-800 flex overflow-y-auto h-[calc(100vh-202px)]">
          {
        isLoading || !users.length ?<div className="m-[18px] flex flex-col gap-5 overflow-auto flex-grow loading">
        <><SkeletonRow opacity={90} /><SkeletonRow opacity={90} /><SkeletonRow opacity={90} /><SkeletonRow opacity={70} /><SkeletonRow opacity={50} /><SkeletonRow opacity={30} /></>
        </div> :
        <div className="p-4  flex flex-col gap-5 overflow-auto flex-grow">
        {
          activeTab == 'public' ?
         <PortfoliosTab users={users} />              
          : activeTab == 'trader' ?
           <TradersTab users={users} />
          : <FavouritesTab users={users}/>
        }
      </div>
      }
        </div>
      </div>
    </div>
    <CopyFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
  </CopyTradingLayout>
}

export default CopyTrading;