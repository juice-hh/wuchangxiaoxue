import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import type { ReportData } from "@/types/report";

interface TopicEvidenceListProps {
  topics: ReportData["topics"];
}

export function TopicEvidenceList({ topics }: TopicEvidenceListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-500" />
          关键话题与证据
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {topics.map((topic, i) => (
          <div key={i}>
            {i > 0 && <Separator className="my-5" />}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                  {i + 1}
                </span>
                {topic.title}
              </h4>
              <blockquote className="border-l-4 border-blue-200 bg-blue-50/60 rounded-r-lg pl-4 pr-4 py-3">
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  {topic.evidence}
                </p>
              </blockquote>
              <p className="text-sm text-gray-700 leading-relaxed pl-1">
                {topic.analysis}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
