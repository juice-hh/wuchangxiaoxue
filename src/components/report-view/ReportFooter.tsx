import { Separator } from "@/components/ui/separator";

export function ReportFooter() {
  return (
    <footer className="mt-8 break-inside-avoid">
      <Separator className="mb-6" />
      <div className="text-center space-y-2 pb-10">
        <p className="text-xs text-gray-400">
          本报告由系统基于 AI 对话分析自动生成，仅供教育工作参考，不构成专业诊断意见。
        </p>
        <p className="text-xs text-gray-400">
          报告内容涉及学生及家长个人信息，请妥善保管，避免不当传播。
        </p>
        <p className="text-xs text-gray-300 mt-3">
          五常小学 · 智能分析系统
        </p>
      </div>
    </footer>
  );
}
