import { TraitEvaluation, TraitType } from "../../../../types";

export const transformSection = (section: TraitEvaluation): TraitEvaluation => {
  // Convert trait_type to uppercase and ensure it matches the enum
  let trait_type: TraitType;
  if (!section.trait_type) {
    trait_type = TraitType.BOOLEAN;
  } else {
    trait_type =
      section.trait_type === "TraitType.SCORE"
        ? TraitType.SCORE
        : TraitType.BOOLEAN;
  }

  return {
    section: section.section,
    content: section.content,
    trait_type,
    value:
      trait_type === TraitType.SCORE
        ? section.normalized_score || 0
        : section.value || section.normalized_score || 0,
    normalized_score: section.normalized_score || 0,
    required: section.required || false,
    value_type: section.value_type,
  };
};
