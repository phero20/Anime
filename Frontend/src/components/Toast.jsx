import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaInfoCircle, FaTimes } from 'react-icons/fa';

// Toast Message Component with the correct design and a functional close button
const ToastMessage = ({ t, title, message, description, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle size={22} className="text-[#f47521]" />;
      case 'error':
        return <FaExclamationTriangle size={22} className="text-red-500" />;
      case 'loading':
        return <FaSpinner size={22} className="animate-spin text-gray-400" />;
      case 'info':
        return <FaInfoCircle size={22} className="text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-[#f47521]';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`flex items-start w-full max-w-sm p-4 bg-gray-900 border-l-4 rounded-r-lg shadow-lg font-['Crunchyroll_Atyp',_sans-serif] ${getBorderColor()}`}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="ml-4 flex-1">
        {title && <h4 className="font-semibold text-sm text-white">{title}</h4>}
        <p className="text-sm text-gray-300 leading-snug">{message}</p>
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => toast.dismiss(t.id)} // Logic to close the toast
        className="ml-2 -mr-1 p-1 rounded-full text-gray-500 hover:bg-gray-700 hover:text-white transition-colors"
      >
        <FaTimes size={14} />
      </button>
    </motion.div>
  );
};

// Custom toast wrapper
export const showToast = {
  success: (message, options = {}) => {
    return toast.custom(
      (t) => ( // Pass 't' so the component can dismiss itself
        <ToastMessage t={t} type="success" title={options.title || 'Success'} message={message} description={options.description} />
      ), { duration: 4000 }
    );
  },
  error: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <ToastMessage t={t} type="error" title={options.title || 'Error'} message={message} description={options.description} />
      ), { duration: 4000 }
    );
  },
  loading: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <ToastMessage t={t} type="loading" title={options.title || 'Loading...'} message={message} description={options.description} />
      ), { duration: Infinity }
    );
  },
  info: (message, options = {}) => {
    return toast.custom(
      (t) => (
        <ToastMessage t={t} type="info" title={options.title || 'Info'} message={message} description={options.description} />
      ), { duration: 3000 }
    );
  },
  dismiss: toast.dismiss
};

// Toast container
export const ToastContainer = () => {
  return <Toaster position="bottom-right" gutter={16} />;
};

// Hook for easy usage
export const useToast = () => {
  return {
    success: showToast.success,
    error: showToast.error,
    loading: showToast.loading,
    info: showToast.info,
    dismiss: showToast.dismiss
  };
};

export default ToastContainer;