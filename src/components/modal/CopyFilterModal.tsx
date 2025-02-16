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
      <h3 className="text-lg font-bold text-white">Filters</h3>
      <div className="space-y-3">
        <h4 className="text-base font-bold text-white">Time Range</h4>
        <div className="grid grid-cols-3 gap-2">
          <button className="btn btn-primary py-3">7 Days</button>
          <button className="btn btn-gray text-white py-3">30 Days</button>
          <button className="btn btn-gray text-white py-3">90 Days</button>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-base font-bold text-white">Tags</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-primary py-3">Top Performer</button>
          <button className="btn btn-gray text-white py-3">Top Performer</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-gray text-white py-3">Most Resilient</button>
          <button className="btn btn-gray text-white py-3">Whale Manager</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-gray text-white py-3">Solid Growth</button>
          <button className="btn btn-gray text-white py-3">Most Consistent</button>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-base font-bold text-white">7D ROI</h4>
        <div className="grid grid-cols-4 gap-2">
          <button className="btn btn-gray text-white py-3"><FaGreaterThanEqual className="font-bold mr-1" size={16} /> 0%</button>
          <button className="btn btn-gray text-white py-3"><FaGreaterThanEqual className="font-bold mr-1" size={16} /> 20%</button>
          <button className="btn btn-gray text-white py-3"><FaGreaterThanEqual className="font-bold mr-1" size={16} /> 50%</button>
          <button className="btn btn-gray text-white py-3"><FaGreaterThanEqual className="font-bold mr-1" size={16} /> 100%</button>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-base font-bold text-white">7D MDD</h4>
        <div className="grid grid-cols-4 gap-2">
          <button className="btn btn-gray text-white py-3"><FaLessThanEqual className="font-bold mr-1" size={16} /> 10%</button>
          <button className="btn btn-gray text-white py-3"><FaLessThanEqual className="font-bold mr-1" size={16} /> 30%</button>
          <button className="btn btn-gray text-white py-3"><FaLessThanEqual className="font-bold mr-1" size={16} /> 50%</button>
          <button className="btn btn-gray text-white py-3"><FaLessThanEqual className="font-bold mr-1" size={16} /> 70%</button>
        </div>
      </div>
    </div>
  </Modal>
}

export default CopyFilterModal;