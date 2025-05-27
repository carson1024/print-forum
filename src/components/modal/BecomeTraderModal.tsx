import Modal from "."
import React, { useState } from 'react';

const BecomeTraderModal = ({
    isOpen,
    onClose,
}: Readonly<{
    isOpen: boolean,
    onClose: () => void
}>) => {
    const [checked, setChecked] = useState(false);
    return (

        <Modal isOpen={isOpen} onClose={onClose} extraClass="w-[540px]">
            <div className="border-b pb-5 border-[#FFFFFF1A]">
                <h1 className="text-[#FFFFFF] text-sm">
                    Become a trader

                </h1>
            </div>
            <div className="flex flex-col gap-4 py-5">
                <p className="text-[#76767E] text-xs font-medium">
                    In order to become a trader you need to reach
                </p>
                <div className="bg-[#FFC3631A] rounded-[12px] p-3 flex justify-between items-center">
                    <div className="flex gap-1.5 items-center">
                        <div className="orangeGrad w-[36px] h-[36px] flex justify-center rounded-[6px] items-center text-[#FFC363] text-xs font-bold " >
                            V
                        </div>
                        <span className="text-sm text-[#FFC363] font-semibold">
                            Rank 5
                        </span>
                    </div>
                    <span className="text-sm text-[#FFC363] font-semibold">
                        View Rank System
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <h1 className="text-xs font-semibold">
                        Terms
                    </h1>
                    <p className="text-xs text-[#76767E] font-medium leading-[135%]">
                        Sed sed massa eu risus commodo sollicitudin. Maecenas vitae ante nec sem cursus pharetra. Vivamus pellentesque turpis vel nisi euismod, eget efficitur dui efficitur.
                    </p>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={() => setChecked(!checked)}
                        className={`w-[20px] h-[20px] rounded-md flex items-center justify-center transition-colors duration-200 ${checked ? "bg-zinc-700" : "bg-zinc-800"
                            }`}
                    >
                        {checked && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>
                    <span className="text-xs font-medium">
                    I agree pellentesque turpis vel nisi 
                    </span>
                </div>
                <button className="bg-[#CAF244] h-[40px] text-black rounded-[6px] text-sm font-semibold ">
                    Create Trade
                </button>
            </div>
        </Modal>
    )
}

export default BecomeTraderModal;