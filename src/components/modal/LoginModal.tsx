import { MdEmail } from "react-icons/md";
import Modal from "."
import { FaXTwitter } from "react-icons/fa6";

const LoginModal = ({
    isOpen, 
    onClose,
  }: Readonly<{
    isOpen: boolean,
    onClose: () => void
  }>) => {
    return <Modal isOpen={isOpen} onClose={onClose} extraClass="w-[92%] sm:w-auto">
      {/* Modal Header */}
      <h2 className="text-base sm:text-lg font-bold mb-3">Log in to your account</h2>
      <p className="text-xs sm:text-base text-gray-600 mb-4">Need help with your account? <span className="text-primary cursor-pointer">Get Support</span></p>
      
      {/* Divider */}
      <div className="border-t border-gray-700 my-5"></div>
      
      {/* Email Login */}
      <p className="font-semibold mb-2">Use a one time code</p>
      <div className="flex items-center gap-4 w-full">
        <div className="relative flex items-center input-field !px-2 sm:!px-4 rounded-full grow">
          <MdEmail className="text-gray-600 ml-1" size={24} />
          <input 
            type="email" 
            placeholder="example@email.com" 
            className="bg-transparent outline-none text-white placeholder-gray-500 text-sm sm:text-base pr-4 grow"
          />
          <button className="absolute top-2 right-2 sm:hidden flex btn btn-sm">Send code</button>
        </div>
        <button className="btn btn-sm text-base !hidden sm:!flex !py-3">Send code</button>
      </div>
      
      {/* OR Separator */}
      <div className="text-center text-gray-500 my-3 sm:my-4 text-xs sm:text-base">OR</div>
      
      {/* Log in using X */}
      <button className="input-field w-full text-gray-600 !px-2 sm:!px-4 text-sm sm:text-base" onClick={onClose}>
        <FaXTwitter className="ml-1.5" size={20} />Log in using X
      </button>
    </Modal>
}

export default LoginModal;