import { MdClose } from "react-icons/md";

const Modal = ({
  isOpen,
  onClose,
  hideCloseButton,
  extraClass,
  children,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  hideCloseButton?: boolean;
  extraClass?: string;
  children: React.ReactNode;
}>) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex justify-center items-start md:items-center "
      onClick={onClose}
    >
      <div
        className={`bg-dark1 text-white rounded-none md:rounded shadow-lg w-full md:max-w-[620px]  py-7 md:mx-0 p-4 md:p-[36px] relative ${extraClass || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={`absolute top-4 right-4 md:top-[24px] md:right-[24px] text-gray-300 hover:text-gray-500 ${hideCloseButton ? "hidden" : ""}`}
          onClick={onClose}
        >
          <MdClose size={24} />
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
