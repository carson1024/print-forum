import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { AiFillCaretDown } from 'react-icons/ai';
import { useState } from 'react';
import { IoCheckmark } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import CopyingModal from 'components/modal/CopyingModal';
import AllCopiersModal from 'components/modal/AllCopiersModal';

const TradeLeadingTab = () => {
  const [isCopying, setIsCopying] = useState(false);
  const [isCopyingModalOpen, setIsCopyingModalOpen] = useState(false);
  const [isAllCopiersModalOpen, setIsAllCopiersModalOpen] = useState(false);

  return (<>
    <div className="overflow-auto h-full">
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 lg:col-span-7 flex-grow space-y-6">
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
                  <span className='text-xs sm:text-sm font-semibold'>7 days</span>
                  <span className='text-xs sm:text-sm text-gray-500'><AiFillCaretDown /></span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="p-5 rounded-[22px] bg-gray-50">
            <div className="space-y-2 text-white">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className="badge-rank-3"></span>
                  <span className="text-sm text-white">Rank 3</span>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="circle-item bg-gray-50 w-8 h-8 text-xs font-bold">IV</span>
                  <span className="text-sm text-gray-600">Rank 4</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '25%' }}></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white">165 XP</span>
                <span className="text-gray-600 text-sm">1000 XP</span>
              </div>
            </div>
          </div>
          <div className="rounded-[22px] bg-gray-50 text-white p-4 space-y-2.5">
            <span>Archievements</span>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span className="badge-money-50k"></span>
                <span className="badge-register-1m"></span>
                <span className="badge-social-twitter"></span>
                <span className="badge-social-telegram"></span>
                <span className="badge-social-solana"></span>
                <span className="badge-call-10X"></span>
                <span className="badge-user-50 !hidden lg:!block"></span>
                <span className="badge-other-bughunter !hidden lg:!block"></span>
              </div>
              <button className="w-8 h-8 text-xs font-bold bg-white circle-item text-black">+5</button>
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