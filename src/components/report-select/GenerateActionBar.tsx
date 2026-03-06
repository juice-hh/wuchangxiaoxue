"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, FileCheck } from "lucide-react";
import type { ReportType } from "@/types/report";

interface GenerateActionBarProps {
  selectedType: ReportType | null;
  isGenerating: boolean;
  onBack: () => void;
  onGenerate: () => void;
}

export function GenerateActionBar({
  selectedType,
  isGenerating,
  onBack,
  onGenerate,
}: GenerateActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 print:hidden">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isGenerating}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          返回聊天
        </Button>

        <Button
          onClick={onGenerate}
          disabled={!selectedType || isGenerating}
          className="gap-2 min-w-[140px] bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              报告生成中...
            </>
          ) : (
            <>
              <FileCheck className="h-4 w-4" />
              生成报告
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
