import React, { useState } from "react";
import { getMultiplierType, getRankChar } from "utils/style";
import SubmitCallCard from "components/call/SubmitCallCard"; 
import LoginCard from "components/login/LoginCard";
import MyProfile from "views/forum/components/MyProfile";
import ForumCard from "views/forum/components/ForumCard";
import CopyTradingProfile from "../components/CopyTradingProfile";
import { useAuth } from "contexts/AuthContext";
import { login, logout } from "utils/auth";

const CopyTradingLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
  const { isLogin } = useAuth();

  return (<>
    <div className="flex gap-5 h-full">
      {/* Left Side - Main Content */}
      <div className="flex-1 flex flex-col h-full">
        { children }
      </div>

      {/* Right Side - Panel */}
      <div className="w-[440px] flex flex-col gap-5 overflow-auto hidden xl:flex">
        { !isLogin ? <>
            <LoginCard
              login={login}
            />
            <ForumCard />
          </> : 
          <CopyTradingProfile
            logout={logout} />}
      </div>
    </div>
  </>
  );
}

export default CopyTradingLayout;