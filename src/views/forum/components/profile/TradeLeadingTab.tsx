import React, { useEffect, useRef, useState } from 'react';
import { IoCheckmark } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import CopyingModal from 'components/modal/CopyingModal';
import AllCopiersModal from 'components/modal/AllCopiersModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSearchParams } from 'react-router-dom';
import Nick from 'assets/img/nick.png';
import Cancel from 'assets/img/cancel.png';

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
  const [activeTab, setActiveTab] = useState<'portfolios' | 'traders' | 'favorites'>('portfolios');
  useOutsideAlerter(wrapperRef, setIsOpen);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (op: string): void => {
    setFilters(op);
    // setSearchParams({ type:activeTab, day: op });
    setIsOpen(false);
  };

  return (<>
    <div className="h-screen bg-black text-white">
      <div className="grid grid-rows-[76px_1fr] h-full border-gray-800">
        <div className='border-b border-gray-800 flex items-center'>
          {
            !isCopying ? <><button className='btn_copy ml-[18px] items-center mainhover' onClick={() => setIsCopyingModalOpen(true)}><span className='flex text-black text-[14px] font-semibold items-center'>Copy Trader</span></button></>
              :
              <>
                <button className='btn_copy_after ml-[18px] items-center mr-[8px] mainhover'><span className='flex text-primary text-[14px] font-semibold items-center'><img src={Nick} />&nbsp;&nbsp;Copy Trader</span></button>
                <span className="btn_roundborder text-gray-600 text-[14px] font-Medium mr-[8px] space-x-[5px]">Your&nbsp;PnL<span className="token_border text-white">0.1&nbsp;SOL</span></span>
                <span className="btn_roundborder text-gray-600  text-[14px] font-Medium mr-[8px] space-x-[5px]">Amount&nbsp;placed<span className="token_border text-white">1&nbsp;SOL</span></span>
                <button className='pause_btn items-center mainhover' onClick={() => setIsCopying(false)}><span className='flex text-gray-400 text-[14px] font-semibold items-center'><img src={Cancel} />&nbsp;&nbsp;Stop&nbsp;Copying</span></button>
              </>
          }
        </div>
        <div className="grid h-screen" style={{ gridTemplateColumns: 'calc((100vw - 501px) / 2) 1fr' }}>
          <div className="border-r border-gray-800 flex flex-col h-screen">
            <div className="grid grid-rows-[50px_1fr] border-gray-800 ">
              <div className="border-b items-center flex">
                <div className="m-[18px] text-[14px] font-semibold text-white items-center flex">Trading overview</div>
              </div>
              <div className="flex-1 overflow-y-auto h-[calc(100vh-202px)]">
                <div className='m-[18px] items-center'>
                  <div className='flex mb-[8px] space-x-[8px]'>
                    <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Days Trading<span className="token_border text-white space-x-[5px]">57</span></span>
                    <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Copiers<span className="token_border text-white space-x-[5px]">95</span></span>
                    <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Total Copiers<span className="token_border text-white space-x-[5px]">658</span></span>
                  </div>
                  <div className='flex space-x-[8px] mb-[16px]'>
                    <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Closed Portfolios<span className="token_border text-white space-x-[5px]">1</span></span>
                    <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">TFA<span className="token_border text-white space-x-[5px]">12 SOL</span></span>
                  </div>
                  <div className="border-b border-gray-800 mb-[16px]"></div>
                  <div className='text-[14px] font-Medium text-white items-center mb-[16px]'>Performance</div>
                  <div className='flex mb-[16px] space-x-[16px]'>
                    <span className=" flex text-gray-600 text-[12px] font-Medium mr-[5px]">ROL&nbsp;&nbsp;<span className=" text-[#4BC586] space-x-[5px]">+13</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">PNL&nbsp;&nbsp;<span className=" text-[#4BC586] space-x-[5px]">+20&nbsp;SOL</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">Sharpe Ratio&nbsp;&nbsp;<span className=" text-white space-x-[5px]">3.98</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">MDD&nbsp;&nbsp;<span className=" text-white space-x-[5px]">4.60%</span></span>
                  </div>
                  <div className='flex mb-[16px] space-x-[16px]'>
                    <span className=" flex text-gray-600 text-[12px] font-Medium mr-[5px]">Win Rate&nbsp;&nbsp;<span className=" text-white space-x-[5px]">100.00%</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">Win Days&nbsp;&nbsp;<span className=" text-white space-x-[5px]">58</span></span>
                  </div>
                  <div className="border-b border-gray-800 mb-[16px]"></div>
                  <div className='text-[14px] font-Medium text-white items-center mb-[16px]'>Lead Trader Overview</div>
                  <div className='flex mb-[16px] space-x-[16px]'>
                    <span className=" flex text-gray-600 text-[12px] font-Medium mr-[5px]">Copier PnL&nbsp;&nbsp;<span className=" text-red-300 space-x-[5px]">-17 SOL</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">Leading Balance&nbsp;&nbsp;<span className=" text-[#4BC586] space-x-[5px]">5&nbsp;SOL</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">AUM&nbsp;&nbsp;<span className=" text-white space-x-[5px]">4 SOL</span></span>
                  </div>
                  <div className='flex mb-[16px] space-x-[16px]'>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">Profit Sharing&nbsp;&nbsp;<span className=" text-[#4BC586] space-x-[5px]">10%</span></span>
                    <span className=" flex text-gray-600 text-[12px] font-Medium mr-[5px]">Minimum Copy Amount&nbsp;&nbsp;<span className=" text-[#4BC586] space-x-[5px]">0.5 SOL</span></span>
                  </div>
                  <div className='flex mb-[16px] space-x-[16px]'>
                    <span className=" flex text-gray-600 text-[12px] font-Medium mr-[5px]">Last Trade&nbsp;&nbsp;<span className=" text-white space-x-[5px]">2025-01-16 09:05</span></span>
                  </div>
                  <div className="border-b border-gray-800 mb-[16px]"></div>
                  <div className='flex items-center'>
                    <div className=''>
                      <div className='text-[14px] font-Medium text-white items-center'>Top Copiers</div>
                      <div className='text-[14px] font-Medium text-gray-600 items-center mb-[16px]'>(Amount locked / Profit) </div>
                    </div>
                    <div className='ml-auto'>
                      <div className='text-[14px] font-Medium text-primary items-center mb-[16px]'>View ALL</div>
                    </div>

                  </div>

                  <div className='flex mb-[16px] space-x-[16px]'>
                    <span className=" flex text-gray-600 text-[12px] font-Medium mr-[5px]">UsernameLong&nbsp;&nbsp;<span className="text-[#4BC586] space-x-[5px]">9/0.3 SOL</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">cv9r69ww&nbsp;&nbsp;<span className="text-[#4BC586] space-x-[5px]">9/0.3 SOL</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">cv9r69ww&nbsp;&nbsp;<span className="text-[#4BC586] space-x-[5px]">9/0.3 SOL</span></span>
                  </div>
                  <div className='flex mb-[16px] space-x-[16px]'>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">cv9r69ww&nbsp;&nbsp;<span className="text-[#4BC586] space-x-[5px]">9/0.3 SOL</span></span>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">cv9r69ww&nbsp;&nbsp;<span className="text-[#4BC586] space-x-[5px]">9/0.3 SOL</span></span>
                  </div>
                  <div className='flex mb-[16px] space-x-[16px]'>
                    <span className="flex text-gray-600 text-[12px] font-Medium space-x-[5px]">cv9r69ww&nbsp;&nbsp;<span className="text-[#4BC586] space-x-[5px]">9/0.3 SOL</span></span>
                  </div>
                  <div className="border-b border-gray-800 mb-[16px]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-gray-800 h-screen flex flex-col">
            <div className="grid grid-rows-[50px_1fr] border-gray-800">
              <div className="border-b items-center flex">
                <div className="m-[18px] text-[14px] font-semibold text-white items-center flex">Latest Trades</div>
              </div>
              <div className="overflow-y-auto h-[calc(100vh-202px)]">
                <div className='m-[18px]'>
                  {[...Array(20)].map((_, index) => (<>
                    <div className="flex items-center gap-2 flex-wrap text-[12px] font-Medium">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="text-xs btn_buy px-1 py-1 sm:px-2 sm:py-1.5 flex items-center gap-1">
                          <button className="text-[#59FFCB]">Buy</button>
                        </div>
                        <div className="flex gap-8 px-[12px]">
                          <div className="">
                            <p className="text-xs mb-[2px] text-white/60">Pair</p>
                            <p className="text-xs text-white">UNIUSDT</p>
                          </div>
                          <div className="">
                            <p className="text-xs mb-[2px] text-white/60">Executed</p>
                            <p className="text-xs text-white">7.87 UNI</p>
                          </div>
                          <div className="">
                            <p className="text-xs mb-[2px] text-white/60">Total</p>
                            <p className="text-xs text-white">0.01 SOL</p>
                          </div>
                          <div className="">
                            <p className="text-xs mb-[2px] text-white/60">Role</p>
                            <p className="text-xs text-white">Taiker</p>
                          </div>
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-white/60 ">2025-01-16 15:45:17</span>
                    </div>
                    <div className="border-b border-gray-800 mb-[19px] mt-[19px]"></div>
                  </>
                  ))}
                </div>
              </div>
            </div>
          </div>
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