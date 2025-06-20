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
  if (!isOpen) return <></>;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/400"
      onClick={onClose}
    >
      <div
        className={`bg-black text-white shadow-lg p-[32px] md:p-[32px] relative max-w-[100%] md:max-w-[32px] ${extraClass || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={`absolute top-8 right-8 md:top-[24px] md:right-[24px] text-gray-300 hover:text-gray-500 ${hideCloseButton ? "hidden" : ""}`}
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
