import Modal from "."

const RestrictedModal = ({
    isOpen, 
    onClose,
  }: Readonly<{
    isOpen: boolean,
    onClose: () => void
  }>) => {
    return <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-3">
          <h3 className="text-[18px] font-semibold font-bold text-white">Page restriced</h3>
          <p className="text-gray-600 !leading-[135%] text-[14px] font-Medium">
            Alpha listing is accessible from rank <span className="text-red-300"><span className="text-base sm:text-md mr-1">IV</span>Rank Name</span><br/>
            and above.
          </p>
        </div>
        <div className="border border-gray-100"></div>
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-[18px] font-semibold font-bold text-white">Rank system</h3>
            <p className="text-gray-600 !leading-[135%] text-[14px] font-Medium">
              Understand print.forum rank system
            </p>
          </div>
          <button className="w-full h-[42px] bg-primary circle text-black text-[16px] font-semibold">Ranks</button>
        </div>
      </div>
    </Modal>
}

export default RestrictedModal;