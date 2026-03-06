import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageSquare, BookOpen, User } from "lucide-react";
import type { ReportData } from "@/types/report";

interface ReportMetaCardProps {
  meta: ReportData["meta"];
  subjectName: string;
}

export function ReportMetaCard({ meta, subjectName }: ReportMetaCardProps) {
  const items = [
    { label: "沟通对象", value: subjectName, icon: User },
    { label: "会话时间", value: meta.conversationTime, icon: Clock },
    { label: "持续时长", value: meta.duration, icon: MessageSquare },
    { label: "会话主题", value: meta.topic, icon: BookOpen },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800">
          基本信息
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(
            (item) =>
              item.value && (
                <div
                  key={item.label}
                  className="flex flex-col gap-1.5 bg-gray-50 rounded-xl p-4"
                >
                  <div className="flex items-center gap-1.5">
                    <item.icon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-400">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {item.value}
                  </span>
                </div>
              )
          )}
        </div>
        {meta.expressionType && (
          <div className="mt-4 bg-blue-50 rounded-xl p-4">
            <span className="text-xs text-blue-400">表达方式</span>
            <p className="mt-1 text-sm text-blue-700">{meta.expressionType}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
