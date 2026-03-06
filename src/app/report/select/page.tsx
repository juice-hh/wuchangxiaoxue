"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ReportTypeCard } from "@/components/report-select/ReportTypeCard";
import { GenerateActionBar } from "@/components/report-select/GenerateActionBar";
import { REPORT_TYPE_OPTIONS } from "@/lib/mock-data";
import type { ReportType } from "@/types/report";

import { ChatHistory } from "@/lib/fastgpt";

function ReportSelectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shareToken = searchParams.get("shareToken") || "";
  const outLinkUidParam = searchParams.get("outLinkUid") || "";

  const [outLinkUid, setOutLinkUid] = useState(outLinkUidParam);
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [histories, setHistories] = useState<ChatHistory[]>([]);
  const [loadingHistories, setLoadingHistories] = useState(false);

  // 初始化 outLinkUid
  useEffect(() => {
    if (!outLinkUid) {
      let currentUid =
        localStorage.getItem("fastgpt_outLinkUid_xvV37m1BvziEorQzMXDOZaE4") ||
        localStorage.getItem("outLinkUid");

      if (!currentUid) {
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

  // 根据 outLinkUid 获取对话记录
  const fetchHistories = async (uid: string) => {
    setLoadingHistories(true);
    try {
      const res = await fetch(`/api/report/history?outLinkUid=${uid}`);
      const data = await res.json();
      if (data.success) {
        setHistories(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch histories", e);
    } finally {
      setLoadingHistories(false);
    }
  };

  useEffect(() => {
    if (outLinkUid) {
      fetchHistories(outLinkUid);
    }
  }, [outLinkUid]);

  const handleGenerate = async () => {
    if (!selectedType) {
      alert("请选择要生成的报告类型");
      return;
    }
    if (!selectedChatId) {
      alert("请在上方选择一条对话记录");
      return;
    }

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
        if (selectedChatId) {
          nextUrl += `&chatId=${selectedChatId}`;
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
      {/* 上半部分：对话历史选择区域 */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">选择对话记录</h2>
              <p className="text-sm text-gray-500 mt-1">请选择您想要生成报告的会话</p>
            </div>
            <button
              onClick={() => outLinkUid && fetchHistories(outLinkUid)}
              disabled={loadingHistories}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
            >
              {loadingHistories ? "正在刷新..." : "刷新记录"}
            </button>
          </div>

          {loadingHistories && histories.length === 0 ? (
            <div className="py-12 flex justify-center text-gray-400">正在获取对话列表...</div>
          ) : histories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-gray-50 p-4 rounded-xl gap-4 max-h-[350px] overflow-y-auto">
              {histories.map((h, index) => {
                const isSelected = selectedChatId === h.chatId;
                return (
                  <div
                    key={h.chatId}
                    onClick={() => setSelectedChatId(h.chatId)}
                    className={`cursor-pointer border p-4 rounded-lg bg-white transition shadow-sm hover:shadow-md ${isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-200"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-gray-400">#{histories.length - index}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(h.updateTime).toLocaleString("zh-CN", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <h3 className="text-md font-medium text-gray-800 line-clamp-2">
                      {h.title || "未命名对话"}
                    </h3>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 flex justify-center text-gray-400 bg-gray-50 rounded-xl">
              <p>暂无对话记录</p>
            </div>
          )}
        </div>
      </div>

      {/* 下半部分：生成报告选项卡 */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-10 pb-4 flex-shrink-0">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">
            第二步：请选择要生成的报告类型
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto">
            根据勾选的会话内容，可生成不同形式的分析报告，用于查看、归档或分享
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
