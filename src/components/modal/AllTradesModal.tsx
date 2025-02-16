import Modal from "."

const AllTradesModal = ({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean,
  onClose: () => void
}>) => {
  return <Modal isOpen={isOpen} onClose={onClose} extraClass="!max-w-none w-[80%]">
    <div className="space-y-6">
      <h3 className="text-lg font-bold">My Trades</h3>
      <div className="border border-gray-100"></div>
      <div className="btn-group light">
        <button className="btn active">Active</button>
        <button className="btn">Past</button>
      </div>
      <div className="space-y-3">
        {
          Array(9).fill(0).map((value, index) => <div className="bg-gray-50 rounded-full text-sm px-4 py-3 flex items-center gap-5">
            <div className="w-[5%]">
              {
                index % 4 < 2 ?
                  <button className="rounded-full bg-green-600 text-black px-1.5 py-1 text-xs">Buy</button>
                :
                  <button className="rounded-full bg-red-400 text-white px-1.5 py-1 text-xs">Sell</button>
              }
            </div>
            <div className="grow">
              <div className="flex gap-2 items-center">
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
            <div className="w-[5%] space-y-1">
              <p className="text-xs text-white/60">Pair</p>
              <p className="text-xs text-white">UNIUSDT</p>
            </div>
            <div className="w-[5%] space-y-1">
              <p className="text-xs text-white/60">Executed</p>
              <p className="text-xs text-white">7.87 UNI</p>
            </div>
            <div className="w-[5%] space-y-1">
              <p className="text-xs text-white/60">Total</p>
              <p className="text-xs text-white">0.01 SOL</p>
            </div>
            <div className="w-[5%] space-y-1">
              <p className="text-xs text-white/60">Role</p>
              <p className="text-xs text-white">Taiker</p>
            </div>
            <div className="w-[3%]">
              { (index % 4 < 2) && <button className="btn btn-xs btn-red">Sell</button> }
            </div>
            <div className="w-[13%] text-gray-600 text-right">
              2025-01-16 15:45:17
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