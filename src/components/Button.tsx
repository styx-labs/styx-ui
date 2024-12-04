import React from 'react';
import { Loader } from 'lucide-react';

interface ButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ loading, disabled, children, type = 'button' }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                transition-colors duration-200 font-medium shadow-sm"
    >
      {loading ? (
        <>
          <Loader className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}