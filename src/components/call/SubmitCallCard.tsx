import CallModal from "components/modal/CallModal";
import { useState } from "react";

const SubmitCallCard = () => {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  
  return (<>
    {/* Search and Submit Button */}
    <div className="flex items-center gap-4 mb-4">
      <input type="text" placeholder="Paste in CA" className="search-field" />
      <button className="btn" onClick={() => setIsCallModalOpen(true)}>Submit a Call</button>
    </div>
    <CallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />
  </>)
}

export default SubmitCallCard;