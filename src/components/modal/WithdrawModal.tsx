import { FaArrowDown } from "react-icons/fa";
import Modal from ".";
import { ImArrowDown } from "react-icons/im";
import { useAuth } from "contexts/AuthContext";
import React, { useState } from "react";
const WithdrawModal = ({
  isOpen,
  onClose,
  maxsol,
  onWithdraw,
}: Readonly<{
  isOpen: boolean;
  maxsol: number;
  onWithdraw: (amount: number, tooneaddress: string) => void;
  onClose: () => void;
}>) => {
  const { isLogin, session, user } = useAuth();
  const [address, setAddress] = useState("");
  const [toaddress, setToAddress] = useState("");
  const [warn, setWarn] = useState("");
  const [amountwarn, setAmountWarn] = useState("");
  const [warntext, setWarntext] = useState("");
  const [amount, setAmount] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode
  const validateAddress = (addr: string) => {
    // Solana addresses are usually 32-44 characters long, base58
    const regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return regex.test(addr);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setAddress(input);
    if (!input) {
      setWarn("Address cannot be empty.");
    } else if (!validateAddress(input)) {
      setWarn("Invalid wallet address format.");
    } else {
      setToAddress(input);
      setWarn(""); // No warning
    }
  };
  const handleChangeamount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value)); // Update address state on input change
    if (
      Number(e.target.value) >= Number(maxsol) ||
      Number(e.target.value) < 0.001
    ) {
      setWarntext("text-red-300");
    } else {
      setWarntext("text-grey-600");
    }
    if (0.001 <= Number(e.target.value) && Number(e.target.value) < maxsol) {
      setAmountWarn("");
    } else {
      setAmountWarn("Confirm SOL ");
    }
  };

  const handleBlur = () => {
    setIsEditing(false); // Switch off editing mode when input loses focus
  };

  const handleFocus = () => {
    setIsEditing(true); // Switch on editing mode when input is focused
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 w-[470px]">
        <div className="flex">
          <div className="text-red-300 flex items-center gap-1">
            <ImArrowDown size={12} />
            <span className="">Withdraw Funds</span>
          </div>
        </div>

        <p className="text-gray-600 text-[12px] font-Medium !leading-[135%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus,
          libero non pulvinar porttitor, neque elit volutpat eros, eget faucibus
          elit augue fringilla magna.
        </p>

        {/* Address Input */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 circle text-white flex items-center gap-2">
          <div className="text-white text-[14px] whitespace-nowrap">
            Your Address
          </div>
          <div className="flex items-center gap-2 grow">
            <div className="truncate-wrapper">
              {!isEditing ? (
                <span
                  className="text-gray-600 text-xs sm:text-sm truncate cursor-pointer"
                  onClick={handleFocus} // Switch to input when clicked
                >
                  {address || "Enter your address"}{" "}
                  {/* Show placeholder if empty */}
                </span>
              ) : (
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={handleChange}
                  onBlur={handleBlur} // Switch off editing when input loses focus
                  className="text-gray-600 text-[12px] border-none bg-transparent p-0 focus:outline-none"
                  placeholder="Enter your address"
                  style={{ width: "180%" }}
                />
              )}
            </div>
          </div>
          {warn && (
            <div className="text-red-400 text-xs mt-1 whitespace-nowrap">
              {warn}
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className=" flex bg-gray-50 px-4 sm:px-6 py-4 circle text-white flex items-center gap-2">
          <span className="text-white text-[14px] whitespace-nowrap">
            Amount (SOL)
          </span>
          <input
            id="funds"
            type="number"
            defaultValue={amount}
            className={`bg-transparent outline-none ${warntext} text-xs sm:text-base flex-grow max-w-[50%] sm:max-w-auto mx-2`}
            placeholder="0.00"
            onChange={handleChangeamount}
          />
          {amountwarn && (
            <div className="text-red-400 text-xs whitespace-nowrap">
              {amountwarn}
            </div>
          )}
          <span className="text-[#59FFCB] text-xs sm:text-sm cursor-pointer whitespace-nowrap">
            {maxsol} SOL Available
          </span>
        </div>

        {/* Withdraw Button */}
        <button
          className="w-full bg-primary circle  text-black text-[14px] font-semibold py-3"
          onClick={() => {
            if (
              warn == "" &&
              address !== "" &&
              amountwarn == "" &&
              amount >= 0.001
            ) {
              onWithdraw(amount, toaddress);
            }
          }}
        >
          Withdraw
        </button>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
