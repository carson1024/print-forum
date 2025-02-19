import { FaArrowDown } from "react-icons/fa";
import Modal from "."
import { ImArrowUp } from "react-icons/im";
import IconCopy from 'assets/img/icons/copy.svg';

const DepositModal = ({
    isOpen,
    onClose,
  }: Readonly<{
    isOpen: boolean,
    onClose: () => void
  }>) => {
    return <Modal isOpen={isOpen} onClose={onClose}>
    <div className="space-y-6">
      <div className="flex">
        <div className="btn btn-sm btn-green flex items-center gap-1">
          <ImArrowUp size={12} />
          <span className="">Deposit funds</span>
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
        <button className="text-gray-400"><img src={IconCopy} className="w-4 h-4 sm:w-6 sm:h-6 opacity-40" /></button>
      </div>
    </div>
  </Modal>
}

export default DepositModal;