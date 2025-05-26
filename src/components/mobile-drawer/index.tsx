import React, { useState } from 'react';
import Logo from 'assets/img/logo-single.png';
import { IoIosNotifications, IoMdSettings } from "react-icons/io";
import ProgressBar from './ProgressBar';
import Telegram from 'assets/img/telegram.png';
import Twitter from 'assets/img/twitter.png';
import Solana from 'assets/img/solana.png';
export const MobileDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='lg:hidden'>
      {/* Toggle Button (only visible when menu is closed) */}
      {!isOpen && (
        <div className="flex justify-end items-center ">
          <img
            src="/Frame.svg"
            width={24}
            height={24}
            alt="menu open"
            className='cursor-pointer z-50 relative'
            onClick={toggleDrawer}
          />
        </div>
      )}

      {/* Fullscreen Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#100F13] text-white z-40">
          {/* Header: Logo + Close Button */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#28272B]">
            <img src={Logo} alt="Logo" className="w-[36px] h-[36px]" />
            <img
              src="/close.svg"
              width={24}
              height={24}
              alt="menu close"
              className="cursor-pointer"
              onClick={toggleDrawer}
            />
          </div>

          {/* Menu Items */}
          <div className="flex flex-col p-4 justify-between h-[calc(100%-64px)]">
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div className="flex cursor-pointer items-center gap-2">
                  <img src="/user.svg" width={32} height={32} alt="User" />
                  <span className='text-white text-sm font-semibold'>
                    UsernameLong
                  </span>
                  <img src="/arrow-right.svg" alt="arrow" />
                </div>
                <div className="flex gap-2 items-center">
                  <IoIosNotifications color='#76767E' className='cursor-pointer' size={24} />
                  <IoMdSettings color='#76767E' className='cursor-pointer' size={24} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3">
                <div className="border-r border-[#FFFFFF1A]">
                  <span className='text-[#76767E] text-[12px] font-medium'>
                    Win rate 55%
                  </span>
                </div>
                <div className="border-r text-center border-[#FFFFFF1A]">
                  <span className='text-[#76767E] text-[12px] font-medium'>
                    Total calls 123
                  </span>
                </div>
                <div className="text-end">
                  <span className='text-[#76767E] text-[12px] font-medium'>
                    Account age 2y
                  </span>
                </div>
              </div>

              {/* Rank Card */}
              <div className="bg-[#84E4FF1A] p-3 rounded-[12px] flex justify-between items-center">
                <div className='flex gap-1.5 items-center'>
                  <button>
                    <img src="/Frame 95.svg" alt="rank icon" />
                  </button>
                  <span className='text-sm font-semibold text-[#84E4FF]'>
                    Rank 2
                  </span>
                </div>
                <span className='text-xs font-medium text-[#84E4FF66]'>
                  Since Jan 5, 2025
                </span>
              </div>

              {/* Rank Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className='text-sm font-medium text-[#76767E]'>
                    Rank progression
                  </span>
                  <span className='text-sm text-white font-semibold'>
                    Rank 3
                  </span>
                </div>
                <ProgressBar progress={20} />
                <div className="flex justify-between">
                  <span className='text-sm text-[#CAF244] font-medium'>
                    165 XP
                  </span>
                  <span className='text-sm font-medium text-[#76767E]'>
                    1000 XP
                  </span>
                </div>
              </div>

              <div className="bg-[#1C1B1F] p-[18px] rounded-[12px] flex flex-col gap-5  ">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col ">
                    <div className="flex gap-2 items-start">
                      <span className='text-white text-[24px] font-semibold'>
                        2.1 SOL
                      </span>
                      <div className="bg-[#59FFCB33] p-[6px] flex gap-1 text-[12px] rounded-[6px] text-[#59FFCB] font-semibold">
                        <img src="/assets/arrow-up.svg" alt="" />
                        15%
                      </div>
                    </div>
                    <span className='text-[#76767E] text-[12px]'>
                      Current balance
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col ">
                      <div className="flex gap-2 items-start">
                        <span className='text-white text-[12px] font-semibold'>
                          0.1 SOL
                        </span>
                        <div className="flex gap-1 text-[10px] rounded-[6px] text-[#59FFCB] font-semibold">
                          <img src="/assets/arrow-up.svg" alt="" />
                          15%
                        </div>
                      </div>
                      <span className='text-[#76767E] font-normal text-[10px]'>
                        Copying
                      </span>
                    </div>
                    <div className="flex flex-col ">
                      <div className="flex gap-2 items-start">
                        <span className='text-white text-[12px] font-semibold'>
                          1.9 SOL
                        </span>

                      </div>
                      <span className='text-[#76767E] font-normal text-[10px]'>
                        Unallocated
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className='bg-[#59FFCB33] py-4 rounded-[6px]  flex gap-1.5 justify-center text-[#59FFCB] text-sm font-semibold '>
                    <img src="/assets/arrow.svg" alt="" />
                    Deposit
                  </button>
                  <button className='bg-[#FF494933] py-4 rounded-[6px]  flex gap-1.5 justify-center text-[#FF4949] text-sm font-semibold '>
                    <img src="/assets/arrow-down.svg" alt="" />
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
            <div className=" flex flex-col gap-[20px]">
              <div className=" flex-col flex text-[13px] font-semibold items-start text-[#76767E] gap-[20px]">
                  <button>Rank system</button>
                  <button>Terms of Service</button>
                  <button>Privacy Policy</button>
                  <button>Support</button>
              </div>
              <div className=" flex gap-4 ">
                <img alt='' src={Twitter} className="w-[18px] h-[18px] mr-[16px] " />
                <img alt='' src={Telegram} className="w-[24px] h-[24px] mr-[16px] " />
                <img alt='' src={Solana} className="w-[20px] h-[20px] " />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
