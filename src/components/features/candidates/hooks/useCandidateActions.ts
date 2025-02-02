import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LoadingStates {
  [key: string]: { email: boolean; message: boolean };
}

interface UseCandidateActionsProps {
  onGetEmail?: (url: string) => Promise<string | undefined>;
  onReachout?: (id: string, format: string) => Promise<string | undefined>;
  onDelete?: (id: string) => Promise<void>;
}

export const useCandidateActions = ({
  onGetEmail,
  onReachout,
  onDelete,
}: UseCandidateActionsProps) => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});
  const { toast } = useToast(); 
  const handleEmail = async (url: string, candidateId: string) => {
    if (!onGetEmail) return;
    setLoadingStates((prev) => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], email: true },
    }));
    try {
      const email = await onGetEmail(url);
      if (email) {
        await navigator.clipboard.writeText(email);
        toast({
          title: "Email copied to clipboard",
        });
      } else {
        toast({
          title: "Failed to get email",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Failed to get email",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to get email",
          variant: "destructive",
        });
      }
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [candidateId]: { ...prev[candidateId], email: false },
      }));
    }
  };

  const handleReachout = async (candidateId: string, format: string) => {
    if (!onReachout) return;
    setLoadingStates((prev) => ({
      ...prev,
      [candidateId]: { ...prev[candidateId], message: true },
    }));
    try {
      const message = await onReachout(candidateId, format);
      if (message !== undefined) {
        await navigator.clipboard.writeText(message);
        toast({
          title: "Reachout copied to clipboard",
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Failed to generate message",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to generate message",
          variant: "destructive",
        });
      }
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [candidateId]: { ...prev[candidateId], message: false },
      }));
    }
  };

  const handleDelete = async (e: React.MouseEvent, candidateId: string) => {
    e.stopPropagation();
    if (!onDelete) return;
    try {
      await onDelete(candidateId);
      toast({
        title: "Candidate deleted successfully",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Failed to delete candidate",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to delete candidate",
          variant: "destructive",
        });
      }
    }
  };

  return {
    loadingStates,
    handleEmail,
    handleReachout,
    handleDelete,
  };
};
