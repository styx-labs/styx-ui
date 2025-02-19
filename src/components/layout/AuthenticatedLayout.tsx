import { ReactNode } from "react";
import { User } from "firebase/auth";
import { AppSidebar } from "../features/sidebar/Sidebar";
import { Job } from "@/types/index";
import { UserAvatar } from "../common/UserAvatar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "../common/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { WelcomePopup } from "../features/welcome/WelcomePopup";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  user: User;
  jobs: Job[];
  isLoading: boolean;
  onJobDelete: (jobId: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function AuthenticatedLayout({
  children,
  user,
  jobs,
  isLoading,
  onJobDelete,
  onLogout,
}: AuthenticatedLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="h-screen">
      <Toaster />
      <WelcomePopup />
      <ErrorBoundary>
        <SidebarProvider>
          <AppSidebar
            jobs={jobs}
            isLoading={isLoading}
            onJobSelect={(job) => navigate(`/jobs/${job.id}`)}
            onCreateClick={() => navigate("/create")}
            onJobDelete={onJobDelete}
            renderAvatar={() => <UserAvatar user={user} />}
            user={user}
            onLogout={onLogout}
          />

          <main className="flex-1 relative bg-gray-50 p-8">{children}</main>
        </SidebarProvider>
      </ErrorBoundary>
    </div>
  );
}
