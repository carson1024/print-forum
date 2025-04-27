import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdStar } from "react-icons/md";

const TradersTab = ({
  users
}: {
  users: any[]
}) => {
  return (<>
    {users.map((user, index) => (<Link to="" key={index}>
      <div className="bg-gray-50 p-1.5 rounded-[22px] flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full border border-gray-150 flex items-center gap-2.5">
                <span className={`badge-rank-${user.rank}`}></span>
                <div className="space-y-0.5">
                  <div className="text-xs text-gray-600">Rank {user.rank}</div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-sm">{user.name}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-xs text-gray-600">7 day PNL</div>
                <div className="text-green-600 space-x-1.5">
                  <span className="text-[18px] sm:text-md font-bold">2.1</span>
                  <span className="text-sm sm:text-base font-semibold">SOL</span>
                </div>
              </div>
              <button className="bg-gray-100 text-gray-400 w-6 h-6 circle-item !flex sm:!hidden">
                <MdStar className="" />
              </button>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                <span className="text-gray-600">ROI</span>
                <span className="text-primary">+64.31%</span>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                <span className="text-gray-600">Win Ratio</span>
                <span className="text-primary">{user.winrate}%</span>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                <span className="text-gray-600">TFA</span>
                <span className="text-white">0 SOL</span>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                <span className="text-gray-600">Followers</span>
                <span className="text-white">2</span>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                <span className="text-gray-600">My PnL</span>
                <span className="text-primary">0.1 SOL</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex gap-2 mr-2.5">
          <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
            <MdStar size={20} />
          </button>
          <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
            <FaChevronRight />
          </button>
        </div>
      </div>
    </Link>
    ))}
  </>);
}

export default TradersTab;