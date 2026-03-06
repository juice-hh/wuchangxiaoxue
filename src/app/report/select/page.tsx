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
    // 如果 URL 没带参数，尝试从 LocalStorage 读取或生成全新的 outLinkUid
    if (!outLinkUid) {
      let currentUid =
        localStorage.getItem("fastgpt_outLinkUid_xvV37m1BvziEorQzMXDOZaE4") ||
        localStorage.getItem("outLinkUid");

      if (!currentUid) {
        // 生成一个新的唯一访客 ID 给这个嵌入的回话使用
        currentUid = `shareChat-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`;
        localStorage.setItem(
          "fastgpt_outLinkUid_xvV37m1BvziEorQzMXDOZaE4",
          currentUid
        );
        localStorage.setItem("outLinkUid", currentUid);
      }
      setOutLinkUid(currentUid);
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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-28">
      {/* 上半部分：嵌入的 FastGPT 聊天界面 */}
      <div className="w-full flex-grow bg-white border-b border-gray-200 shadow-sm" style={{ height: '60vh', minHeight: '500px' }}>
        {outLinkUid ? (
          <iframe
            src={`https://wxzs.allschool.cn/chat/share?shareId=xvV37m1BvziEorQzMXDOZaE4&outLinkUid=${outLinkUid}`}
            className="w-full h-full border-none"
            title="FastGPT Chat Session"
            allow="microphone"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            正在初始化聊天环境...
          </div>
        )}
      </div>

      {/* 下半部分：生成报告选项卡 */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-4 flex-shrink-0">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">
            完成上方对话后，请选择要生成的报告类型
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">
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
