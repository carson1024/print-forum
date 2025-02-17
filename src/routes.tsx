import React from "react";

// Admin Imports
import ForumList from "views/forum/list";

// Icon Imports
import {
  MdHome,
} from "react-icons/md";
import TokenDetail from "views/forum/token";
import ProfileDetail from "views/forum/profile";
import Leaderboard from "views/leaderboard";
import CopyTrading from "views/copytrading";
import Profile from "views/user";

const routes = [
  {
    key: "forum",
    layout: "",
    path: "forum",
    component: <ForumList />,
  },
  {
    key: "login",
    layout: "",
    path: "profile",
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
    path: "profile/*",
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
];
export default routes;
