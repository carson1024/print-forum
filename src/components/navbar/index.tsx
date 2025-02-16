import Logo from 'assets/img/logo.png';
import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import RestrictedModal from 'components/modal/RestrictedModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = (props: {
  currentRoute: string;
  secondary?: boolean | string;
}) => {
  const { currentRoute } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="card rounded-full flex justify-between">
      <div className='flex gap-6'>
        <div className='my-auto'>
          <img src={Logo} />
        </div>
        <div className="flex gap-2">
          <Link to="/forum" className={`nav-item ${currentRoute == 'forum' ? 'active' : ''}`}>Forum</Link>
          <button className={`nav-item ${currentRoute == 'alpha' ? 'active' : ''}`} onClick={() => setIsModalOpen(true)}>Alpha</button>
          <Link to="/leaderboard" className={`nav-item ${currentRoute == 'leaderboard' ? 'active' : ''}`}>Leaderboard</Link>
          <Link to="/copytrading" className={`nav-item ${currentRoute == 'copytrading' ? 'active' : ''}`}>Copy Trading</Link>
        </div>
      </div>
      <div className="flex px-3 py-2.5 gap-3 bg-gray-100 rounded-full my-auto items-center">
        <img src={IconTwitter} className='w-5 h-5' />
        <img src={IconTelegram} className='w-[28px] h-[28px]' />
        <img src={IconSolana} className='w-6 h-6' />
      </div>
      <RestrictedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Navbar;