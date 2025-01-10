import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Settings,
  Chrome,
  Zap,
  LogOut,
} from "lucide-react";
import { Job } from "../../../types";
import { JobList } from "./JobList";
import styxLogo from "../../../assets/styx_name_logo.png";
import { User } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

interface JobSectionProps {
  jobs: Job[];
  isLoading: boolean;
  onJobSelect: (job: Job) => void;
  onCreateClick: () => void;
  onJobDelete: (jobId: string) => Promise<void>;
  selectedJobId?: string;
  renderAvatar: () => React.ReactNode;
  user: User | null;
  onLogout: () => Promise<void>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const JobSection: React.FC<JobSectionProps> = ({
  jobs,
  isLoading,
  onJobSelect,
  onCreateClick,
  onJobDelete,
  selectedJobId,
  renderAvatar,
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredJobs = jobs.filter(
    (job) =>
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`h-full flex flex-col ${isCollapsed ? "overflow-hidden" : ""}`}
    >
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 bg-white px-4 py-3 z-10 shadow-sm">
          {/* Top section with all components in one row */}
          <div className="flex items-center">
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

            {/* Other buttons with fade transition */}
            <div
              className={`
              flex items-center ml-auto
              transition-all duration-300 ease-in-out
              ${
                isCollapsed
                  ? "opacity-0 -translate-x-4"
                  : "opacity-100 translate-x-0"
              }
            `}
            >
              {/* Add Job Button */}
              <button
                onClick={onCreateClick}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full flex-shrink-0"
                title="Create New Job"
              >
                <Plus size={20} />
              </button>

              {/* Search Button with Popup */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-full flex-shrink-0 mx-2"
                  title="Search Jobs"
                >
                  <Search size={20} />
                </button>

                {/* Search Popup */}
                {isSearchOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[calc(100vw-300px)] max-w-[300px] bg-white rounded-lg shadow-lg border border-gray-200 animate-fadeIn">
                    <div className="p-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search jobs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

        {/* Job list */}
        {!isCollapsed && (
          <div
            className={`flex-1 ${
              isCollapsed ? "overflow-hidden" : "overflow-y-auto"
            }`}
          >
            <JobList
              jobs={filteredJobs}
              onJobSelect={onJobSelect}
              onDeleteJob={onJobDelete}
              selectedJobId={selectedJobId}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Profile section with fade transition */}
      <div
        className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "opacity-0 h-0" : "opacity-100"}
      `}
      >
        <div className="border-t border-gray-200">
          <div className="relative group p-4">
            <div className="flex items-center gap-2">
              {renderAvatar()}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.displayName || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            {/* Dropdown Menu */}
            <div className="absolute left-4 right-4 bottom-full mb-2 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
              <div className="py-1 divide-y divide-gray-100">
                {/* User Info */}
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.displayName || user?.email?.split("@")[0]}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {/* <Link
                    to="/automation"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Zap className="w-4 h-4" />
                    Automation
                  </Link> */}
                  <a
                    href="https://chromewebstore.google.com/detail/styx-linkedin-profile-eva/aoehfbedlmpcinddkobkgaddmifnenjl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Chrome className="w-4 h-4" />
                    Chrome Extension
                  </a>
                  {/* <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link> */}
                </div>

                {/* Logout */}
                <div className="py-1">
                  <button
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
