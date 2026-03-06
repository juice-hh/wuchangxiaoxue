import { NextRequest, NextResponse } from "next/server";
import { fetchChatHistories } from "@/lib/fastgpt";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const outLinkUid = searchParams.get("outLinkUid");

    if (!outLinkUid) {
        return NextResponse.json(
            { success: false, error: "缺少 outLinkUid 参数" },
            { status: 400 }
        );
    }

    try {
        const histories = await fetchChatHistories(outLinkUid);

        // 过滤掉无关的历史（例如 FastGPT 的默认 "家长报告" 导航条目）
        const validHistories = histories.filter(
            (h) => h.title !== "家长报告" && h.title !== "新对话"
        );

        return NextResponse.json({
            success: true,
            data: validHistories,
        });
    } catch (e) {
        console.error("Fetch histories failed:", e);
        return NextResponse.json(
            { success: false, error: "获取历史对话失败" },
            { status: 500 }
        );
    }
}
