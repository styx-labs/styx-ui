import React from "react";
import { Chrome, LogOut, Search, CreditCard } from "lucide-react";
import { User } from "firebase/auth";
import { useSearchCredits } from "../../../hooks/useSearchCredits";

interface ProfileMenuProps {
  user: User | null;
  onLogout: () => Promise<void>;
  renderAvatar: () => React.ReactNode;
  isCollapsed: boolean;
  onOpenPricing: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  onLogout,
  renderAvatar,
  isCollapsed,
  onOpenPricing,
}) => {
  const { searchCredits, loading } = useSearchCredits();

  return (
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
              <div className="flex items-center gap-1">
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                {!loading && searchCredits !== null && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={onOpenPricing}
                      className="p-0.5 text-purple-600 hover:bg-purple-50 rounded"
                      title="Add Search Credits"
                    >
                      <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                        <Search className="w-3 h-3" />
                        <span>{searchCredits}</span>
                      </div>{" "}
                    </button>
                  </div>
                )}
              </div>
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
                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                {!loading && searchCredits !== null && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-purple-600">
                    <Search className="w-4 h-4" />
                    <span>{searchCredits} remaining search credits</span>
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <a
                  href="https://chromewebstore.google.com/detail/styx-linkedin-profile-eva/aoehfbedlmpcinddkobkgaddmifnenjl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Chrome className="w-4 h-4" />
                  Chrome Extension
                </a>
              </div>

              {/* Pricing */}
              <div className="py-1">
                <button
                  onClick={onOpenPricing}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <CreditCard className="w-4 h-4" />
                  Pricing & Credits
                </button>
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
  );
};
