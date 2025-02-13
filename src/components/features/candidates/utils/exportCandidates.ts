import type { Candidate } from "@/types/index";
import * as XLSX from "xlsx";
import { getFitScoreLabel } from "./traitHelpers";

export const exportCandidates = (
  candidates: Candidate[],
  format: "csv" | "xlsx" = "csv"
) => {
  const headers = [
    "name",
    "url",
    "occupation",
    "company",
    "summary",
    "fit",
    "required_met",
    "optional_met",
  ];

  const data = candidates.map((candidate) => [
    candidate.name || "",
    candidate.url || "",
    candidate.profile?.occupation || "",
    candidate.profile?.experiences?.[0]?.company || "",
    candidate.summary || "",
    getFitScoreLabel(candidate.fit).label || "Unknown",
    candidate.required_met || "0",
    candidate.optional_met || "0",
  ]);

  if (format === "csv") {
    const escapeCsvField = (field: string | number) => {
      const fieldStr = String(field);
      if (fieldStr.includes(",") || fieldStr.includes('"')) {
        return `"${fieldStr.replace(/"/g, '""')}"`;
      }
      return fieldStr;
    };

    const csvContent = [headers, ...data]
      .map((row) => row.map(escapeCsvField).join(","))
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
  } else if (format === "xlsx") {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

    const xlsxBlob = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsxBlob], { type: "application/octet-stream" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `candidates_export_${new Date().toISOString().split("T")[0]}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
