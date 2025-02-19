import Modal from "."

const AllTradesModal = ({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean,
  onClose: () => void
}>) => {
  return <Modal isOpen={isOpen} onClose={onClose} extraClass="!max-w-none w-[90%] sm:w-[80%] max-h-[90%] overflow-hidden flex">
    <div className="flex flex-col gap-4 sm:gap-6 grow">
      <h3 className="text-base sm:text-lg font-bold">My Trades</h3>
      <div className="border border-gray-100"></div>
      <div className="btn-group light">
        <button className="btn btn-sm sm:btn-lg active">Active</button>
        <button className="btn btn-sm sm:btn-lg">Past</button>
      </div>
      <div className="space-y-3 flex-grow overflow-auto">
        {
          Array(9).fill(0).map((value, index) => <div className="bg-gray-50 rounded-[22px] text-sm px-3 py-1.5 sm:px-4 sm:py-3 flex items-center gap-3 sm:gap-5 flex-wrap">
            <div className="w-[5%]">
              {
                index % 4 < 2 ?
                  <button className="rounded-full bg-green-600 text-black btn btn-xs">Buy</button>
                :
                  <button className="rounded-full bg-red-400 text-white btn btn-xs">Sell</button>
              }
            </div>
            <div className="grow flex">
              <div className="flex gap-2 items-center border border-gray-100 rounded-full p-3 pr-5 sm:border-none sm:p-0">
                <span className="badge-rank-8"></span>
                <div className="space-y-1">
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-600">Rank 5</span>
                    <span className="text-primary">COPYING</span>
                  </div>
                  <p className="text-sm font-bold">UsernameLong</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-white/60">Pair</p>
                <p className="text-xs text-white">UNIUSDT</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60">Executed</p>
                <p className="text-xs text-white">7.87 UNI</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60">Total</p>
                <p className="text-xs text-white">0.01 SOL</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60">Role</p>
                <p className="text-xs text-white">Taiker</p>
              </div>
            </div>
            <div className="min-w-[25%] flex gap-2 items-center">
              { (index % 4 < 2) && <button className="btn btn-xs btn-red">Sell</button> }
              <div className="text-xs sm:text-sm text-gray-600 text-right ml-auto">
                2025-01-16 15:45:17
              </div>
            </div>
          </div>)
        }
      </div>
      <div className="flex">
        <div className="px-4 py-2 flex items-center gap-2 text-sm border border-gray-100 rounded-full">
          <button>{'<'}</button>
          <button className="circle-item w-6 h-6 text-primary bg-primary/10">1</button>
          <button className="circle-item w-6 h-6 text-white">2</button>
          <span>....</span>
          <button className="circle-item w-6 h-6 text-white">27</button>
          <button>{'>'}</button>
        </div>
      </div>
    </div>
  </Modal>
}

export default AllTradesModal;