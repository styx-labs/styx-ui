import type * as React from "react";
import type { User } from "firebase/auth";
import { Chrome, CreditCard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SearchCredits } from "./SearchCredits";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface UserNavProps {
  user: User | null;
  onLogout: () => Promise<void>;
  renderAvatar: () => React.ReactNode;
}

export function UserNav({ user, onLogout, renderAvatar }: UserNavProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "h-auto w-full gap-2 px-2 py-1.5 justify-center",
            isCollapsed && "justify-center px-0"
          )}
        >
          {renderAvatar()}
          {!isCollapsed && (
            <>
              <div className="flex flex-1 flex-col items-start gap-1">
                <p className="text-sm font-medium leading-none">
                  {user?.displayName || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-muted-foreground truncate w-full">
                  {user?.email}
                </p>
              </div>
              <SearchCredits variant="compact" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] sm:w-60"
        align="end"
        side={isCollapsed ? "right" : "bottom"}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.displayName || user?.email?.split("@")[0]}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <SearchCredits />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a
            href="https://chromewebstore.google.com/detail/styx-linkedin-profile-eva/aoehfbedlmpcinddkobkgaddmifnenjl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Chrome className="mr-2 h-4 w-4" />
            Chrome Extension
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/pricing")}>
          <CreditCard className="mr-2 h-4 w-4" />
          Pricing & Credits
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
