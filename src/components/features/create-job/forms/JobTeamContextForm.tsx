import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface TeamMember {
  role: string;
  name?: string;
  description?: string;
}

interface TeamContext {
  hiring_manager?: TeamMember;
  direct_report?: TeamMember;
  team_members?: TeamMember[];
}

interface JobTeamContextFormProps {
  onSubmit: (context: TeamContext) => void;
  onBack: () => void;
  initialContext?: TeamContext;
}

export const JobTeamContextForm: React.FC<JobTeamContextFormProps> = ({
  onSubmit,
  onBack,
  initialContext,
}) => {
  const [teamContext, setTeamContext] = useState<TeamContext>(
    initialContext || {
      team_members: [],
    }
  );

  const updateHiringManager = (updates: Partial<TeamMember>) => {
    setTeamContext((prev) => ({
      ...prev,
      hiring_manager: {
        ...prev.hiring_manager,
        ...updates,
      },
    }));
  };

  const updateDirectReport = (updates: Partial<TeamMember>) => {
    setTeamContext((prev) => ({
      ...prev,
      direct_report: {
        ...prev.direct_report,
        ...updates,
      },
    }));
  };

  const addTeamMember = () => {
    setTeamContext((prev) => ({
      ...prev,
      team_members: [...(prev.team_members || []), { role: "" }],
    }));
  };

  const updateTeamMember = (index: number, updates: Partial<TeamMember>) => {
    setTeamContext((prev) => ({
      ...prev,
      team_members: prev.team_members?.map((member, i) =>
        i === index ? { ...member, ...updates } : member
      ),
    }));
  };

  const removeTeamMember = (index: number) => {
    setTeamContext((prev) => ({
      ...prev,
      team_members: prev.team_members?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean up empty fields before submitting
    const cleanContext: TeamContext = {};

    if (teamContext.hiring_manager?.role) {
      cleanContext.hiring_manager = {
        role: teamContext.hiring_manager.role,
        ...(teamContext.hiring_manager.name && {
          name: teamContext.hiring_manager.name,
        }),
        ...(teamContext.hiring_manager.description && {
          description: teamContext.hiring_manager.description,
        }),
      };
    }

    if (teamContext.direct_report?.role) {
      cleanContext.direct_report = {
        role: teamContext.direct_report.role,
        ...(teamContext.direct_report.name && {
          name: teamContext.direct_report.name,
        }),
        ...(teamContext.direct_report.description && {
          description: teamContext.direct_report.description,
        }),
      };
    }

    const validTeamMembers = teamContext.team_members?.filter(
      (member) => member.role
    );
    if (validTeamMembers?.length) {
      cleanContext.team_members = validTeamMembers.map((member) => ({
        role: member.role,
        ...(member.name && { name: member.name }),
        ...(member.description && { description: member.description }),
      }));
    }

    onSubmit(cleanContext);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Team Context (Optional)
        </h1>
        <p className="text-muted-foreground mt-2">
          Add information about the team this role will be working with. This
          helps us better understand the role and provide more relevant
          candidates.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Hiring Manager Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Hiring Manager</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Role/Title</Label>
                <Input
                  placeholder="e.g., Engineering Director"
                  value={teamContext.hiring_manager?.role || ""}
                  onChange={(e) =>
                    updateHiringManager({ role: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Name (Optional)</Label>
                <Input
                  placeholder="e.g., Jane Smith"
                  value={teamContext.hiring_manager?.name || ""}
                  onChange={(e) =>
                    updateHiringManager({ name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Add any relevant information about the hiring manager..."
                  value={teamContext.hiring_manager?.description || ""}
                  onChange={(e) =>
                    updateHiringManager({ description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Direct Report Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Direct Report To</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Role/Title</Label>
                <Input
                  placeholder="e.g., VP of Engineering"
                  value={teamContext.direct_report?.role || ""}
                  onChange={(e) => updateDirectReport({ role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Name (Optional)</Label>
                <Input
                  placeholder="e.g., John Doe"
                  value={teamContext.direct_report?.name || ""}
                  onChange={(e) => updateDirectReport({ name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Add any relevant information about who they'll report to..."
                  value={teamContext.direct_report?.description || ""}
                  onChange={(e) =>
                    updateDirectReport({ description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Members Section */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Key Team Members</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {teamContext.team_members?.map((member, index) => (
                <div key={index} className="space-y-4 pt-4 first:pt-0">
                  {index > 0 && <div className="border-t -mt-4" />}
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-medium">
                      Team Member {index + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Role/Title</Label>
                      <Input
                        placeholder="e.g., Senior Software Engineer"
                        value={member.role}
                        onChange={(e) =>
                          updateTeamMember(index, { role: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Name (Optional)</Label>
                      <Input
                        placeholder="e.g., Alice Johnson"
                        value={member.name || ""}
                        onChange={(e) =>
                          updateTeamMember(index, { name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        placeholder="Add any relevant information about this team member..."
                        value={member.description || ""}
                        onChange={(e) =>
                          updateTeamMember(index, {
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addTeamMember}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </CardContent>
          </Card>
        </div>

        <CardFooter className="flex justify-between border-t pt-6 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="submit" className="flex items-center">
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </div>
  );
};
