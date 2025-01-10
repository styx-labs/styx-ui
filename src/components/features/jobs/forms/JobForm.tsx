import React, { useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { JobTraitsForm } from "./JobTraitsForm";
import { apiService } from "../../../../api";
import { toast } from "react-hot-toast";
import { TraitType } from "../../../../types";

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
  const [showTraitsEditor, setShowTraitsEditor] = useState(false);

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
                    trait_type: TraitType.CATEGORICAL,
                    required: false,
                  };
                }
                return {
                  ...trait,
                  trait_type: trait.trait_type || TraitType.CATEGORICAL,
                  required: trait.required ?? false,
                };
              }
            )
          : response.data.key_traits;
        setSuggestedTraits(formattedTraits);
        setJobTitle(response.data.job_title);
        setCompanyName(response.data.company_name);
        setShowTraitsEditor(true);
      } catch (error) {
        toast.error("Failed to get key traits");
        console.error("Error getting key traits:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTraitsConfirm = (
    traits: KeyTrait[],
    title: string,
    company: string
  ) => {
    onSubmit(description, traits, title, company);
  };

  if (showTraitsEditor) {
    return (
      <JobTraitsForm
        suggestedTraits={suggestedTraits}
        jobTitle={jobTitle}
        companyName={companyName}
        onConfirm={handleTraitsConfirm}
        onCancel={() => setShowTraitsEditor(false)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
        <p className="mt-2 text-gray-600">
          Start by pasting your job description, and we'll help you identify key
          traits
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleInitialSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste your job description here..."
                  rows={12}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!description.trim() || isSubmitting}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                  !description.trim() || isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-800">
          <p className="font-medium mb-2">💡 Pro Tips:</p>
          <ul className="list-disc list-inside space-y-1 text-purple-700">
            <li>Include detailed requirements and qualifications</li>
            <li>Specify any must-have skills or experience</li>
            <li>Add information about the role's responsibilities</li>
            <li>Mention preferred technologies or tools</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
