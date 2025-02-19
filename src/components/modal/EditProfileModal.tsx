import { FaArrowDown } from "react-icons/fa";
import Modal from "."
import { ImArrowDown } from "react-icons/im";
import User from 'assets/img/sample/user.png';
import IconUpload from 'assets/img/icons/upload.svg';
import IconTwitter from 'assets/img/icons/twitter.svg';
import IconTelegram from 'assets/img/icons/telegram.svg';
import IconSolana from 'assets/img/icons/solana.svg';
import { IoCheckmark } from "react-icons/io5";

const EditProfileModal = ({
    isOpen,
    onOk,
    onCancel,
  }: Readonly<{
    isOpen: boolean,
    onOk: () => void
    onCancel: () => void
  }>) => {
  return <Modal isOpen={isOpen} onClose={onCancel} extraClass="w-[620px]">
    <div className="space-y-6">
      {/* User Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img src={User} className="w-[42px] h-[42px] sm:w-[82px] sm:h-[82px] circle" alt="User avatar" />
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold">UsernameLong</h2>
            <button className="hidden sm:flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-full">
              <img src={IconUpload} className="w-5 h-5" /> Upload new picture
            </button>
          </div>
        </div>
        <button className="sm:hidden flex items-center gap-2 text-sm bg-gray-50 px-3 py-3 rounded-full justify-center">
          <img src={IconUpload} className="w-5 h-5" /> Upload new picture
        </button>
      </div>
      <div className="border-b-[1px] border-gray-100"></div>
      {/* Social Links */}
      <div className="space-y-5">
        <div className="flex items-center bg-gray-50 rounded-full px-5 py-2.5 gap-2">
          <img src={IconTwitter} className="w-5 h-5 opacity-60" />
          <span className="text-xs sm:text-sm text-gray-600">x.com/</span>
          <input
            type="text"
            placeholder=""
            defaultValue="username"
            className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center bg-gray-50 rounded-full px-5 py-2.5 gap-2">
          <img src={IconTelegram} className="w-[28px] h-[28px] opacity-60" />
          <span className="text-xs sm:text-sm text-gray-600">t.com/</span>
          <input
            type="text"
            placeholder="t.com/username"
            defaultValue="asdaf3qasd8"
            className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center bg-gray-50 rounded-full px-5 py-2.5 gap-2">
          <img src={IconSolana} className="w-6 h-6 opacity-60" />
          <span className="text-xs sm:text-sm text-gray-600">address:</span>
          <input
            type="text"
            placeholder="address"
            defaultValue="7RHms4GTZXsB8CiVbEuu9SAJRzPYrJLhLMAb"
            className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 text-xs sm:text-sm"
            disabled
          />
        </div>

        <div className="flex items-start bg-gray-50 rounded-[20px] px-5 py-2.5">
          <span className="text-gray-600 mr-2">Bio</span>
          <textarea
            placeholder="Write a short bio..."
            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ipsum eros, volutpat id nibh quis, pretium aliquet neque. "
            className="bg-transparent flex-grow outline-none text-white placeholder-gray-500 resize-none text-xs sm:text-sm leading-snug"
          ></textarea>
        </div>
      </div>

      {/* Save Button */}
      <button className="w-full btn py-3 text-sm sm:text-base" onClick={() => onOk()}>Save</button>
    </div>
  </Modal>
}

export default EditProfileModal;