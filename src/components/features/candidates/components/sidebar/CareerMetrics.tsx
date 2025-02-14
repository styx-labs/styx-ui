import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Building2,
  Timer,
  Code2,
  Tags,
  Briefcase,
  DollarSign,
} from "lucide-react";
import type { CareerMetrics as CareerMetricsType } from "@/types/index";

interface CareerMetricsProps {
  metrics: CareerMetricsType;
}

export const CareerMetrics: React.FC<CareerMetricsProps> = ({ metrics }) => {
  // Helper function to format duration from months to years and months
  const formatDuration = (totalMonths: number | undefined): string => {
    if (totalMonths === undefined || isNaN(totalMonths))
      return "0 years, 0 months";

    const years = Math.floor(totalMonths / 12);
    const months = Math.round(totalMonths % 12);

    if (years === 0) {
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else if (months === 0) {
      return `${years} year${years !== 1 ? "s" : ""}`;
    }
    return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
      months !== 1 ? "s" : ""
    }`;
  };

  // Helper function to get career tag color
  const getCareerTagStyle = (tag: string): string => {
    switch (tag) {
      // Career Progression Tags
      case "High Average Tenure":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Low Average Tenure":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Single Promotion":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Multiple Promotions":
        return "bg-green-50 text-green-700 border-green-200";
      case "Diverse Company Experience":
        return "bg-violet-50 text-violet-700 border-violet-200";
      case "Single Company Focus":
        return "bg-teal-50 text-teal-700 border-teal-200";

      // Company Type Tags
      case "Worked at Big Tech":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Worked at Unicorn":
        return "bg-pink-50 text-pink-700 border-pink-200";
      case "Worked at Quant Fund":
        return "bg-purple-50 text-purple-700 border-purple-200";

      // Company Stage Tags
      case "Startup Experience":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Growth Company Experience":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Public Company Experience":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Helper function to format salary range
  const formatSalaryRange = (range?: [number, number]): string => {
    if (!range) return "";
    const [min, max] = range;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      <h4 className="text-base font-medium text-purple-800/90 flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Career Metrics
      </h4>
      <Card className="border-purple-100/50">
        <div className="p-4 space-y-4">
          {/* Career Tags */}
          {metrics.career_tags && metrics.career_tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-sm text-purple-800">
                <Tags className="h-4 w-4" />
                <span>Career Insights</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {metrics.career_tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={getCareerTagStyle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tags */}
          {metrics.experience_tags && metrics.experience_tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-sm text-purple-800">
                <Tags className="h-4 w-4" />
                <span>Experience Insights</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {metrics.experience_tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={getCareerTagStyle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Latest Experience Info */}
          {(metrics.latest_experience_level ||
            metrics.latest_experience_income) && (
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-purple-100">
              {metrics.latest_experience_level && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-purple-800">
                    <Briefcase className="h-4 w-4" />
                    <span>Estimated Experience Level</span>
                  </div>
                  <p className="text-lg font-semibold text-purple-900">
                    {metrics.latest_experience_level}
                  </p>
                </div>
              )}
              {metrics.latest_experience_income && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-purple-800">
                    <DollarSign className="h-4 w-4" />
                    <span>Estimated Income Range</span>
                  </div>
                  <p className="text-lg font-semibold text-purple-900">
                    {formatSalaryRange(metrics.latest_experience_income)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm text-purple-800">
                <Timer className="h-4 w-4" />
                <span>Total Experience</span>
              </div>
              <p className="text-lg font-semibold text-purple-900">
                {formatDuration(metrics.total_experience_months)}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm text-purple-800">
                <Building2 className="h-4 w-4" />
                <span>Avg. Tenure</span>
              </div>
              <p className="text-lg font-semibold text-purple-900">
                {formatDuration(metrics.average_tenure_months)}
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-sm text-purple-800">
                <Timer className="h-4 w-4" />
                <span>Current Tenure</span>
              </div>
              <p className="text-lg font-semibold text-purple-900">
                {formatDuration(metrics.current_tenure_months)}
              </p>
            </div>
          </div>

          {/* Tech Stacks */}
          {metrics.tech_stacks && metrics.tech_stacks.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-purple-100">
              <div className="flex items-center gap-1.5 text-sm text-purple-800">
                <Code2 className="h-4 w-4" />
                <span>Tech Stacks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {metrics.tech_stacks.map((stack, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {stack}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
