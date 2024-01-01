import React, { forwardRef, useImperativeHandle } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type NotifyType = "success" | "warning" | "error";

const Pop = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    notify(message: string, type: NotifyType = "success") {
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "warning":
          toast.warn(message);
          break;
        case "error":
          toast.error(message);
          break;
        default:
          toast(message); // Default case for generic notifications
      }
    },
  }));

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </div>
  );
});

export default Pop;
