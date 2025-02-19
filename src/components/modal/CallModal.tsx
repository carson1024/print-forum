import { MdEmail } from "react-icons/md";
import Modal from "."
import { FaXTwitter } from "react-icons/fa6";
import Token from 'assets/img/sample/token.png';
import Dexscreener from 'assets/img/sample/dexscreener.png';
import Photon from 'assets/img/sample/photon.png';
import { FaExternalLinkAlt } from "react-icons/fa";

const CallModal = ({
    isOpen,
    onClose,
  }: Readonly<{
    isOpen: boolean,
    onClose: () => void
  }>) => {
    return <Modal isOpen={isOpen} onClose={onClose} hideCloseButton={true}>
      <div className="space-y-6">
        {/* Token Info */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex gap-2 items-center">
            <img src={Token} className="w-[50px] h-[50px] sm:w-16 sm:h-16 rounded-full" />
            <div>
              <h2 className="text-base sm:text-lg font-bold mb-1">$PEPESI</h2>
              <p className="text-sm sm:text-base text-gray-600">New call</p>
            </div>
          </div>
          <div>
            <div className="flex flex-col bg-gray-50 px-5 py-3 sm:px-6 sm:py-4 rounded-full text-xs sm:text-base gap-1">
              Marketcap <span className="text-white">475.5k</span>
            </div>
          </div>
        </div>

        {/* Contract Address */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 rounded-full text-xs text-gray-600 flex items-center gap-2">
          <span className="font-semibold text-white text-base">CA</span> 
          <div className="truncate-wrapper">
            <span className="truncate">7RHms4GTZXsB8CiVbEuu9SAJRzPYrJLhLMAb</span>
          </div>
        </div>

        <div className="border border-gray-100"></div>

        {/* Holders & Callers */}
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <span className="text-sm sm:text-base">Callers</span> 
            <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">72</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm sm:text-base">Top 10 holders</span> 
            <span className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">22.4% ($20m)</span>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-sm sm:text-base">Top 3 holders</span>
            <div className="flex gap-0.5 sm:gap-2"> 
              {Array(3).fill(0).map((holder, index) => (
                <span key={index} className="bg-gray-100 px-2 py-1.5 rounded-full text-white text-xs">3.3% ($1.3m)</span>
              ))}
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="space-y-2 mb-4">
          <button className="flex items-center justify-between w-full bg-black px-5 py-2.5 rounded-full">
            <span className="flex items-center gap-2">
              <img src={Dexscreener} alt="DEX Screener" className="w-6 h-6" /> <span className="text-sm">DEX Screener</span>
            </span>
            <FaExternalLinkAlt className="text-white" />
          </button>
          <button className="flex items-center justify-between w-full bg-black px-5 py-2.5 rounded-full">
            <span className="flex items-center gap-2">
              <img src={Photon} alt="Photon-SOL" className="w-6 h-6" /> <span className="text-sm">Photon-SOL</span>
            </span>
            <FaExternalLinkAlt className="text-white" />
          </button>
        </div>

        {/* Call Button */}
        <button className="btn w-full text-sm sm:text-base py-3" onClick={onClose}>Call</button>
      </div>
    </Modal>
}

export default CallModal;