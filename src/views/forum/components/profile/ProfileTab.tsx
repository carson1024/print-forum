import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import React, { Component } from 'react';
import { formatTimestamp } from "../../../../utils/blockchain";
import { useAuth } from "../../../../contexts/AuthContext";

type Props = {
  myprofile: {
    name: string;
    email: string;
    avatar: string;
    xp: string;
    rank: string;
    winrate: string;
    callcount: string;
    achievements: string;
    created_at: string;
    taddress: string;
    xaddress: string;
    saddress: string;
    bio: string;
  };
};

const ProfileTab = ({ myprofile }: Props) => {
  const { isLogin,session } = useAuth();
  return (<>
    <div className="overflow-auto sm:h-full">
      <div className="flex flex-col gap-6 sm:border-b-[1px] border-gray-100 p-4 sm:p-6">
        <div className="hidden sm:grid grid-cols-12">
          <div className="col-span-9 flex-grow space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Followers</span>
                <span className="text-xs text-primary">12</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Win rate</span>
                <span className="text-xs text-green-600">{myprofile.winrate}</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Calls</span>
                <span className="text-xs text-white">{myprofile.callcount}</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Account age</span>
                <span className="text-xs text-white">{formatTimestamp(myprofile.created_at) } ago</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 !leading-[135%]">
              {myprofile.bio}
            </p>
          </div>
          <div className="col-span-3">
            <div className="flex">
              { 
                isLogin ?<div className="ml-auto flex px-3 py-2 gap-3 bg-gray-50 rounded-full items-center">
                <button><a  href={`https://x.com/${myprofile.xaddress}`} target="_blank" rel="noopener noreferrer" ><img src={IconTwitter} className='w-3.5 h-3.5 sm:w-5 sm:h-5' /></a></button>
                <button><a  href={`https://t.me/${myprofile.taddress}`} target="_blank" rel="noopener noreferrer" ><img src={IconTelegram} className='w-[20px] h-[20px] sm:w-[28px] sm:h-[28px]' /></a></button>
                <button><a  href={`https://explorer.solana.com/address/${myprofile.saddress}`} target="_blank" rel="noopener noreferrer" ><img src={IconSolana} className='w-4 h-4 sm:w-6 sm:h-6' /></a></button>
                </div> :<div className="ml-auto flex px-3 py-2 gap-3 bg-gray-50 rounded-full items-center">
                <button><a target="_blank" rel="noopener noreferrer" ><img src={IconTwitter} className='w-3.5 h-3.5 sm:w-5 sm:h-5' /></a></button>
                <button><a target="_blank" rel="noopener noreferrer" ><img src={IconTelegram} className='w-[20px] h-[20px] sm:w-[28px] sm:h-[28px]' /></a></button>
                <button><a target="_blank" rel="noopener noreferrer" ><img src={IconSolana} className='w-4 h-4 sm:w-6 sm:h-6' /></a></button>
                </div>
              }
              
            </div>
          </div>
        </div>
        <div className="sm:hidden rounded-[22px] text-white space-y-2">
          <span className='text-sm font-bold'>Bio</span>
          <p className='text-xs !leading-[135%]'>{myprofile.bio}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 sm:p-5 rounded-[22px] bg-gray-50">
            <div className="space-y-2 text-white">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className={"badge-rank-" + myprofile.rank}></span>
                  <span className="text-sm text-white">Rank {myprofile.rank}</span>
                </div>
                <div className="hidden sm:flex gap-2 items-center">
                  {/* <span className="circle-item bg-gray-50 w-8 h-8 text-xs font-bold">IV</span> */}
                  <span className={"badge-rank-" + Number(myprofile.rank+1)}></span>
                  <span className="text-sm text-gray-600">Rank {Number( myprofile.rank ) + 1}</span>
                </div>
              </div>
              <div className="hidden sm:flex w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${ Number(myprofile.xp) * 100/1000}%`  }}></div>
              </div>
              <div className="hidden sm:flex  justify-between">
                <span className="text-sm text-white">{myprofile.xp} XP</span>
                <span className="text-gray-600 text-sm">1000 XP</span>
              </div>
            </div>
          </div>
          <div className="sm:hidden p-4 sm:p-5 rounded-[22px] bg-gray-50 text-xs space-y-1.5">
            <div className='grid grid-cols-12'>
              <span className='col-span-4 text-gray-600'>Win rate</span>
              <span className='col-span-8 text-white'>{myprofile.winrate}%</span>
            </div>
            <div className='grid grid-cols-12'>
              <span className='col-span-4 text-gray-600'>Calls</span>
              <span className='col-span-8 text-white'>{myprofile.callcount}</span>
            </div>
            <div className='grid grid-cols-12'>
              <span className='col-span-4 text-gray-600'>Account age</span>
              <span className='col-span-8 text-white'>{formatTimestamp(myprofile.created_at)} ago</span>
            </div>
          </div>
          <div className="rounded-[22px] sm:bg-gray-50 text-white sm:p-4 space-y-2.5">
            <span>Archievements</span>
            <div className="flex justify-between">
              <div className="flex gap-2">
                {myprofile?.achievements.includes("1x") ? <span className="badge-rank-1" title="You reached rank 1"></span> : <></>}
                {myprofile?.achievements.includes("2x") ? <span className="badge-rank-2" title="You reached rank 2"></span> : <></>}
                {myprofile?.achievements.includes("3x") ? <span className="badge-rank-3" title="You reached rank 3"></span> : <></>}
                {myprofile?.achievements.includes("4x") ? <span className="badge-rank-4" title="You reached rank 4"></span> : <></>}
                {myprofile?.achievements.includes("5x") ? <span className="badge-rank-5" title="You reached rank 5"></span> : <></>}
                {myprofile?.achievements.includes("6x") ? <span className="badge-rank-6" title="You reached rank 6"></span> : <></>}
                {myprofile?.achievements.includes("7x") ? <span className="badge-rank-7" title="You reached rank 7"></span> : <></>}
                {myprofile?.achievements.includes("8x") ? <span className="badge-rank-8" title="You reached rank 8"></span> : <></>}
                {myprofile?.achievements.includes("9x") ? <span className="badge-rank-9" title="You reached rank 9"></span> : <></>}
                {myprofile?.achievements.includes("10x") ? <span className="badge-rank-10" title="You reached rank 10"></span> : <></>}
                {myprofile?.achievements.includes("t") ? <span className="badge-social-telegram" title="You set your Telegram address"></span> : <></>}
                {myprofile?.achievements.includes("x") ? <span className="badge-social-twitter" title="You set your Twitter address"></span> : <></>}
                {myprofile?.achievements.includes("s") ? <span className="badge-social-solana" title="You set your Solana address"></span> : <></>}
                {myprofile?.achievements.includes("c5x") ? <span className="badge-call-5X" title="You get 5X marketCap"></span> : <></>}
                {myprofile?.achievements.includes("c10x") ? <span className="badge-call-10X" title="You get 10X marketCap"></span> : <></>}
                {myprofile?.achievements.includes("c50x") ? <span className="badge-call-50X" title="You get 50X marketCap"></span> : <></>}
                {myprofile?.achievements.includes("c100x") ? <span className="badge-call-100X" title="You get 100X marketCap"></span> : <></>}
                {myprofile?.achievements.includes("u10") ? <span className="badge-user-10" title="10 people copytrade you"></span> : <></>}
                {myprofile?.achievements.includes("u50") ? <span className="badge-user-50" title="50 people copytrade you"></span> : <></>}
                {myprofile?.achievements.includes("u100") ? <span className="badge-user-100" title="100 people copytrade you"></span> : <></>}
                {myprofile?.achievements.includes("m50k") ? <span className="badge-money-50k" title="You earn 50K-money"></span> : <></>}
                {myprofile?.achievements.includes("m100k") ? <span className="badge-money-100k" title="You earn 100K-money"></span> : <></>}
                {myprofile?.achievements.includes("m500k") ? <span className="badge-money-500k" title="You earn 500K-money"></span> : <></>}
                {myprofile?.achievements.includes("m1m") ? <span className="badge-money-1m" title="You earn 1m-money"></span> : <></>}
                {myprofile?.achievements.includes("reg1m") ? <span className="badge-register-1m" title="Your account has 1 month history"></span> : <></>}
                {myprofile?.achievements.includes("reg3m") ? <span className="badge-register-3m" title="Your account has 3 month history"></span> : <></>}
                {myprofile?.achievements.includes("reg1y") ? <span className="badge-register-1y" title="Your account has 1 year history"></span> : <></>}
                {myprofile?.achievements.includes("influ") ? <span className="badge-other-influencer"></span> : <></>}
                {myprofile?.achievements.includes("alpha") ? <span className="badge-other-alpha"></span> : <></>}
                {myprofile?.achievements.includes("partner") ? <span className="badge-other-partner" title="You have best partner"></span> : <></>}
                {myprofile?.achievements.includes("never") ? <span className="badge-other-neverskip"></span> : <></>}
                {myprofile?.achievements.includes("bug") ? <span className="badge-other-bughunter" title="You find bugs of this site"></span> : <></>}
                {myprofile?.achievements.includes("OG") ? <span className="badge-other-og" title="You registed in this site"></span> : <></>}
              </div>
              {/* <button className="w-8 h-8 text-xs font-bold bg-gray-100 sm:bg-white circle-item text-white sm:text-black">+5</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default ProfileTab;