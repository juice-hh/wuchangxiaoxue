import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface NextStepPanelProps {
  nextSteps: string[];
}

export function NextStepPanel({ nextSteps }: NextStepPanelProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-blue-500" />
          下一次沟通提纲
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {nextSteps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700 leading-relaxed pt-0.5">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
