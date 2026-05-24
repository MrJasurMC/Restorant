import { createContext, useContext } from "react";
import { toast } from "react-toastify";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  function showToast(msg, type = "success") {
    if (type === "error") toast.error(msg);
    else if (type === "warning") toast.warning(msg);
    else toast.success(msg);
  }
  return <ToastContext.Provider value={{ showToast }}>{children}</ToastContext.Provider>;
}

export function useToast() { return useContext(ToastContext); }
