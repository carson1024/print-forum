import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';

const ProfileTab = () => {
  return (<>
    <div className="overflow-auto sm:h-full">
      <div className="flex flex-col gap-6 sm:border-b-[1px] border-gray-100 p-4 sm:p-6">
        <div className="hidden sm:grid grid-cols-12">
          <div className="col-span-9 flex-grow space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Followers</span>
                <span className="text-xs text-primary">12</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Win rate</span>
                <span className="text-xs text-green-600">56%</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Calls</span>
                <span className="text-xs text-white">125</span>
              </div>
              <div className="bg-gray-50 rounded-full px-3 py-1.5 flex items-center gap-1">
                <span className="text-xs text-gray-600">Account age</span>
                <span className="text-xs text-white">2 years</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-snug">
              {"FIXED RATIO is recommended as the algo is built on buying small portions with many price points. An algo bot that capitalizes volatility of the market aiming for monthly returns. Just trust the bot !"}
            </p>
          </div>
          <div className="col-span-3">
            <div className="flex">
              <div className="ml-auto flex px-3 py-2 gap-3 bg-gray-50 rounded-full items-center">
                <img src={IconTwitter} className='w-3.5 h-3.5 sm:w-5 sm:h-5' />
                <img src={IconTelegram} className='w-[20px] h-[20px] sm:w-[28px] sm:h-[28px]' />
                <img src={IconSolana} className='w-4 h-4 sm:w-6 sm:h-6' />
              </div>
            </div>
          </div>
        </div>
        <div className="sm:hidden rounded-[22px] text-white space-y-2">
          <span className='text-sm font-bold'>Bio</span>
          <p className='text-xs leading-snug'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ipsum eros, volutpat id nibh quis, pretium aliquet neque. </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 sm:p-5 rounded-[22px] bg-gray-50">
            <div className="space-y-2 text-white">
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <span className="badge-rank-3"></span>
                  <span className="text-sm text-white">Rank 3</span>
                </div>
                <div className="hidden sm:flex gap-2 items-center">
                  <span className="circle-item bg-gray-50 w-8 h-8 text-xs font-bold">IV</span>
                  <span className="text-sm text-gray-600">Rank 4</span>
                </div>
              </div>
              <div className="hidden sm:flex w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '25%' }}></div>
              </div>
              <div className="hidden sm:flex  justify-between">
                <span className="text-sm text-white">165 XP</span>
                <span className="text-gray-600 text-sm">1000 XP</span>
              </div>
            </div>
          </div>
          <div className="sm:hidden p-4 sm:p-5 rounded-[22px] bg-gray-50 text-xs space-y-1.5">
            <div className='grid grid-cols-12'>
              <span className='col-span-4 text-gray-600'>Win rate</span>
              <span className='col-span-8 text-white'>56%</span>
            </div>
            <div className='grid grid-cols-12'>
              <span className='col-span-4 text-gray-600'>Calls</span>
              <span className='col-span-8 text-white'>125</span>
            </div>
            <div className='grid grid-cols-12'>
              <span className='col-span-4 text-gray-600'>Account age</span>
              <span className='col-span-8 text-white'>2 years</span>
            </div>
          </div>
          <div className="rounded-[22px] sm:bg-gray-50 text-white sm:p-4 space-y-2.5">
            <span>Archievements</span>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span className="badge-money-50k"></span>
                <span className="badge-register-1m"></span>
                <span className="badge-social-twitter"></span>
                <span className="badge-social-telegram"></span>
                <span className="badge-social-solana"></span>
                <span className="badge-call-10X"></span>
                <span className="badge-user-50 !hidden lg:!block"></span>
                <span className="badge-other-bughunter !hidden lg:!block"></span>
              </div>
              <button className="w-8 h-8 text-xs font-bold bg-gray-100 sm:bg-white circle-item text-white sm:text-black">+5</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>);
}

export default ProfileTab;