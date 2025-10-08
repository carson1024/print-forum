import Modal from "./index_trade";
import React, { useState } from "react";
import Trader from "assets/img/trader.png";
const AllTradesModal = ({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>) => {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      extraClass="!max-w-none w-[100%] sm:w-[100%] min-h-[100%] overflow-hidden flex"
    >
      <div className="flex flex-col gap-4 sm:gap-6 grow ">
        <h3 className="text-base sm:text-lg ">My Trades</h3>
        <div className="border border-gray-100"></div>
        <div className=" light">
          <div className=" flex text-[14px] font-semibold text-gray-500 ">
            {activeTab == "active" ? (
              <button
                className=" repause_btn flex items-center justify-center mainhover flex"
                onClick={() => setActiveTab("active")}
              >
                <span className="text-primary text-[14px]">Active</span>
              </button>
            ) : (
              <button
                className=" pause_btn flex items-center justify-center mainhover flex"
                onClick={() => setActiveTab("active")}
              >
                <span className="text-[14px]">Active</span>
              </button>
            )}
            {activeTab == "past" ? (
              <button
                className="ml-[20px] repause_btn flex items-center justify-center mainhover flex"
                onClick={() => setActiveTab("past")}
              >
                <span className="text-primary">Past</span>
              </button>
            ) : (
              <button
                className="ml-[20px] pause_btn flex items-center justify-center mainhover flex"
                onClick={() => setActiveTab("past")}
              >
                <span>Past</span>
              </button>
            )}
          </div>
        </div>
        <div className="space-y-3 flex-grow overflow-auto">
          {Array(9)
            .fill(0)
            .map((value, index) => (
              <div key={index} className="border-b border-gray-100 text-sm px-3 py-1.5 sm:px-4 sm:py-3 flex items-center gap-3 sm:gap-5 flex-wrap">
                <div className="mr-[16px]">
                  {index % 4 < 2 ? (
                    <button className="circle btn_buy_small text-[#59FFCB] btn btn-xs">
                      Buy
                    </button>
                  ) : (
                    <button className="circle btn_buy_small text-red-300 btn btn-xs">
                      Sell
                    </button>
                  )}
                </div>
                <div className="text-Medium text-[12px] text-gray-600 mr-[16px]">
                  2025-01-16 15:45:17
                </div>
                <div className="text-Medium text-[12px] text-gray-600 mr-[16px]">
                  Pair
                  <span className="text-white ml-[4px]">UNIUSDT</span>
                </div>
                <div className="text-Medium text-[12px] text-gray-600 mr-[16px]">
                  Executed
                  <span className="text-white ml-[4px]">7.87 UNI</span>
                </div>
                <div className="text-Medium text-[12px] text-gray-600 mr-[16px]">
                  Total
                  <span className="text-white ml-[4px]">0.01 SOL</span>
                </div>
                <div className="text-Medium text-[12px] text-gray-600 mr-[16px]">
                  Role
                  <span className="text-white ml-[4px]">Taker</span>
                </div>
                <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">
                  <span className={`badge-rank-2 w-[20px] h-[20px]`}></span>
                  <span className="text-white font-semibold text-[12px]">
                    UsernameLong
                  </span>
                  <span className="text-gray-600 font-Medium text-[12px]">
                    55%
                  </span>
                  <img src={Trader} className="w-[20px] h-[20px]" />
                </span>

                <div className=" flex gap-2 items-center ml-auto">
                  {index % 4 < 2 && (
                    <button className="bg-red-300 p-[3px] circle text-[12px] font-semibold text-[#FFFFFF]">
                      Sell now
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="flex">
          <div className="px-4 py-2 flex items-center gap-2 text-sm border border-gray-100 circle">
            <button>{"<"}</button>
            <button className="circle-item w-6 h-6 text-primary bg-primary/10">
              1
            </button>
            <button className="circle-item w-6 h-6 text-white">2</button>
            <span>....</span>
            <button className="circle-item w-6 h-6 text-white">27</button>
            <button>{">"}</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AllTradesModal;
