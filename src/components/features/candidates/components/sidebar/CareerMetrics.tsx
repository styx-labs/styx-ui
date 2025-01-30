import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Building2, Timer, Code2 } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <h4 className="text-base font-medium text-purple-800/90 flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Career Metrics
      </h4>
      <Card className="border-purple-100/50">
        <div className="p-4 space-y-4">
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

          {/* Experience by Stage */}
          {metrics.experience_by_stage &&
            metrics.experience_by_stage.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-purple-100">
                <div className="flex items-center gap-1.5 text-sm text-purple-800">
                  <Building2 className="h-4 w-4" />
                  <span>Company Experience</span>
                </div>
                <div className="space-y-2">
                  {metrics.experience_by_stage.map((exp, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs border-purple-200"
                        >
                          {exp.company_tier}
                        </Badge>
                        <span className="text-purple-800">
                          {exp.company_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {exp.funding_stage}
                        </Badge>
                        <span className="text-purple-600 text-xs">
                          {formatDuration(exp.duration_months)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </Card>
    </div>
  );
};
