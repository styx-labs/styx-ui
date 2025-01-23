import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="jobTitle">Job Title</Label>
        <Input
          id="jobTitle"
          type="text"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
          placeholder="e.g. Senior Software Engineer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
          placeholder="e.g. Acme Inc."
        />
      </div>
    </div>
  );
};
