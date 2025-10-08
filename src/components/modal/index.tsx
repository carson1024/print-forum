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
      className="fixed inset-0 z-[999] bg-black/70 flex justify-center items-start md:items-center "
      onClick={onClose}
    >
      <div
        className={`bg-dark1 text-white rounded-none md:rounded shadow-lg w-full md:max-w-[620px]  pt-[72px] pb-[36px] px-[36px] md:mx-0   md:p-[36px] relative ${extraClass || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={`absolute top-[4rem] right-[2rem] md:top-[24px] md:right-[24px] text-gray-300 hover:text-gray-500 ${hideCloseButton ? "hidden" : ""}`}
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
