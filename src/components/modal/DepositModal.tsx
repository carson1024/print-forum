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

      <p className="text-white text-sm leading-snug">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus, libero non pulvinar porttitor, neque elit volutpat eros, eget faucibus elit augue fringilla magna.
      </p>

      {/* Address Input */}
      <div className="bg-gray-50 px-6 py-4 rounded-full text-white flex justify-between">
        <div className="flex items-center gap-2">
          <span className="">Your Address</span>
          <span className="text-gray-600 text-sm">7RHms4GTZXsB8CiVbEuu9SAJRzPYrJLhLMAb</span>
        </div>
        <button className="text-gray-400"><img src={IconCopy} className="w-6 h-6 opacity-40" /></button>
      </div>
    </div>
  </Modal>
}

export default DepositModal;