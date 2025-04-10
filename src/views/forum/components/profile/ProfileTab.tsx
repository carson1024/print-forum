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
              </div>:<></>
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
                <span className="badge-money-50k"></span>
                <span className="badge-register-1m"></span>
                <span className="badge-social-twitter"></span>
                <span className="badge-social-telegram"></span>
                <span className="badge-social-solana"></span>
                <span className="badge-call-10X"></span>
                <span className="badge-user-50 !hidden lg:!block"></span>
                <span className="badge-other-bughunter !hidden lg:!block"></span>
              </div>
              <button className="w-8 h-8 text-xs font-bold bg-gray-100 sm:bg-white circle-item text-white sm:text-black">+5</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default ProfileTab;