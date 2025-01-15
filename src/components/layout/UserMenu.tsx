import React from "react";
import { Menu } from "@headlessui/react";
import { User, LogOut, CreditCard } from "lucide-react";

interface UserMenuProps {
  onLogout: () => void;
  onOpenPricing: () => void;
  userEmail: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onLogout,
  onOpenPricing,
  userEmail,
}) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-md">
        <User className="w-5 h-5" />
        <span className="text-sm">{userEmail}</span>
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 focus:outline-none">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onOpenPricing}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700`}
              >
                <CreditCard className="w-4 h-4" />
                Pricing & Credits
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onLogout}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700`}
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};
