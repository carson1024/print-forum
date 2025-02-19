import Modal from "."
import { FaGreaterThanEqual, FaLessThanEqual } from "react-icons/fa6";

const CopyFilterModal = ({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean,
  onClose: () => void
}>) => {
  return <Modal isOpen={isOpen} onClose={onClose} extraClass="w-[540px]">
    <div className="space-y-6">
      <h3 className="text-base sm:text-lg font-bold text-white">Filters</h3>
      <div className="space-y-3">
        <h4 className="text-sm sm:text-base font-bold text-white">Time Range</h4>
        <div className="grid grid-cols-3 gap-2">
          <button className="btn btn-base btn-primary py-3">7 Days</button>
          <button className="btn btn-base btn-gray text-white py-3">30 Days</button>
          <button className="btn btn-base btn-gray text-white py-3">90 Days</button>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm sm:text-base font-bold text-white">Tags</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-base btn-primary py-3">Top Performer</button>
          <button className="btn btn-base btn-gray text-white py-3">Top Performer</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-base btn-gray text-white py-3">Most Resilient</button>
          <button className="btn btn-base btn-gray text-white py-3">Whale Manager</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-base btn-gray text-white py-3">Solid Growth</button>
          <button className="btn btn-base btn-gray text-white py-3">Most Consistent</button>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm sm:text-base font-bold text-white">7D ROI</h4>
        <div className="grid grid-cols-4 gap-2">
          <button className="btn btn-base btn-gray text-white py-3"><FaGreaterThanEqual className="font-bold text-xxs sm:text-sm" /> 0%</button>
          <button className="btn btn-base btn-gray text-white py-3"><FaGreaterThanEqual className="font-bold text-xxs sm:text-sm" /> 20%</button>
          <button className="btn btn-base btn-gray text-white py-3"><FaGreaterThanEqual className="font-bold text-xxs sm:text-sm" /> 50%</button>
          <button className="btn btn-base btn-gray text-white py-3"><FaGreaterThanEqual className="font-bold text-xxs sm:text-sm" /> 100%</button>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm sm:text-base font-bold text-white">7D MDD</h4>
        <div className="grid grid-cols-4 gap-2">
          <button className="btn btn-base btn-gray text-white py-3"><FaLessThanEqual className="font-bold text-xxs sm:text-sm" /> 10%</button>
          <button className="btn btn-base btn-gray text-white py-3"><FaLessThanEqual className="font-bold text-xxs sm:text-sm" /> 30%</button>
          <button className="btn btn-base btn-gray text-white py-3"><FaLessThanEqual className="font-bold text-xxs sm:text-sm" /> 50%</button>
          <button className="btn btn-base btn-gray text-white py-3"><FaLessThanEqual className="font-bold text-xxs sm:text-sm" /> 70%</button>
        </div>
      </div>
    </div>
  </Modal>
}

export default CopyFilterModal;