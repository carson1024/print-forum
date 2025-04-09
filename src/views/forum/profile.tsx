import React, { useState } from "react";
import ForumLayout from "./layout"
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa";
import User from 'assets/img/sample/user.png';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import ProfileTab from "./components/profile/ProfileTab";
import CallsTab from "./components/profile/CallsTab";
import TradeLeadingTab from "./components/profile/TradeLeadingTab";
import EditProfileModal from "components/modal/EditProfileModal";
import { act, useEffect } from "react";
import { supabase } from "lib/supabase";
import { SkeletonList, SkeletonRow } from "../../../src/components/skeleton/forum";
import { useAuth } from "contexts/AuthContext";
  
const ProfileDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'calls' | 'trade'>('profile');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mainid, setMainid] = useState('');
  const { isLogin, session,user } = useAuth();
  const [avatar, setAvatar] = useState("");
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

  useEffect(() => {
     setIsLoading(true);
   const params = new URLSearchParams(window.location.search);
   const id = params.get("id");
    setMainid(id);
   const scan = async () => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .match({ "id": id });
    if (error) {
        console.error("Fetch failed:", error);
        return; // Stop execution if there's an error
        }
    if (data.length > 0) {
      setProfile(data)
      setAvatar(data[0].avatar)
    } else {
    }};
    scan(); 
   setIsLoading(false);
  }, []);
  const handleReprofile = async (xaddress: string, taddress: string, saddress: string, bio: string, preview: string) => { 
    setAvatar(preview);
    if (profile[0].avatar !== preview) {
    const { error: updatenotificationError } = await supabase
    .from("notifications")
    .insert({ user_id: profile[0].id, type: "avatar", title: "Avatar Changed",value:"changed", content:"Your avatar image is changed." });
      if (updatenotificationError) {
        console.error("Update failed:", updatenotificationError);}
      profile[0].avatar = preview;
      user.avatar = preview;
    }
    if (profile[0].xaddress !== xaddress) {
         const { error: updatenotificationError } = await supabase
          .from("notifications")
          .insert({ user_id: profile[0].id, type: "x", title: "X Linked",value:xaddress, content:"Your X-link address is changed." });
           if (updatenotificationError) {
             console.error("Update failed:", updatenotificationError);}
         profile[0].xaddress = xaddress;
    }
    if (profile[0].taddress !== taddress) {
         const { error: updatenotificationError } = await supabase
          .from("notifications")
          .insert({ user_id: profile[0].id, type: "t", title: "Telegram Linked",value:taddress, content:"Your Telegram address is changed." });
           if (updatenotificationError) {
             console.error("Update failed:", updatenotificationError);}
         profile[0].taddress = taddress;
    }
    if (profile[0].saddress !== saddress) {
      const { error: updatenotificationError } = await supabase
      .from("notifications")
      .insert({ user_id: profile[0].id, type: "s", title: "Solana Linked",value:saddress, content:"Your Solana address is changed." });
        if (updatenotificationError) {
          console.error("Update failed:", updatenotificationError);}
      profile[0].saddress = saddress;
    }
  if (profile[0].bio !== bio) {
    const { error: updatenotificationError } = await supabase
    .from("notifications")
    .insert({ user_id: profile[0].id, type: "bio", title: "BIO Changed",value:"changed", content:"Your BIO description is changed." });
      if (updatenotificationError) {
        console.error("Update failed:", updatenotificationError);}
    profile[0].bio = bio;
  }

  }
  return <ForumLayout>
    {isLoading ? <SkeletonList /> :
              !profile.length ? <>
                <SkeletonRow opacity={60} />
                <SkeletonRow opacity={30} />
              </> :<>
                <div className="overflow-auto md:overflow-hidden flex-grow space-y-4">
         <div className="card md:h-full p-0 flex flex-col md:overflow-hidden">
        <div className="p-4 sm:p-6 border-b-[1px] border-gray-100 flex justify-between items-center">
             <div className="flex gap-2 sm:gap-3 items-center grow">
              <button onClick={() => navigate(-1)} className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
              <FaChevronLeft />
              </button>
              {avatar !==null?<img src={avatar} className="w-8 h-8 circle"/>:<img src={User} className="w-8 h-8 circle"/> }
                  <span className="font-bold text-base sm:text-lg">{profile[0].name}</span>
                  { 
                    isLogin && session.user.id == profile[0].id ? <button className="btn btn-gray flex btn-sm gap-1 items-center ml-auto md:ml-0" onClick={() => setIsEditProfileModalOpen(true)}><MdEdit /> Edit Profile</button>
                   :<></>
              }
            
          </div>
         <div className="hidden md:flex btn-group light">
            <button className={`btn btn-sm ${activeTab == 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
            <button className={`btn btn-sm ${activeTab == 'calls' ? 'active' : ''}`} onClick={() => setActiveTab('calls')}>Calls</button>
            <button className={`btn btn-sm hidden ${activeTab == 'trade' ? 'active' : ''}`} onClick={() => setActiveTab('trade')}>Trade leading</button>
         </div>
        </div>
        <div className="hidden md:block flex-grow relative overflow-hidden">
          {
            activeTab == 'profile' ?
              <ProfileTab myprofile={profile[0]} />
            : activeTab == 'calls' ?
              <CallsTab myprofile={profile[0]}/>
            :
              <TradeLeadingTab />
          }
        </div>
        <div className="md:hidden">
          <ProfileTab myprofile={profile[0]} />
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
          <CallsTab myprofile={profile[0]} />
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
          <EditProfileModal isOpen={isEditProfileModalOpen} onChange={(xaddress,taddress,saddress,bio,preview)=>handleReprofile(xaddress,taddress,saddress,bio,preview)} onOk={() => setIsEditProfileModalOpen(false)} onCancel={() => setIsEditProfileModalOpen(false)} />
       </>
     }
    </ForumLayout>
    }

export default ProfileDetail;