import React, { useState } from "react";
import { Send } from "lucide-react";
import { KeyTraitsEditor } from "./KeyTraitsEditor";
import { apiService } from "../api";
import { toast } from "react-hot-toast";
import { TraitType } from "../types";

interface KeyTrait {
  trait: string;
  description: string;
  trait_type: TraitType;
  value_type?: string;
  required: boolean;
}

interface JobFormProps {
  onSubmit: (
    description: string,
    keyTraits: KeyTrait[],
    jobTitle: string,
    companyName: string
  ) => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const [description, setDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedTraits, setSuggestedTraits] = useState<KeyTrait[]>([]);
  const [isEditingTraits, setIsEditingTraits] = useState(false);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await apiService.getKeyTraits(description);
        const formattedTraits = Array.isArray(response.data.key_traits)
          ? response.data.key_traits.map(
              (
                trait:
                  | string
                  | {
                      trait: string;
                      description: string;
                      trait_type?: TraitType;
                      value_type?: string;
                      required?: boolean;
                    }
              ) => {
                if (typeof trait === "string") {
                  return {
                    trait,
                    description: "",
                    trait_type: "CATEGORICAL" as TraitType,
                    required: false,
                  };
                }
                return {
                  ...trait,
                  trait_type: trait.trait_type || ("CATEGORICAL" as TraitType),
                  required: trait.required ?? false,
                };
              }
            )
          : response.data.key_traits;
        setSuggestedTraits(formattedTraits);
        setJobTitle(response.data.job_title);
        setCompanyName(response.data.company_name);
        setIsEditingTraits(true);
      } catch (error) {
        toast.error("Failed to get key traits");
        console.error("Error getting key traits:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTraitsConfirm = async (
    traits: KeyTrait[],
    updatedJobTitle: string,
    updatedCompanyName: string
  ) => {
    setIsSubmitting(true);
    try {
      await onSubmit(description, traits, updatedJobTitle, updatedCompanyName);
      setDescription("");
      setJobTitle("");
      setCompanyName("");
      setIsEditingTraits(false);
      setSuggestedTraits([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditingTraits) {
    return (
      <KeyTraitsEditor
        suggestedTraits={suggestedTraits}
        jobTitle={jobTitle}
        companyName={companyName}
        onConfirm={handleTraitsConfirm}
        onCancel={() => setIsEditingTraits(false)}
      />
    );
  }

  return (
    <form onSubmit={handleInitialSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Job Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2"
          placeholder="Enter job description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !description.trim()}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
          ${
            isSubmitting || !description.trim()
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          }`}
      >
        <Send size={16} className="mr-2" />
        {isSubmitting ? "Processing..." : "Continue"}
      </button>
    </form>
  );
};
