import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { AiFillCaretDown } from 'react-icons/ai';
import React, { useEffect,useRef,useState  } from 'react';
import { IoCheckmark } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import CopyingModal from 'components/modal/CopyingModal';
import AllCopiersModal from 'components/modal/AllCopiersModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {useSearchParams } from 'react-router-dom';

const options = ["7Days", "30Days", "90Days"];

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

type Props = {
  myprofile: {
    name: string;
    email: string;
    avatar: string;
    xp: string;
    rank: string;
    winrate: string;
    callcount: string;
    achievements: string;
    created_at: string;
    taddress: string;
    xaddress: string;
    saddress: string;
    bio: string;
  };
};

const TradeLeadingTab = ({ myprofile }: Props) => {
  const [isCopying, setIsCopying] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCopyingModalOpen, setIsCopyingModalOpen] = useState(false);
  const [isAllCopiersModalOpen, setIsAllCopiersModalOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(searchParams.get('day') || "7 days");
  const wrapperRef = React.useRef(null);
  const [activeTab,setActiveTab] = useState<'portfolios' | 'traders' | 'favorites'>('portfolios');
  useOutsideAlerter(wrapperRef, setIsOpen);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (op: string): void =>{
    setFilters(op);
    // setSearchParams({ type:activeTab, day: op });
    setIsOpen(false);
  };
  

  return (<>
    <div className="overflow-auto h-full">
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 lg:col-span-7  flex-grow space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Days Trading</span>
                <span className="text-xs text-white">57</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Copiers</span>
                <span className="text-xs text-white">95</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Total Copiers</span>
                <span className="text-xs text-white">658</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Closed Portfolios</span>
                <span className="text-xs text-white">1</span>
              </div>
            </div>
            <div className='p-4 sm:p-5 bg-gray-50 rounded-[22px] space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='font-semibold text-sm sm:text-base'>Performance</span>
                <div className='px-2.5 py-1.5 rounded-full bg-gray-100 text-white flex items-center gap-2'>
                  {/* <span className='text-xs sm:text-sm font-semibold'>7 days</span> */}
                  <div ref={wrapperRef} className="relative inline-block text-left flex">
                                  <button
                                  onClick={toggleDropdown} className='flex'>
                                  <span className='text-xs sm:text-sm font-semibold'>{filters}</span>
                                  <span className='text-xs sm:text-sm text-gray-500 center'><AiFillCaretDown /></span></button>
                                  {isOpen && (
                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-6 text-white overflow-hidden rounded-sm pb-2 z-10 text-sm bg-neutral-800 shadow-lg" >
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
                  {/* <span className='text-xs sm:text-sm text-gray-500'><AiFillCaretDown /></span> */}
                </div>
              </div>
              <div className='flex flex-wrap gap-4'>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">ROI</span>
                  <span className="text-xs text-green-600">+ 13.00</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">PNL</span>
                  <span className="text-xs text-green-600">+20 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Sharpe Ratio</span>
                  <span className="text-xs text-white">3.98</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">MDD</span>
                  <span className="text-xs text-white">4.60%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Win Rate</span>
                  <span className="text-xs text-white">100.00%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Win Days</span>
                  <span className="text-xs text-white">58</span>
                </div>
              </div>
              <div className='border border-gray-100'></div>
              <div className='flex'>
                <span className='font-semibold text-sm sm:text-base'>Lead Trader Overview</span>
              </div>
              <div className='flex flex-wrap gap-4'>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Copier PnL</span>
                  <span className="text-xs text-red-400">-17 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Leading Balance</span>
                  <span className="text-xs text-green-600">5 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">AUM</span>
                  <span className="text-xs text-green-600">4 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Profit Sharing</span>
                  <span className="text-xs text-green-600">10%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Minimum Copy Amount</span>
                  <span className="text-xs text-green-600">0.5 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">Last Trade</span>
                  <span className="text-xs text-green-600">2025-01-16 09:05</span>
                </div>
              </div>
              <div className='border border-gray-100'></div>

              <div className='flex justify-between items-center'>
                <span className='font-semibold text-sm sm:text-base'>Finances</span>
                <div className='px-2.5 py-1.5 rounded-full bg-gray-100 text-white flex items-center gap-2'>
                  <span className='text-xs sm:text-sm font-semibold'>Trader profit</span>
                  <span className='text-xs sm:text-sm font-semibold text-green-600'>2 SOL</span>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                  <span className='text-sm font-semibold text-sm sm:text-base'>Top Copiers</span>
                  <span className='text-xs text-gray-600'>{'(Amount locked / Profit)'}</span>
                </div>
                <button className='text-primary text-xs font-normal hover:text-primary/80' onClick={() => setIsAllCopiersModalOpen(true)}>View All</button>
              </div>
              <div className='flex flex-wrap gap-4'>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">UsernameLong</span>
                  <span className="text-xs text-green-600">9/0.3 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">cv9r69ww</span>
                  <span className="text-xs text-green-600">9/0.3 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">UsernameLong</span>
                  <span className="text-xs text-green-600">9/0.3 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">cv9r69ww</span>
                  <span className="text-xs text-green-600">9/0.3 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">UsernameLong</span>
                  <span className="text-xs text-green-600">9/0.3 SOL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-600">cv9r69ww</span>
                  <span className="text-xs text-green-600">9/0.3 SOL</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 lg:col-span-5">
            <div className="flex">
              <div className='flex flex-col md:ml-auto gap-2'>
                {
                  !isCopying ?
                    <button className='btn btn-md' onClick={() => setIsCopyingModalOpen(true)}>Copy Trader</button> :
                    <div className='rounded-full bg-primary/20 text-primary px-4 py-1.5 font-semibold flex items-center justify-center'><IoCheckmark className='mr-1 font-bold' size={20} /> Copying this trader</div>
                }
                <div className='flex gap-1 justify-between'>
                  <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                    <span className="text-xs text-gray-600">Followers</span>
                    <span className="text-xs text-white">12</span>
                  </div>
                  <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                    <span className="text-xs text-gray-600">TFA</span>
                    <span className="text-xs text-white">12 SOL</span>
                  </div>
                </div>

                { isCopying && <>
                  <div className='rounded-[20px] bg-gray-100 text-white px-4 py-3 flex justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-white font-semibold'>0.1 SOL</span>
                      <span className='text-xs text-gray-600'>Your PnL</span>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-white font-semibold'>1 SOL</span>
                      <span className='text-xs text-gray-600'>Amount placed</span>
                    </div>
                  </div>
                  <button className='btn btn-gray btn-md' onClick={() => setIsCopying(false)}><MdClose className='mr-1 font-bold' size={20} /> Stop Copying</button>
                </> }
              </div>
            </div>
          </div>
        </div>
        {/* <div className="overflow-auto md:overflow-hidden flex-grow space-y-4">
          <div className="card md:h-full p-0 flex flex-col md:overflow-hidden">
            <div className="p-4 sm:p-6 border-b-[1px] border-gray-100 flex justify-between items-center">
              <div className="flex gap-2 sm:gap-3 items-center grow loading"></div>
           </div>
           </div></div> */}
        <div className="-mx-6 border-b border-gray-100"></div>
        <div className="px-3 sm:px-[18px] py-3 rounded-[22px] bg-gray-50 flex items-center gap-2 flex-wrap">
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="text-xs bg-green-600 px-1 py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 rounded-full">
                    <button className="text-black">Buy</button>
                  </div>
                  <div className="flex gap-8 px-1 pl-4">
                  <div className="">
                    <p className="text-xs text-white/60">Pair</p>
                    <p className="text-xs text-white">UNIUSDT</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Executed</p>
                    <p className="text-xs text-white">7.87 UNI</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Total</p>
                    <p className="text-xs text-white">0.01 SOL</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Role</p>
                    <p className="text-xs text-white">Taiker</p>
                  </div>
                </div>
                </div>
                <span className="ml-auto text-xs text-white/60">2025-01-16 15:45:17</span>
        </div>
        <div className="px-3 sm:px-[18px] py-3 rounded-[22px] bg-gray-50 flex items-center gap-2 flex-wrap">
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="text-xs bg-red-300 px-1 py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 rounded-full">
                    <button className="text-white">Sell</button>
                  </div>
                  <div className="flex gap-8 px-1 pl-4">
                  <div className="">
                    <p className="text-xs text-white/60">Pair</p>
                    <p className="text-xs text-white">UNIUSDT</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Executed</p>
                    <p className="text-xs text-white">7.87 UNI</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Total</p>
                    <p className="text-xs text-white">0.01 SOL</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Role</p>
                    <p className="text-xs text-white">Taiker</p>
                  </div>
                </div>
                </div>
                <span className="ml-auto text-xs text-white/60">2025-01-16 15:45:17</span>
        </div>
         <div className="px-3 sm:px-[18px] py-3 rounded-[22px] bg-gray-50 flex items-center gap-2 flex-wrap">
                
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="text-xs bg-red-300 px-1 py-1 sm:px-2 sm:py-1.5 flex items-center gap-1 rounded-full">
                    <button className="text-white">Sell</button>
                  </div>
                  <div className="flex gap-8 px-1 pl-4">
                  <div className="">
                    <p className="text-xs text-white/60">Pair</p>
                    <p className="text-xs text-white">UNIUSDT</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Executed</p>
                    <p className="text-xs text-white">7.87 UNI</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Total</p>
                    <p className="text-xs text-white">0.01 SOL</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-white/60">Role</p>
                    <p className="text-xs text-white">Taiker</p>
                  </div>
                </div>
                </div>
                <span className="ml-auto text-xs text-white/60">2025-01-16 15:45:17</span>
        </div>


      </div>
     </div>
    <CopyingModal isOpen={isCopyingModalOpen} onOk={() => {
      setIsCopyingModalOpen(false);
      setIsCopying(true)
    }} onCancel={() => setIsCopyingModalOpen(false)} />
    <AllCopiersModal isOpen={isAllCopiersModalOpen} onClose={() => setIsAllCopiersModalOpen(false)} />
  </>);
}

export default TradeLeadingTab;