import React from "react";

interface JobDetailsFormProps {
  jobTitle: string;
  companyName: string;
  onJobTitleChange: (value: string) => void;
  onCompanyNameChange: (value: string) => void;
}

export const JobDetailsForm: React.FC<JobDetailsFormProps> = ({
  jobTitle,
  companyName,
  onJobTitleChange,
  onCompanyNameChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Title
        </label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
    </div>
  );
};
