import Modal from "./index_alert";

const AlertModal = ({
  isOpen,
  onClose,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      extraClass="fixed top-[50px] right-[38px]  flex"
    >
      <div className="w-[290px] h-[488px] m-[18px]">
        <div className="text-[16px] font-semibold text-white mb-[16px] mt-[6px]">
          Notifications
        </div>
        <div className="overflow-auto h-[90%]">
          <div className="">
            <div className="flex items-center mb-[4px]">
              <span className="badge-user-50 w-[32px] h-[32px] mr-[10px]"></span>
              <span className="text-[14px] font-semibold text-white">
                Achievement unlocked!
              </span>
              <span className="text-[14px] font-Medium text-gray-600 ml-auto">
                7 min ago
              </span>
            </div>
            <div className="items-center text-[14px] font-Medium text-gray-600 mb-[4px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel
              congue orci, a pretium augue.
            </div>
            <div className="items-center text-[14px] font-semibold text-primary mb-[8px]">
              +10 XP
            </div>
            <div className="border border-gray-100 mb-[8px]"></div>
          </div>

          <div className="">
            <div className="flex items-center mb-[4px]">
              <span className="badge-user-50 w-[32px] h-[32px] mr-[10px]"></span>
              <span className="text-[14px] font-semibold text-white">
                Achievement unlocked!
              </span>
              <span className="text-[14px] font-Medium text-gray-600 ml-auto">
                7 min ago
              </span>
            </div>
            <div className="items-center text-[14px] font-Medium text-gray-600 mb-[4px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel
              congue orci, a pretium augue.
            </div>
            <div className="items-center text-[14px] font-semibold text-primary mb-[8px]">
              +10 XP
            </div>
            <div className="border border-gray-100 mb-[8px]"></div>
          </div>

          <div className="">
            <div className="flex items-center mb-[4px]">
              <span className="badge-user-50 w-[32px] h-[32px] mr-[10px]"></span>
              <span className="text-[14px] font-semibold text-white">
                Achievement unlocked!
              </span>
              <span className="text-[14px] font-Medium text-gray-600 ml-auto">
                7 min ago
              </span>
            </div>
            <div className="items-center text-[14px] font-Medium text-gray-600 mb-[4px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel
              congue orci, a pretium augue.
            </div>
            <div className="items-center text-[14px] font-semibold text-primary mb-[8px]">
              +10 XP
            </div>
            <div className="border border-gray-100 mb-[8px]"></div>
          </div>

          <div className="">
            <div className="flex items-center mb-[4px]">
              <span className="badge-user-50 w-[32px] h-[32px] mr-[10px]"></span>
              <span className="text-[14px] font-semibold text-white">
                Achievement unlocked!
              </span>
              <span className="text-[14px] font-Medium text-gray-600 ml-auto">
                7 min ago
              </span>
            </div>
            <div className="items-center text-[14px] font-Medium text-gray-600 mb-[4px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel
              congue orci, a pretium augue.
            </div>
            <div className="items-center text-[14px] font-semibold text-primary mb-[8px]">
              +10 XP
            </div>
            <div className="border border-gray-100 mb-[8px]"></div>
          </div>

          <div className="">
            <div className="flex items-center mb-[4px]">
              <span className="badge-user-50 w-[32px] h-[32px] mr-[10px]"></span>
              <span className="text-[14px] font-semibold text-white">
                Achievement unlocked!
              </span>
              <span className="text-[14px] font-Medium text-gray-600 ml-auto">
                7 min ago
              </span>
            </div>
            <div className="items-center text-[14px] font-Medium text-gray-600 mb-[4px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel
              congue orci, a pretium augue.
            </div>
            <div className="items-center text-[14px] font-semibold text-primary mb-[8px]">
              +10 XP
            </div>
            <div className="border border-gray-100 mb-[8px]"></div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AlertModal;
