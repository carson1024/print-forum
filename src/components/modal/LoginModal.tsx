import { MdEmail } from "react-icons/md";
import Modal from "."
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import { showToastr } from "components/toastr";

const LoginModal = ({
    isOpen, 
    onClose,
    login
  }: Readonly<{
    isOpen: boolean,
    onClose: () => void,
    login: (provider: string, email?: string) => Promise<boolean>
  }>) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const handleLogin = async (provider: string, email?: string) => {
      if (isSending) return;
      if (provider === 'twitter') {
        showToastr("Not supported yet", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (provider === 'email' && email && !emailRegex.test(email)) {
        setEmailError('Invalid email address.');
        return;
      }
      if (provider === 'email' && !email) {
        setEmailError('Email is required.');
        return
      }

      setIsSending(true);
      let success = await login(provider, email);
      setIsSending(false);
      if (!success) {
        showToastr("Login failed. Try again.", "error");
        return;
      }
      switch (provider) {
        case 'twitter':
          showToastr("Login successful. Redirecting...", "success");
          break;
        case 'email':
          showToastr("Check your email for the login link!", "success");
          break;
      } 
    }

    // Detect Enter key press
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent default form submission
        handleLogin('email', email);
      }
    };

    return <Modal isOpen={isOpen} onClose={onClose} extraClass="w-[92%] sm:w-auto">
      {/* Modal Header */}
      <h2 className="text-base sm:text-lg font-bold mb-3">Log in to your account</h2>
      <p className="text-xs sm:text-base text-gray-600 mb-4">Need help with your account? <span className="text-primary cursor-pointer">Get Support</span></p>
      
      {/* Divider */}
      <div className="border-t border-gray-700 my-5"></div>
      
      {/* Email Login */}
      <p className="font-semibold mb-2">Use a one time code</p>
      <div className="flex items-center gap-4 w-full">
        <div className="relative flex items-center input-field !px-2 sm:!px-4 circle grow">
          <MdEmail className="text-gray-600 ml-1" size={24} />
          <input
            type="email" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="example@email.com" 
            className="bg-transparent outline-none text-white placeholder-gray-500 text-sm sm:text-base pr-4 grow"
          />
          <button className="absolute top-2 right-2 sm:hidden flex bg-primary font-semibold p-[6px] circle btn-sm" onClick={() => handleLogin('email', email)} disabled={isSending}>Send code</button>
        <button className="bg-primary circle font-semibold p-[6px] text-black  text-base !hidden sm:!flex !py-3" onClick={() => handleLogin('email', email)} disabled={isSending}>Send code</button>
        </div>
       
      </div>
      {emailError && <p className="text-red-400 text-xs mt-2 ml-2">{emailError}</p>}
      
      {/* OR Separator */}
      <div className="text-center text-gray-500 my-3 sm:my-4 text-xs sm:text-base">OR</div>
      
      {/* Log in using X */}
      <button className="input-field circle w-full text-gray-600 !px-2 sm:!px-4 text-sm sm:text-base" onClick={() => handleLogin('twitter')}>
        <FaXTwitter className="ml-1.5" size={20} />Log in using X
      </button>
    </Modal>
}

export default LoginModal;