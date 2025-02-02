import { Trash2 } from "lucide-react";
import type { Job } from "@/types/index";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JobListProps {
  jobs: Job[];
  selectedJobId?: string;
  onJobSelect: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
  isLoading?: boolean;
  isCollapsed?: boolean;
}

function JobSkeleton() {
  return (
    <div className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function JobList({
  jobs,
  selectedJobId,
  onJobSelect,
  onDeleteJob,
  isLoading = false,
  isCollapsed = false,
}: JobListProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-border">
        {Array.from({ length: 3 }).map((_, i) => (
          <JobSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return isCollapsed ? null : (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No jobs found
      </div>
    );
  }

  const content = (
    <SidebarMenu className="max-w-[255px]">
      <div className="divide-y divide-border">
        {jobs.map((job) => (
          <SidebarMenuItem
            key={job.id}
            className="group/item px-2 py-3 first:pt-4 last:pb-4 hover:bg-muted/50"
          >
            {isCollapsed ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      onClick={() => onJobSelect(job)}
                      isActive={selectedJobId === job.id}
                      className="relative transition-colors hover:bg-transparent"
                    >
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate text-center">
                          {job.company_name.charAt(0)}
                        </p>
                      </div>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    className="bg-white text-violet-600 shadow-md"
                  >
                    <p className="text-sm font-medium">{job.company_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.job_title}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <SidebarMenuButton
                onClick={() => onJobSelect(job)}
                isActive={selectedJobId === job.id}
                className="relative transition-colors hover:bg-transparent h-10"
              >
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium truncate leading-normal">
                    {job.company_name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate leading-normal">
                    {job.job_title}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteJob(job.id!);
                  }}
                  className="absolute right-2 hidden group-hover/item:block hover:text-destructive hover:bg-transparent"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                  <span className="sr-only">Delete job</span>
                </Button>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </div>
    </SidebarMenu>
  );

  return isCollapsed ? (
    <TooltipProvider delayDuration={0}>{content}</TooltipProvider>
  ) : (
    content
  );
}
