import React from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextArea({ label, value, onChange, placeholder }: TextAreaProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-500 transition-colors duration-200">
      <label className="block text-lg font-semibold text-gray-900 mb-4">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={20}
        className="w-full rounded-lg border-gray-200 shadow-sm focus:border-blue-500 
                   focus:ring-blue-500 resize-none transition-colors duration-200"
        placeholder={placeholder}
      />
    </div>
  );
}