
import React from 'react';
import { ToastMessage } from '../../types';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const baseClasses = "flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800";
  
  const icons = {
    success: <CheckCircleIcon />,
    error: <ExclamationCircleIcon />,
    info: <InformationCircleIcon />,
  };
  
  const colors = {
    success: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400',
    info: 'text-blue-500 dark:text-blue-400',
  };

  return (
    <div className={baseClasses} role="alert">
      <div className={`p-2 rounded-lg ${colors[type]}`}>
        {icons[type]}
      </div>
      <div className="pl-4 text-sm font-normal">{message}</div>
    </div>
  );
};


interface ToastContainerProps {
  toasts: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </div>
  );
};


const CheckCircleIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>;
const ExclamationCircleIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>;
const InformationCircleIcon = () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>;

export default ToastContainer;