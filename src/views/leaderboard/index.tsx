import { Link } from "react-router-dom";
import LeaderboardLayout from "./layout"
import { FaChevronRight } from "react-icons/fa";

const Leaderboard = () => {
  return (<LeaderboardLayout>
    <div className="card flex-grow p-0 flex flex-col overflow-hidden">
      <div className="px-6 py-6 border-b-[1px] border-gray-100 flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <h2 className="text-lg font-semibold">Leaderboard</h2>
        </div>
      </div>
      
      <div className="p-6 flex flex-col gap-5 overflow-auto flex-grow">
        {Array(9).fill(0).map((item, index) => (<Link to="/profile/123" key={index}>
          <div className="bg-gray-50 p-1.5 rounded-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`leader-rank${index+1}`}>{index+1}</span>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full border border-gray-150 flex items-center gap-2.5">
                  <div className="circle-item w-7 h-7 bg-red-300 text-black text-sm font-bold">V</div>
                  <div className="space-y-0.5">
                    <div className="text-xs text-gray-600">Rank 5</div>
                    <div className="flex gap-1 items-center">
                      <span className="font-bold text-sm">UsernameLong</span>
                    </div>
                  </div>
                </div>
                <div className="px-[18px] py-3 rounded-full border border-gray-150 flex items-center gap-2">
                  <span className="text-xs text-gray-600">Win ratio</span>
                  <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                    <span className="text-white">Week</span>
                    <span className="text-primary font-bold">82%</span>
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                    <span className="text-white">Month</span>
                    <span className="text-primary font-bold">82%</span>
                  </div>
                  <div className="text-xs bg-gray-100 px-2 py-1.5 flex items-center gap-1 rounded-full">
                    <span className="text-white">All time</span>
                    <span className="text-primary font-bold">67%</span>
                  </div>
                  <div className="text-xs bg-primary/20 px-2 py-1.5 flex items-center gap-1 rounded-full">
                    <span className="text-primary">Calls</span>
                    <span className="text-primary font-bold">135</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="bg-gray-100 text-gray-400 w-8 h-8 circle-item mr-2.5">
              <FaChevronRight />
            </button>
          </div>
        </Link>
        ))}
      </div>
    </div>
  </LeaderboardLayout>)
}

export default Leaderboard;