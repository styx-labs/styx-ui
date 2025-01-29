import * as React from "react";
import type { User } from "firebase/auth";
import { Plus, Search, X } from "lucide-react";
import type { Job } from "@/types/index";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserNav } from "./UserNav";
import styxLogo from "@/assets/styx_name_logo_transparent.png";
import styxIcon from "@/assets/styx.svg";
import { JobList } from "./JobList";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Add the keyframe animation
const tooltipAnimation = `
@keyframes sideToSide {
  0% { transform: translateX(0px); }
  50% { transform: translateX(20px); }
  100% { transform: translateX(0px); }
}

.tooltip-animate {
  animation: sideToSide 1s ease-in-out infinite;
}
` as const;

// Add the style element
const StyleSheet = () => (
  <style>{tooltipAnimation}</style>
);

interface SidebarProps {
  jobs: Job[];
  isLoading: boolean;
  onJobSelect: (job: Job) => void;
  onCreateClick: () => void;
  onJobDelete: (jobId: string) => void;
  selectedJobId?: string;
  renderAvatar: () => React.ReactNode;
  user: User | null;
  onLogout: () => Promise<void>;
}

export function AppSidebar({
  jobs,
  isLoading,
  onJobSelect,
  onCreateClick,
  onJobDelete,
  selectedJobId,
  renderAvatar,
  user,
  onLogout,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const { state, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  const showTooltip = !isLoading && jobs.length === 0 && location.pathname === "/";

  const filteredJobs = React.useMemo(
    () =>
      jobs.filter(
        (job) =>
          job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [jobs, searchQuery]
  );

  return (
    <Sidebar collapsible="icon">
      <StyleSheet />
      <SidebarHeader className={cn("border-b", !isCollapsed && "p-4")}>
        <div
          className={cn(
            "flex items-center justify-between",
            isCollapsed && "flex-col gap-2"
          )}
        >
          {!isCollapsed ? (
            <img
              src={styxLogo || "/styx_name_logo_transparent.png"}
              alt="Styx"
              className="h-8 cursor-pointer"
              onClick={() => navigate("/")}
            />
          ) : (
            <img
              src={styxIcon || "/styx.svg"}
              alt="Styx"
              className="h-8 w-8 cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}
          <SidebarTrigger className="h-8 w-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className={cn("border-b", !isCollapsed && "p-4")}>
          <div className="flex flex-col gap-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip open={showTooltip}>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className={cn(
                      "w-full transition-colors flex items-center",
                      isCollapsed
                        ? "justify-center h-8 w-8 p-0"
                        : "justify-center h-8"
                    )}
                    onClick={onCreateClick}
                  >
                    <Plus className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                    {!isCollapsed && "Add Job"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className={cn(
                    "bg-white/80 backdrop-blur-sm text-slate-900 px-4 py-3 text-lg font-medium border-2 border-slate-300 shadow-[0_0_15px_rgba(147,51,234,0.3)] z-10",
                    showTooltip && "tooltip-animate"
                  )}
                >
                  <p>Start by creating your first job!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              className={cn(
                "w-full transition-colors flex items-center",
                isCollapsed
                  ? "justify-center h-8 w-8 p-0 hover:bg-muted/50"
                  : "justify-center h-8 hover:bg-muted/50"
              )}
              onClick={() => {
                if (isCollapsed) {
                  setOpen(true);
                }
                setIsSearching(!isSearching);
              }}
            >
              <Search className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && "Search"}
            </Button>
          </div>

          <div
            className={cn(
              "overflow-hidden transition-all duration-200 ease-in-out",
              isSearching && !isCollapsed ? "mt-2 h-[36px]" : "h-0"
            )}
          >
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearching(false);
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
        </SidebarGroup>

        <ScrollArea className="flex-1">
          <JobList
            jobs={filteredJobs}
            selectedJobId={selectedJobId}
            onJobSelect={onJobSelect}
            onDeleteJob={onJobDelete}
            isLoading={isLoading}
            isCollapsed={isCollapsed}
          />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <UserNav user={user} onLogout={onLogout} renderAvatar={renderAvatar} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
