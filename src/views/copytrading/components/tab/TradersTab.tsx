import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdStar } from "react-icons/md";

const TradersTab = () => {
  return (<>
    {Array(4).fill(0).map((item, index) => (<Link to="" key={index}>
      <div className="bg-gray-50 p-1.5 rounded-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full border border-gray-150 flex items-center gap-2.5">
              <span className="badge-rank-8"></span>
              <div className="space-y-0.5">
                <div className="flex gap-2 text-xs">
                  <span className="text-gray-600">Rank 5</span>
                  <span className="text-primary">COPYING</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-sm">UsernameLong</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-600">7 day PNL</div>
              <div className="text-green-600 space-x-1.5">
                <span className="text-md font-bold">2.1</span>
                <span className="font-semibold">SOL</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
  
              <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                <span className="text-gray-600">ROI</span>
                <span className="text-primary">+64.31%</span>
              </div>
              <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                <span className="text-gray-600">Win Ratio</span>
                <span className="text-primary">56%</span>
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
        <div className="flex gap-2 mr-2.5">
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