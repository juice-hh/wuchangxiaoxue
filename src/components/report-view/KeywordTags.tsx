import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import type { ReportData } from "@/types/report";

interface KeywordTagsProps {
  keywords: ReportData["keywords"];
  alarmWords: ReportData["alarmWords"];
}

export function KeywordTags({ keywords, alarmWords }: KeywordTagsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Tag className="h-4 w-4 text-blue-500" />
          关键词与预警词
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {keywords.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-3">关键词</h5>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-sm px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  {kw.word}
                  {kw.count && kw.count > 1 && (
                    <span className="ml-1.5 text-xs text-blue-400">
                      ×{kw.count}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {alarmWords.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-3">预警词</h5>
            <div className="flex flex-wrap gap-2">
              {alarmWords.map((aw, i) => (
                <Badge
                  key={i}
                  variant="destructive"
                  className="text-sm px-3 py-1 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                >
                  {aw.word}
                  {aw.count && aw.count > 0 && (
                    <span className="ml-1.5 text-xs text-red-400">
                      ×{aw.count}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
