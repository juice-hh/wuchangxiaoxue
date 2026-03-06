import { NextRequest, NextResponse } from "next/server";
import { fetchLatestReport } from "@/lib/fastgpt";
import { generateMockReport } from "@/lib/mock-data";
import type { ReportType } from "@/types/report";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("reportId");
  const reportType = (searchParams.get("reportType") || "full") as ReportType;
  const outLinkUid = searchParams.get("outLinkUid");

  if (!reportId) {
    return NextResponse.json(
      { success: false, error: "缺少 reportId" },
      { status: 400 }
    );
  }

  // 尝试从 FastGPT 获取最新报告
  try {
    if (outLinkUid) {
      const liveData = await fetchLatestReport(outLinkUid);
      if (liveData) {
        return NextResponse.json({
          success: true,
          data: { ...liveData, reportId },
        });
      }
    }
  } catch (e) {
    console.error("FastGPT fetch failed, falling back to mock:", e);
  }

  // 如果获取失败，回退到 Mock 数据
  const data = generateMockReport(reportType, reportId);
  return NextResponse.json({
    success: true,
    data,
  });
}
