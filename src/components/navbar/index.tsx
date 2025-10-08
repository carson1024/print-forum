import IconUser from "assets/img/icons/user.svg";
import RestrictedModal from "components/modal/RestrictedModal";
import LoginModal from "components/modal/LoginModal";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import Icons from "./icons";
import { useAuth } from "../../contexts/AuthContext";
import { login } from "utils/auth";
import Logo from "assets/img/logo-single.png";
import Token from "assets/img/token.png";
import Userlogo from "assets/img/sample/userlogo.png";
import Next from "assets/img/sample/next.png";
import Ring from "assets/img/sample/Ring.png";
import Setting from "assets/img/sample/Setting.png";
import UpDeposite from "assets/img/sample/UpDeposite.png";
import DownWithdraw from "assets/img/sample/DownWithdraw.png";
import Vector from "assets/img/Vector.png";
import VectorR from "assets/img/VectorR.png";
import Frame from "assets/img/Frame.png";
import FrameR from "assets/img/FrameR.png";
import Adjust from "assets/img/Adjust.png";
import AdjustR from "assets/img/AdjustR.png";
import Ranks from "assets/img/Ranks.png";
import RanksR from "assets/img/RanksR.png";
import Telegram from "assets/img/telegram.png";
import Twitter from "assets/img/twitter.png";
import Solana from "assets/img/solana.png";
import { useSearchParams } from "react-router-dom";

const Navbar = (props: {
  currentRoute: string;
  secondary?: boolean | string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const route = useLocation();
  const navigate = useNavigate();
  const { isLogin, session } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "forum" | "alpha" | "copy" | "rankings" | ""
  >("forum");

  useEffect(() => {
    console.log(route.pathname);
    if (route.pathname == "/") {
      setActiveTab("forum");
    } else if (route.pathname == "/login") {
      setActiveTab("");
    } else if (route.pathname == "/token") {
      setActiveTab("forum");
    } else if (route.pathname == "/profile") {
      setActiveTab("forum");
    } else if (route.pathname == "/leaderboard") {
      setActiveTab("rankings");
    } else if (route.pathname == "/copytrading") {
      setActiveTab("copy");
    }
  }, [route]);

  return (
    <>
      <div className="grid grid-rows-[76px_220px_1fr_152px_64px] h-screen border-r border-gray-800">
        <div className=" border-b border-gray-800 flex items-center justify-center">
          <img src={Logo} className="w-[36px] h-[36px]" />
        </div>
        <div className=" border-gray-800  items-center justify-center ">
          <div className="text-gray-400 m-[20px]">
            {activeTab == "forum" ? (
              <button className="flex items-center w-full px-[9px] py-[6px] text-primary text-[13px] font-semibold selecthover mb-[12px]">
                <img src={VectorR} className="w-[24px] h-[24px] mr-[6px]" />
                Forum
              </button>
            ) : (
              <Link to="/">
                <button
                  className="flex items-center w-full px-[9px] py-[6px] text-[13px] font-semibold mainhover mb-[12px]"
                  onClick={() => setActiveTab("forum")}
                >
                  <img src={Vector} className="w-[24px] h-[24px] mr-[6px]" />
                  Forum
                </button>
              </Link>
            )}
            {activeTab == "alpha" ? (
              <button className="flex items-center w-full px-[9px] py-[6px] text-primary text-[13px] font-semibold selecthover mb-[12px]">
                <img src={FrameR} className="w-[24px] h-[24px] mr-[6px]" />
                Alpha
              </button>
            ) : (
              <button
                className="flex items-center w-full px-[9px] py-[6px] text-[13px] font-semibold mainhover mb-[12px]"
                onClick={() => {
                  setActiveTab("alpha");
                  setIsModalOpen(true);
                }}
              >
                <img src={Frame} className="w-[24px] h-[24px] mr-[6px]" />
                Alpha
              </button>
            )}
            {activeTab == "copy" ? (
              <button className="flex whitespace-nowrap items-center w-full px-[9px] py-[6px] text-primary text-[13px] font-semibold selecthover mb-[12px]">
                <img src={AdjustR} className="w-[24px] h-[24px] mr-[6px]" />
                Copy trading
              </button>
            ) : (
              <button
                className="flex whitespace-nowrap items-center w-full px-[9px] py-[6px] text-[13px] font-semibold mainhover mb-[12px]"
                onClick={() => {
                  if (isLogin) {
                    setActiveTab("copy");
                    navigate("/copytrading");
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                <img src={Adjust} className="w-[24px] h-[24px] mr-[6px]" />
                Copy trading
              </button>
            )}
            {activeTab == "rankings" ? (
              <button className="flex whitespace-nowrap items-center w-full px-[9px] py-[6px] text-primary text-[13px] font-semibold selecthover mb-[12px]">
                <img src={RanksR} className="w-[24px] h-[24px] mr-[6px]" />
                Rankings
              </button>
            ) : (
              <Link to="/leaderboard">
                <button
                  className="flex whitespace-nowrap items-center w-full px-[9px] py-[6px] text-[13px] font-semibold mainhover mb-[12px]"
                  onClick={() => setActiveTab("rankings")}
                >
                  <img src={Ranks} className="w-[24px] h-[24px] mr-[6px]" />
                  Rankings
                </button>
              </Link>
            )}
          </div>
        </div>
        <div className="bg-black"></div>
        <div className=" flex items-center bg-black">
          <div className="text-sm  text-[13px] font-semibold  text-gray-500 space-y-[20px] m-[20px]">
            <button>Rank system</button>
            <button>Terms of Service</button>
            <button>Privacy Policy</button>
            <button>Support</button>
          </div>
        </div>
        <div className=" flex items-center justify-center border-t border-gray-800 bg-black">
          <img src={Twitter} className="w-[18px] h-[18px] mr-[16px] " />
          <img src={Telegram} className="w-[24px] h-[24px] mr-[16px] " />
          <img src={Solana} className="w-[20px] h-[20px] " />
        </div>
      </div>
      <RestrictedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        login={login}
      />
    </>
  );
};

export default Navbar;
