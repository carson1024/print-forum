import React, { useState } from "react";
import { getMultiplierType, getRankChar } from "utils/style";
import LoginCard from "../../../components/login/LoginCard";
import MyProfile from "../components/MyProfile";
import CallModal from "components/modal/CallModal";
import ForumCard from "../components/ForumCard";
import SubmitCallCard from "components/call/SubmitCallCard"; 

const ForumLayout = ({
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
      <div className="w-[440px] flex flex-col gap-5 overflow-auto">
        { !isLogin ? <>
            <LoginCard
              login={handleLogin}
            />
            <ForumCard />
          </> : 
          <MyProfile
            logout={handleLogout} />}
      </div>
    </div>
  </>
  );
}

export default ForumLayout;