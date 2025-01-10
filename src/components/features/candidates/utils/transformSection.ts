import { Section, TraitEvaluation, TraitType } from "../../../../types";

export const transformSection = (section: Section): TraitEvaluation => {
  // Default to SCORE type if not specified
  const trait_type = (section.trait_type as TraitType) || "TraitType.SCORE";

  return {
    section: section.section,
    content: section.content,
    trait_type,
    value:
      trait_type === TraitType.SCORE
        ? section.score || 0
        : section.value || section.score || 0,
    normalized_score: section.score || 0,
    required: section.required || false,
    value_type: section.value_type,
  };
};
