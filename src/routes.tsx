import React from "react";

// Admin Imports
import ForumList from "views/forum/list";

// Icon Imports
import TokenDetail from "views/forum/token";
import ProfileDetail from "views/forum/profile";
import Leaderboard from "views/leaderboard";
import CopyTrading from "views/copytrading";
import Profile from "views/user";
import MyProfile from "views/forum/components/MyProfile";
import { logout } from "utils/auth";

const routes = [
  {
    key: "forum",
    layout: "",
    path: "/",
    component: <ForumList />,
  },
  {
    key: "login",
    layout: "",
    path: "profile/*",
    component: <Profile />,
  },
  {
    key: "token",
    layout: "",
    path: "token/*",
    component: <TokenDetail />,
  },
  {
    key: "profile",
    layout: "",
    path: "profile",
    component: <ProfileDetail />,
  },
  {
    key: "leaderboard",
    layout: "",
    path: "leaderboard",
    component: <Leaderboard />,
  },
  {
    key: "copytrading",
    layout: "",
    path: "copytrading",
    component: <CopyTrading />,
  },
  {
    key: "account",
    layout: "",
    path: "account",
    component: <MyProfile logout={logout} />,
  },
];
export default routes;
