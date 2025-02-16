import Modal from "."

const AllCopiersModal = ({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean,
  onClose: () => void
}>) => {
  return <Modal isOpen={isOpen} onClose={onClose}>
    <div className="space-y-6">
      <h3 className="text-lg font-bold">UsernameLong’s copiers</h3>
      <div className="border border-gray-100"></div>
      <div className="space-y-3">
        {
          Array(9).fill(0).map((value, index) => <div className="bg-gray-50 rounded-full text-sm px-4 py-3 flex items-center gap-3">
            <div className="grow">
              <div className="flex gap-2 items-center">
                <span className="badge-rank-8"></span>
                <div className="space-y-1">
                  <div className="flex gap-2 text-xs">
                    <span className="text-gray-600">Rank 5</span>
                  </div>
                  <p className="text-sm font-bold">UsernameLong</p>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/60">Total amount</p>
              <p className="text-xs text-white">9 SOL</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/60">Result</p>
              <p className="text-xs text-green-600">+1.2 SOL</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/60">Copying</p>
              <p className="text-xs text-white">7 Days</p>
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

export default AllCopiersModal;