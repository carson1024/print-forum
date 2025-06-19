import LoginCard from "components/login/LoginCard";
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMultiplierType, getRankChar } from "utils/style";
import ForumCard from "views/forum/components/ForumCard";
import MyProfile from "views/forum/components/MyProfile";
import Logo from 'assets/img/logo.png';
import LeaderboardCard from "views/leaderboard/components/LeaderboardCard";
import CopyTradingProfile from "views/copytrading/components/CopyTradingProfile";
import { useAuth } from "contexts/AuthContext";
import { supabase } from "lib/supabase";
import { login, logout } from "utils/auth";

const Profile = () => {
  const { isLogin } = useAuth();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  return (<>
    <div className="flex gap-5 h-full overflow-auto justify-center">
      {/* Right Side - Panel */}
      <div className="w-[360px] sm:w-[440px] flex flex-col gap-5 overflow-auto">
        {!isLogin ? <div className="my-auto space-y-5">
          <div className="text-center mb-3">
            <img src={Logo} className="m-auto h-12" />
          </div>
          {
            (tab == 'leaderboard') && <LeaderboardCard />
          }
          <LoginCard
            login={login}
          />
          {
            (tab != 'leaderboard') && <ForumCard />
          }
        </div> : <>
          {
            (tab != 'copytrading') && <MyProfile
              logout={logout} />
          }
          {
            (tab == 'copytrading') && <CopyTradingProfile
              logout={logout} />
          }
        </>
        }
      </div>
    </div>
  </>
  );
}

export default Profile;