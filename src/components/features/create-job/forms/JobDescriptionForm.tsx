import React from "react";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ProTips } from "@/components/features/create-job/components/ProTips";
interface JobDescriptionFormProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  description,
  onDescriptionChange,
  onSubmit,
}) => {
  return (
    <>
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Create New Job
        </h1>
        <p className="text-muted-foreground mt-2">
          Start by pasting your job description, and we'll help you identify key
          traits
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold flex items-center">
            <FileText className="mr-2 h-6 w-6 text-purple-500" />
            Job Description
          </h2>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Include detailed requirements, qualifications, responsibilities, and preferred technologies..."
                className="min-h-[250px] text-base"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" size="lg" className="font-semibold">
              Next: Ideal Profiles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardFooter>
        </form>
      </Card>
      <ProTips />
    </>
  );
};
