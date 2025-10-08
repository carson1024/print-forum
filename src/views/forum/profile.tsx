import React, { useState } from "react";
import ForumLayout from "./layout";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import ProfileTab from "./components/profile/ProfileTab";
import TradeLeadingTab from "./components/profile/TradeLeadingTab";
import EditProfileModal from "components/modal/EditProfileModal";
import { act, useEffect } from "react";
import { supabase } from "lib/supabase";
import {
  SkeletonList,
  SkeletonRow,
} from "../../../src/components/skeleton/forum";
import { useAuth } from "contexts/AuthContext";
import Prev from "assets/img/prev.png";
import Userlogo from "assets/img/sample/userlogo.png";
import Adjust from "assets/img/Adjust.png";
import AdjustR from "assets/img/AdjustR.png";
import User_face from "assets/img/user_face.png";
import User_face_R from "assets/img/user_faceR.png";

const ProfileDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "calls" | "trade">(
    "profile"
  );
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mainid, setMainid] = useState("");
  const { isLogin, session, user } = useAuth();
  const [avatar, setAvatar] = useState("");
  const [shouldRun, setShouldRun] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const tag = params.get("tag");
    if (tag == "1") {
      setActiveTab("profile");
    } else if (tag == "2") {
      setActiveTab("trade");
    }
    setMainid(id);
    const scan = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .match({ id: id });
      if (error) {
        console.error("Fetch failed:", error);
        return; // Stop execution if there's an error
      }
      if (data.length > 0) {
        setProfile(data);
        setAvatar(data[0].avatar_url);
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
  const handleReprofile = async (
    xaddress: string,
    taddress: string,
    saddress: string,
    bio: string,
    preview: string
  ) => {
    setAvatar(preview);
    if (user) user.avatar_url = preview;
    if (profile[0]) profile[0].avatar_url = preview;
    if (profile[0].xaddress !== xaddress) {
      const { error: updatenotificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: profile[0].id,
          type: "x",
          title: "X Linked",
          value: xaddress,
          content: "Thanks for adding X.",
        });
      if (updatenotificationError) {
        console.error("Update failed:", updatenotificationError);
      }
      const updatedProfile = [...profile]; // Create a copy of the array
      updatedProfile[0] = { ...updatedProfile[0], xaddress: xaddress }; // Update the specific element
      setProfile(updatedProfile);
    }
    if (profile[0].taddress !== taddress) {
      const { error: updatenotificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: profile[0].id,
          type: "t",
          title: "Telegram Linked",
          value: taddress,
          content: "Thanks for adding Telegram.",
        });
      if (updatenotificationError) {
        console.error("Update failed:", updatenotificationError);
      }
      const updatedProfile = [...profile]; // Create a copy of the array
      updatedProfile[0] = { ...updatedProfile[0], taddress: taddress }; // Update the specific element
      setProfile(updatedProfile);
    }
    if (profile[0].saddress !== saddress) {
      const { error: updatenotificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: profile[0].id,
          type: "s",
          title: "Solana Linked",
          value: saddress,
          content: "Thanks for adding Solana.",
        });
      if (updatenotificationError) {
        console.error("Update failed:", updatenotificationError);
      }
      const updatedProfile = [...profile]; // Create a copy of the array
      updatedProfile[0] = { ...updatedProfile[0], saddress: saddress }; // Update the specific element
      setProfile(updatedProfile);
    }
    setShouldRun(true);
  };
  return (
    <ForumLayout>
      <div className="border-r border-gray-800 grow loading">
        <div className="grid grid-rows-[76px_1fr] flex-col h-screen border-gray-800">
          <div className="flex border-b border-gray-800 flex items-center px-[18px]">
            <button onClick={() => navigate(-1)}>
              <img src={Prev} className="w-[24px] h-[24px] mr-[12px]" />
            </button>
            {isLoading || avatar == null ? (
              <a>
                <img src={Userlogo} className="w-[32px] h-[32px] mr-[8px]" />
              </a>
            ) : (
              <a>
                <img
                  src={avatar}
                  className="w-[32px] h-[32px] mr-[8px] circle"
                />
              </a>
            )}
            {isLoading || !profile.length ? (
              <div className="skeleton w-64 h-4 sm:w-60 sm:h-6 rounded "></div>
            ) : (
              <>
                <span className="font-bold text-base text-[14px]">
                  {profile[0].display_name || profile[0].username}
                </span>
                {isLogin && user && user.id === mainid && (
                  <div className="flex items-center">
                    <button
                      className="ml-[12px] pause_btn !px-3 !py-2 !h-auto text-xs rounded-md flex items-center gap-1.5"
                      onClick={() => setIsEditProfileModalOpen(true)}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                )}
              </>
            )}

            <div className=" flex text-[14px] font-semibold text-gray-500 ml-auto">
              {activeTab == "profile" ? (
                <button
                  className="ml-[20px] repause_btn flex items-center justify-center mainhover flex"
                  onClick={() => setActiveTab("profile")}
                >
                  <img src={User_face_R} className="" />
                  <span className="text-primary">Profile</span>
                </button>
              ) : (
                <button
                  className="ml-[20px] pause_btn flex items-center justify-center mainhover flex"
                  onClick={() => setActiveTab("profile")}
                >
                  <img src={User_face} className="" />
                  <span>Profile</span>
                </button>
              )}
              {activeTab == "trade" ? (
                <button
                  className="ml-[20px] repause_btn flex items-center justify-center mainhover flex"
                  onClick={() => setActiveTab("trade")}
                >
                  <img src={AdjustR} className="" />
                  <span className="text-primary">Trading leading</span>
                </button>
              ) : (
                <button
                  className="ml-[20px] pause_btn flex items-center justify-center mainhover flex"
                  onClick={() => setActiveTab("trade")}
                >
                  <img src={Adjust} className="" />
                  <span>Trading leading</span>
                </button>
              )}
            </div>
          </div>
          {isLoading || !profile.length ? (
            <div
              className={`flex-1 overflow-auto flex flex-col ${isLoading ? "overflow-hidden loading" : "overflow-auto"}`}
            >
              <div
                className="grid h-screen"
                style={{ gridTemplateColumns: "calc((100vw - 501px) / 2) 1fr" }}
              >
                <div className="border-r border-gray-800 flex flex-col h-screen">
                  <div className="grid grid-rows-[50px_1fr] border-gray-800 ">
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
          ) : (
            <>
              {activeTab == "profile" ? (
                <ProfileTab myprofile={profile[0]} />
              ) : (
                <TradeLeadingTab myprofile={profile[0]} />
              )}
            </>
          )}
        </div>
      </div>
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onChange={(xaddress, taddress, saddress, bio, preview) =>
          handleReprofile(xaddress, taddress, saddress, bio, preview)
        }
        onOk={() => setIsEditProfileModalOpen(false)}
        onCancel={() => setIsEditProfileModalOpen(false)}
      />
    </ForumLayout>
  );
};

export default ProfileDetail;
