import LoginCard from "components/login/LoginCard";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMultiplierType, getRankChar } from "utils/style";
import ForumCard from "views/forum/components/ForumCard";
import MyProfile from "views/forum/components/MyProfile";
import Logo from 'assets/img/logo.png';
import LeaderboardCard from "views/leaderboard/components/LeaderboardCard";
import CopyTradingProfile from "views/copytrading/components/CopyTradingProfile";

const Profile = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  const handleLogin = () => {
    setIsLogin(true);
  }

  const handleLogout = () => {
    setIsLogin(false);
  }

  return (<>
    <div className="flex gap-5 h-full overflow-auto justify-center">
      {/* Right Side - Panel */}
      <div className="w-[360px] sm:w-[440px] flex flex-col gap-5 overflow-auto">
        { !isLogin ? <div className="my-auto space-y-5">
            <div className="text-center mb-3">
                <img src={Logo} className="m-auto h-12" />
            </div>
            {
              (tab == 'leaderboard') && <LeaderboardCard />
            }
            <LoginCard
              login={handleLogin}
            />
            {
              (tab != 'leaderboard') && <ForumCard />
            }
          </div> : <>
            {
              (tab != 'copytrading') && <MyProfile
                logout={handleLogout} />
            }
            {
              (tab == 'copytrading') && <CopyTradingProfile
                logout={handleLogout} />
            }
          </>
        }
      </div>
    </div>
  </>
  );
}

export default Profile;