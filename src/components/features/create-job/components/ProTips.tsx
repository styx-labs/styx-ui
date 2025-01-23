import React from "react";
import { ClipboardList } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface ProTip {
  text: string;
}

interface ProTipsProps {
  tips?: ProTip[];
}

const DEFAULT_TIPS: ProTip[] = [
  { text: "Include detailed requirements and qualifications" },
  { text: "Specify any must-have skills or experience" },
  { text: "Add information about the role's responsibilities" },
  { text: "Mention preferred technologies or tools" },
  { text: "Describe the team structure and work environment" },
];

export const ProTips: React.FC<ProTipsProps> = ({ tips = DEFAULT_TIPS }) => {
  return (
    <Card className="border-purple-200 bg-purple-50 shadow-md">
      <CardHeader>
        <h3 className="font-semibold text-purple-900 text-lg flex items-center">
          <ClipboardList className="mr-2 h-5 w-5 text-purple-700" />
          Pro Tips for Great Job Descriptions
        </h3>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-purple-800">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
