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
    <div className="flex items-center justify-between mb-4">
      <div className="btn-group">
        <button className={`btn btn-lg ${activeTab == 'portfolios' ? 'active' : ''}`} onClick={() => setActiveTab('portfolios')}><FaUser /><span>Public Portfolios</span></button>
        <button className={`btn btn-lg ${activeTab == 'traders' ? 'active' : ''}`} onClick={() => setActiveTab('traders')}><MdCandlestickChart size={24} /><span>My Traders (4)</span></button>
        <button className={`btn btn-lg ${activeTab == 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}><MdStar size={24} /><span>My Favorites</span></button>
      </div>
      <button className='btn btn-lg btn-dark'><FaPlus size={16} /><span>New Trade</span></button>
    </div>
    <div className="card flex-grow p-0 flex flex-col overflow-hidden">
      <div className="px-6 py-6 border-b-[1px] border-gray-100 flex justify-between items-center">
        <div className="btn-group lighter">
          <button 
            className={`btn btn-sm !text-base ${activeSubTab[activeTab] == 'pnl' ? 'active' : ''}`} 
            onClick={() => updateSubTab(activeTab, 'pnl')}>
              PnL
          </button>
          <button 
            className={`btn btn-sm !text-base ${activeSubTab[activeTab] == 'roi' ? 'active' : ''}`}
            onClick={() => updateSubTab(activeTab, 'roi')}>
              ROI
          </button>
          <button
            className={`btn btn-sm !text-base ${activeSubTab[activeTab] == 'mdd' ? 'active' : ''} ${activeTab == 'portfolios' ? 'hidden' : ''}`}
            onClick={() => updateSubTab(activeTab, 'mdd')}>
              MDD
          </button>
          <button 
            className={`btn btn-sm !text-base ${activeSubTab[activeTab] == 'aum' ? 'active' : ''} ${activeTab == 'portfolios' ? 'hidden' : ''}`} 
            onClick={() => updateSubTab(activeTab, 'aum')}>
              AUM
          </button>
          <button 
            className={`btn btn-sm !text-base ${activeSubTab[activeTab] == 'followers' ? 'active' : ''} ${activeTab == 'portfolios' ? '' : 'hidden'}`} 
            onClick={() => updateSubTab(activeTab, 'followers')}>
              Top Followers
          </button>
        </div>
        <div className="flex gap-3">
          <div className="bg-gray-50 px-3 py-1 rounded-full text-white flex items-center gap-2">
            <IoSearchSharp size={24} className="text-gray-600"/>
            <input 
              type="text" 
              className="bg-transparent outline-none text-white flex-grow text-sm max-w-[140px]"
              placeholder="Search user"
            />
          </div>
          <div className="flex">
            <button className="w-8 y-8 bg-gray-100 circle-item hover:text-primary hover:bg-gray-200" onClick={() => setIsFilterModalOpen(true)}>
              <MdFilterListAlt />
            </button>
          </div>
          <div className='px-3 py-1 rounded-full bg-gray-100 text-white flex items-center gap-2'>
            <span className='text-base font-semibold'>7 days</span>
            <span className='text-sm text-gray-500'><AiFillCaretDown /></span>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-5 overflow-auto flex-grow">
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