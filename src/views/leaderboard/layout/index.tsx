import React, { useState } from "react";
import { getMultiplierType, getRankChar } from "utils/style";
import SubmitCallCard from "components/call/SubmitCallCard"; 
import LoginCard from "components/login/LoginCard";
import LeaderboardCard from "../components/LeaderboardCard";
import MyProfile from "views/forum/components/MyProfile";

const LeaderboardLayout = ({
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
        <SubmitCallCard />

        { children }
        
      </div>

      {/* Right Side - Panel */}
      <div className="w-[440px] flex flex-col gap-5 overflow-auto hidden xl:flex">
        { !isLogin ? <>
            <LeaderboardCard />
            <LoginCard
              login={handleLogin}
            />
          </> : 
          <MyProfile
            logout={handleLogout} />}
      </div>
    </div>
  </>
  );
}

export default LeaderboardLayout;