import Modal from "."
import { FaFilter, FaGreaterThanEqual, FaLessThanEqual } from "react-icons/fa6";
import React, { useEffect, useRef } from 'react';
import { useState } from "react";
import { useSearchParams } from 'react-router-dom';

const CopyFilterModal = ({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean,
  onClose: () => void
}>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'7 days' | '30 days' | '90 days'>('7 days');
  const [activeTag, setActiveTag] = useState<'top performer' | 'top ratior' | 'most resilient' | 'whale manager' | 'solid growth' | 'most consistent'>('top performer');
  const [activeROI, setActiveROI] = useState<'0' | '20' | '50' | '100'>('0');
  const [activeMDD, setActiveMDD] = useState<'10' | '30' | '50' | '70'>('10');
  useEffect(() => {
    setSearchParams({ tab: activeTab, tag: activeTag, roi: activeROI, mdd: activeMDD });
  }, []);
  return <Modal isOpen={isOpen} onClose={onClose} extraClass="w-[540px]">
    <div className="border-b pb-5 border-[#FFFFFF1A]">
      <h1 className="text-[#FFFFFF] text-base flex gap-2">
        <FaFilter color="#76767E" />
        Filters

      </h1>
    </div>
    <div className="space-y-6 pt-4">

      <div className="flex flex-col gap-2">
        <h4 className="text-[12px] md:text-base font-bold text-white">Time Range</h4>
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => { setActiveTab('7 days'); setSearchParams({ tab: "7 days", tag: activeTag, roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTab == '7 days' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>7 Days</button>
          <button onClick={() => { setActiveTab('30 days'); setSearchParams({ tab: "30 days", tag: activeTag, roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTab == '30 days' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>30 Days</button>
          <button onClick={() => { setActiveTab('90 days'); setSearchParams({ tab: "90 days", tag: activeTag, roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTab == '90 days' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>90 Days</button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-[12px] md:text-base font-bold text-white">Tags</h4>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setActiveTag('top performer'); setSearchParams({ tab: activeTab, tag: 'top performer', roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTag == 'top performer' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>Top Performer</button>
          <button onClick={() => { setActiveTag('top ratior'); setSearchParams({ tab: activeTab, tag: 'top ratior', roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTag == 'top ratior' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>Top Ratior</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setActiveTag('most resilient'); setSearchParams({ tab: activeTab, tag: 'most resilient', roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTag == 'most resilient' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>Most Resilient</button>
          <button onClick={() => { setActiveTag('whale manager'); setSearchParams({ tab: activeTab, tag: 'whale manager', roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTag == 'whale manager' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>Whale Manager</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setActiveTag('solid growth'); setSearchParams({ tab: activeTab, tag: 'solid growth', roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTag == 'solid growth' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>Solid Growth</button>
          <button onClick={() => { setActiveTag('most consistent'); setSearchParams({ tab: activeTab, tag: 'most consistent', roi: activeROI, mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeTag == 'most consistent' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}>Most Consistent</button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-[12px] md:text-base font-bold text-white">7D ROI</h4>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => { setActiveROI('0'); setSearchParams({ tab: activeTab, tag: activeTag, roi: "0", mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeROI == '0' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}><FaGreaterThanEqual className="font-bold text-xxs sm:text-sm" /> 0%</button>
          <button onClick={() => { setActiveROI('20'); setSearchParams({ tab: activeTab, tag: activeTag, roi: "20", mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeROI == '20' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}><FaGreaterThanEqual className="font-bold text-xxs sm:text-sm" /> 20%</button>
          <button onClick={() => { setActiveROI('50'); setSearchParams({ tab: activeTab, tag: activeTag, roi: "50", mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeROI == '50' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}><FaGreaterThanEqual className="font-bold text-xxs sm:text-sm" /> 50%</button>
          <button onClick={() => { setActiveROI('100'); setSearchParams({ tab: activeTab, tag: activeTag, roi: "100", mdd: activeMDD }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeROI == '100' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}><FaGreaterThanEqual className="font-bold text-xxs sm:text-sm" /> 100%</button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="text-[12px] md:text-base font-bold text-white">7D MDD</h4>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => { setActiveMDD('10'); setSearchParams({ tab: activeTab, tag: activeTag, roi: activeROI, mdd: "10" }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeMDD == '10' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}><FaLessThanEqual className="font-bold text-xxs sm:text-sm" /> 10%</button>
          <button onClick={() => { setActiveMDD('30'); setSearchParams({ tab: activeTab, tag: activeTag, roi: activeROI, mdd: "30" }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeMDD == '30' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}><FaLessThanEqual className="font-bold text-xxs sm:text-sm" /> 30%</button>
          <button onClick={() => { setActiveMDD('50'); setSearchParams({ tab: activeTab, tag: activeTag, roi: activeROI, mdd: "50" }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeMDD == '50' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}><FaLessThanEqual className="font-bold text-xxs sm:text-sm" /> 50%</button>
          <button onClick={() => { setActiveMDD('70'); setSearchParams({ tab: activeTab, tag: activeTag, roi: activeROI, mdd: "70" }); }} className={`lg:btn lg:btn-base  py-1 h-[28px] lg:h-auto rounded-[6px]  flex justify-center items-center gap-1 text-[12px] lg:py-3 ${activeMDD == '70' ? 'text-[#CAF244] bg-[#CAF24433] lg:btn-primary' : 'btn-gray text-white'}`}><FaLessThanEqual className="font-bold text-xxs sm:text-sm" /> 70%</button>
        </div>
      </div>
    </div>
  </Modal>
}

export default CopyFilterModal;