import React from 'react';
import { WifiOff } from 'lucide-react';

export const ConnectionError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="rounded-lg bg-white p-6 text-center shadow-lg">
    <WifiOff className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-4 text-lg font-medium text-gray-900">Connection Error</h3>
    <p className="mt-2 text-sm text-gray-500">
      Unable to connect to the server. Please check if the backend is running on http://127.0.0.1:8000
    </p>
    <button
      onClick={onRetry}
      className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Try Again
    </button>
  </div>
);