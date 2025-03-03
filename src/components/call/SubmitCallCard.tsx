import CallModal from "components/modal/CallModal";
import { showToastr } from "components/toastr";
import { useAuth } from "contexts/AuthContext";
import { supabase } from "lib/supabase";
import { useState } from "react";
import { CallReportType } from "types/calls";
import { checkCall } from "utils/blockchain";

const SubmitCallCard = () => {
  const { isLogin, session } = useAuth();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callToken, setCallToken] = useState("");
  const [callReport, setCallReport] = useState<CallReportType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitCall = async () => {
    if (isSubmitting) return;
    setCallReport(null);
    if (!isLogin) {
      showToastr("Please login to submit a call", "error");
      return;
    }
    if (!callToken) {
      showToastr("Please enter a CA", "error");
      return;
    }
    setIsSubmitting(true);
    let result = await checkCall(callToken);
    setIsSubmitting(false);
    if (!result) {
      showToastr("Invalid CA", "error");
      return;
    }
    setCallReport(result);
    setCallToken("");
    setIsCallModalOpen(true);
  }

  const handleCallSave = async () => {
    if (!session.user || !callReport) return;
    const userId = session.user.id;
    const { data, error } = await supabase
      .from("calls")
      .insert([
        {
          image: callReport.info.imageUrl,
          name: callReport.fileMeta.name,
          symbol: callReport.fileMeta.symbol,
          address: callReport.pairAddress,
          token_address: callReport.baseToken.address,
          init_market_cap: callReport.marketCap,
        },
      ]);

    if (error) {
      showToastr("Error saving call report", "error");
      console.error("Error saving call report:", error.message);
      setIsCallModalOpen(false);
      return;
    }

    const { data: dataCaller, error: errorCaller } = await supabase
      .from("callers")
      .insert([
        {
          user_id: userId,
          address: callReport.pairAddress,
        },
      ])
    
    if (error) {
      showToastr("Error saving call report", "error");
      console.error("Error saving call report:", error.message);
    }

    setIsCallModalOpen(false);
  }

  return (<>
    {/* Search and Submit Button */}
    <div className="flex items-center gap-4 mb-4">
      <div className="flex items-center card p-2 rounded-full grow">
        <input 
          value={callToken}
          onChange={(e) => setCallToken(e.target.value)}
          type="text" 
          placeholder="Paste in CA" 
          className="outline-none text-sm px-2 grow sm:px-4 sm:py-3 sm:text-base bg-transparent" />
        <button className="sm:hidden flex btn btn-sm" onClick={handleSubmitCall} disabled={isSubmitting}>Submit a Call</button>
      </div>
      <button className="btn !hidden sm:!flex" onClick={handleSubmitCall} disabled={isSubmitting}>Submit a Call</button>
    </div>
    {
      <CallModal 
        isOpen={isCallModalOpen} 
        callReport={callReport}
        onSave={handleCallSave}
        onClose={() => setIsCallModalOpen(false)} 
      />
    }
  </>)
}

export default SubmitCallCard;