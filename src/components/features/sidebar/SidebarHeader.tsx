import React, { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styxLogo from "../../../assets/styx_name_logo.png";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCreateClick: () => void;
  onSearch: (query: string) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onCreateClick,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleSearchClose = () => {
    setIsSearching(false);
    setSearchQuery("");
    onSearch("");
  };

  return (
    <>
      <div className="sticky top-0 bg-white z-10">
        {/* Header */}
        <div className="px-4 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Logo/Expand Button */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => isCollapsed && onToggleCollapse()}
            >
              <div className="relative w-[120px] h-8">
                <div
                  className={`
                  absolute left-0 top-0
                  transition-all duration-300 ease-in-out
                  ${
                    isCollapsed
                      ? "opacity-0 -translate-x-4"
                      : "opacity-100 translate-x-0"
                  }
                `}
                >
                  <img
                    src={styxLogo}
                    alt="Styx"
                    className="h-8 w-auto hover:opacity-80 transition-opacity"
                    onClick={() => navigate("/")}
                  />
                </div>
                <div
                  className={`
                  absolute left-0 top-1
                  transition-all duration-300 ease-in-out
                  ${
                    isCollapsed
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-4"
                  }
                `}
                >
                  <ChevronRight className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`
              flex items-center gap-2 ml-auto
              transition-all duration-300 ease-in-out
              ${
                isCollapsed
                  ? "opacity-0 -translate-x-4"
                  : "opacity-100 translate-x-0"
              }
            `}
            >
              {/* Search Button */}
              <button
                onClick={() => setIsSearching(!isSearching)}
                className={`p-2 rounded-full flex-shrink-0 transition-colors ${
                  isSearching
                    ? "text-purple-600 bg-purple-50 hover:bg-purple-100"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                title="Search Jobs"
              >
                <Search size={20} />
              </button>

              {/* Add Job Button */}
              <button
                onClick={onCreateClick}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full flex-shrink-0"
                title="Create New Job"
              >
                <Plus size={20} />
              </button>

              {/* Collapse Button */}
              <button
                onClick={onToggleCollapse}
                className="p-2 text-gray-500 hover:bg-gray-50 rounded-full flex-shrink-0"
                title="Collapse Sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isSearching ? "h-16 border-b border-gray-200" : "h-0"}
          `}
        >
          <div className="px-4 py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                autoFocus={isSearching}
              />
              {searchQuery && (
                <button
                  onClick={handleSearchClose}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
