import { useState } from "react";
import { X, LinkIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface JobIdealProfilesFormProps {
  onSubmit: (urls: string[]) => void;
  onBack: () => void;
}

export const JobIdealProfilesForm: React.FC<JobIdealProfilesFormProps> = ({
  onSubmit,
  onBack,
}) => {
  const [urls, setUrls] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrl = () => {
    if (urls.length < 3) {
      setUrls([...urls, ""]);
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validUrls = urls.filter((url) => url.trim() !== "");
    await onSubmit(validUrls);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Ideal Candidate Profiles
        </h1>
        <p className="text-muted-foreground mt-2">
          Add up to 3 LinkedIn profile URLs that represent your ideal
          candidates. These will help guide the evaluation of sourced
          candidates.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold flex items-center">
            <LinkIcon className="mr-2 h-6 w-6 text-purple-500" />
            LinkedIn Profiles
          </h2>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-3 items-center group">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="LinkedIn Profile URL"
                    className="pl-9"
                  />
                </div>
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUrl(index)}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {urls.length < 3 && (
              <Button
                type="button"
                variant="outline"
                onClick={addUrl}
                className="w-full"
              >
                <span className="h-5 w-5 rounded-full border-2 border-current inline-flex items-center justify-center mr-2">
                  +
                </span>
                Add another profile
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  Next: Key Traits <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
