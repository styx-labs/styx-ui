import React, { useState } from "react";
import {
  Upload,
  UserPlus,
  RefreshCw,
  Search,
  Edit2,
  Star,
  ChevronDown,
} from "lucide-react";
import { Candidate, Job } from "@/types/index";
import { CandidateList } from "./CandidateList";
import { CandidateForm } from "./CandidateForm";
import { toast } from "react-hot-toast";
import Papa from "papaparse";
import { EditKeyTraits } from "./components/EditKeyTraits";
import { CandidateTraitFilter } from "./components/CandidateTraitFilter";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [isUploading, setIsUploading] = useState(false);
  const [searchMode, setSearchMode] = useState(true);
  const [showEditTraits, setShowEditTraits] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"processing" | "complete">(
    "complete"
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredCandidates = candidates.filter(
    (candidate) => candidate.status === statusFilter
  );

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
        <div className="p-6">
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
                <Edit2 className="h-4 w-4" />
                Edit Traits
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
                    {trait.description && (
                      <div className="absolute left-0 w-80 p-3 rounded-md border bg-white shadow-md mt-2 invisible group-hover:visible z-10">
                        <p className="text-sm text-muted-foreground">
                          {trait.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Actions Bar */}
      <Card className="p-4 border-purple-100">
        <div className="flex items-center gap-3 flex-wrap">
          <CandidateTraitFilter
            job={job}
            onFilterChange={onTraitFilterChange}
          />

          <Separator orientation="vertical" className="h-8" />

          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchMode(!searchMode)}
                className={cn(
                  "gap-2",
                  searchMode && "bg-purple-50 text-purple-700 border-purple-200"
                )}
              >
                <Search className="h-4 w-4" />
                {searchMode ? "Detailed Search" : "Quick Search"}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-64">
              Detailed searches on candidates take longer
            </TooltipContent>
          </Tooltip>

          <Button variant="default" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Candidate
          </Button>

          <CandidateForm
            onSubmit={(name, context, url) =>
              onCandidateCreate(name, context, url, searchMode)
            }
          />

          <div className="flex items-center gap-2">
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
                    toast.success(
                      `Found ${urls.length} LinkedIn URLs to process`
                    );
                  } catch (error) {
                    console.error("Error processing CSV:", error);
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "Failed to process CSV file"
                    );
                  } finally {
                    setIsUploading(false);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }
                }
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload CSV"}
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
          </div>

          <Separator orientation="vertical" className="h-8" />

          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter("complete")}
              className={cn(
                "rounded",
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
                "rounded",
                statusFilter === "processing" && "bg-white shadow-sm"
              )}
            >
              Processing
            </Button>
          </div>
        </div>
      </Card>

      {/* Candidates List */}
      {isLoading ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[200px]">Current Position</TableHead>
                <TableHead className="text-center">AI Evaluation</TableHead>
                <TableHead className="text-center">Traits Met</TableHead>
                <TableHead>Trait Breakdown</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
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
                      <Skeleton className="h-8 w-[60px]" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card>
          <CandidateList
            candidates={filteredCandidates}
            onDelete={async (id) => onCandidateDelete(id)}
            onReachout={onCandidateReachout}
            onGetEmail={onGetEmail}
          />
        </Card>
      )}

      {showEditTraits && (
        <EditKeyTraits
          job={job}
          onClose={() => setShowEditTraits(false)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};
