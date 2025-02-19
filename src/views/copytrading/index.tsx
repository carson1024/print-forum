import { useState } from "react";
import CopyTradingLayout from "./layout"
import { MdCandlestickChart } from "react-icons/md";
import { MdStar } from "react-icons/md";
import { FaUser } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AiFillCaretDown } from "react-icons/ai";
import PortfoliosTab from "./components/tab/PortfoliosTab";
import TradersTab from "./components/tab/TradersTab";
import FavouritesTab from "./components/tab/FavouritesTab";
import { IoSearchSharp } from "react-icons/io5";
import { MdFilterListAlt } from "react-icons/md";
import CopyFilterModal from "components/modal/CopyFilterModal";

interface SubTabType {
  portfolios: string;
  traders: string;
  favorites: string;
}

const CopyTrading = () => {

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeTab,setActiveTab] = useState<'portfolios' | 'traders' | 'favorites'>('portfolios');
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

  return <CopyTradingLayout>
    <div className="flex items-center mb-4 flex-wrap gap-3 justify-center">
      <button className='btn btn-sm md:btn-lg btn-dark w-full sm:!hidden'><FaPlus className="text-xs mr-1 lg:text-base" /><span>New Trade</span></button>
      <div className="btn-group">
        <button className={`btn btn-sm lg:btn-lg ${activeTab == 'portfolios' ? 'active' : ''}`} onClick={() => setActiveTab('portfolios')}><FaUser className="text-xxs sm:mr-0.5 lg:text-base" /> <span>Public Portfolios</span></button>
        <button className={`btn btn-sm lg:btn-lg ${activeTab == 'traders' ? 'active' : ''}`} onClick={() => setActiveTab('traders')}><MdCandlestickChart className="text-sm sm:mr-0.5 lg:text-lg" /><span>My Traders (4)</span></button>
        <button className={`btn btn-sm lg:btn-lg ${activeTab == 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}><MdStar className="text-sm sm:mr-0.5 lg:text-lg" /><span>My Favorites</span></button>
      </div>
      <button className='btn btn-sm lg:btn-lg btn-dark ml-auto !hidden sm:!flex'><FaPlus className="text-xs mr-1 lg:text-base" /><span>New Trade</span></button>
    </div>
    <div className="card flex-grow p-0 flex flex-col overflow-hidden">
      <div className="p-4 md:p-6 border-b-[1px] border-gray-100 flex justify-between items-center flex-wrap gap-3">
        <div className="btn-group lighter">
          <button 
            className={`btn btn-sm !text-xs md:!text-base ${activeSubTab[activeTab] == 'pnl' ? 'active' : ''}`} 
            onClick={() => updateSubTab(activeTab, 'pnl')}>
              PnL
          </button>
          <button 
            className={`btn btn-sm !text-xs md:!text-base ${activeSubTab[activeTab] == 'roi' ? 'active' : ''}`}
            onClick={() => updateSubTab(activeTab, 'roi')}>
              ROI
          </button>
          <button
            className={`btn btn-sm !text-xs md:!text-base ${activeSubTab[activeTab] == 'mdd' ? 'active' : ''} ${activeTab == 'portfolios' ? 'hidden' : ''}`}
            onClick={() => updateSubTab(activeTab, 'mdd')}>
              MDD
          </button>
          <button 
            className={`btn btn-sm !text-xs md:!text-base ${activeSubTab[activeTab] == 'aum' ? 'active' : ''} ${activeTab == 'portfolios' ? 'hidden' : ''}`} 
            onClick={() => updateSubTab(activeTab, 'aum')}>
              AUM
          </button>
          <button 
            className={`btn btn-sm !text-xs md:!text-base ${activeSubTab[activeTab] == 'followers' ? 'active' : ''} ${activeTab == 'portfolios' ? '' : 'hidden'}`} 
            onClick={() => updateSubTab(activeTab, 'followers')}>
              Top Followers
          </button>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <div className="bg-gray-50 px-3 py-1 md:py-2 rounded-full text-white flex items-center gap-2">
            <IoSearchSharp className="text-gray-600 text-md md:text-base"/>
            <input 
              type="text" 
              className="bg-transparent outline-none text-white flex-grow text-xs md:text-sm max-w-[100px] sm:max-w-[140px]"
              placeholder="Search user"
            />
          </div>
          <div className="flex">
            <button className="w-[28px] y-[28px] sm:w-8 sm:y-8 bg-gray-100 circle-item hover:text-primary hover:bg-gray-200" onClick={() => setIsFilterModalOpen(true)}>
              <MdFilterListAlt />
            </button>
          </div>
          <div className='px-3 py-1 md:py-2 rounded-full bg-gray-100 text-white flex items-center gap-2'>
            <span className='text-xs md:text-base font-semibold'>7 days</span>
            <span className='text-xs md:text-sm text-gray-500'><AiFillCaretDown /></span>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col gap-5 overflow-auto flex-grow">
        {
          activeTab == 'portfolios' ?
            <PortfoliosTab />
          : activeTab == 'traders' ?
            <TradersTab />
          : <FavouritesTab />
        }
      </div>
    </div>
    <CopyFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
  </CopyTradingLayout>
}

export default CopyTrading;