import React from 'react';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Talent Evaluator
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Powered by advanced AI for accurate candidate assessment
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}