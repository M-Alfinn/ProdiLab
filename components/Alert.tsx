import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const bgColors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    info: <Info size={20} className="text-blue-500" />
  };

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border ${bgColors[type]} min-w-[320px] max-w-lg animate-fade-in-down`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 font-medium text-sm">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition">
        <X size={16} />
      </button>
    </div>
  );
};