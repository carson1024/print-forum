import React, { useState } from "react";
import LoginCard from "../../../components/login/LoginCard";
import MyProfile from "../components/MyProfile";
import ForumCard from "../components/ForumCard";
import SubmitCallCard from "components/call/SubmitCallCard"; 
import { useAuth } from "contexts/AuthContext";
import { login, logout } from "utils/auth";

const ForumLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
  const { isLogin } = useAuth();

  return (<>
    <div className="grid grid-cols-[1fr_331px] h-screen bg-black text-white ">
      {/* Left Side - Main Content */}
      <div className="grid grid-rows-[76px_1fr] flex-col h-screen border-gray-800">
        <div className="border-b border-r border-gray-800 flex items-center justify-between">
          <div className="m-[18px] w-[425px] ">
            <SubmitCallCard />
          </div>
        </div>
        { children }
      </div>
      
      {/* Right Side - Panel */}
      <div className=" ">
        { !isLogin ? <div className="m-[18px]">
            <LoginCard
              login={login}
            />
            <ForumCard  />
          </div> : 
          <MyProfile
            logout={logout} />}
      </div>
    </div>
  </>
 );
}

export default ForumLayout;