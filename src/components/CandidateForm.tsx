import React, { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";

interface CandidateFormProps {
  onSubmit: (name?: string, context?: string, url?: string) => Promise<void>;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      setIsLoading(true);
      try {
        await onSubmit(undefined, undefined, url);
        setUrl("");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="url"
          placeholder="LinkedIn URL"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={14} className="mr-1.5 animate-spin" />
          ) : (
            <UserPlus size={14} className="mr-1.5" />
          )}
          {isLoading ? "Evaluating..." : "Evaluate"}
        </button>
      </form>
    </div>
  );
};
