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
    return <Modal isOpen={isOpen} onClose={onClose}>
      {/* Modal Header */}
      <h2 className="text-lg font-bold mb-3">Log in to your account</h2>
      <p className="text-gray-600 mb-4">Need help with your account? <span className="text-primary cursor-pointer">Get Support</span></p>
      
      {/* Divider */}
      <div className="border-t border-gray-700 my-5"></div>
      
      {/* Email Login */}
      <p className="font-semibold mb-2">Use a one time code</p>
      <div className="input-field w-full">
        <MdEmail className="text-gray-600 ml-1" size={24} />
        <input 
          type="email" 
          placeholder="example@email.com" 
          className="bg-transparent flex-grow outline-none text-white placeholder-gray-500"
        />
        <button className="btn btn-sm text-base">Send code</button>
      </div>
      
      {/* OR Separator */}
      <div className="text-center text-gray-500 my-4">OR</div>
      
      {/* Log in using X */}
      <button className="input-field w-full text-gray-600" onClick={onClose}>
        <FaXTwitter className="ml-1.5" size={20} />Log in using X
      </button>
    </Modal>
}

export default LoginModal;