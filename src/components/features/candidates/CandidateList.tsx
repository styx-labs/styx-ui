import React, { useState, useMemo } from "react";
import type { Candidate } from "@/types/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Check,
  X,
  LinkedinIcon,
  Mail,
  MessageSquarePlus,
  ChevronRight,
  Star,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { CandidateSidebar } from "./components/sidebar/CandidateSidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface CandidateListProps {
  candidates: Candidate[];
  onGetEmail?: (url: string) => Promise<string | undefined>;
  onReachout?: (id: string, format: string) => Promise<string | undefined>;
  onDelete?: (id: string) => Promise<void>;
}

const ProcessingCandidateRow: React.FC<{ candidate: Candidate }> = ({
  candidate,
}) => (
  <TableRow className="cursor-default">
    <TableCell className="font-medium">
      <div className="flex items-center gap-2">
        <span>{candidate.name}</span>
      </div>
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[140px]" />
        <Skeleton className="h-3 w-[100px]" />
      </div>
    </TableCell>
    <TableCell className="text-center">
      <Skeleton className="h-5 w-[100px] mx-auto" />
    </TableCell>
    <TableCell>
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-5 w-[120px]" />
        <Skeleton className="h-5 w-[100px]" />
      </div>
    </TableCell>
    <TableCell>
      <div className="flex gap-1">
        {[...Array(3)].map((_, j) => (
          <Skeleton key={j} className="h-6 w-[80px]" />
        ))}
      </div>
    </TableCell>
    <TableCell>
      <div className="flex items-center justify-end gap-2">
        {[...Array(4)].map((_, j) => (
          <Skeleton key={j} className="h-8 w-8" />
        ))}
      </div>
    </TableCell>
  </TableRow>
);

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onGetEmail,
  onReachout,
  onDelete,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { email: boolean; message: boolean };
  }>({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = useMemo(() => {
    if (!searchQuery.trim()) return candidates;

    const query = searchQuery.toLowerCase();
    return candidates.filter((candidate) => {
      const name = candidate.name?.toLowerCase() || "";
      const occupation = candidate.profile?.occupation?.toLowerCase() || "";
      const company =
        candidate.profile?.experiences?.[0]?.company?.toLowerCase() || "";

      return (
        name.includes(query) ||
        occupation.includes(query) ||
        company.includes(query)
      );
    });
  }, [candidates, searchQuery]);

  const currentIndex = selectedCandidate
    ? filteredCandidates.findIndex((c) => c.id === selectedCandidate.id)
    : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedCandidate(filteredCandidates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredCandidates.length - 1) {
      setSelectedCandidate(filteredCandidates[currentIndex + 1]);
    }
  };

  const getTotalRequiredTraits = (candidate: Candidate) => {
    return (
      candidate.sections?.filter((section) => section.required).length || 0
    );
  };

  const getTotalOptionalTraits = (candidate: Candidate) => {
    return (
      candidate.sections?.filter((section) => !section.required).length || 0
    );
  };

  const getFitScoreLabel = (score: number | undefined) => {
    if (score === undefined)
      return { label: "Unknown", variant: "outline" as const };

    switch (score) {
      case 0:
        return { label: "Not Fit", variant: "destructive" as const };
      case 1:
        return { label: "Likely Not Fit", variant: "outline" as const };
      case 2:
        return { label: "Potential Fit", variant: "secondary" as const };
      case 3:
        return { label: "Good Fit", variant: "default" as const };
      case 4:
        return { label: "Ideal Fit", variant: "secondary" as const };
      default:
        return { label: "Unknown", variant: "outline" as const };
    }
  };

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
        toast.success("Email copied to clipboard");
      } else {
        toast.error("Failed to get email");
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
        toast.success("Reachout copied to clipboard");
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
      toast.success("Candidate deleted successfully");
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(null);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete candidate");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredCandidates.length} candidate
          {filteredCandidates.length !== 1 ? "s" : ""} found
        </div>
        <div className="relative w-[300px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, role, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="w-[200px]">Current Position</TableHead>
              <TableHead className="text-center">
                AI Evaluation (Beta)
              </TableHead>
              <TableHead className="text-center">Traits Met</TableHead>
              <TableHead>Trait Breakdown</TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCandidates.map((candidate) =>
              candidate.status === "processing" ? (
                <ProcessingCandidateRow
                  key={candidate.id}
                  candidate={candidate}
                />
              ) : (
                <TableRow
                  key={candidate.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="flex flex-col truncate">
                      <span className="font-medium truncate">
                        {candidate.profile?.occupation}
                      </span>
                      {candidate.profile?.experiences?.[0]?.company && (
                        <span className="text-sm text-muted-foreground truncate">
                          {candidate.profile.experiences[0].company}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {candidate.sections &&
                      (() => {
                        const { variant, label } = getFitScoreLabel(
                          candidate.fit
                        );

                        return (
                          <Badge
                            variant={variant}
                            className={cn(
                              "font-medium hover:bg-inherit",
                              candidate.fit !== undefined &&
                                candidate.fit >= 3 &&
                                "bg-green-100 text-green-700 hover:bg-green-100",
                              candidate.fit !== undefined &&
                                candidate.fit === 2 &&
                                "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
                              candidate.fit !== undefined &&
                                candidate.fit <= 1 &&
                                "bg-red-100 text-red-700 hover:bg-red-100"
                            )}
                          >
                            {label}
                          </Badge>
                        );
                      })()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Badge
                        variant={
                          candidate.required_met ===
                          getTotalRequiredTraits(candidate)
                            ? "secondary"
                            : "outline"
                        }
                        className="mb-1"
                      >
                        {candidate.required_met}/
                        {getTotalRequiredTraits(candidate)} Required
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        {candidate.optional_met}/
                        {getTotalOptionalTraits(candidate)} Optional
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <TooltipProvider>
                        {candidate.sections?.map((section) => (
                          <Tooltip key={section.section}>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5",
                                  section.value === true
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-red-50 text-red-700 border border-red-200",
                                  section.required ? "shadow-sm" : "opacity-75"
                                )}
                              >
                                {section.value === true ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                                <span className="flex items-center gap-1">
                                  {section.section}
                                  {section.required ? (
                                    <Star className="h-3 w-3 fill-current opacity-75" />
                                  ) : null}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px] bg-zinc-700 text-zinc-50">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-semibold">
                                    {section.section}
                                  </p>
                                </div>
                                <p className="text-sm">{section.content}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              disabled={!candidate.url}
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (candidate.url) {
                                  window.open(candidate.url, "_blank");
                                }
                              }}
                            >
                              <LinkedinIcon className="h-4 w-4 text-[#0A66C2]" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {candidate.url
                              ? "View LinkedIn Profile"
                              : "No LinkedIn URL available"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              disabled={!candidate.url}
                              size="icon"
                              className="h-8 w-8"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (candidate.url) {
                                  await handleEmail(
                                    candidate.url,
                                    candidate.id!
                                  );
                                }
                              }}
                            >
                              {loadingStates[candidate.id!]?.email ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Mail className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {candidate.url
                              ? "Grab Email"
                              : "No LinkedIn URL available"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  disabled={!candidate.id}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {loadingStates[candidate.id!]?.message ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MessageSquarePlus className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                  Choose Message Format
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleReachout(candidate.id!, "linkedin")
                                  }
                                  className="gap-2"
                                >
                                  <LinkedinIcon className="h-4 w-4" />
                                  <span>LinkedIn Message</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleReachout(candidate.id!, "email")
                                  }
                                  className="gap-2"
                                >
                                  <Mail className="h-4 w-4" />
                                  <span>Email Message</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipTrigger>
                          <TooltipContent>
                            Generate Outreach Message
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleDelete(e, candidate.id!)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Candidate</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCandidate(candidate);
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>

      <CandidateSidebar
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onPrevious={handlePrevious}
        onNext={handleNext}
        hasPrevious={currentIndex > 0}
        hasNext={currentIndex < filteredCandidates.length - 1}
        loadingStates={loadingStates}
        onGetEmail={async (url: string, id: string) => {
          await handleEmail(url, id);
        }}
        onReachout={async (id: string, format: string) => {
          await handleReachout(id, format);
        }}
      />
    </div>
  );
};
