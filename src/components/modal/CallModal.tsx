import { MdEmail } from "react-icons/md";
import Modal from ".";
import { FaXTwitter } from "react-icons/fa6";
import Token from "assets/img/sample/token.png";
import Dexscreener from "assets/img/sample/dexscreener.png";
import Photon from "assets/img/sample/photon.png";
import { FaExternalLinkAlt } from "react-icons/fa";
import { formatNumber } from "utils/blockchain";
import { useEffect, useState } from "react";
import { CallReportType } from "types/calls";

export interface TopHolderType {
  pct: number;
  uiAmount: number;
}
const CallModal = ({
  isOpen,
  callReport,
  onSave,
  onClose,
}: Readonly<{
  isOpen: boolean;
  callReport: CallReportType;
  onSave: () => void;
  onClose: () => void;
}>) => {
  const [top3Holders, setTop3Holders] = useState<TopHolderType[]>([]);
  const [top10HolderInfo, setTop10HolderInfo] = useState<TopHolderType>({
    pct: 0,
    uiAmount: 0,
  });
  const [callers, setCallers] = useState(0);

  useEffect(() => {
    if (!callReport) return;
    let _top3Holders: TopHolderType[] = [];
    let _top10HolderInfo: TopHolderType = { pct: 0, uiAmount: 0 };
    callReport.topHolders.map((holder, index) => {
      if (index < 3) {
        _top3Holders.push(holder);
      }
      if (index < 10) {
        _top10HolderInfo.pct += holder.pct;
        _top10HolderInfo.uiAmount += holder.uiAmount;
      }
    });
    setTop3Holders(_top3Holders);
    setTop10HolderInfo(_top10HolderInfo);
  }, [callReport]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideCloseButton={false}>
      <div className="space-y-[12px]">
        {/* Token Info */}
        <p className="text-[20px] font-semibold text-white">New call</p>
        <div className="flex items-center gap-3 justify-between">
          <div className="flex gap-2 items-center">
            <img
              src={callReport?.info.imageUrl}
              className="w-[50px] h-[50px] sm:w-16 sm:h-16 circle"
            />
            <div>
              <h2 className="text-[18px] font-semibold text-white mb-1">
                ${callReport?.tokenMeta.symbol}
              </h2>
              <div className="flex text-[14px] font-Medium text-gray-600">
                <span className="mr-[8px]">Market Cap</span>
                {formatNumber(callReport?.marketCap)}
              </div>
            </div>
          </div>
        </div>

        {/* Contract Address */}
        <div className="bg-gray-50 px-4 sm:px-6 py-4 circle text-xs text-gray-600 flex items-center gap-2">
          <span className="font-semibold text-white text-base">CA</span>
          <div className="truncate-wrapper">
            <span className="truncate">{callReport?.pairAddress}</span>
          </div>
        </div>
        <div className="border border-gray-100"></div>

        {/* Holders & Callers */}
        <div className="  items-center space-y-[6px]">
          <div className="flex">
            <span className="token_info text-gray-600 text-[12px] font-Medium mr-[8px]">
              Callers<span className="token_border text-white">{callers}</span>
            </span>
            <span className="token_info text-gray-600 text-[12px] font-Medium ">
              Top&nbsp;10&nbsp;holders
              <span className=" text-white">
                {top10HolderInfo.pct.toFixed(2)}%{" "}
                <span className="text-gray-600">
                  $
                  {formatNumber(
                    top10HolderInfo.uiAmount *
                      ((callReport?.marketCap *
                        Math.pow(10, callReport?.token.decimals)) /
                        callReport?.token.supply)
                  )}
                </span>
              </span>
            </span>
          </div>
          <div className="mb-[12px]">
            <span className="token_info text-gray-600 text-[12px] font-Medium space-x-[5px]">
              Top&nbsp;3&nbsp;holders
              {top3Holders.map((holder, index) => (
                <span className=" text-white ">
                  {holder.pct.toFixed(2)}%
                  <span className="text-gray-600 ml-[2px]">
                    $
                    {formatNumber(
                      holder.uiAmount *
                        ((callReport?.marketCap *
                          Math.pow(10, callReport?.token.decimals)) /
                          callReport?.token.supply)
                    )}
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* External Links */}
        <div className=" mb-4 flex  items-center justify-between">
          <a
            href={`https://dexscreener.com/solana/${callReport?.pairAddress.toLocaleLowerCase()}`}
            target="_blank"
            className="flex items-center btn_callcard "
          >
            <span className="flex items-center gap-2">
              <img src={Dexscreener} alt="DEX Screener" className="w-6 h-6" />{" "}
              <span className="text-sm">DEX Screener</span>
            </span>
            &nbsp;
            <FaExternalLinkAlt className="text-white" />
          </a>
          <a
            href={`https://photon-sol.tinyastro.io/en/lp/${callReport?.pairAddress.toLowerCase()}`}
            target="_blank"
            className="flex items-center btn_callcard "
          >
            <span className="flex items-center gap-2">
              <img src={Photon} alt="Photon-SOL" className="w-6 h-6" />{" "}
              <span className="text-sm">Photon-SOL</span>
            </span>
            &nbsp;
            <FaExternalLinkAlt className="text-white" />
          </a>
        </div>

        {/* Call Button */}
        <button
          className="bg-primary circle font-semibold text-black w-full text-sm sm:text-base py-3"
          onClick={onSave}
        >
          Call
        </button>
      </div>
    </Modal>
  );
};

export default CallModal;
