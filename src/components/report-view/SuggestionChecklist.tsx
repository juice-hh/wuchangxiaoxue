"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks } from "lucide-react";

interface SuggestionChecklistProps {
  suggestions: string[];
}

export function SuggestionChecklist({ suggestions }: SuggestionChecklistProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-blue-500" />
          行动建议
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {suggestions.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <Checkbox
                id={`suggestion-${i}`}
                className="mt-0.5 shrink-0"
              />
              <label
                htmlFor={`suggestion-${i}`}
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
              >
                {item}
              </label>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
