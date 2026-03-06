import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-500" />
          会话概述
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
      </CardContent>
    </Card>
  );
}
