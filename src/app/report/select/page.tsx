"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ReportTypeCard } from "@/components/report-select/ReportTypeCard";
import { GenerateActionBar } from "@/components/report-select/GenerateActionBar";
import { REPORT_TYPE_OPTIONS } from "@/lib/mock-data";
import type { ReportType } from "@/types/report";

import { ChatHistory } from "@/lib/fastgpt";
import { X, MessageCirclePlus, RefreshCw } from "lucide-react";

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
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // 初始化 outLinkUid
  useEffect(() => {
    if (!outLinkUid) {
      let currentUid =
        localStorage.getItem("fastgpt_outLinkUid_xvV37m1BvziEorQzMXDOZaE4") ||
        localStorage.getItem("outLinkUid");

      if (!currentUid) {
        // 生成纯随机的专属 UID（不再共用测试 UID，确保数据完全隔离）
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
        // 如果有记录且当前未选择，默认选中第一条（最新的一条）
        if (data.data.length > 0 && !selectedChatId) {
          setSelectedChatId(data.data[0].chatId);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outLinkUid]);

  const handleGenerate = async () => {
    if (!selectedType) {
      alert("请选择要生成的报告类型");
      return;
    }
    if (!selectedChatId) {
      alert("请在上方选择或新建一条对话记录");
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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-28 relative">
      {/* 步骤 1：对话历史选择区域 */}
      <div className="w-full px-6 pt-14 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">第一步：选择或新建对话记录</h1>
              <p className="text-sm text-gray-500 mt-1">
                请先完成与 AI 的对话沟通，然后在此处勾选生成报告的依据。
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsChatModalOpen(true)}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
              >
                <MessageCirclePlus className="w-4 h-4" />
                <span>新对话</span>
              </button>
              <button
                onClick={() => outLinkUid && fetchHistories(outLinkUid)}
                disabled={loadingHistories}
                className="flex items-center space-x-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingHistories ? 'animate-spin' : ''}`} />
                <span>刷新记录</span>
              </button>
            </div>
          </div>

          {loadingHistories && histories.length === 0 ? (
            <div className="py-12 flex justify-center items-center text-gray-400 bg-white border border-gray-200 rounded-xl shadow-sm">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              正在同步对话列表...
            </div>
          ) : histories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-white border border-gray-200 p-4 rounded-xl gap-4 max-h-[350px] overflow-y-auto shadow-sm">
              {histories.map((h, index) => {
                const isSelected = selectedChatId === h.chatId;
                return (
                  <div
                    key={h.chatId}
                    onClick={() => setSelectedChatId(h.chatId)}
                    className={`cursor-pointer border p-4 rounded-lg bg-gray-50 transition shadow-sm hover:shadow-md ${isSelected ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/30" : "border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        最近对话
                      </span>
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
            <div className="py-12 flex flex-col justify-center items-center text-gray-500 bg-white border border-gray-200 rounded-xl shadow-sm">
              <p className="mb-4">暂无对话记录</p>
              <button
                onClick={() => setIsChatModalOpen(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline underline-offset-4"
              >
                点击开始您的第一次沟通
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 步骤 2：生成报告选项卡 */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-6 pb-4 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            第二步：请选择要生成的报告类型
          </h1>
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

      {/* 全屏嵌入的聊天弹窗 Modal */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 shadow-sm relative z-10">
            <h3 className="font-semibold text-gray-800">与 AI 报告助手沟通</h3>
            <button
              onClick={() => {
                setIsChatModalOpen(false);
                if (outLinkUid) fetchHistories(outLinkUid); // 关掉弹窗时自动刷新历史记录
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition text-sm"
            >
              <X className="w-4 h-4" />
              <span>完成聊天并关闭</span>
            </button>
          </div>
          <div className="flex-grow w-full h-full relative z-0">
            {outLinkUid ? (
              <iframe
                src={`https://wxzs.allschool.cn/chat/share?shareId=xvV37m1BvziEorQzMXDOZaE4&outLinkUid=${outLinkUid}`}
                className="w-full h-full border-none"
                title="FastGPT Chat Session"
                allow="microphone"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                加载对话身份信息中...
              </div>
            )}
          </div>
        </div>
      )}
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
