import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"
import { Link } from "react-router-dom"
import { formatNumber, formatShortAddress, formatTimestamp } from "utils/blockchain"
import IconCopy from 'assets/img/icons/copy.svg';
import { FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import { MdCheck } from "react-icons/md";

export const CallRow = ({
  call
}: {
  call: any
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCopied) return;
    setIsCopied(true);
    await navigator.clipboard.writeText(call.pair_addr);
    setTimeout(() => setIsCopied(false), 2000);
  }
  
  return <>
    <Link to={`/token/${call.pair_addr}`} key={call.id}>
      <div className="bg-gray-50 p-1.5 pr-3 rounded sm:rounded-[40px] flex flex-col gap-2 sm:gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-wrap grow">
            <div className="flex grow gap-2 sm:gap-3 items-center">
              <img src={call.image} className="w-[44px] h-[44px] sm:w-16 sm:h-16 circle"/>
              <div className="grow space-y-1 sm:space-y-1.5">
                <div className="flex gap-1.5 sm:gap-2.5 items-center">
                  <span className="text-sm sm:text-base font-bold">${call.symbol}</span>
                  {
                    call.multiplier && <span className={`badge-multiplier-${call.multiplier}`}></span>
                  }
                  <div onClick={handleCopy} className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1 items-center">
                    <span>CA</span>
                    <span className="truncate text-gray-400">{formatShortAddress(call.pair_addr)}</span>
                    <button className="text-gray-400">{
                      !isCopied ? <img src={IconCopy} className="opacity-40"/>
                      : <span className='text-[#06cf9c]'><MdCheck size={16} /></span>
                    }</button>
                  </div>
                  <span className="text-sm text-gray-600">{formatTimestamp(call.updated_at)}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2.5">
                  <div className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1">
                    Marketcap {formatNumber(call.init_market_cap)} to {formatNumber(call.init_market_cap)}
                  </div>
                  {
                    call.percentage &&
                    <div className="bg-green-600 px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                      <AiFillCaretUp />
                      <span>{call.percentage}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 justify-between">
              {
                call.user_id && 
                  <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
                    <span className={`badge-rank-${call.rank || 1}`}></span>
                    <div>
                      <div className="text-gray-600">Caller</div>
                      <div className="font-bold text-sm">{call.user_name} <span className="text-xs text-gray-600">0%</span></div>
                    </div>
                  </div>
              }
              <div className="flex gap-1 items-center">
                <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
                <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
                <span className="text-xs text-gray-600">0%</span>
              </div>
            </div>
          </div>
          <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item !hidden lg:!flex">
            <FaChevronRight />
          </button>
        </div>
        <div className="flex md:hidden items-center gap-1 sm:gap-3 justify-between">
          {
            call.user_id && 
            <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
              <span className={`badge-rank-${call.rank}`}></span>
              <div className="">
                <div className="text-gray-600">Caller</div>
                <div className="font-bold text-sm">{call.user_name} <span className="text-xs text-gray-600">55%</span></div>
              </div>
            </div>
          }
          <div className="border border-gray-100 rounded-full px-2.5 py-3.5 flex gap-1 items-center">
            <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
            <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
            <span className="text-xs text-gray-600">55%</span>
          </div>
        </div>
      </div>
    </Link>
  </>
}