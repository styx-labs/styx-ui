import { Candidate } from "@/types";

export const getTraitsMet = (candidate: Candidate) => {
  if (!candidate.sections) return 0;
  return candidate.sections.filter((section) => section.value === true).length;
};

export const getTotalTraits = (candidate: Candidate) => {
  return candidate.sections?.length || 0;
};

export const getRequiredTraitsMet = (candidate: Candidate) => {
  if (!candidate.sections) return 0;
  return candidate.sections.filter(
    (section) => section.value === true && section.required
  ).length;
};

export const getTotalRequiredTraits = (candidate: Candidate) => {
  return candidate.sections?.filter((section) => section.required).length || 0;
};

export const getOptionalTraitsMet = (candidate: Candidate) => {
  if (!candidate.sections) return 0;
  return candidate.sections.filter(
    (section) => section.value === true && !section.required
  ).length;
};

export const getTotalOptionalTraits = (candidate: Candidate) => {
  return candidate.sections?.filter((section) => !section.required).length || 0;
};

export const getFitScoreLabel = (score: number | undefined) => {
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
