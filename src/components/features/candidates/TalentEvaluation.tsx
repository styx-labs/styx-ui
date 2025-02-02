import React, { useState, useMemo } from "react";
import {
  Upload,
  RefreshCw,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  GaugeCircle,
  UserPlus,
  Loader2,
  Download,
} from "lucide-react";
import { Candidate, Job } from "@/types/index";
import { CandidateList } from "./components/list/CandidateList";
import Papa from "papaparse";
import { EditKeyTraits } from "./components/EditKeyTraits";
import { CandidateTraitFilter } from "./components/CandidateTraitFilter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TalentEvaluationProps {
  job: Job;
  candidates: Candidate[];
  isLoading?: boolean;
  onCandidateCreate: (
    name?: string,
    context?: string,
    url?: string,
    searchMode?: boolean
  ) => Promise<void>;
  onCandidateDelete: (candidateId: string) => void;
  onCandidatesBatch: (urls: string[], searchMode?: boolean) => Promise<void>;
  onCandidateReachout: (
    candidateId: string,
    format: string
  ) => Promise<string | undefined>;
  onGetEmail: (linkedinUrl: string) => Promise<string | undefined>;
  onRefresh: () => void;
  onTraitFilterChange: (traits: string[]) => void;
}

const LoadingTable = () => (
  <div className="animate-pulse p-4">
    <div className="h-8 bg-muted rounded-md w-full mb-4" />
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-3 py-4">
        <div className="h-5 bg-muted rounded-md w-full" />
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-4">
            <div className="h-4 bg-muted rounded-md col-span-1" />
            <div className="h-4 bg-muted rounded-md col-span-1" />
            <div className="h-4 bg-muted rounded-md col-span-1" />
            <div className="h-4 bg-muted rounded-md col-span-1" />
            <div className="h-4 bg-muted rounded-md col-span-1" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const TalentEvaluation: React.FC<TalentEvaluationProps> = ({
  job,
  candidates,
  isLoading = false,
  onCandidateCreate,
  onCandidateDelete,
  onCandidatesBatch,
  onCandidateReachout,
  onGetEmail,
  onRefresh,
  onTraitFilterChange,
}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [searchMode, setSearchMode] = useState(true);
  const [showEditTraits, setShowEditTraits] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"processing" | "complete">(
    "complete"
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [url, setUrl] = useState("");
  const [showActionBar, setShowActionBar] = useState(false);
  const [showExportBar, setShowExportBar] = useState(false);
  const [exportMode, setExportMode] = useState<"all" | "limited" | "selected">(
    "all"
  );
  const [exportLimit, setExportLimit] = useState("10");
  const [exportFormat, setExportFormat] = useState("csv");
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedCareerTags, setSelectedCareerTags] = useState<string[]>([]);

  const filteredCandidates = useMemo(() => {
    let filtered = candidates.filter(
      (candidate) => candidate.status === statusFilter
    );

    // Filter by career tags if any are selected
    if (selectedCareerTags.length > 0) {
      filtered = filtered.filter((candidate) => {
        const careerTags = candidate.profile?.career_metrics?.career_tags || [];
        const experienceTags =
          candidate.profile?.career_metrics?.experience_tags || [];
        const allTags = [...careerTags, ...experienceTags];
        return selectedCareerTags.every((tag) => allTags.includes(tag));
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((candidate) => {
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
    }

    return filtered;
  }, [candidates, statusFilter, selectedCareerTags, searchQuery]);

  const handleExport = () => {
    if (exportFormat === "csv") {
      let candidates_to_export = filteredCandidates;

      if (exportMode === "limited") {
        candidates_to_export = filteredCandidates.slice(
          0,
          parseInt(exportLimit)
        );
      } else if (exportMode === "selected") {
        candidates_to_export = filteredCandidates.filter(
          (c) => c.id && selectedCandidates.includes(c.id)
        );
      }

      const csvContent = [
        [
          "name",
          "url",
          "occupation",
          "company",
          "evaluation_score",
          "traits_met",
          "total_traits",
        ],
        ...candidates_to_export.map((candidate) => [
          candidate.name || "",
          candidate.url || "",
          candidate.profile?.occupation || "",
          candidate.profile?.experiences?.[0]?.company || "",
          candidate.evaluation?.score
            ? (candidate.evaluation.score * 100).toFixed(0) + "%"
            : "",
          candidate.evaluation?.traits_met || "0",
          candidate.evaluation?.total_traits || "0",
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `candidates_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Reset selection state when export bar is toggled off
  const handleExportBarToggle = (show: boolean) => {
    setShowExportBar(show);
    if (!show) {
      setExportMode("all");
      setSelectedCandidates([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-white border-purple-100">
        <Collapsible open={showDescription} onOpenChange={setShowDescription}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <h1 className="text-xl font-semibold text-purple-900 truncate">
                  {job.job_title}
                </h1>
                <Separator orientation="vertical" className="h-6" />
                <h1 className="text-xl font-semibold text-purple-600 truncate">
                  {job.company_name}
                </h1>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      showDescription ? "rotate-180" : ""
                    )}
                  />
                  {showDescription ? "Hide Description" : "Show Description"}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground whitespace-pre-line">
                  {job.job_description}
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </Card>

      {/* Key Traits Card */}
      <Card className="border-purple-100">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-purple-900">
                Key Traits
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-purple-200 text-purple-800" />
                  <span>Required</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span>Optional</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditTraits(true)}
                className="gap-2"
              >
                <GaugeCircle className="h-4 w-4" />
                Re-Calibrate Traits
              </Button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t space-y-4">
            <div className="flex flex-wrap gap-2">
              {[...job.key_traits]
                .sort((a, b) => {
                  // Sort by required first, then alphabetically
                  if (a.required !== b.required) {
                    return a.required ? -1 : 1;
                  }
                  return a.trait.localeCompare(b.trait);
                })
                .map((trait, index) => (
                  <div key={index} className="group relative">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help inline-flex">
                            <Badge
                              variant={trait.required ? "default" : "secondary"}
                              className={cn(
                                trait.required
                                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                  : "hover:bg-purple-100",
                                "cursor-help"
                              )}
                            >
                              {trait.trait}
                              {trait.required && (
                                <Star className="h-3 w-3 ml-1 fill-current opacity-75 inline-block" />
                              )}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="max-w-[300px] bg-white text-muted-foreground shadow-md"
                        >
                          <p className="text-sm">{trait.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Action Bar */}
      <Card className="border-purple-100">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <CandidateTraitFilter
              job={job}
              onFilterChange={onTraitFilterChange}
            />

            {/* <CareerTagFilter onFilterChange={setSelectedCareerTags} /> */}

            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowActionBar(!showActionBar)}
              className={cn(
                "gap-2",
                showActionBar &&
                  "bg-purple-100 hover:bg-purple-200 text-purple-700"
              )}
            >
              {showActionBar ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              Manually Add Candidates
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportBarToggle(!showExportBar)}
              className={cn(
                "gap-2",
                showExportBar &&
                  "bg-purple-100 hover:bg-purple-200 text-purple-700"
              )}
            >
              {showExportBar ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export
            </Button>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("complete")}
                className={cn(
                  "rounded hover:bg-purple-100 hover:text-purple-700 transition-colors",
                  statusFilter === "complete" && "bg-white shadow-sm"
                )}
              >
                Completed
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter("processing")}
                className={cn(
                  "rounded hover:bg-purple-100 hover:text-purple-700 transition-colors",
                  statusFilter === "processing" && "bg-white shadow-sm"
                )}
              >
                Processing
              </Button>
            </div>
          </div>
          {statusFilter !== "processing" && (
            <div className="mt-3">
              <span className="text-sm text-muted-foreground">
                {filteredCandidates.length} candidate
                {filteredCandidates.length === 1 ? "" : "s"} found
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Export Settings Bar */}
      {showExportBar && (
        <Card className="p-4 border-purple-100">
          <div className="flex items-center gap-6">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">Export to CSV</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setExportMode("all");
                  setSelectedCandidates([]);
                }}
                className={cn(
                  "rounded hover:bg-purple-100 hover:text-purple-700 transition-colors",
                  exportMode === "all" && "bg-white shadow-sm"
                )}
              >
                Export All
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setExportMode("limited");
                        setSelectedCandidates([]);
                      }}
                      className={cn(
                        "rounded hover:bg-purple-100 hover:text-purple-700 transition-colors",
                        exportMode === "limited" && "bg-white shadow-sm"
                      )}
                    >
                      Export Top #
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-sm">
                      Export the top N candidates from the current list
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExportMode("selected")}
                className={cn(
                  "rounded hover:bg-purple-100 hover:text-purple-700 transition-colors",
                  exportMode === "selected" && "bg-white shadow-sm"
                )}
              >
                Export Selected
              </Button>
            </div>

            {exportMode === "limited" && (
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground mr-2">
                  Export top
                </Label>
                <Input
                  type="number"
                  value={exportLimit}
                  onChange={(e) => setExportLimit(e.target.value)}
                  className="w-24"
                  min="1"
                  max={filteredCandidates.length}
                />
                <span className="text-sm text-muted-foreground">
                  candidates from the list
                </span>
              </div>
            )}

            {exportMode === "selected" && (
              <div className="text-sm text-muted-foreground">
                {selectedCandidates.length} candidate
                {selectedCandidates.length === 1 ? "" : "s"} selected
              </div>
            )}

            <Button
              onClick={handleExport}
              size="sm"
              className="gap-2"
              disabled={
                exportMode === "selected" && selectedCandidates.length === 0
              }
            >
              <Download className="h-4 w-4" />
              Start Export
            </Button>
          </div>
        </Card>
      )}

      {/* Add Candidates Bar - Now conditionally rendered */}
      {showActionBar && (
        <Card className="p-4 border-purple-100">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={searchMode}
                        onCheckedChange={setSearchMode}
                        id="search-mode"
                      />
                      <Label
                        htmlFor="search-mode"
                        className="text-sm cursor-pointer select-none"
                      >
                        Search Mode
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="w-64">
                    When enabled, searches through candidate profiles and their
                    previous jobs for better matches, but takes longer to
                    process
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex gap-3 flex-1 min-w-0 items-center">
                <Input
                  type="url"
                  placeholder="LinkedIn URL"
                  className="flex-1 min-w-0"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button
                  onClick={async () => {
                    setIsEvaluating(true);
                    try {
                      await onCandidateCreate(
                        undefined,
                        undefined,
                        url,
                        searchMode
                      );
                      setUrl("");
                    } finally {
                      setIsEvaluating(false);
                    }
                  }}
                  size="sm"
                  disabled={isEvaluating || !url}
                >
                  {isEvaluating ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <UserPlus size={14} className="mr-1.5" />
                  )}
                  {isEvaluating ? "Evaluating..." : "Evaluate"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2 whitespace-nowrap"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload CSV"}
              </Button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setIsUploading(true);
                  try {
                    interface CsvRow {
                      url: string;
                      [key: string]: string;
                    }

                    const results = await new Promise<CsvRow[]>(
                      (resolve, reject) => {
                        Papa.parse(file, {
                          header: true,
                          skipEmptyLines: true,
                          complete: (results) => {
                            if (!results.meta.fields?.includes("url")) {
                              reject(
                                new Error(
                                  "The CSV file must have a column labeled 'url' containing LinkedIn URLs"
                                )
                              );
                              return;
                            }
                            const rows = results.data as CsvRow[];
                            resolve(rows);
                          },
                          error: (error) => {
                            reject(error);
                          },
                        });
                      }
                    );

                    const urls = results
                      .map((row) => row.url)
                      .filter(
                        (url): url is string =>
                          typeof url === "string" && url.trim() !== ""
                      );

                    if (urls.length === 0) {
                      throw new Error(
                        "No valid LinkedIn URLs found in the 'url' column"
                      );
                    }

                    await onCandidatesBatch(urls, searchMode);
                    toast({
                      title: "Success",
                      description: `Found ${urls.length} LinkedIn URLs to process`,
                    });
                  } catch (error) {
                    console.error("Error processing CSV:", error);
                    toast({
                      title: "Error",
                      description:
                        error instanceof Error
                          ? error.message
                          : "Failed to process CSV file",
                    });
                  } finally {
                    setIsUploading(false);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }
                }
              }}
            />
          </div>
        </Card>
      )}

      {/* Candidates Table */}
      <Card className="border-purple-100">
        {isLoading ? (
          <LoadingTable />
        ) : (
          <CandidateList
            candidates={filteredCandidates}
            onDelete={async (id) => onCandidateDelete(id)}
            onReachout={onCandidateReachout}
            onGetEmail={onGetEmail}
            searchQuery={searchQuery}
            showSelection={showExportBar && exportMode === "selected"}
            selectedCandidates={selectedCandidates}
            onSelectionChange={setSelectedCandidates}
          />
        )}
      </Card>

      {showEditTraits && (
        <EditKeyTraits
          job={job}
          onClose={() => setShowEditTraits(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
};
