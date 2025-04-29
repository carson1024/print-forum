import React, { useEffect, useState } from "react";
import IconUser from 'assets/img/icons/user.svg';
import IconLink from 'assets/img/icons/link.svg';
import IconLogout from 'assets/img/icons/logout.svg';
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { AiFillCaretUp } from "react-icons/ai";
import WithdrawModal from "components/modal/WithdrawModal";
import DepositModal from "components/modal/DepositModal";
import AllTradesModal from "components/modal/AllTradesModal";
import { Link } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { supabase } from "lib/supabase";
import { SkeletonMyCallsList } from "components/skeleton/mycalls";
import { getRankChar } from "../../../../src/utils/style";
import { formatNumber, formatShortAddress, formatTimestamp } from "../../../utils/blockchain";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
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
  const [muser, setMuser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificates, setNotificate] = useState([]);
  const [hasUnread, setHasUnread] = useState(true);
  const [unreadcounts, setUnreadcounts] = useState(0);
  const [readcounts, setReadcounts] = useState(0);
  useEffect(() => {
    //  setIsLoading(true);
    const fetchCalls = async () => {
      if (!user) return;
      else {
        const { data, error } = await supabase
          .from("calls")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Error fetching calls:", error.message);
          return;
        }
        setCallList(data);

        const { data: notifications, error: notifyerror } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (notifyerror) {
          console.error("Error fetching calls:", notifyerror.message);
          return;
        }
        if (notifications) {
          setUnreadcounts(Number(notifications.length))
          setNotificate(notifications);
        }

        setIsLoading(false);
      }
    }
    fetchCalls();
    // Subscribe to real-time changes in the "calls" table
    const channel = supabase
      .channel("my_calls")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "calls" }, fetchCalls)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "users" }, fetchCalls)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, fetchCalls)
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleClick2 = () => {
        setActiveTab1(1); 
        setHasUnread(false); // hide the badge on click
        setUnreadcounts(0)
        };
        const handleClick1 = async() => {
        setHasUnread(true); // hide the badge on click
        setActiveTab1(0);
        const { error } = await supabase
        .from("users")
        .update({ achievements: ["OG", "1x"] })
        .eq("id", user.id);
        };
  
  return (<>
    <div className="rounded border border-gray-100">
      <div className="tab">
        <button className={`tab-item ${activeTab1 === 0 ? 'active' : ''}`} onClick={() => handleClick1()}>My Account</button>
        <button className={`tab-item ${activeTab1 === 1 ? 'active' : ''}`} onClick={() => handleClick2()}>Notifications {!isLoading && hasUnread && unreadcounts > 0 && (<span className="ml-1 text-gray-400">{ unreadcounts}</span>)}</button>
      </div>
      <div className="bg-white text-black p-5 space-y-4 overflow-auto max-h-[400px] sm:max-h-[500px] rounded-b">
        {
          activeTab1 == 0 ? <>
            <div className="flex gap-3">
              <div className="relative min-w-[80px] w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] bg-black circle flex items-center justify-center">
                {user?.avatar==null?<img src={IconUser} className="w-5 h-5" />:
                <><img src={user.avatar} className="relative min-w-[80px] w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] bg-black circle flex items-center justify-center" />
                <div className="absolute right-0 bottom-0 circle bg-dark1">
                 <span className={"badge-rank-" + user?.rank}></span> 
                </div></>}
                
              </div>
              <div className="space-y-3 grow">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <h3 className="font-bold text-base sm:text-lg">{ user?.name }</h3>
                    <Link to={`/profile?id=${session.user.id}`}><img src={IconLink} className="w-4 h-4" /></Link>
                  </div>
                  <button className="text-black/40 font-bold" onClick={logout}><img src={IconLogout} className="w-4 h-4" /></button>
                </div>

                <div className="sm:hidden flex flex-wrap gap-1">
                <div className="flex px-1.5 py-1 bg-black/10 gap-1 rounded-full">
                  <span className="text-xs text-black/60">Rank</span>
                  <span className="text-xs text-black font-semibold">{user?.rank }</span>
                </div>
                <div className="flex px-1.5 py-1 bg-black/10 gap-1 rounded-full">
                  <span className="text-xs text-black/60">Win rate</span>
                  <span className="text-xs text-black font-semibold">{user?.winrate }%</span>
                </div>
                <div className="flex px-1.5 py-1 bg-black/10 gap-1 rounded-full">
                  <span className="text-xs text-black/60">Calls</span>
                  <span className="text-xs text-black font-semibold">{user?.callcount }</span>
                </div>
                <div className="flex px-1.5 py-1 bg-black/10 gap-1 rounded-full">
                  <span className="text-xs text-black/60">Account age</span>
                  <span className="text-xs text-black font-semibold">{formatTimestamp(user?.created_at) }</span>
                </div>
              </div> 
        
                  <div className="hidden sm:block text-black/60 text-sm space-y-2">
                  <div className="grid grid-cols-12 gap-5">
                    <p className="col-span-5">Win rate</p>
                        <p className="col-span-7">{user?.winrate }%</p>
                  </div>
                  <div className="grid grid-cols-12 gap-5">
                    <p className="col-span-5">Calls</p>
                    <p className="col-span-7">{user?.callcount }</p>
                  </div>
                  <div className="grid grid-cols-12 gap-5">
                    <p className="col-span-5">Account age</p>
                    <p className="col-span-7">{formatTimestamp(user?.created_at) } ago</p>
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
                  <div className="text-md font-semibold"><span className="text-xl font-bold">{user?.balance}</span> SOL</div>
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
                      <span>{user?.allocate_balance || 0} SOL</span>
                      {/* <div className="bg-green-600 px-2 py-1 text-xs flex items-center rounded-full text-black">
                        <span className="text-sm"><AiFillCaretUp /></span>
                        <span>12%</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-black/60 text-sm">Unallocated</p>
                    <div className="text-black font-semibold flex gap-2">
                      <span>{Number(user?.balance-user?.allocate_balance) ||0} SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-black">
              <div className="flex justify-between items-center pt-5">
                <span className="font-bold">Rank progression</span>
                <div className="flex gap-3 items-center">
                      <span className="circle-item bg-red-300 w-8 h-8 text-xs font-bold">{getRankChar(user?.rank) }</span>
                  <span className="text-sm text-black/60">Rank {user?.rank }</span>
                </div>
              </div>
              <div className="w-full bg-black/15 h-3 rounded-full overflow-hidden">
                <div className="bg-red-300 h-full" style={{ width: `${user?.xp*100/1000}%` }}></div>
              </div>
              <div className="flex justify-between">
                    <span className="text-sm">{user?.xp}XP</span>
                <span className="text-black/60 text-sm">1000 XP</span>
              </div>
            </div>
            
            <div className="rounded-[25px] bg-dark3 text-white p-4 space-y-2.5">
              <span>Archievements</span>
              <div className="flex justify-between">
                <div className="flex gap-2">
                <Tippy theme="yellowTooltip" content="You reached rank 1" delay={[0, 0]}>
                 {user?.achievements.includes("1x") ?   <button className="text-yellow-400">
                   <span className="badge-rank-1"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 2" delay={[0, 0]}>
                 {user?.achievements.includes("2x") ? <button className="text-yellow-400">
                     <span className="badge-rank-2"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 3" delay={[0, 0]}>
                  {user?.achievements.includes("3x") ? <button className="text-yellow-400">
                    <span className="badge-rank-3"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 4" delay={[0, 0]}>
                  {user?.achievements.includes("4x") ?  <button className="text-yellow-400">
                     <span className="badge-rank-4"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 5" delay={[0, 0]}>
                    {user?.achievements.includes("5x") ? <button className="text-yellow-400">
                    <span className="badge-rank-5"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 6" delay={[0, 0]}>
                  {user?.achievements.includes("6x") ? <button className="text-yellow-400">
                     <span className="badge-rank-6"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 7" delay={[0, 0]}>
                 {user?.achievements.includes("7x") ?  <button className="text-yellow-400">
                     <span className="badge-rank-7"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 8" delay={[0, 0]}>
                  {user?.achievements.includes("8x") ?  <button className="text-yellow-400">
                    <span className="badge-rank-8"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 9" delay={[0, 0]}>
                    {user?.achievements.includes("9x") ? <button className="text-yellow-400">
                   <span className="badge-rank-9"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 10" delay={[0, 0]}>
                  {user?.achievements.includes("10x") ? <button className="text-yellow-400">
                     <span className="badge-rank-10"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Telegram address" delay={[0, 0]}>
                 {user?.achievements.includes("t") ? <button className="text-yellow-400">
                      <span className="badge-social-telegram"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Twitter address" delay={[0, 0]}>
                  {user?.achievements.includes("x") ?<button className="text-yellow-400">
                      <span className="badge-social-twitter"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Solana address" delay={[0, 0]}>
                 {user?.achievements.includes("s") ? <button className="text-yellow-400">
                      <span className="badge-social-solana"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 5X marketCap" delay={[0, 0]}>
                  {user?.achievements.includes("c5x") ? <button className="text-yellow-400">
                     <span className="badge-call-5X"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 10X marketCap" delay={[0, 0]}>
                   {user?.achievements.includes("c10x") ? <button className="text-yellow-400">
                    <span className="badge-call-10X"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 50X marketCap" delay={[0, 0]}>
                  {user?.achievements.includes("c50x") ?<button className="text-yellow-400">
                      <span className="badge-call-50X"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 100X marketCap" delay={[0, 0]}>
                  {user?.achievements.includes("c100x") ?<button className="text-yellow-400">
                      <span className="badge-call-100X"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="10 people copytrade you" delay={[0, 0]}>
                   {user?.achievements.includes("u10") ? <button className="text-yellow-400">
                    <span className="badge-user-10"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="50 people copytrade you" delay={[0, 0]}>
                   {user?.achievements.includes("u50") ? <button className="text-yellow-400">
                    <span className="badge-user-50"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="100 people copytrade you" delay={[0, 0]}>
                   {user?.achievements.includes("u100") ?<button className="text-yellow-400">
                     <span className="badge-user-100"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 50K-money" delay={[0, 0]}>
                 {user?.achievements.includes("m50k") ? <button className="text-yellow-400">
                      <span className="badge-money-50k"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 100K-money" delay={[0, 0]}>
                   {user?.achievements.includes("m100k") ? <button className="text-yellow-400">
                    <span className="badge-money-100k"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 500K-money" delay={[0, 0]}>
                  {user?.achievements.includes("m500k") ? <button className="text-yellow-400">
                     <span className="badge-money-500k"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 1m-money" delay={[0, 0]}>
                  {user?.achievements.includes("m1m") ? <button className="text-yellow-400">
                     <span className="badge-money-1m"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 1 month history" delay={[0, 0]}>
                  {user?.achievements.includes("reg1m") ? <button className="text-yellow-400">
                     <span className="badge-register-1m"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 3 months history" delay={[0, 0]}>
                  {user?.achievements.includes("reg3m") ? <button className="text-yellow-400">
                     <span className="badge-register-3m"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 1 year history" delay={[0, 0]}>
                  {user?.achievements.includes("reg1y") ?<button className="text-yellow-400">
                      <span className="badge-register-1y"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You are a influencer" delay={[0, 0]}>
                  {user?.achievements.includes("influ") ? <button className="text-yellow-400">
                     <span className="badge-other-influencer"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Alpha action" delay={[0, 0]}>
                  {user?.achievements.includes("alpha") ? <button className="text-yellow-400">
                     <span className="badge-other-alpha"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You have a best partner" delay={[0, 0]}>
                   {user?.achievements.includes("partner") ? <button className="text-yellow-400">
                    <span className="badge-other-partner"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You never did skip" delay={[0, 0]}>
                  {user?.achievements.includes("never") ? <button className="text-yellow-400">
                     <span className="badge-other-neverskip"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You found some bugs of this site" delay={[0, 0]}>
                  {user?.achievements.includes("bug") ? 
                  <button className="text-yellow-400">
                     <span className="badge-other-bughunter"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You registered on this site" delay={[0, 0]}>
                  {user?.achievements.includes("OG") ?
                  <button className="text-yellow-400">
                      <span className="badge-other-og"></span>
                  </button> : <></>}
                </Tippy>
                </div>
                {/* <button className="w-8 h-8 text-xs font-bold bg-white circle-item text-black">+5</button> */}
              </div>
            </div>
          </> : <>
              <div className="space-y-3">
                { 
                  notificates.map((notificate) => 
                    <>
                      { 
                        notificate.type == "rankup" ?
                          <div className="rounded-[20px] border border-black/15 p-4 space-y-2">
                           <div className="flex justify-between">
                            <div className="flex gap-3 items-center">
                                <div className="circle bg-dark1"><span className={`badge-rank-${notificate.value}`}></span></div>
                                <span className="text-black font-bold">{ notificate.title}</span>
                              </div>
                              </div>
                            <p className="text-black/70 text-sm !leading-[135%]">{ notificate.content} </p>
                          </div> :
                        notificate.type == "x" ?
                         <div className="rounded-[20px] border border-black/15 p-4 space-y-2">
                          <div className="flex justify-between">
                           <div className="flex gap-3 items-center">
                            <span className="badge-social-twitter"></span>
                            <span className="text-black font-bold">X Linked</span>
                           </div>
                           </div>
                              <p className="text-black/70 text-sm !leading-[135%]">{notificate.content} </p>
                         </div> :
                      notificate.type == "t" ? 
                         <div className="rounded-[20px] border border-black/15 p-4 space-y-2">
                          <div className="flex justify-between">
                           <div className="flex gap-3 items-center">
                           <span className="badge-social-telegram"></span>
                           <span className="text-black font-bold">Telegram Linked</span>
                            </div>
                           </div>
                         <p className="text-black/70 text-sm !leading-[135%]">{ notificate.content} </p>
                         </div> :      
                         <div className="rounded-[20px] border border-black/15 p-4 space-y-2">
                          <div className="flex justify-between">
                           <div className="flex gap-3 items-center">
                           <span className="badge-social-solana"></span>
                           <span className="text-black font-bold">Solana Linked</span>
                            </div>
                           </div>
                         <p className="text-black/70 text-sm !leading-[135%]">{ notificate.content}</p>
                         </div>            
                      }
                    </>
                  )
                }

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
                  <img src={call.image} className="w-8 h-8 sm:w-[40px] sm:h-[40px] circle"/>
                  <span className="font-bold text-sm sm:text-base">${call.symbol}</span>
                  {call.is_featured ? <span className="rounded-full bg-green-600 px-2 py-1.5 text-xs text-black font-semibold">{call.featured}X</span> : <></>}
                </div>
                {call.addXP == 0 ? <></> : call.addXP < 0 ? <span className="rounded-full bg-red-500 px-2 py-1.5 text-xs text-black font-semibold">{call.addXP}XP</span> :
                   <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">{call.addXP}XP</span>}
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
    {/* <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} maxsol={0} /> */}
    <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
    <AllTradesModal isOpen={isAllTradesModalOpen} onClose={() => setIsAllTradesModalOpen(false)} />
  </>)
}

export default MyProfile;