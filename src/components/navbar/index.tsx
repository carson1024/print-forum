import Logo from 'assets/img/logo.png';
import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import IconUser from 'assets/img/icons/user.svg';
import RestrictedModal from 'components/modal/RestrictedModal';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdClose } from 'react-icons/md';

const Navbar = (props: {
  currentRoute: string;
  secondary?: boolean | string;
}) => {
  const { currentRoute } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const route = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(route.pathname);
  }, [route]);
  
  return (
    <div className="card rounded-full flex justify-between px-2.5 lg:px-5 items-center">
      <div className={`${route.pathname == '/profile' ? 'grow' : 'hidden'}`}>
        <img src={Logo} className={`h-8`} />
      </div>
      <div className={`flex gap-6 ${route.pathname == '/profile' ? 'hidden' : ''}`}>
        <div className='hidden lg:block my-auto'>
          <img src={Logo} className='h-8' />
        </div>
        <div className="flex gap-0 sm:gap-2">
          <Link to="/" className={`nav-item btn-sm md:btn-lg ${currentRoute == 'forum' ? 'active' : ''}`}>Forum</Link>
          <button className={`nav-item btn-sm md:btn-lg ${currentRoute == 'alpha' ? 'active' : ''}`} onClick={() => setIsModalOpen(true)}>Alpha</button>
          <Link to="/leaderboard" className={`nav-item btn-sm md:btn-lg ${currentRoute == 'leaderboard' ? 'active' : ''}`}>Leaderboard</Link>
          <Link to="/copytrading" className={`nav-item btn-sm md:btn-lg ${currentRoute == 'copytrading' ? 'active' : ''}`}>Copy Trading</Link>
        </div>
      </div>
      <div className={`${route.pathname == '/profile' ? 'flex' : 'hidden'} sm:flex px-2.5 py-2 sm:px-3 sm:py-2.5 gap-3 bg-gray-100 rounded-full my-auto items-center`}>
        <img src={IconTwitter} className='w-3.5 h-3.5 sm:w-5 sm:h-5' />
        <img src={IconTelegram} className='w-[20px] h-[20px] sm:w-[28px] sm:h-[28px]' />
        <img src={IconSolana} className='w-4 h-4 sm:w-6 sm:h-6' />
      </div>
      {
        route.pathname == '/profile' ?
          <button onClick={() => navigate(-1)} className='w-8 h-8 circle-item bg-gray-100 ml-3'>
            <MdClose size={20} />
          </button>
        :
          <Link to={`/profile?tab=${currentRoute}`} className='sm:!hidden w-8 h-8 circle-item bg-gray-100'>
            <img src={IconUser} className='w-3 h-3' />
          </Link>          
      }
      <RestrictedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Navbar;