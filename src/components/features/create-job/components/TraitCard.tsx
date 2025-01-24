import React from "react";
import { X, Star } from "lucide-react";
import { TraitType } from "../../../../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KeyTrait {
  trait: string;
  description: string;
  trait_type: TraitType;
  value_type?: string;
  required: boolean;
}

interface TraitCardProps {
  trait: KeyTrait;
  index: number;
  onRemove: (index: number) => void;
  onUpdate: (index: number, updates: Partial<KeyTrait>) => void;
}

export const TraitCard: React.FC<TraitCardProps> = ({
  trait,
  index,
  onRemove,
  onUpdate,
}) => {
  return (
    <Card
      className={cn(
        "group relative transition-all duration-200",
        trait.required
          ? "border-purple-200 bg-purple-50/50 shadow-sm"
          : "border-gray-200 hover:border-primary/20"
      )}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex-1">
          <Label>Trait</Label>
          <Input
            value={trait.trait}
            onChange={(e) => onUpdate(index, { trait: e.target.value })}
            placeholder="Enter trait name..."
            className="text-lg font-medium px-3 h-auto focus-visible:ring-0 bg-transparent"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-2 text-sm font-normal",
              trait.required
                ? "text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onUpdate(index, { required: !trait.required })}
          >
            <Star
              className={cn(
                "h-4 w-4",
                trait.required ? "fill-current" : "fill-none"
              )}
            />
            {trait.required ? "Required" : "Optional"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label>Description - Tell our models exactly how candidates should be evaluated</Label>
          <Textarea
            value={trait.description}
            onChange={(e) => onUpdate(index, { description: e.target.value })}
            placeholder="Describe this trait and how it should be evaluated..."
            className="resize-none bg-transparent"
          />
        </div>
      </CardContent>
    </Card>
  );
};
