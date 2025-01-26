import React from "react";
import { Mail, Trash2, Linkedin, Loader2, Sparkles } from "lucide-react";
import { createPortal } from "react-dom";
import { Citation } from "../../../../types";
import { OverallScore } from "./OverallScore";

interface CandidateHeaderProps {
  id: string;
  name: string;
  status: string;
  url?: string;
  overall_score?: number;
  citations?: Citation[];
  search_mode?: boolean;
  required_met: number;
  optional_met: number;
  openDropdownId: string | null;
  dropdownPosition: { top: number; left: number } | null;
  onDelete: (id: string) => void;
  onGetEmail: (url: string) => Promise<void>;
  onReachout: (id: string, format: string) => Promise<void>;
  onSparklesClick: (e: React.MouseEvent, id: string) => void;
}

export const CandidateHeader: React.FC<CandidateHeaderProps> = ({
  id,
  name,
  status,
  url,
  citations,
  search_mode,
  required_met,
  optional_met,
  openDropdownId,
  dropdownPosition,
  onDelete,
  onGetEmail,
  onReachout,
  onSparklesClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          {name}
          {status === "processing" && (
            <Loader2 size={16} className="animate-spin text-purple-600" />
          )}
        </h2>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-sm font-medium rounded bg-purple-100 text-purple-800">
            {required_met} required
          </span>
          <span className="px-2 py-0.5 text-sm font-medium rounded bg-blue-100 text-blue-800">
            {optional_met} preferred
          </span>
        </div>
        <OverallScore citations={citations} search_mode={search_mode} />
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#0A66C2] hover:bg-blue-50 rounded-md"
            title="View LinkedIn Profile"
          >
            <Linkedin size={18} />
          </a>
        )}
        {url && (
          <button
            onClick={() => onGetEmail(url)}
            className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-md"
          >
            <Mail size={18} />
          </button>
        )}
        <div className="relative">
          <button
            onClick={(e) => onSparklesClick(e, id)}
            className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-md"
          >
            <Sparkles size={18} />
          </button>

          {openDropdownId === id &&
            dropdownPosition &&
            createPortal(
              <div
                className="absolute z-50 w-64 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                }}
              >
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Choose Generated Message Format
                  </div>
                  <button
                    onClick={() => onReachout(id, "linkedin")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </button>
                  <button
                    onClick={() => onReachout(id, "email")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                  >
                    <Mail size={16} /> Email
                  </button>
                </div>
              </div>,
              document.body
            )}
        </div>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
