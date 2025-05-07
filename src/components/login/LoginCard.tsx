import LoginModal from "components/modal/LoginModal";
import { useState } from "react";
import { getRankChar } from "utils/style";

const LoginCard = (props: {
  login: (provider: string, email?: string) => Promise<boolean>
}) => {
  const { login } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (<>
    <div className="bg-white text-black p-8 rounded space-y-3 items-center justify-center h-[240px]">
      <h3 className="font-bold text-base sm:text-lg items-center justify-center">Start printing</h3>
      <p className="text-black/60 text-xs lg:text-base !leading-[135%] items-center justify-center flex">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis odio rhoncus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis odio rhoncus.</p>
      <button className="bg-primary circle text-[18px] font-semibold  h-[54px] w-full py-3 sm:py-5 items-center justify-center flex" onClick={() => setIsModalOpen(true)}>Log in</button>
    </div>
    <LoginModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)}
      login={login}
      />
  </>)
}

export default LoginCard;