import { FaArrowDown } from "react-icons/fa";
import Modal from "."
import { ImArrowDown } from "react-icons/im";

const WithdrawModal = ({
    isOpen,
    onClose,
  }: Readonly<{
    isOpen: boolean,
    onClose: () => void
  }>) => {
  return <Modal isOpen={isOpen} onClose={onClose}>
    <div className="space-y-6">
      <div className="flex">
        <div className="btn btn-sm btn-red flex items-center gap-1">
          <ImArrowDown size={12} />
          <span className="">Withdraw funds</span>
        </div>
      </div>

      <p className="text-white text-sm leading-snug">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus, libero non pulvinar porttitor, neque elit volutpat eros, eget faucibus elit augue fringilla magna.
      </p>

      {/* Address Input */}
      <div className="bg-gray-50 px-6 py-4 rounded-full text-white flex items-center gap-2">
        <span className="">Your Address</span>
        <span className="text-gray-600 text-sm">7RHms4GTZXsB8CiVbEuu9SAJRzPYrJLhLMAb</span>
      </div>

      {/* Amount Input */}
      <div className="bg-gray-50 px-6 py-4 rounded-full text-white flex items-center gap-2">
        <span className="">Amount (SOL)</span>
        <input 
          type="number" 
          className="bg-transparent outline-none text-gray-600 flex-grow mx-2"
          placeholder="0.00"
        />
        <span className="text-green-600 text-sm cursor-pointer">3 SOL Available</span>
      </div>

      {/* Withdraw Button */}
      <button className="w-full btn py-3" onClick={onClose}>Withdraw</button>
    </div>
  </Modal>
}

export default WithdrawModal;