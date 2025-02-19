import React, { useState } from "react";
import { getMultiplierType, getRankChar } from "utils/style";
import SubmitCallCard from "components/call/SubmitCallCard"; 
import LoginCard from "components/login/LoginCard";
import MyProfile from "views/forum/components/MyProfile";
import ForumCard from "views/forum/components/ForumCard";
import CopyTradingProfile from "../components/CopyTradingProfile";

const CopyTradingLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
  const [isLogin, setIsLogin] = useState(false);

  const handleLogin = () => {
    setIsLogin(true);
  }

  const handleLogout = () => {
    setIsLogin(false);
  }

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
              login={handleLogin}
            />
            <ForumCard />
          </> : 
          <CopyTradingProfile
            logout={handleLogout} />}
      </div>
    </div>
  </>
  );
}

export default CopyTradingLayout;