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

      <p className="text-white text-xs sm:text-sm !leading-[135%]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus, libero non pulvinar porttitor, neque elit volutpat eros, eget faucibus elit augue fringilla magna.
      </p>

      {/* Address Input */}
      <div className="bg-gray-50 px-4 sm:px-6 py-4 rounded-full text-white flex items-center gap-2">
        <div className="text-xs sm:text-base">Your Address</div>
        <div className="flex items-center gap-2 grow">
          <div className="truncate-wrapper">
            <span className="text-gray-600 text-xs sm:text-sm truncate">7RHms4GTZXsB8CiVbEuu9SAJRzPYrJLhLMAb</span>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="bg-gray-50 px-4 sm:px-6 py-4 rounded-full text-white flex items-center gap-2">
        <span className="text-xs sm:text-base">Amount (SOL)</span>
        <input 
          type="number" 
          className="bg-transparent outline-none text-gray-600 text-xs sm:text-base flex-grow max-w-[50%] sm:max-w-auto mx-2"
          placeholder="0.00"
        />
        <span className="text-green-600 text-xs sm:text-sm cursor-pointer">3 SOL Available</span>
      </div>

      {/* Withdraw Button */}
      <button className="w-full btn text-sm sm:text-base py-3" onClick={onClose}>Withdraw</button>
    </div>
  </Modal>
}

export default WithdrawModal;