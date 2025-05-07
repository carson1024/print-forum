import React, { useEffect, useState } from "react";
import { AiFillCaretUp } from "react-icons/ai";
import WithdrawModal from "components/modal/WithdrawModal";
import DepositModal from "components/modal/DepositModal";
import AllTradesModal from "components/modal/AllTradesModal";
import AlertModal from "components/modal/AlertModal";
import { Link } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { supabase } from "lib/supabase";
import { SkeletonMyCallsList } from "components/skeleton/mycalls";
import { getRankChar } from "../../../../src/utils/style";
import { formatNumber, formatShortAddress, formatTimestamp } from "../../../utils/blockchain";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { Keypair } from '@solana/web3.js';
import ConfirmwithdrawModalModal from "components/modal/ConfirmwithdrawModal";
import Userlogo from 'assets/img/sample/userlogo.png';
import Next from 'assets/img/sample/next.png';
import Ring from 'assets/img/sample/Ring.png';
import Setting from 'assets/img/sample/Setting.png';
import UpDeposite from 'assets/img/sample/UpDeposite.png';
import DownWithdraw from 'assets/img/sample/DownWithdraw.png';
const MyProfile = (props: {
  logout: () => void
}) => {
  const { session, user } = useAuth();
  const { logout } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [activeTag, setActiveTag] = useState("");
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
  const [amount, setAmount] = useState(0);
  const [toaddress, setToAddress] = useState("");
  const [isConfirmWithdrawModalOpen, setIsConfirmWithdrawModalOpen] = useState(false);
  const [isRingModalOpen, setIsRingModalOpen] = useState(false);
  const [mySKey, setMySKey] = useState({});
  const [balance, setBalance] = useState<number | null>(null);
  const getBalance = async (publicKeyStr: string) => {
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); // or 'mainnet-beta'
  const publicKey = new PublicKey(publicKeyStr);

  try {
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Error fetching balance:', error);
    return null;
  }
};

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

    if (user?.wallet_paddress) {
      let interval: NodeJS.Timeout;
      const fetchBalance = async (publicKeyStr: string) => {
        const balance = await getBalance(publicKeyStr);
        setBalance(balance);
        if (user.balance !== balance) {
          user.balance = balance;
          const { error: balanceError } = await supabase
                .from('users')
                .update({ balance:balance })
                .eq('id', user.id);
                if (balanceError) {
                console.error('Error updating balance error', balanceError);
              }
        }
      };
      const privateKeyString = user?.wallet_saddress;
      const privateKeyObject = JSON.parse(privateKeyString);
      const privateKeyArray = Object.values(privateKeyObject).map(Number);
      const privateKeyUint8Array = Uint8Array.from(privateKeyArray);
      const myKeypair = Keypair.fromSecretKey(privateKeyUint8Array);
      setMySKey(myKeypair);
      const fetchcall = async () => {
        try {
          // setMyKey(data.wallet_paddress);
          await fetchBalance(user.wallet_paddress);
          setIsLoading(false);
          // Set interval AFTER you have the wallet address
          interval = setInterval(() => {
            fetchBalance(user.wallet_paddress);
          }, 5000);
        } catch (error) {
          console.error('Error fetching user info', error);
        }
      };
      fetchcall();
     return () => {
        if (interval) clearInterval(interval);
      };
    }
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
        setActiveTab(1); 
        setHasUnread(false); // hide the badge on click
        setUnreadcounts(0)
        };
        const handleClick1 = async() => {
        setHasUnread(true); // hide the badge on click
        setActiveTab(0);
        const { error } = await supabase
        .from("users")
        .update({ achievements: ["OG", "1x"] })
        .eq("id", user.id);
  };
  
function formatSinceDate(timestamp?: string): string {
  if (!timestamp) return ""; // or return a fallback like "Unknown"
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return ""; // Invalid date fallback

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return `Since ${new Intl.DateTimeFormat("en-US", options).format(date)}`;
}
  
  return (<>
  <div className="h-screen bg-black text-white ">
        <div className="grid grid-rows-[100px_170px_98px_197px_270px_1fr_50px] h-screen border-gray-800">
          <div className=" border-b border-gray-800 items-center justify-center">
            <div className="m-[18px]">
            <div className="flex items-center">
              { 
                !user?.avatar ? <a><img src={Userlogo} className="w-[32px] h-[32px] mr-[8px]" /></a> :
                  <a><img src={user.avatar} className="w-[32px] h-[32px] mr-[8px] circle"/></a>
              }
                <span className="text-[14px] flex items-center font-semibold text-white">{user?.name}</span>
                <button><img src={Next} className="w-[24px] h-[24px] mr-[8px]" /></button>
                <div className="bg-black"></div>
                <button onClick={() => setIsRingModalOpen(true)} ><img src={Ring} className="w-[24px] h-[24px] mr-[8px] ml-auto" /></button>
                <button><img src={Setting} className="w-[24px] h-[24px]" /></button>
              </div>
              <div className="flex items-center mt-[20px]">
              <div className="text-gray-400 text-[12px] font-Medium">Win rate {user?.winrate}% | Total calls {user?.callcount} | Account age {formatTimestamp(user?.created_at)} </div>
              </div>
            </div>
          </div>
          <div className=" border-b border-gray-800 items-center justify-center">
          {
            !user?<div className="m-[18px]">
              <div className="flex items-center profileXP mb-[20px]">
              <span className={`badge-rank-1 w-[36px] h-[36px] mr-[6px]`}></span>
              <span className="text-[14px] font-semibold text-white flex items-center justify-center">Rank 1</span>
              <span className="text-[12px] font-Medium text-gray-600 flex items-center ml-auto">Since Apr 29, 2025</span>
              </div>
              <div className="XP space-y-[8px]">
                <div className="flex">
                  <span className="text-[12px] font-Medium text-gray-600 flex items-center">Rank progression</span>
                  <span className="text-[14px] font-semibold text-white flex items-center ml-auto">Rank 3</span>
                </div>
                <div style={{ background: "#1C1B1F" }} className=" rounded-full">
                <div className="flex bg-primary h-2 rounded-full" style={{ width: '16.5%',height:'12px' }}></div>
                </div>
                <div className="flex">
                <span className="text-[12px] font-Medium text-primary flex items-center">165 XP</span>
                <span className="text-[12px] font-Medium text-gray-600 flex items-center ml-auto">1000 XP</span>
                </div>
              </div>
            </div> :
              <div className="m-[18px]">
              <div className="flex items-center profileXP mb-[20px]">
              <span className={`badge-rank-${user?.rank} w-[36px] h-[36px] mr-[6px]`}></span>
              <span className="text-[14px] font-semibold text-white flex items-center justify-center">Rank {user?.rank}</span>
              <span className="text-[12px] font-Medium text-gray-600 flex items-center ml-auto">{formatSinceDate(user?.created_at)}</span>
              </div>
              <div className="XP space-y-[8px]">
                <div className="flex">
                  <span className="text-[12px] font-Medium text-gray-600 flex items-center">Rank progression</span>
                    <span className="text-[14px] font-semibold text-white flex items-center ml-auto">Rank {user?.rank}</span>
                </div>
                <div style={{ background: "#1C1B1F" }} className=" rounded-full">
                <div className="flex bg-primary h-2 rounded-full" style={{ width: `${user?.xp*100/1000}%`,height:'12px' }}></div>
                </div>
                <div className="flex">
                    <span className="text-[12px] font-Medium text-primary flex items-center">{user?.xp} XP</span>
                <span className="text-[12px] font-Medium text-gray-600 flex items-center ml-auto">1000 XP</span>
                </div>
              </div>
            </div>
          }
            
          </div>
          <div className=" border-b border-gray-800 items-center justify-center">
            <div className="m-[18px]">
              <span className="text-[14px] font-semibold text-white flex items-center mb-[16px]">Achievements</span>
              <div className="flex space-x-[6px]">
              {/* <button className="w-[32px] h-[32px] text-xs font-bold bg-gray-900 circle-item text-white">+5</button> */}
              <Tippy theme="yellowTooltip" content="You reached rank 1" delay={[0, 0]}>
                 {user?.achievements.includes("1x") ?   <button className="text-yellow-400">
                   <span className="badge-rank-1 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 2" delay={[0, 0]}>
                 {user?.achievements.includes("2x") ? <button className="text-yellow-400">
                     <span className="badge-rank-2 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 3" delay={[0, 0]}>
                  {user?.achievements.includes("3x") ? <button className="text-yellow-400">
                    <span className="badge-rank-3 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 4" delay={[0, 0]}>
                  {user?.achievements.includes("4x") ?  <button className="text-yellow-400">
                     <span className="badge-rank-4 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 5" delay={[0, 0]}>
                    {user?.achievements.includes("5x") ? <button className="text-yellow-400">
                    <span className="badge-rank-5 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 6" delay={[0, 0]}>
                  {user?.achievements.includes("6x") ? <button className="text-yellow-400">
                     <span className="badge-rank-6 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 7" delay={[0, 0]}>
                 {user?.achievements.includes("7x") ?  <button className="text-yellow-400">
                     <span className="badge-rank-7 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 8" delay={[0, 0]}>
                  {user?.achievements.includes("8x") ?  <button className="text-yellow-400">
                    <span className="badge-rank-8 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 9" delay={[0, 0]}>
                    {user?.achievements.includes("9x") ? <button className="text-yellow-400">
                   <span className="badge-rank-9 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You reached rank 10" delay={[0, 0]}>
                  {user?.achievements.includes("10x") ? <button className="text-yellow-400">
                     <span className="badge-rank-10 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Telegram address" delay={[0, 0]}>
                 {user?.achievements.includes("t") ? <button className="text-yellow-400">
                      <span className="badge-social-telegram w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Twitter address" delay={[0, 0]}>
                  {user?.achievements.includes("x") ?<button className="text-yellow-400">
                      <span className="badge-social-twitter w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You set your Solana address" delay={[0, 0]}>
                 {user?.achievements.includes("s") ? <button className="text-yellow-400">
                      <span className="badge-social-solana w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 5X marketCap" delay={[0, 0]}>
                  {user?.achievements.includes("c5x") ? <button className="text-yellow-400">
                     <span className="badge-call-5X w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 10X marketCap" delay={[0, 0]}>
                   {user?.achievements.includes("c10x") ? <button className="text-yellow-400">
                    <span className="badge-call-10X w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 50X marketCap" delay={[0, 0]}>
                  {user?.achievements.includes("c50x") ?<button className="text-yellow-400">
                      <span className="badge-call-50X w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You get 100X marketCap" delay={[0, 0]}>
                  {user?.achievements.includes("c100x") ?<button className="text-yellow-400">
                      <span className="badge-call-100X w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="10 people copytrade you" delay={[0, 0]}>
                   {user?.achievements.includes("u10") ? <button className="text-yellow-400">
                    <span className="badge-user-10 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="50 people copytrade you" delay={[0, 0]}>
                   {user?.achievements.includes("u50") ? <button className="text-yellow-400">
                    <span className="badge-user-50 w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="100 people copytrade you" delay={[0, 0]}>
                   {user?.achievements.includes("u100") ?<button className="text-yellow-400">
                     <span className="badge-user-100 w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 50K-money" delay={[0, 0]}>
                 {user?.achievements.includes("m50k") ? <button className="text-yellow-400">
                      <span className="badge-money-50k w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 100K-money" delay={[0, 0]}>
                   {user?.achievements.includes("m100k") ? <button className="text-yellow-400">
                    <span className="badge-money-100k w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 500K-money" delay={[0, 0]}>
                  {user?.achievements.includes("m500k") ? <button className="text-yellow-400">
                     <span className="badge-money-500k w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You earn 1m-money" delay={[0, 0]}>
                  {user?.achievements.includes("m1m") ? <button className="text-yellow-400">
                     <span className="badge-money-1m w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 1 month history" delay={[0, 0]}>
                  {user?.achievements.includes("reg1m") ? <button className="text-yellow-400">
                     <span className="badge-register-1m w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 3 months history" delay={[0, 0]}>
                  {user?.achievements.includes("reg3m") ? <button className="text-yellow-400">
                     <span className="badge-register-3m w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Your account has 1 year history" delay={[0, 0]}>
                  {user?.achievements.includes("reg1y") ?<button className="text-yellow-400">
                      <span className="badge-register-1y w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You are a influencer" delay={[0, 0]}>
                  {user?.achievements.includes("influ") ? <button className="text-yellow-400">
                     <span className="badge-other-influencer w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="Alpha action" delay={[0, 0]}>
                  {user?.achievements.includes("alpha") ? <button className="text-yellow-400">
                     <span className="badge-other-alpha w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You have a best partner" delay={[0, 0]}>
                   {user?.achievements.includes("partner") ? <button className="text-yellow-400">
                    <span className="badge-other-partner w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You never did skip" delay={[0, 0]}>
                  {user?.achievements.includes("never") ? <button className="text-yellow-400">
                     <span className="badge-other-neverskip w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You found some bugs of this site" delay={[0, 0]}>
                  {user?.achievements.includes("bug") ? 
                  <button className="text-yellow-400">
                     <span className="badge-other-bughunter w-[32px] h-[32px]"></span> 
                  </button>: <></>}
                </Tippy>
                <Tippy theme="yellowTooltip" content="You registered on this site" delay={[0, 0]}>
                  {user?.achievements.includes("OG") ?
                  <button className="text-yellow-400">
                      <span className="badge-other-og w-[32px] h-[32px]"></span>
                  </button> : <></>}
                </Tippy>
              </div>
            </div>
          </div>
          <div className=" border-b border-gray-800 items-center justify-center">
            <div className="m-[18px]">
              <div className=" items-center wallet h-full grid-rows-[66px_1fr]"> 
                <div className="items-center flex">
                    <div className="">
                      <div className="text-[24px] font-semibold text-white flex items-center m-0">
                        {balance ||0} SOL
                        <div className="w-[34px] h-[21px] text-xxs font-bold bg-gray-200 circle-item text-white ml-[4px]">
                          <AiFillCaretUp />1%
                        </div>
                      </div>
                      <div className="text-[12px] font-Regular text-gray-600 flex items-center"> 
                        Current balance
                      </div>
                    </div>
                  <div className="ml-auto"> 
                    <div className="mb-[12px]">
                      <div className="text-[14px] font-semibold text-[#59FFCB] flex items-center">{user?.allocate_balance || 0} SOL<span className="text-[14px] font-semibold text-[#59FFCB] flex items-center"><AiFillCaretUp className="transform scale-[0.6]" />12%</span></div>
                      <div className="text-[12px] font-Regular text-gray-600 flex items-center">Copying</div>
                    </div>
                    <div className="">
                      <div className="text-[14px] font-semibold text-[#59FFCB] flex items-center">{Number(balance-user?.allocate_balance) ||0} SOL</div>
                      <div className="text-[12px] font-Regular text-gray-600 flex items-center">Unallocated</div>
                    </div>
                  </div>
                </div>
                <div className="items-center flex justify-between mt-[4px]">
                  <button className="btn_deposite mr-[8px] text-[12px] font-semibold text-[#59FFCB] items-center justify-center flex mainhover" onClick={() => setIsDepositModalOpen(true)}><img src={UpDeposite} />Deposit</button>
                  <button className="btn_withdraw text-[12px] font-semibold text-[#FF4949] items-center justify-center flex mainhover" onClick={() => setIsWithdrawModalOpen(true)}><img src={DownWithdraw} />Withdraw</button>
                </div>
              </div>
            </div>
          </div>
          <div className=" border-b border-gray-800 items-center justify-center">
            <div className="m-[18px] h-full">
              <div className="flex mb-[20px]">
              <button className={`btn_profile text-[12px] font-semibold ${activeTag == "mtrade" ? "text-primary " : "text-[#76767E]"}  items-center justify-center flex mr-[8px] mainhover`} onClick={() => { setActiveTag('mtrade'); setIsAllTradesModalOpen(true); }}>My Trades</button>
                <button className={`btn_profile text-[12px] font-semibold ${activeTag == "mcall" ? "text-primary ":"text-[#76767E]"} items-center justify-center flex mainhover`} onClick={() => setActiveTag('mcall')}>My Calls</button>
                <button className={`btn_outline text-[11px] font-semibold ${activeTag == "alltrade" ? "text-primary ":"text-[#76767E]"} items-center justify-center flex ml-auto mainhover`} onClick={() => setActiveTag('alltrade')}>All Trades</button>
              </div>
            <div className="flex-1 overflow-y-auto h-[200px]">
            { 
              !user ?
                <div className="">
                  {
                    Array(3).fill(0).map(() => <div className="border-b-[1px] border-black/10 space-y-[8px] justify-evenly h-full mb-[8px]">
                      <div className="flex items-center">
                        <div className="gray space-x-[4px] text-[12px]">
                          <button className="circle btn_buy_small text-white px-1.5 py-1 text-xs">Buy</button>
                          <button className="rounded-full bg-black/10 text-white/60 text-xs">UsernameLong</button>
                        </div>
                        <span className="text-xs text-white/60 ml-auto">2025-01-16 15:45:17</span>
                      </div>
                      <div className="border-b-[1px] flex text-[12px] font-Medium justify-between">
                        <div className="">
                          <p className="text-xs text-white/60 mb-[4px]">Pair</p>
                          <p className="text-xs text-white mb-[4px]">UNIUSDT</p>
                        </div>
                        <div className="">
                          <p className="text-xs text-white/60 mb-[4px]">Executed</p>
                          <p className="text-xs text-white mb-[4px]">7.87 UNI</p>
                        </div>
                        <div className="">
                          <p className="text-xs text-white/60 mb-[4px]">Total</p>
                          <p className="text-xs text-white mb-[4px]">0.01 SOL</p>
                        </div>
                        <div className="">
                          <p className="text-xs text-white/60 mb-[4px]">Role</p>
                          <p className="text-xs text-white mb-[4px]">Taiker</p>
                        </div>
                      </div>
                    </div>)
                  }
              </div> :
                <>
                  {
                    activeTag=="mtrade"? <div className="">
                      {
                        Array(3).fill(0).map(() => <div className="border-b-[1px] border-black/10 space-y-[8px] justify-evenly h-full mb-[8px]">
                          <div className="flex items-center">
                            <div className="gray space-x-[4px] text-[12px]">
                              <button className="circle btn_buy_small text-white px-1.5 py-1 text-xs">Buy</button>
                              <button className="rounded-full bg-black/10 text-white/60 text-xs">UsernameLong</button>
                            </div>
                            <span className="text-xs text-white/60 ml-auto">2025-01-16 15:45:17</span>
                          </div>
                          <div className="border-b-[1px] flex text-[12px] font-Medium justify-between">
                            <div className="">
                              <p className="text-xs text-white/60 mb-[4px]">Pair</p>
                              <p className="text-xs text-white mb-[4px]">UNIUSDT</p>
                            </div>
                            <div className="">
                              <p className="text-xs text-white/60 mb-[4px]">Executed</p>
                              <p className="text-xs text-white mb-[4px]">7.87 UNI</p>
                            </div>
                            <div className="">
                              <p className="text-xs text-white/60 mb-[4px]">Total</p>
                              <p className="text-xs text-white mb-[4px]">0.01 SOL</p>
                            </div>
                            <div className="">
                              <p className="text-xs text-white/60 mb-[4px]">Role</p>
                              <p className="text-xs text-white mb-[4px]">Taiker</p>
                            </div>
                          </div>
                        </div>)
                      }
                    </div> :
                      activeTag == "mcall" ?
                      <div className="space-y-2 ">
                        {
                          isLoading || !callList.length ? <SkeletonMyCallsList /> :
                          callList.map((call, index) => (<div className="rounded-full border border-gray/15 flex justify-between items-center p-1 pr-3">
                            <div className="flex gap-1 items-center">
                              <img src={call.image} className="w-8 h-8 sm:w-[40px] sm:h-[40px] recircle"/>
                              <span className="font-bold text-sm sm:text-base">${call.symbol}</span>
                              {call.is_featured ? <span className="rounded-full bg-green-600 px-2 py-1.5 text-xs text-black font-semibold">{call.featured}X</span> : <></>}
                            </div>
                            {call.addXP == 0 ? <></> : call.addXP < 0 ? <span className="rounded-full bg-red-500 px-2 py-1.5 text-xs text-black font-semibold">{call.addXP}XP</span> :
                              <span className="rounded-full bg-primary px-2 py-1.5 text-xs text-black font-semibold">{call.addXP}XP</span>}
                          </div>
                          ))
                        }
                      </div>
                      :
                         <div className="">
                          {
                            Array(3).fill(0).map(() => <div className="border-b-[1px] border-black/10 space-y-[8px] justify-evenly h-full mb-[8px]">
                              <div className="flex items-center">
                                <div className="gray space-x-[4px] text-[12px]">
                                  <button className="circle btn_buy_small text-white px-1.5 py-1 text-xs">Buy</button>
                                  <button className="rounded-full bg-black/10 text-white/60 text-xs">UsernameLong</button>
                                </div>
                                <span className="text-xs text-white/60 ml-auto">2025-01-16 15:45:17</span>
                              </div>
                              <div className="border-b-[1px] flex text-[12px] font-Medium justify-between">
                                <div className="">
                                  <p className="text-xs text-white/60 mb-[4px]">Pair</p>
                                  <p className="text-xs text-white mb-[4px]">UNIUSDT</p>
                                </div>
                                <div className="">
                                  <p className="text-xs text-white/60 mb-[4px]">Executed</p>
                                  <p className="text-xs text-white mb-[4px]">7.87 UNI</p>
                                </div>
                                <div className="">
                                  <p className="text-xs text-white/60 mb-[4px]">Total</p>
                                  <p className="text-xs text-white mb-[4px]">0.01 SOL</p>
                                </div>
                                <div className="">
                                  <p className="text-xs text-white/60 mb-[4px]">Role</p>
                                  <p className="text-xs text-white mb-[4px]">Taiker</p>
                                </div>
                              </div>
                            </div>)
                          }
                   </div>
                  }
                </>
             }          
            </div>
            </div>
          </div> 
          <div className="bg-black"></div>
          <div className=" flex items-center border-gray-800 bg-black">
            <div className="m-[18px]">
              <button className="text-[14px] font-semibold text-[#76767E] p-1 " onClick={logout}>Log out</button>
            </div>
          </div>
      </div>
  </div>
    <WithdrawModal isOpen={isWithdrawModalOpen} onClose={() => { setIsWithdrawModalOpen(false); }} maxsol={balance} onWithdraw={(amount: number, tooneaddress: string) => { setIsConfirmWithdrawModalOpen(true); setAmount(amount); setToAddress(tooneaddress)}} />
    <ConfirmwithdrawModalModal isOpen={isConfirmWithdrawModalOpen} onClose={() => { setIsConfirmWithdrawModalOpen(false); setIsWithdrawModalOpen(false); }} maxsol={balance} withdraw={amount} privateKey={mySKey} to={toaddress} />
    <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} />
    <AllTradesModal isOpen={isAllTradesModalOpen} onClose={() => setIsAllTradesModalOpen(false)} />
    <AlertModal isOpen={isRingModalOpen} onClose={() => setIsRingModalOpen(false)} />
    
  </>
)}

export default MyProfile;