import { createContext, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

  // showToast function to handle different variants with default icons
  const showToast = (message, variant = 'default') => {
    const toastOptions = {
      autoClose: 3000, 
    };

    // Show the toast using react-toastify's built-in icons by setting the type
    if (variant === 'success') {
      toast.success(message, toastOptions); 
    } else if (variant === 'destructive') {
      toast.error(message, toastOptions); 
    } else {
      toast(message, toastOptions); 
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer 
        position="bottom-right" 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </ToastContext.Provider>
  );
};

// Hook to use toast in components
export const useToast = () => {
  return useContext(ToastContext);
};
