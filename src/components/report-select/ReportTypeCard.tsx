"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, FileBarChart, ShieldAlert } from "lucide-react";
import type { ReportType, ReportTypeOption } from "@/types/report";
import { cn } from "@/lib/utils";

const iconMap: Record<ReportType, React.ComponentType<{ className?: string }>> = {
  full: FileText,
  summary: FileBarChart,
  risk: ShieldAlert,
};

interface ReportTypeCardProps extends ReportTypeOption {
  selected: boolean;
  onSelect: (type: ReportType) => void;
}

export function ReportTypeCard({
  type,
  title,
  description,
  contents,
  recommended,
  selected,
  onSelect,
}: ReportTypeCardProps) {
  const Icon = iconMap[type];

  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all duration-200 hover:shadow-md",
        selected
          ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      )}
      onClick={() => onSelect(type)}
    >
      {recommended && (
        <Badge className="absolute -top-2.5 right-4 bg-blue-500 hover:bg-blue-500 text-white text-xs px-2.5 py-0.5">
          推荐
        </Badge>
      )}
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              selected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-2.5">
          {contents.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
              <CheckCircle
                className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  selected ? "text-blue-500" : "text-gray-300"
                )}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-center">
          <div
            className={cn(
              "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
              selected
                ? "border-blue-500"
                : "border-gray-300"
            )}
          >
            {selected && (
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
