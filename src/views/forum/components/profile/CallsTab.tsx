import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import Token from 'assets/img/sample/token.png';
import IconCopy from 'assets/img/icons/copy.svg';
import { Link } from "react-router-dom";

const CallsTab = () => {
  const forumData = [
    { id: 1, name: "$PEPESI", multiplier: "10X", rank: "1", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 2, name: "$PEPESI", multiplier: "100X", rank: "2", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 3, name: "$PEPESI", multiplier: "20X", rank: "3", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 4, name: "$PEPESI", multiplier: "10X", rank: "4", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 5, name: "$PEPESI", multiplier: "100X", rank: "6", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 6, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 7, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 8, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
  ];
  return (<>
    <div className="p-4 sm:p-6 h-full flex flex-col gap-3">
      <div className='btn-group primary !hidden sm:!flex'>
        <button className='btn btn-sm active'>Active Calls</button>
        <button className='btn btn-sm'>Previous Calls</button>
      </div>
      <div className="flex-grow overflow-auto">
        <div className='flex flex-col gap-3'>
        {forumData.map((item) => (<Link to="/token/123" key={item.id}>
          <div className="bg-gray-50 p-1.5 pr-3 rounded flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-wrap grow">
                <div className="flex grow gap-2 sm:gap-3 items-center">
                  <img src={Token} className="w-[44px] h-[44px] sm:w-16 sm:h-16 circle"/>
                  <div className="grow space-y-1 sm:space-y-1.5">
                    <div className="flex gap-1.5 sm:gap-2.5 items-center">
                      <span className="text-sm sm:text-base font-bold">{item.name}</span>
                      <span className={`badge-multiplier-${item.multiplier}`}></span>
                      <div className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1 items-center">
                        <span>CA</span>
                        <span className="truncate text-gray-400">Gmx…AyW</span>
                        <button className="text-gray-400"><img src={IconCopy} className="opacity-40"/></button>
                      </div>
                      <span className="text-sm text-gray-600">3m</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <div className="bg-gray-100 px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-full flex text-xs gap-1">
                        Marketcap {item.marketcap}
                      </div>
                      <div className="bg-green-600 px-1.5 py-1 sm:px-2 sm:py-1.5 text-xs flex gap-0.5 items-center rounded-full text-black">
                        <AiFillCaretUp />
                        <span>{item.percentage}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-3 justify-between">
                  <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
                    <span className={`badge-rank-${item.rank}`}></span>
                    <div>
                      <div className="text-gray-600">Caller</div>
                      <div className="font-bold text-sm">{item.caller} <span className="text-xs text-gray-600">55%</span></div>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
                    <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
                    <span className="text-xs text-gray-600">55%</span>
                  </div>
                </div>
              </div>
              <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item !hidden lg:!flex">
                <FaChevronRight />
              </button>
            </div>
            <div className="flex md:hidden items-center gap-1 sm:gap-3 justify-between">
              <div className="border border-gray-100 rounded-full p-2.5 flex items-center gap-1.5 text-xs">
                <span className={`badge-rank-${item.rank}`}></span>
                <div>
                  <div className="text-gray-600">Caller</div>
                  <div className="font-bold text-sm">{item.caller} <span className="text-xs text-gray-600">55%</span></div>
                </div>
              </div>
              <div className="border border-gray-100 rounded-full px-2.5 py-3.5 flex gap-1 items-center">
                <div className="circle-item w-6 h-6 bg-gray-100 text-green-600 text-sm pb-[2px]"><AiFillCaretUp /></div>
                <div className="circle-item w-6 h-6 bg-gray-100 text-red-400 text-sm pt-[2px]"><AiFillCaretDown /></div>
                <span className="text-xs text-gray-600">55%</span>
              </div>
            </div>
          </div>
        </Link>
        ))}
        </div>
      </div>
    </div>
  </>);
}

export default CallsTab;