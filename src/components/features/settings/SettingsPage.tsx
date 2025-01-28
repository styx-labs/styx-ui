import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { apiService } from "@/api";

export function SettingsPage() {
  const { toast } = useToast();
  const [emailTemplate, setEmailTemplate] = React.useState("");
  const [linkedinTemplate, setLinkedinTemplate] = React.useState("");
  const [customInstructions, setCustomInstructions] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  // Load templates and instructions on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [templatesResponse, instructionsResponse] = await Promise.all([
          apiService.getTemplates(),
          apiService.getEvaluationInstructions(),
        ]);

        setEmailTemplate(templatesResponse.data.email_template || "");
        setLinkedinTemplate(templatesResponse.data.linkedin_template || "");
        setCustomInstructions(
          instructionsResponse.data.evaluation_instructions || ""
        );
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Error loading settings",
          description: "Failed to load your settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save templates and instructions in parallel
      await Promise.all([
        apiService.updateTemplates({
          email_template: emailTemplate,
          linkedin_template: linkedinTemplate,
        }),
        apiService.updateEvaluationInstructions({
          evaluation_instructions: customInstructions,
        }),
      ]);

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "Failed to save your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const TemplatesSkeleton = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[200px] w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </div>
  );

  const PreferencesSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-[200px] w-full" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your preferences and templates
          </p>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList>
            <TabsTrigger value="templates">Message Templates</TabsTrigger>
            <TabsTrigger value="preferences">AI Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <Card className="p-6">
              {loading ? (
                <TemplatesSkeleton />
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-purple-800 mb-1">
                        Message Templates
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Customize your default templates for candidate outreach.
                        These templates will be used as prompts for the AI to
                        generate personalized messages.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="emailTemplate">
                          Email Template Prompt
                        </Label>
                        <Textarea
                          id="emailTemplate"
                          placeholder="Enter your email template prompt..."
                          value={emailTemplate}
                          onChange={(e) => setEmailTemplate(e.target.value)}
                          className="min-h-[200px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          Write a prompt that guides the AI in generating email
                          messages. You can also provide previous examples of
                          emails you've sent to candidates.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedinTemplate">
                          LinkedIn Message Template Prompt
                        </Label>
                        <Textarea
                          id="linkedinTemplate"
                          placeholder="Enter your LinkedIn message template prompt..."
                          value={linkedinTemplate}
                          onChange={(e) => setLinkedinTemplate(e.target.value)}
                          className="min-h-[200px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          Write a prompt that guides the AI in generating
                          LinkedIn messages. You can also provide previous
                          examples of messages you've sent to candidates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="p-6">
              {loading ? (
                <PreferencesSkeleton />
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-purple-800 mb-1">
                      Custom Evaluation Instructions
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Customize how the AI evaluates candidates across all jobs.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customInstructions">
                      Define your evaluation criteria
                    </Label>
                    <Textarea
                      id="customInstructions"
                      placeholder="Example: Prioritize candidates who demonstrate leadership abilities, have experience in fast-paced environments, and show continuous learning. Value quality of experience over duration, and consider both formal education and practical skills..."
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <p className="text-sm text-muted-foreground">
                      These instructions will guide how the AI evaluates
                      candidates' experience, education, skills, and other
                      aspects of their profile.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto"
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
