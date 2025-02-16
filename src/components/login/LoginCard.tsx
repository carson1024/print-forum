import LoginModal from "components/modal/LoginModal";
import { useState } from "react";
import { getRankChar } from "utils/style";

const LoginCard = (props: {
  login: () => void
}) => {
  const { login } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (<>
    <div className="bg-white text-black p-8 rounded space-y-3">
      <h3 className="font-bold text-lg">Start printing</h3>
      <p className="text-black/60">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis odio rhoncus.</p>
      <button className="btn w-full" onClick={() => setIsModalOpen(true)}>Log in</button>
    </div>
    <LoginModal isOpen={isModalOpen} onClose={() => {
      setIsModalOpen(false);
      login()
    }} />
  </>)
}

export default LoginCard;