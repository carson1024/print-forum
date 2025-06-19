import { Toaster, toast } from "react-hot-toast";

export const showToastr = (message: string, type: "success" | "error" | "info") => {
  // console.log("showToastr", message, type);
  switch (type) {
    case "success":
      toast.success(message, { position: "top-center" });
      break;
    case "error":
      toast.error(message, { position: "top-center" });
      break;
    case "info":
    default:
      toast(message, { position: "top-center" });
  }
};

const Toastr = () => {
  return <Toaster
    toastOptions={{
      // style: { background: "#333", color: "#fff" },
      position: "top-center",
      duration: 3000
    }}
  />;
};

export default Toastr;
