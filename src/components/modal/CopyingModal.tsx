import { FaArrowDown } from "react-icons/fa";
import Modal from "."
import { ImArrowDown } from "react-icons/im";
import User from 'assets/img/sample/user.png';
import { IoCheckmark } from "react-icons/io5";

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
    <div className="space-y-6">
      <div className="flex">
        <div className='rounded-full bg-primary/20 text-primary px-4 py-1.5 font-semibold flex items-center justify-center'><IoCheckmark className='mr-1 font-bold' size={20} /> Start Copying</div>
      </div>
      {/* User Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <img src={User} className="w-8 h-8 rounded-full" alt={'Avatar'} />
          <div>
            <h2 className="font-bold">UsernameLong</h2>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
            <span className="text-xs text-gray-600">Followers</span>
            <span className="text-xs text-primary">12</span>
          </div>
          <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
            <span className="text-xs text-gray-600">Win rate</span>
            <span className="text-xs text-green-600">56%</span>
          </div>
          <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
            <span className="text-xs text-gray-600">Calls</span>
            <span className="text-xs text-white">125</span>
          </div>
          <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
            <span className="text-xs text-gray-600">Account age</span>
            <span className="text-xs text-white">2 years</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Amount Input Fields */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block">Total amount leader can use</label>
          <span className="text-primary text-sm">3 SOL available</span>
        </div>
        <div className="flex items-center bg-gray-50 rounded-full px-6 py-2.5">
          <input 
            type="number" 
            placeholder="0.00" 
            className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-sm"
          />
          <span className="ml-2">SOL</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block">One buy amount</label>
        <div className="flex items-center bg-gray-50 rounded-full px-6 py-2.5">
          <input 
            type="number" 
            placeholder="0.00" 
            className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-sm"
          />
          <span className="ml-2">SOL</span>
        </div>
      </div>

      {/* Start Copying Button */}
    <button className="w-full btn py-3" onClick={onOk}>Start Copying</button>
    </div>
  </Modal>
}

export default CopyingModal;