import { FaArrowDown } from "react-icons/fa";
import Modal from "."
import { ImArrowDown } from "react-icons/im";
import User from 'assets/img/sample/user.png';
import { IoCheckmark } from "react-icons/io5";
import User_modal from "assets/img/User_modal.png"

const CopyingModal = ({
    isOpen,
    onOk,
    onCancel,
  }: Readonly<{
    isOpen: boolean,
    onOk: () => void
    onCancel: () => void
  }>) => {
  return <Modal isOpen={isOpen} onClose={onCancel}>
    <div className="w-[470px]">
      <div className="flex">
        <img src={User_modal} /><span className='ml-[12px] text-[18px] font-semibold text-white'> Start Copying</span>
      </div>
      {/* User Info */}
      <div className="space-y-[16px] mt-[16px]">
        <div className="border-t border-gray-100"></div>
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[14px] font-semibold text-white mr-[4px]">UsernameLong</span>
            <span className="text-[14px] font-Medium text-gray-600">55%</span>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
              <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Followers<span className="small_border circle text-primary space-x-[5px]">12</span></span>
              <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Win rate<span className="gray_border text-white space-x-[5px]">56%</span></span>
            <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Calls<span className=" text-white space-x-[5px]">125</span></span>
            <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">Account age<span className=" text-white space-x-[5px]">2 years</span></span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className=" mt-[16px] mb-[16px] text-[12px] font-Medium text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus, libero non pulvinar porttitor, neque elit volutpat eros, eget faucibus elit augue fringilla magna.</div>

      {/* Amount Input Fields */}
      <div className="space-y-3 mb-[16px]">
        <div className="flex justify-between items-center flex-wrap gap-1">
          <label className="text-sm sm:text-base block">Total amount leader can use</label>
          <span className="text-[#59FFCB] text-sm">3 SOL available</span>
        </div>
        <div className="flex items-center bg-gray-50 circle px-6 py-2.5 ">
          <input 
            type="number" 
            placeholder="0.00" 
            className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-sm"
          />
          <span className="ml-2">SOL</span>
        </div>
      </div>
      <div className="space-y-3 mb-[16px]">
        <label className="text-sm sm:text-base block">One buy amount</label>
        <div className="flex items-center bg-gray-50 circle px-6 py-2.5">
          <input 
            type="number" 
            placeholder="0.00" 
            className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-sm"
          />
          <span className="ml-2">SOL</span>
        </div>
      </div>
      {/* Start Copying Button */}
    <button className="w-full bg-primary text-black text-[14px] font-semibold circle py-3" onClick={onOk}>Start Copying</button>
    </div>
  </Modal>
}

export default CopyingModal;