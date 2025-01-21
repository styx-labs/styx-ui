import React, { useState } from "react";
import { X, Link as LinkIcon } from "lucide-react";

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
    const validUrls = urls.filter(url => url.trim() !== "");
    await onSubmit(validUrls);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">What does your ideal candidate look like?</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Optionally add up to 3 LinkedIn profile URLs that represent your ideal candidates. 
          These will help guide the evaluation of sourced candidates.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-3 items-center group">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LinkIcon size={18} />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder="LinkedIn Profile URL"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors"
                />
              </div>
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          ))}

          {urls.length < 3 && (
            <button
              type="button"
              onClick={addUrl}
              className="w-full py-2.5 text-sm text-gray-500 hover:text-purple-600 flex items-center justify-center gap-1.5 group"
            >
              <span className="h-5 w-5 rounded-full border-2 border-gray-300 inline-flex items-center justify-center group-hover:border-purple-300 group-hover:bg-purple-50 transition-all">
                +
              </span>
              Add another profile
            </button>
          )}

          <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                  Analyzing...
                </>
              ) : (
                'Next Step'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 