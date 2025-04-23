import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { AiFillCaretDown } from 'react-icons/ai';
import { useState } from 'react';
import { IoCheckmark } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import CopyingModal from 'components/modal/CopyingModal';
import AllCopiersModal from 'components/modal/AllCopiersModal';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

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
                 <span className={"badge-rank-" + myprofile.rank}></span>
                  <span className="text-sm text-white">Rank {myprofile.rank}</span>
                </div>
                <div className="flex gap-2 items-center">
                   <span className={"badge-rank-" + Number(myprofile.rank+1)}></span>
                  <span className="text-sm text-gray-600">Rank {Number( myprofile.rank ) + 1}</span>
                </div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${ Number(myprofile.xp) * 100/1000}%`  }}></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white">{myprofile.xp} XP</span>
                <span className="text-gray-600 text-sm">1000 XP</span>
              </div>
            </div>
          </div>
          <div className="rounded-[22px] bg-gray-50 text-white p-4 space-y-2.5">
            <span>Archievements</span>
            <div className="flex justify-between">
              <div className="flex gap-2">
                {/* <span className="badge-money-50k"></span>
                <span className="badge-register-1m"></span>
                <span className="badge-social-twitter"></span>
                <span className="badge-social-telegram"></span>
                <span className="badge-social-solana"></span>
                <span className="badge-call-10X"></span>
                <span className="badge-user-50 !hidden lg:!block"></span>
                <span className="badge-other-bughunter !hidden lg:!block"></span> */}
                <Tippy theme="yellowTooltip" content="You reached rank 1" delay={[0, 0]}>
                 {myprofile?.achievements.includes("1x") ?   <button className="text-yellow-400">
                   <span className="badge-rank-1"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 2" delay={[0, 0]}>
                 {myprofile?.achievements.includes("2x") ? <button className="text-yellow-400">
                     <span className="badge-rank-2"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 3" delay={[0, 0]}>
                  {myprofile?.achievements.includes("3x") ? <button className="text-yellow-400">
                    <span className="badge-rank-3"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 4" delay={[0, 0]}>
                  {myprofile?.achievements.includes("4x") ?  <button className="text-yellow-400">
                     <span className="badge-rank-4"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 5" delay={[0, 0]}>
                    {myprofile?.achievements.includes("5x") ? <button className="text-yellow-400">
                    <span className="badge-rank-5"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 6" delay={[0, 0]}>
                  {myprofile?.achievements.includes("6x") ? <button className="text-yellow-400">
                     <span className="badge-rank-6"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 7" delay={[0, 0]}>
                 {myprofile?.achievements.includes("7x") ?  <button className="text-yellow-400">
                     <span className="badge-rank-7"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 8" delay={[0, 0]}>
                  {myprofile?.achievements.includes("8x") ?  <button className="text-yellow-400">
                    <span className="badge-rank-8"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 9" delay={[0, 0]}>
                    {myprofile?.achievements.includes("9x") ? <button className="text-yellow-400">
                   <span className="badge-rank-9"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 10" delay={[0, 0]}>
                  {myprofile?.achievements.includes("10x") ? <button className="text-yellow-400">
                     <span className="badge-rank-10"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Telegram address" delay={[0, 0]}>
                 {myprofile?.achievements.includes("t") ? <button className="text-yellow-400">
                      <span className="badge-social-telegram"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Twitter address" delay={[0, 0]}>
                  {myprofile?.achievements.includes("x") ?<button className="text-yellow-400">
                      <span className="badge-social-twitter"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Solana address" delay={[0, 0]}>
                 {myprofile?.achievements.includes("s") ? <button className="text-yellow-400">
                      <span className="badge-social-solana"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 5X marketCap" delay={[0, 0]}>
                  {myprofile?.achievements.includes("c5x") ? <button className="text-yellow-400">
                     <span className="badge-call-5X"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 10X marketCap" delay={[0, 0]}>
                   {myprofile?.achievements.includes("c10x") ? <button className="text-yellow-400">
                    <span className="badge-call-10X"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 50X marketCap" delay={[0, 0]}>
                  {myprofile?.achievements.includes("c50x") ?<button className="text-yellow-400">
                      <span className="badge-call-50X"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 100X marketCap" delay={[0, 0]}>
                  {myprofile?.achievements.includes("c100x") ?<button className="text-yellow-400">
                      <span className="badge-call-100X"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="10 people copytrade you" delay={[0, 0]}>
                   {myprofile?.achievements.includes("u10") ? <button className="text-yellow-400">
                    <span className="badge-user-10"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="50 people copytrade you" delay={[0, 0]}>
                   {myprofile?.achievements.includes("u50") ? <button className="text-yellow-400">
                    <span className="badge-user-50"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="100 people copytrade you" delay={[0, 0]}>
                   {myprofile?.achievements.includes("u100") ?<button className="text-yellow-400">
                     <span className="badge-user-100"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 50K-money" delay={[0, 0]}>
                 {myprofile?.achievements.includes("m50k") ? <button className="text-yellow-400">
                      <span className="badge-money-50k"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 100K-money" delay={[0, 0]}>
                   {myprofile?.achievements.includes("m100k") ? <button className="text-yellow-400">
                    <span className="badge-money-100k"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 500K-money" delay={[0, 0]}>
                  {myprofile?.achievements.includes("m500k") ? <button className="text-yellow-400">
                     <span className="badge-money-500k"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 1m-money" delay={[0, 0]}>
                  {myprofile?.achievements.includes("m1m") ? <button className="text-yellow-400">
                     <span className="badge-money-1m"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 1 month history" delay={[0, 0]}>
                  {myprofile?.achievements.includes("reg1m") ? <button className="text-yellow-400">
                     <span className="badge-register-1m"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 3 months history" delay={[0, 0]}>
                  {myprofile?.achievements.includes("reg3m") ? <button className="text-yellow-400">
                     <span className="badge-register-3m"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 1 year history" delay={[0, 0]}>
                  {myprofile?.achievements.includes("reg1y") ?<button className="text-yellow-400">
                      <span className="badge-register-1y"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You are a influencer" delay={[0, 0]}>
                  {myprofile?.achievements.includes("influ") ? <button className="text-yellow-400">
                     <span className="badge-other-influencer"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Alpha action" delay={[0, 0]}>
                  {myprofile?.achievements.includes("alpha") ? <button className="text-yellow-400">
                     <span className="badge-other-alpha"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You have a best partner" delay={[0, 0]}>
                   {myprofile?.achievements.includes("partner") ? <button className="text-yellow-400">
                    <span className="badge-other-partner"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You never did skip" delay={[0, 0]}>
                  {myprofile?.achievements.includes("never") ? <button className="text-yellow-400">
                     <span className="badge-other-neverskip"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You found some bugs of this site" delay={[0, 0]}>
                  {myprofile?.achievements.includes("bug") ? 
                  <button className="text-yellow-400">
                     <span className="badge-other-bughunter"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You registered on this site" delay={[0, 0]}>
                  {myprofile?.achievements.includes("OG") ?
                  <button className="text-yellow-400">
                      <span className="badge-other-og"></span>
                  </button> : <></>}
                </Tippy>
              </div>
              {/* <button className="w-8 h-8 text-xs font-bold bg-white circle-item text-black">+5</button> */}
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