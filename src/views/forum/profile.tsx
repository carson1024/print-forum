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
  const [shouldRun, setShouldRun] = useState(true);
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
     setIsLoading(false);
    } else {
     }
   };
      scan();
      setShouldRun(false);
   const intervalId = setInterval(() => {
     scan();
    }, 20000); 

    return () => clearInterval(intervalId);
  }, [shouldRun]);
  const handleReprofile = async (xaddress: string, taddress: string, saddress: string, bio: string, preview: string) => { 
    setAvatar(preview);
    user.avatar = preview;
    profile[0].avatar = preview;
    if (profile[0].xaddress !== xaddress) {
       const { error: updatenotificationError } = await supabase
          .from("notifications")
          .insert({ user_id: profile[0].id, type: "x", title: "X Linked",value:xaddress, content:"Thanks for adding X." });
       if (updatenotificationError) {
           console.error("Update failed:", updatenotificationError);}
       const updatedProfile = [...profile];  // Create a copy of the array
       updatedProfile[0] = { ...updatedProfile[0], xaddress: xaddress };  // Update the specific element
       setProfile(updatedProfile);
    }
    if (profile[0].taddress !== taddress) {
       const { error: updatenotificationError } = await supabase
          .from("notifications")
          .insert({ user_id: profile[0].id, type: "t", title: "Telegram Linked",value:taddress, content:"Thanks for adding Telegram." });
       if (updatenotificationError) {
             console.error("Update failed:", updatenotificationError);}
       const updatedProfile = [...profile];  // Create a copy of the array
       updatedProfile[0] = { ...updatedProfile[0], taddress: taddress };  // Update the specific element
       setProfile(updatedProfile);
    }
    if (profile[0].saddress !== saddress) {
      const { error: updatenotificationError } = await supabase
      .from("notifications")
      .insert({ user_id: profile[0].id, type: "s", title: "Solana Linked",value:saddress, content:"Thanks for adding Solana." });
      if (updatenotificationError) {
          console.error("Update failed:", updatenotificationError);}
      const updatedProfile = [...profile];  // Create a copy of the array
      updatedProfile[0] = { ...updatedProfile[0], saddress: saddress };  // Update the specific element
      setProfile(updatedProfile);
    }
    setShouldRun(true);

  }
  return <ForumLayout>
    <div className="overflow-auto md:overflow-hidden flex-grow space-y-4">
      <div className="card md:h-full p-0 flex flex-col md:overflow-hidden">
        <div className="p-4 sm:p-6 border-b-[1px] border-gray-100 flex justify-between items-center">
          <div className="flex gap-2 sm:gap-3 items-center grow loading">
              <button onClick={() => navigate(-1)} className="bg-gray-100 text-gray-400 w-8 h-8 circle-item">
              <FaChevronLeft />
              </button>
              {isLoading || avatar==null?<img src={User} className="w-8 h-8 circle"/> : <img src={avatar} className="w-8 h-8 circle"/> }
              {
              isLoading || ! profile.length ? <div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div> : <>
                <span className="font-bold text-base sm:text-lg">{profile[0].name}</span>
                {
                  isLogin && session.user.id == profile[0].id ? <button className="btn btn-gray flex btn-sm gap-1 items-center ml-auto md:ml-0" onClick={() => setIsEditProfileModalOpen(true)}><MdEdit /> Edit Profile</button>
                    : <></>
                }
              </>}          
          </div>
             <div className="hidden md:flex btn-group light">
               <button className={`btn btn-sm ${activeTab == 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
               <button className={`btn btn-sm ${activeTab == 'calls' ? 'active' : ''}`} onClick={() => setActiveTab('calls')}>Calls</button>
               <button className={`btn btn-sm ${activeTab == 'trade' ? 'active' : ''}`} onClick={() => setActiveTab('trade')}>Trade leading</button>
             </div>
        </div>
        <div className="flex flex-col gap-5 flex-grow hidden md:block flex-grow relative ">
          {
            isLoading || !profile.length ? <div className="p-4 sm:p-6 overflow-hidden loading"><SkeletonList /></div>:<>
              {
                activeTab == 'profile' ?
                  <ProfileTab myprofile={profile[0]} />
                  : activeTab == 'calls' ?
                    <CallsTab myprofile={profile[0]} />
                    :
                    <TradeLeadingTab />
              }</> }
        </div>
        <div className="md:hidden loading">
          {
            isLoading || !profile.length ? <><SkeletonList /></> : <>
              <ProfileTab myprofile={profile[0]} />
            </>}
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
        <div className="loading">
          {
            isLoading || ! profile.length ? <><SkeletonList /></> : <>
              <CallsTab myprofile={profile[0]} />
            </>}
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
    </ForumLayout>
    }

export default ProfileDetail;