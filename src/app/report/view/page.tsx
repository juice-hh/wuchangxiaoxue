"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ReportHeader } from "@/components/report-view/ReportHeader";
import { ReportMetaCard } from "@/components/report-view/ReportMetaCard";
import { SummaryCard } from "@/components/report-view/SummaryCard";
import { TopicEvidenceList } from "@/components/report-view/TopicEvidenceList";
import { RiskPanel } from "@/components/report-view/RiskPanel";
import { KeywordTags } from "@/components/report-view/KeywordTags";
import { SuggestionChecklist } from "@/components/report-view/SuggestionChecklist";
import { NextStepPanel } from "@/components/report-view/NextStepPanel";
import { ReportFooter } from "@/components/report-view/ReportFooter";
import type { ReportData } from "@/types/report";

function ReportViewContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId") || "";
  const reportType = searchParams.get("reportType") || "full";

  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setError("缺少报告 ID");
      setLoading(false);
      return;
    }

    fetch(`/api/report/detail?reportId=${reportId}&reportType=${reportType}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReport(data.data);
        } else {
          setError(data.error || "加载失败");
        }
      })
      .catch(() => setError("网络错误"))
      .finally(() => setLoading(false));
  }, [reportId, reportType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-500">正在加载报告...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">{error || "报告不存在"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="max-w-[1060px] mx-auto px-6 py-10 space-y-6">
        <ReportHeader
          reportTitle={report.reportTitle}
          reportType={report.reportType}
          generatedAt={report.generatedAt}
          subjectName={report.subjectName}
          riskLevel={report.risk.level}
          riskLabel={report.risk.label}
          summary={report.summary}
        />
        <ReportMetaCard meta={report.meta} subjectName={report.subjectName} />
        <SummaryCard summary={report.summary} />
        <TopicEvidenceList topics={report.topics} />
        <RiskPanel risk={report.risk} />
        <KeywordTags
          keywords={report.keywords}
          alarmWords={report.alarmWords}
        />
        <SuggestionChecklist suggestions={report.suggestions} />
        <NextStepPanel nextSteps={report.nextSteps} />
        <ReportFooter />
      </div>
    </div>
  );
}

export default function ReportViewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-500">正在加载报告...</p>
        </div>
      }
    >
      <ReportViewContent />
    </Suspense>
  );
}
