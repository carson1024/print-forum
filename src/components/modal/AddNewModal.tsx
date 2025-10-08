import Modal from "."
import React from 'react';

const AddNew = ({
    isOpen,
    onClose,
}: Readonly<{
    isOpen: boolean,
    onClose: () => void
}>) => {

    return (

        <Modal isOpen={isOpen} onClose={onClose} extraClass="w-[540px]">
            <div className="border-b pb-5 border-[#FFFFFF1A]">
                <h1 className="text-[#57DBFF] text-sm">
                    New Trade

                </h1>
            </div>
            <div className="flex flex-col gap-4 py-5">
                <p className="text-[#76767E] text-xs font-medium"> 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi cursus, libero non pulvinar porttitor, neque elit volutpat eros, eget faucibus elit augue fringilla magna.
                </p>
                <div className="bg-[#323137] px-3 py-[10px] rounded-[6px] flex flex-col gap-1.5 ">
                    <span className="text-xs font-medium text-white">
                    Contract Address
                    </span>
                    <span className="text-[#84848D] text-[10px]">
                    7RHms4GTZXsB8CiVbEuu9SAJRzPYrJLhLMAb
                    </span>
                </div>
                <div className="bg-[#323137]  px-3 py-[10px] rounded-[6px] flex items-center justify-between gap-1.5 ">
                    <div className="flex gap-2 items-center">
                        <span className="text-xs font-medium text-white">
                        SOL Amount
                        </span>
                        <input type="text" className="border-none w-[50px] outline-none bg-transparent " placeholder="1" />
                    </div>
                    <span className="text-[#59FFCB] truncate text-xs font-medium">
                    2.1 Available
                    </span>
                 
                </div>
                <button className="bg-[#CAF244] h-[40px] text-black rounded-[6px] text-sm font-semibold ">
                Create Trade
                </button>
            </div>
        </Modal>
    )
}

export default AddNew;