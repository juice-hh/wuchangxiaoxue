"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ReportTypeCard } from "@/components/report-select/ReportTypeCard";
import { GenerateActionBar } from "@/components/report-select/GenerateActionBar";
import { REPORT_TYPE_OPTIONS } from "@/lib/mock-data";
import type { ReportType } from "@/types/report";

function ReportSelectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shareToken = searchParams.get("shareToken") || "";
  const outLinkUidParam = searchParams.get("outLinkUid") || "";

  const [outLinkUid, setOutLinkUid] = useState(outLinkUidParam);
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // 如果 URL 没带参数，尝试从 LocalStorage 里自动获取 FastGPT 的对话 UID
    if (!outLinkUid) {
      const fallbackUid =
        localStorage.getItem("fastgpt_outLinkUid_xvV37m1BvziEorQzMXDOZaE4") ||
        localStorage.getItem("outLinkUid");
      if (fallbackUid) {
        setOutLinkUid(fallbackUid);
      }
    }
  }, [outLinkUid]);

  const handleGenerate = async () => {
    if (!selectedType) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareToken, reportType: selectedType }),
      });
      const data = await res.json();

      if (data.success) {
        let nextUrl = `/report/view?reportId=${data.reportId}&reportType=${selectedType}`;
        if (outLinkUid) {
          nextUrl += `&outLinkUid=${outLinkUid}`;
        }
        router.push(nextUrl);
      } else {
        alert("报告生成失败，请重试");
        setIsGenerating(false);
      }
    } catch {
      alert("网络错误，请重试");
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    window.location.href = "https://test.m.xiaoyuanhao.com/micro/app/virtualhumans/weixin/index?shareToken=c4c3de5301d343acbfe3a00421df50ff";
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-4xl mx-auto px-6 pt-14">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900">
            请选择要生成的报告
          </h1>
          <p className="mt-3 text-sm text-gray-500 max-w-lg mx-auto">
            根据本次会话内容，可生成不同形式的分析报告，用于查看、归档或分享
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REPORT_TYPE_OPTIONS.map((option) => (
            <ReportTypeCard
              key={option.type}
              {...option}
              selected={selectedType === option.type}
              onSelect={setSelectedType}
            />
          ))}
        </div>
      </div>

      <GenerateActionBar
        selectedType={selectedType}
        isGenerating={isGenerating}
        onBack={handleBack}
        onGenerate={handleGenerate}
      />
    </div>
  );
}

export default function ReportSelectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-400">加载中...</p>
        </div>
      }
    >
      <ReportSelectContent />
    </Suspense>
  );
}
