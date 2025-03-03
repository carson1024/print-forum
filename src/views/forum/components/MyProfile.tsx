import React, { useEffect, useState } from "react";
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
import { useAuth } from "contexts/AuthContext";
import { supabase } from "lib/supabase";
import { SkeletonMyCallsList } from "components/skeleton/mycalls";

const MyProfile = (props: {
  logout: () => void
}) => {
  const { session, user } = useAuth();
  const { logout } = props;
  const [activeTab1, setActiveTab1] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isAllTradesModalOpen, setIsAllTradesModalOpen] = useState(false);
  const [callList, setCallList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // setIsLoading(true);
    const fetchCalls = async () => {
      if (!session || !session.user) return;
      const { data, error } = await supabase
        .from("callers")
        .select("calls(*)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error("Error fetching calls:", error.message);
        return;
      }
  
      setCallList(data);
  
      setIsLoading(false);
    }

    fetchCalls();

    // Subscribe to real-time changes in the "calls" table
    const subscription = supabase
      .channel("my_calls")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "calls" }, fetchCalls)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };

  }, []);
  
  return (<>
    <div className="rounded border border-gray-100">
      <div className="tab">
        <button className={`tab-item ${activeTab1 === 0 ? 'active' : ''}`} onClick={() => setActiveTab1(0)}>My Account</button>
        <button className={`tab-item ${activeTab1 === 1 ? 'active' : ''}`} onClick={() => setActiveTab1(1)}>Notifications <span className="ml-1 text-gray-400">5</span></button>
      </div>
      <div className="bg-white text-black p-5 space-y-4 overflow-auto max-h-[400px] sm:max-h-[500px] rounded-b">
        {
          activeTab1 == 0 ? <>
            <div className="flex gap-3">
              <div className="relative min-w-[80px] w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] bg-black circle flex items-center justify-center">
                <img src={IconUser} className="w-4 h-4" />
                <div className="absolute right-0 bottom-0 circle bg-dark1">
                  <span className="badge-rank-5"></span>
                </div>
              </div>
              <div className="space-y-3 grow">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-bold text-base sm:text-lg">{ user?.name }</h3>
                    <Link to="/profile/123"><img src={IconLink} className="w-4 h-4" /></Link>
                  </div>
                  <button className="text-black/40 font-bold" onClick={logout}><img src={IconLogout} className="w-4 h-4" /></button>
                </div>
                
                <div className="sm:hidden flex flex-wrap gap-1">
                  <div className="flex px-1.5 py-1 bg-black/10 gap-1 rounded-full">
                    <span className="text-xs text-black/60">Rank</span>
                    <span className="text-xs text-black font-semibold">5</span>
                  </div>
                  <div className="flex px-1.5 py-1 bg-black/10 gap-1 rounded-full">
                    <span className="text-xs text-black/60">Win rate</span>
                    <span className="text-xs text-black font-semibold">56%</span>
                  </div>
                  <div className="flex px-1.5 py-1 bg-black/10 gap-1 rounded-full">
                    <span className="text-xs text-black/60">Calls</span>
                    <span className="text-xs text-black font-semibold">125</span>
                  </div>
                  <div className="flex px-1.5 py-1 bg-black/10 gap-1 rounded-full">
                    <span className="text-xs text-black/60">Account age</span>
                    <span className="text-xs text-black font-semibold">2 years</span>
                  </div>
                </div>
                <div className="hidden sm:block text-black/60 text-sm space-y-2">
                  <div className="grid grid-cols-12 gap-5">
                    <p className="col-span-5">Win rate</p>
                    <p className="col-span-7">56%</p>
                  </div>
                  <div className="grid grid-cols-12 gap-5">
                    <p className="col-span-5">Calls</p>
                    <p className="col-span-7">125</p>
                  </div>
                  <div className="grid grid-cols-12 gap-5">
                    <p className="col-span-5">Account age</p>
                    <p className="col-span-7">2 years</p>
                  </div>
                </div>
                <div className="sm:hidden flex flex-wrap gap-1">

                </div>
              </div>
            </div>
            <div className="border border-black/15"></div>
            <div className="rounded-[20px] bg-black/5 p-4 hidden sm:block">
              <div className="flex gap-6">
                <div className="space-y-2">
                  <div className="text-md font-semibold"><span className="text-xl font-bold">2.1</span> SOL</div>
                  <p className="text-sm text-black/60">Current Balance</p>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-green flex items-center gap-1" onClick={() => setIsDepositModalOpen(true)}><span className=""><ImArrowUp /></span> Deposit</button>
                    <button className="btn btn-sm btn-red flex items-center gap-1" onClick={() => setIsWithdrawModalOpen(true)}><span className=""><ImArrowDown /></span> Withdraw</button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="space-y-0.5">
                    <p className="text-black/60 text-sm">Copying</p>
                    <div className="text-black font-semibold flex gap-2">
                      <span>0.2 SOL</span>
                      <div className="bg-green-600 px-2 py-1 text-xs flex items-center rounded-full text-black">
                        <span className="text-sm"><AiFillCaretUp /></span>
                        <span>12%</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-black/60 text-sm">Unallocated</p>
                    <div className="text-black font-semibold flex gap-2">
                      <span>2 SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-black">
              <div className="flex justify-between items-center">
                <span className="font-bold">Rank progression</span>
                <div className="flex gap-3 items-center">
                  <span className="circle-item bg-red-300 w-8 h-8 text-xs font-bold">VIII</span>
                  <span className="text-sm text-black/60">Rank 6</span>
                </div>
              </div>
              <div className="w-full bg-black/15 h-3 rounded-full overflow-hidden">
                <div className="bg-red-300 h-full" style={{ width: '25%' }}></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">165 XP</span>
                <span className="text-black/60 text-sm">1000 XP</span>
              </div>
            </div>
            <div className="rounded-[25px] bg-dark3 text-white p-4 space-y-2.5">
              <span>Archievements</span>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <span className="badge-money-50k"></span>
                  <span className="badge-register-1m"></span>
                  <span className="badge-social-twitter"></span>
                  <span className="badge-social-telegram"></span>
                  <span className="badge-social-solana"></span>
                  <span className="badge-call-10X !hidden sm:!flex"></span>
                  <span className="badge-user-50 !hidden sm:!flex"></span>
                  <span className="badge-other-bughunter !hidden sm:!flex"></span>
                </div>
                <button className="w-8 h-8 text-xs font-bold bg-white circle-item text-black">+5</button>
              </div>
            </div>
          </> : <>
            <div className="space-y-3">
              <div className="rounded-[20px] border border-black/15 p-4 space-y-2">
                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <span className="badge-social-twitter"></span>
                    <span className="text-black font-bold">X Linked</span>
                  </div>
                  <div>
                    <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">+10 XP</span>
                  </div>
                </div>
                <p className="text-black/70 text-sm !leading-[135%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet interdum </p>
              </div>
              <div className="rounded-[20px] border border-black/15 p-4 space-y-2">
                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="circle bg-dark1"><span className="badge-rank-5"></span></div>
                    <span className="text-black font-bold">Rank 5 reached</span>
                  </div>
                </div>
                <p className="text-black/70 text-sm !leading-[135%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet interdum </p>
              </div>
              <div className="rounded-[20px] border border-black/15 p-4 space-y-2">
                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <span className="badge-social-telegram"></span>
                    <span className="text-black font-bold">Telegram Linked</span>
                  </div>
                  <div>
                    <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">+10 XP</span>
                  </div>
                </div>
                <p className="text-black/70 text-sm !leading-[135%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet interdum </p>
              </div>
              <div className="rounded-[20px] border border-black/15 p-4 space-y-2">
                <div className="flex justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="circle bg-dark1"><span className="badge-rank-4"></span></div>
                    <span className="text-black font-bold">Rank 4 reached</span>
                  </div>
                  <div>
                    <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">+10 XP</span>
                  </div>
                </div>
                <p className="text-black/70 text-sm !leading-[135%]">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean sit amet interdum </p>
              </div>
            </div>
          </>
        }
      </div>
    </div>

    {/* My Calls / My Trades Tabs */}
    <div className={`rounded border border-gray-100 grow flex flex-col ${isLoading ? 'loading' : ''}`}>
      <div className="tab">
        <button className={`tab-item ${activeTab2 === 0 ? 'active' : ''}`} onClick={() => setActiveTab2(0)}>My Calls</button>
        <button className={`tab-item ${activeTab2 === 1 ? 'active' : ''}`} onClick={() => setActiveTab2(1)}>My Trades</button>
      </div>
      <div className="bg-white text-black flex-1 overflow-auto rounded-b">
        {activeTab2 === 0 ? (
          <div className="space-y-3 p-5">
            {
              isLoading || !callList.length ? <SkeletonMyCallsList /> :
              callList.map((call, index) => (<div className="rounded-full border border-black/15 flex justify-between items-center p-1 pr-3">
                <div className="flex gap-1 items-center">
                  <img src={call.calls.image} className="w-8 h-8 sm:w-[40px] sm:h-[40px] circle"/>
                  <span className="font-bold text-sm sm:text-base">${call.calls.symbol}</span>
                  <span className="rounded-full bg-green-600 px-2 py-1.5 text-xs text-black font-semibold">200X</span>
                </div>
                <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">+10 XP</span>
              </div>
              ))
            }
          </div>
        ) : (<div className="px-5 py-3">
          <div className="flex justify-between">
            <div className="btn-group gray">
              <button className="btn btn-sm sm:btn-base active">Active</button>
              <button className="btn btn-sm sm:btn-base">Past</button>
            </div>
            <button className="btn btn-sm sm:btn-base" onClick={() => setIsAllTradesModalOpen(true)}>View all</button>
          </div>
          <div className="">
            {
              Array(1).fill(0).map(() => <div className="py-3 border-b-[1px] border-black/10 space-y-2">
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
        )}
      </div>
    </div>
    <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} />
    <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
    <AllTradesModal isOpen={isAllTradesModalOpen} onClose={() => setIsAllTradesModalOpen(false)} />
  </>)
}

export default MyProfile;