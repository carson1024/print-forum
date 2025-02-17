import CallModal from "components/modal/CallModal";
import { useState } from "react";

const SubmitCallCard = () => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  return (<>
    {/* Search and Submit Button */}
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center card p-2 rounded-full grow">
        <input type="text" placeholder="Paste in CA" className="outline-none text-sm px-2 grow sm:px-4 sm:py-3 sm:text-base bg-transparent" />
        <button className="sm:hidden flex btn btn-sm" onClick={() => setIsCallModalOpen(true)}>Submit a Call</button>
      </div>
      <button className="btn !hidden sm:!flex" onClick={() => setIsCallModalOpen(true)}>Submit a Call</button>
    </div>
    <CallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
  </>)
}

export default SubmitCallCard;