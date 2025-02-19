import React, { useState } from "react";
import ForumLayout from "./layout"
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { IoMdCopy } from "react-icons/io";
import User from 'assets/img/sample/user.png';
import IconCopy from 'assets/img/icons/copy.svg';
import IconSend from 'assets/img/icons/send.svg';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import Dexscreener from 'assets/img/sample/dexscreener.png';
import Photon from 'assets/img/sample/photon.png';
import { FaExternalLinkAlt } from "react-icons/fa";
import IconUser from 'assets/img/icons/user.svg';
import { MdEdit } from "react-icons/md";
import ProfileTab from "./components/profile/ProfileTab";
import CallsTab from "./components/profile/CallsTab";
import TradeLeadingTab from "./components/profile/TradeLeadingTab";
import EditProfileModal from "components/modal/EditProfileModal";

const ProfileDetail = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All Ranks");
  const [activeTab, setActiveTab] = useState<'profile' | 'calls' | 'trade'>('profile');
  const [isEditProfileModalOpen ,setIsEditProfileModalOpen] = useState(false);
  const forumData = [
    { id: 1, name: "$PEPESI", multiplier: "10X", rank: "1", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 2, name: "$PEPESI", multiplier: "100X", rank: "2", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 3, name: "$PEPESI", multiplier: "20X", rank: "3", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 4, name: "$PEPESI", multiplier: "10X", rank: "4", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 5, name: "$PEPESI", multiplier: "100X", rank: "6", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 6, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 6, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    { id: 6, name: "$PEPESI", multiplier: "20X", rank: "10", caller: "UsernameLong", marketcap: "475.5k to 880.4k", percentage: "519%" },
    
  ];

  return <ForumLayout>
    <div className="overflow-auto md:overflow-hidden flex-grow space-y-4">
      <div className="card md:h-full p-0 flex flex-col md:overflow-hidden">
        <div className="p-4 sm:p-6 border-b-[1px] border-gray-100 flex justify-between items-center">
          <div className="flex gap-2 sm:gap-3 items-center grow">
            <button onClick={() => navigate(-1)} className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
              <FaChevronLeft />
            </button>
            <img src={User} className="w-8 h-8 circle"/>
            <span className="font-bold text-base sm:text-lg">UsernameLong</span>
            <button className="btn btn-gray flex btn-sm gap-1 items-center ml-auto md:ml-0" onClick={() => setIsEditProfileModalOpen(true)}><MdEdit /> Edit Profile</button>
          </div>
          <div className="hidden md:flex btn-group light">
            <button className={`btn btn-sm ${activeTab == 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
            <button className={`btn btn-sm ${activeTab == 'calls' ? 'active' : ''}`} onClick={() => setActiveTab('calls')}>Calls</button>
            <button className={`btn btn-sm ${activeTab == 'trade' ? 'active' : ''}`} onClick={() => setActiveTab('trade')}>Trade leading</button>
          </div>
        </div>

        <div className="hidden md:block flex-grow relative overflow-hidden">
          {
            activeTab == 'profile' ?
              <ProfileTab />
            : activeTab == 'calls' ?
              <CallsTab />
            :
              <TradeLeadingTab />
          }
        </div>
        <div className="md:hidden">
          <ProfileTab />
        </div>
      </div>
      <div className="card md:!hidden p-0">
        <div className="p-4 sm:p-6 border-b-[1px] border-gray-100 flex justify-between items-center">
          <span className="font-bold text-base sm:text-lg">Calls</span>
          <div className='btn-group primary'>
            <button className='btn btn-sm active'>Active</button>
            <button className='btn btn-sm'>Previous</button>
          </div>
        </div>
        <div>
          <CallsTab />
        </div>
      </div>
      <div className="card md:!hidden p-0">
        <div className="px-4 sm:px-6 py-6 border-b-[1px] border-gray-100 flex justify-between items-center">
          <span className="font-bold text-base sm:text-lg">Trade leading</span>
        </div>
        <div>
          <TradeLeadingTab />
        </div>
      </div>
    </div>
    <EditProfileModal isOpen={isEditProfileModalOpen} onOk={() => setIsEditProfileModalOpen(false)} onCancel={() => setIsEditProfileModalOpen(false)} />
  </ForumLayout>
}

export default ProfileDetail;