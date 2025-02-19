import React, { useState } from "react";
import { getRankChar } from "utils/style";
import IconUser from 'assets/img/icons/user.svg';
import IconLink from 'assets/img/icons/link.svg';
import IconLogout from 'assets/img/icons/logout.svg';
import { VscLinkExternal } from "react-icons/vsc";
import { MdLogout } from "react-icons/md";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { AiFillCaretUp } from "react-icons/ai";
import Token from 'assets/img/sample/token.png';
import WithdrawModal from "components/modal/WithdrawModal";
import DepositModal from "components/modal/DepositModal";
import AllTradesModal from "components/modal/AllTradesModal";
import { Link } from "react-router-dom";

const CopyTradingProfile = (props: {
  logout: () => void
}) => {
  const { logout } = props;
  const [activeTab1, setActiveTab1] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAllTradesModalOpen, setIsAllTradesModalOpen] = useState(false);

  return (<>
    <div className="rounded border border-gray-100">
      <div className="bg-white text-black p-5 space-y-4 rounded">
        <div className="flex gap-3 items-center">
          <div className="relative w-[65px] h-[65px] bg-black circle flex items-center justify-center">
            <img src={IconUser} className="w-4 h-4" />
          </div>
          <div className="space-y-2 flex justify-between grow items-center">
            <div>
              <div className="text-md font-semibold"><span className="text-xl font-bold">2.1</span> SOL</div>
              <p className="text-black/60">Current Balance</p>
            </div>
            <div className="flex">
              <div className="space-y-1">
                <button className="btn btn-sm btn-green flex items-center gap-1 w-full" onClick={() => setIsDepositModalOpen(true)}><span className=""><ImArrowUp /></span> Deposit</button>
                <button className="btn btn-sm btn-red flex items-center gap-1 w-full" onClick={() => setIsWithdrawModalOpen(true)}><span className=""><ImArrowDown /></span> Withdraw</button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[20px] bg-black/5 p-4">
            <div className="space-y-0.5">
              <p className="text-black/60 text-sm">Copying</p>
              <div className="text-black font-semibold flex gap-1 sm:gap-2">
                <span className="font-semibold"><span className="text-md font-bold">0.2</span> SOL</span>
                <div className="bg-green-600 px-1 sm:px-2 py-1 text-xxs sm:text-xs flex items-center rounded-full text-black">
                  <span className="text-sm"><AiFillCaretUp /></span>
                  <span>12%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-[20px] bg-black/5 p-4">
            <div className="space-y-0.5">
              <p className="text-black/60 text-sm">Unallocated</p>
              <div className="text-black font-semibold flex gap-2">
                <span className="font-semibold"><span className="text-md font-bold">2</span> SOL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* My Calls / My Trades Tabs */}
    <div className="rounded border border-gray-100 grow flex flex-col overflow-hidden">
      <div className="tab">
        <button className={`tab-item ${activeTab2 === 0 ? 'active' : ''}`} onClick={() => setActiveTab2(0)}>Orders</button>
        <button className={`tab-item ${activeTab2 === 1 ? 'active' : ''}`} onClick={() => setActiveTab2(1)}>...</button>
      </div>
      <div className="bg-white text-black flex-1 overflow-auto rounded-b">
        {activeTab2 === 0 ? (
        <div className="px-5 py-3">
          <div className="">
            {
              Array(8).fill(0).map(() => <div className="py-3 border-b-[1px] border-black/10 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="btn-group gray">
                    <button className="rounded-full bg-green-600 text-white px-1.5 py-1 text-xs">Buy</button>
                    <button className="rounded-full bg-black/10 text-black/60 px-1.5 py-1 text-xs">UsernameLong</button>
                  </div>
                  <span className="text-xs text-black/60">2025-01-16 15:45:17</span>
                </div>
                <div className="flex gap-8">
                  <div className="">
                    <p className="text-xs text-black/60">Pair</p>
                    <p className="text-xs text-black">UNIUSDT</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-black/60">Executed</p>
                    <p className="text-xs text-black">7.87 UNI</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-black/60">Total</p>
                    <p className="text-xs text-black">0.01 SOL</p>
                  </div>
                  <div className="">
                    <p className="text-xs text-black/60">Role</p>
                    <p className="text-xs text-black">Taiker</p>
                  </div>
                </div>
              </div>)
            }
          </div>
        </div>
        ) : (<></>
        )}
      </div>
    </div>
    <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
    <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
    <AllTradesModal isOpen={isAllTradesModalOpen} onClose={() => setIsAllTradesModalOpen(false)} />
  </>)
}

export default CopyTradingProfile;