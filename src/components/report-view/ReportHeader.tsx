"use client";

import { Badge } from "@/components/ui/badge";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReportType } from "@/types/report";

const typeLabels: Record<ReportType, string> = {
  full: "完整分析报告",
  summary: "简版摘要报告",
  risk: "风险预警报告",
};

interface ReportHeaderProps {
  reportTitle: string;
  reportType: ReportType;
  generatedAt: string;
  subjectName: string;
  riskLevel: "low" | "medium" | "high";
  riskLabel: string;
  summary: string;
}

const riskColors: Record<string, string> = {
  low: "bg-green-100 text-green-700 border-green-200",
  medium: "bg-orange-100 text-orange-700 border-orange-200",
  high: "bg-red-100 text-red-700 border-red-200",
};

export function ReportHeader({
  reportTitle,
  reportType,
  generatedAt,
  subjectName,
  riskLevel,
  riskLabel,
  summary,
}: ReportHeaderProps) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm px-8 py-8">
      <Button
        variant="outline"
        size="sm"
        className="absolute top-6 right-6 gap-1.5 text-gray-500 print:hidden"
        onClick={() => window.print()}
      >
        <Printer className="h-4 w-4" />
        打印
      </Button>

      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-gray-900">{reportTitle}</h1>

        <div className="mt-3 flex items-center gap-3 flex-wrap justify-center">
          <Badge variant="secondary" className="text-xs">
            {typeLabels[reportType]}
          </Badge>
          <Badge className={`text-xs border ${riskColors[riskLevel]}`}>
            {riskLabel}
          </Badge>
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
          <span>沟通对象：{subjectName}</span>
          <span>·</span>
          <span>生成于 {generatedAt}</span>
        </div>

        <p className="mt-5 max-w-2xl text-sm text-gray-600 leading-relaxed">
          {summary}
        </p>

        <p className="mt-4 text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-2">
          本报告基于 AI 对话分析自动生成，仅供教育工作参考，不构成专业诊断意见。
        </p>
      </div>
    </div>
  );
}
