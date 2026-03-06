import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReportData } from "@/types/report";

interface RiskPanelProps {
  risk: ReportData["risk"];
}

const riskStyles = {
  low: {
    border: "border-green-200",
    bg: "bg-green-50/50",
    badge: "bg-green-100 text-green-700 border-green-200",
    icon: "text-green-500",
    alert: "bg-green-50 border-green-200 text-green-700",
  },
  medium: {
    border: "border-orange-200",
    bg: "bg-orange-50/50",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    icon: "text-orange-500",
    alert: "bg-orange-50 border-orange-200 text-orange-700",
  },
  high: {
    border: "border-red-200",
    bg: "bg-red-50/50",
    badge: "bg-red-100 text-red-700 border-red-200",
    icon: "text-red-500",
    alert: "bg-red-50 border-red-200 text-red-700",
  },
};

export function RiskPanel({ risk }: RiskPanelProps) {
  const style = riskStyles[risk.level];

  return (
    <Card className={cn("break-inside-avoid", style.border, style.bg)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <ShieldAlert className={cn("h-4 w-4", style.icon)} />
          风险评估
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={cn("text-sm px-3 py-1 border", style.badge)}>
            {risk.label}
          </Badge>
        </div>

        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-gray-400" />
            评估依据
          </h5>
          <p className="text-sm text-gray-600 leading-relaxed pl-5">
            {risk.reason}
          </p>
        </div>

        {risk.needsFollowUp && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-3",
              style.alert
            )}
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">建议进行后续跟进</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
