import React, { useState } from "react";
import ForumLayout from "./layout"
import { Link, useNavigate, useNavigation } from "react-router-dom";
import ProfileTab from "./components/profile/ProfileTab";
import TradeLeadingTab from "./components/profile/TradeLeadingTab";
import EditProfileModal from "components/modal/EditProfileModal";
import { act, useEffect } from "react";
import { supabase } from "lib/supabase";
import { SkeletonList, SkeletonRow } from "../../../src/components/skeleton/forum";
import { useAuth } from "contexts/AuthContext";
import Prev from 'assets/img/prev.png';
import Userlogo from 'assets/img/sample/userlogo.png';
import Adjust from 'assets/img/Adjust.png';
import AdjustR from 'assets/img/AdjustR.png';
import User_face from 'assets/img/user_face.png';
import User_face_R from 'assets/img/user_faceR.png';

const ProfileDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'calls' | 'trade'>('profile');
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mainid, setMainid] = useState('');
  const { isLogin, session, user } = useAuth();
  const [avatar, setAvatar] = useState("");
  const [shouldRun, setShouldRun] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const tag = params.get("tag");
    if (tag == "1") { setActiveTab('profile') }
    else if (tag == "2") { setActiveTab('trade') }
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
        .insert({ user_id: profile[0].id, type: "x", title: "X Linked", value: xaddress, content: "Thanks for adding X." });
      if (updatenotificationError) {
        console.error("Update failed:", updatenotificationError);
      }
      const updatedProfile = [...profile];  // Create a copy of the array
      updatedProfile[0] = { ...updatedProfile[0], xaddress: xaddress };  // Update the specific element
      setProfile(updatedProfile);
    }
    if (profile[0].taddress !== taddress) {
      const { error: updatenotificationError } = await supabase
        .from("notifications")
        .insert({ user_id: profile[0].id, type: "t", title: "Telegram Linked", value: taddress, content: "Thanks for adding Telegram." });
      if (updatenotificationError) {
        console.error("Update failed:", updatenotificationError);
      }
      const updatedProfile = [...profile];  // Create a copy of the array
      updatedProfile[0] = { ...updatedProfile[0], taddress: taddress };  // Update the specific element
      setProfile(updatedProfile);
    }
    if (profile[0].saddress !== saddress) {
      const { error: updatenotificationError } = await supabase
        .from("notifications")
        .insert({ user_id: profile[0].id, type: "s", title: "Solana Linked", value: saddress, content: "Thanks for adding Solana." });
      if (updatenotificationError) {
        console.error("Update failed:", updatenotificationError);
      }
      const updatedProfile = [...profile];  // Create a copy of the array
      updatedProfile[0] = { ...updatedProfile[0], saddress: saddress };  // Update the specific element
      setProfile(updatedProfile);
    }
    setShouldRun(true);

  }
  return <ForumLayout>
    <div className="border-r border-gray-800 grow loading">
      <div className="md:grid grid-rows-[76px_1fr] flex-col h-screen border-gray-800">
        <div className="flex border-b py-2.5 border-gray-800 justify-between flex items-center px-[18px]">
          <div className="flex items-center">
          <button onClick={() => navigate(-1)} ><img src={Prev} className="w-[24px] h-[24px] mr-[12px]" /></button>
          {
            isLoading || avatar == null ? <a><img src={Userlogo} className="w-[32px] h-[32px] mr-[8px]" /></a> :
              <a><img src={avatar} className="w-[32px] h-[32px] mr-[8px] circle" /></a>
          }
          {
            isLoading || !profile.length ? <div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div> : <><span className="font-bold text-base text-[12px] lg:text-[14px]">{profile[0].name}</span></>
          }
</div>
          <div className=" hidden lg:flex text-[14px] font-semibold text-gray-500 ml-auto">
            {
              activeTab == 'profile' ? <button className="ml-[20px] repause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('profile')}>
                <img src={User_face_R} className="" />
                <span className="text-primary">Profile</span>
              </button> :
                <button className="ml-[20px] pause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('profile')}>
                  <img src={User_face} className="" />
                  <span >Profile</span>
                </button>
            }
            {
              activeTab == 'trade' ? <button className="ml-[20px] repause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('trade')}>
                <img src={AdjustR} className="" />
                <span className="text-primary">Trading leading</span>
              </button> :
                <button className="ml-[20px] pause_btn flex items-center justify-center mainhover flex" onClick={() => setActiveTab('trade')}>
                  <img src={Adjust} className="" />
                  <span>Trading leading</span>
                </button>
            }
          </div>

          <div className="relative lg:hidden max-w-max ">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full gap-1.5 text-white text-[10px] font-semibold px-3 py-2 rounded-[6px] border border-[#28272B] flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                {activeTab === 'profile' && <img src={User_face} className="w-[14px] h-[13px]" alt="Profile" />}
                {activeTab === 'trade' && <img src={Adjust} className="w-[14px] h-[13px]" alt="Trading" />}
                <span>
                  {activeTab === 'profile' && 'Profile'}
                  {activeTab === 'trade' && 'Trading leading'}
                </span>
              </div>
              <img src="/assets/arrrow.svg" alt="Dropdown" />
            </button>

            {showDropdown && (
              <div className="absolute z-50 mt-2 w-full bg-[#1a1a1a] border border-gray-700 rounded-[6px] shadow-lg">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-800 text-[10px]"
                >
                  <img src={User_face} className="w-4 h-4 mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActiveTab('trade');
                    setShowDropdown(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-white hover:bg-gray-800 text-[10px]"
                >
                  <img src={Adjust} className="w-4 h-4 mr-2" />
                  Trading leading
                </button>
              </div>
            )}
          </div>
        </div>
        {
          isLoading || !profile.length ?
            <div className={`flex-1 overflow-auto flex flex-col ${isLoading ? "overflow-hidden loading" : "overflow-auto"}`}>
              <div className="grid h-screen" style={{ gridTemplateColumns: 'calc((100vw - 501px) / 2) 1fr' }}>
                <div className="border-r border-gray-800 flex flex-col h-screen">
                  <div className="grid grid-rows-[50px_1fr] border-gray-800 ">
                    <div className="border-b items-center flex">
                      <div className="skeleton w-1 h-4 sm:w-[300px] sm:h-[20px] ml-[18px] rounded"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto h-[calc(100vh-202px)]">
                      <div className='m-[18px]'>
                        <SkeletonList />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-gray-800 h-screen flex flex-col">
                  <div className="grid grid-rows-[50px_1fr] border-gray-800">
                    <div className="border-b items-center flex">
                      <div className="skeleton w-1 h-4 sm:w-[300px] sm:h-[20px] ml-[18px] rounded"></div>
                    </div>
                    <div className="flex-1 overflow-y-auto h-[calc(100vh-202px)]">
                      <div className="m-[18px]">
                        <SkeletonList />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            : <>
              {
                activeTab == 'profile' ?
                  <ProfileTab myprofile={profile[0]} />
                  :
                  <TradeLeadingTab myprofile={profile[0]} />
              }</>}
      </div>
    </div>
    <EditProfileModal isOpen={isEditProfileModalOpen} onChange={(xaddress, taddress, saddress, bio, preview) => handleReprofile(xaddress, taddress, saddress, bio, preview)} onOk={() => setIsEditProfileModalOpen(false)} onCancel={() => setIsEditProfileModalOpen(false)} />
  </ForumLayout>
}

export default ProfileDetail;