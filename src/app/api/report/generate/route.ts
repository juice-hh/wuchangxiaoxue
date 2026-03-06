import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { shareToken, reportType } = body;

  if (!shareToken || !reportType) {
    return NextResponse.json(
      { success: false, error: "缺少 shareToken 或 reportType" },
      { status: 400 }
    );
  }

  if (!["full", "summary", "risk"].includes(reportType)) {
    return NextResponse.json(
      { success: false, error: "无效的 reportType" },
      { status: 400 }
    );
  }

  // 模拟生成延迟 1.5~2 秒
  await new Promise((resolve) =>
    setTimeout(resolve, 1500 + Math.random() * 500)
  );

  const reportId = `rpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return NextResponse.json({
    success: true,
    reportId,
    reportType,
  });
}
