import { FaArrowDown } from "react-icons/fa";
import Modal from "."
import { ImArrowUp } from "react-icons/im";
import React, { act, useEffect } from "react";
import IconCopy from 'assets/img/icons/copy.svg';
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { showToastr } from "components/toastr";
import { MdCheck } from "react-icons/md";
// import { ConnectWalletButton } from "./ConnectWalletButton";
const DepositModal = ({
    isOpen,
    onClose,
  }: Readonly<{
    isOpen: boolean,
    onClose: () => void
  }>) => {
  const { isLogin, session, user } = useAuth();
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCopied) return;
    setIsCopied(true);
    await navigator.clipboard.writeText(user?.wallet_paddress);
    showToastr("Address copied to clipboard!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  }
  const openWallet = () => {
    // <ConnectWalletButton />
  }

    return <Modal isOpen={isOpen} onClose={onClose}>
    <div className="space-y-6">
      <div className="flex">
        <div className="btn btn-sm btn-green flex items-center gap-1" onClick={openWallet}>
          <ImArrowUp size={12} />
          <span className="">Deposit funds</span>
        </div>
      </div>

      <p className="text-white text-xs sm:text-sm !leading-[135%]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus, libero non pulvinar porttitor, neque elit volutpat eros, eget faucibus elit augue fringilla magna.
      </p>

      {/* Address Input */}
      <div className="bg-gray-50 px-4 sm:px-6 py-4 rounded-full text-white flex items-center gap-2" onClick={handleCopy}>
        <div className="text-xs sm:text-base whitespace-nowrap">Your Address</div>
        <div className="flex items-center gap-2 grow">
          <div className="truncate-wrapper">
              <span className="text-gray-600 text-xs sm:text-sm truncate">{user?.wallet_paddress}</span>
                
          </div>
        </div>
        <button className="text-gray-400">{
                      !isCopied ? <img src={IconCopy} className="w-4 h-4 sm:w-6 sm:h-6 opacity-40" />
                      : <span className='text-[#06cf9c]'><MdCheck size={16} /></span>
                    } </button>
      </div>
    </div>
  </Modal>
}

export default DepositModal;