import React, { useState } from "react";
import { getMultiplierType, getRankChar } from "utils/style";
import LoginCard from "../../../components/login/LoginCard";
import MyProfile from "../components/MyProfile";
import CallModal from "components/modal/CallModal";
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
    <div className="flex gap-5 h-full">
      {/* Left Side - Main Content */}
      <div className="flex-1 flex flex-col h-full">
        <SubmitCallCard />

        { children }
        
      </div>

      {/* Right Side - Panel */}
      <div className="w-[440px] flex-col gap-5 overflow-auto hidden xl:flex">
        { !isLogin ? <>
            <LoginCard
              login={login}
            />
            <ForumCard />
          </> : 
          <MyProfile
            logout={logout} />}
      </div>
    </div>
  </>
  );
}

export default ForumLayout;