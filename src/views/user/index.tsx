import LoginCard from "components/login/LoginCard";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMultiplierType, getRankChar } from "utils/style";
import ForumCard from "views/forum/components/ForumCard";
import MyProfile from "views/forum/components/MyProfile";
import Logo from 'assets/img/logo.png';

const Profile = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [searchParams] = useSearchParams();
  const param1 = searchParams.get('param1');

  const handleLogin = () => {
    setIsLogin(true);
  }

  const handleLogout = () => {
    setIsLogin(false);
  }

  return (<>
    <div className="flex gap-5 h-full overflow-auto">
      {/* Right Side - Panel */}
      <div className="w-[360px] sm:w-[440px] flex flex-col gap-5 overflow-auto justify-center">
        { !isLogin ? <>
            <div className="text-center mb-3">
                <img src={Logo} className="m-auto h-12" />
            </div>
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

export default Profile;