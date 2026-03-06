import type { ReportData } from "@/types/report";

const FASTGPT_BASE = "https://wxzs.allschool.cn";
const SHARE_ID = "xvV37m1BvziEorQzMXDOZaE4";
const APP_ID = "69a7ce03f5d31f944311e54b";
const FASTGPT_TOKEN =
  "65f2e7585a255006993dc11f:znKlGhq9kEvisM7wtjZByDPKfvPCnhWF";

const headers = {
  "Content-Type": "application/json",
  Cookie: `NEXT_LOCALE=zh-CN; fastgpt_token=${FASTGPT_TOKEN}`,
};

export interface ChatHistory {
  chatId: string;
  updateTime: string;
  title: string;
  customTitle?: string;
}

interface ChatRecord {
  obj: "Human" | "AI";
  value: Array<{ type: string; text?: { content: string } }>;
  time: string;
}

/**
 * 获取某个 UID 下的历史对话列表
 */
export async function fetchChatHistories(
  outLinkUid: string
): Promise<ChatHistory[]> {
  try {
    const payload = {
      messages: [{ role: "user", content: "家长报告" }],
      shareId: SHARE_ID,
      outLinkUid,
      stream: false,
      detail: true,
    };

    const res = await fetch(
      `${FASTGPT_BASE}/api/v2/chat/completions`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }
    );

    // 检查是否因为某种原因返回了 event-stream
    if (res.headers.get("content-type")?.includes("text/event-stream")) {
      console.error("FastGPT returned SSE unexpectedly for chat histories.");
      return [];
    }

    const data = await res.json();

    // FastGPT 后台工作流中，对话记录文本存在 newVariables.xb8McbHC 中
    const listText = data?.newVariables?.xb8McbHC;
    if (!listText) {
      console.warn("No xb8McbHC variable found in FastGPT response:", data);
      return [];
    }

    // 解析形如：1) chatId=xxx | updateTime=xxx | title=xxx 的文本
    const lines = listText.split("\n").filter((l: string) => l.trim().length > 0);
    const histories: ChatHistory[] = [];

    for (const line of lines) {
      const match = line.match(/chatId=([^|]+)\s*\|\s*updateTime=([^|]+)\s*\|\s*title=(.+)/);
      if (match) {
        histories.push({
          chatId: match[1].trim(),
          updateTime: match[2].trim(),
          title: match[3].trim(),
          customTitle: "",
        });
      }
    }

    // 按照 updateTime 降序排序
    histories.sort((a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime());

    return histories;
  } catch (error) {
    console.error("FastGPT fetch histories error:", error);
    return [];
  }
}

/**
 * 根据具体的 chatId 获取该对话的报告内容
 */
export async function fetchReportByChatId(
  outLinkUid: string,
  chatId: string
): Promise<ReportData | null> {
  try {
    // 为了 parseReportText 需要 title 和 updateTime，这里必须先拿到 histories 去找匹配的项
    const histories = await fetchChatHistories(outLinkUid);
    const reportChat = histories.find((h) => h.chatId === chatId);
    if (!reportChat) return null;

    const recRes = await fetch(
      `${FASTGPT_BASE}/api/core/chat/getPaginationRecords`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          appId: APP_ID,
          chatId: reportChat.chatId,
          shareId: SHARE_ID,
          outLinkUid,
          offset: 0,
          pageSize: 30,
        }),
      }
    );
    const recData = await recRes.json();
    const records: ChatRecord[] = recData?.data?.list || [];

    const aiMessages = records.filter((r) => r.obj === "AI");
    const lastAI = aiMessages[aiMessages.length - 1];
    if (!lastAI) return null;

    const content =
      lastAI.value.find((v) => v.type === "text")?.text?.content || "";
    if (!content || content.includes("请回复编号查看")) return null;

    return parseReportText(content, reportChat);
  } catch (error) {
    console.error("FastGPT fetch report error:", error);
    return null;
  }
}

/**
 * 从 FastGPT 获取最新的报告内容
 */
export async function fetchLatestReport(
  outLinkUid: string
): Promise<ReportData | null> {
  const histories = await fetchChatHistories(outLinkUid);
  if (histories.length === 0) return null;

  const reportChat = histories.find((h) => h.title !== "家长报告");
  if (!reportChat) return null;

  return fetchReportByChatId(outLinkUid, reportChat.chatId);
}

/**
 * 将 FastGPT 返回的结构化文本解析为 ReportData
 */
function parseReportText(
  text: string,
  chat: ChatHistory
): ReportData {
  // 只取第一份报告（文本中可能重复了两次）
  const halfIndex = text.indexOf("\n1) 家长", 10);
  const cleanText = halfIndex > 0 ? text.substring(0, halfIndex) : text;

  // 解析家长名称
  const subjectMatch = cleanText.match(/1\)\s*家长[：:]\s*(.+)/);
  const subjectName = subjectMatch?.[1]?.trim() || "未知家长";

  // 解析会话概览
  const summaryMatch = cleanText.match(
    /2\)\s*会话概览[：:]\s*([\s\S]*?)(?=\n\s*3\))/
  );
  const summary = summaryMatch?.[1]?.trim() || "";

  // 解析关键话题与证据
  const topicsMatch = cleanText.match(
    /3\)\s*关键话题与证据[：:]\s*([\s\S]*?)(?=\n\s*4\))/
  );
  const topicsText = topicsMatch?.[1]?.trim() || "";
  const topics = parseTopics(topicsText);

  // 解析风险信号
  const riskMatch = cleanText.match(
    /4\)\s*风险信号[：:]\s*(\w+)\s*\n\s*理由[：:]\s*([\s\S]*?)(?=\n\s*5\))/
  );
  const riskLevel = riskMatch?.[1]?.trim().toLowerCase() || "low";
  const riskReason = riskMatch?.[2]?.trim() || "";

  const riskLabels: Record<string, string> = {
    low: "低风险",
    medium: "中风险",
    high: "高风险",
  };

  // 解析建议
  const suggestionsMatch = cleanText.match(
    /5\)\s*可执行建议[：:]\s*([\s\S]*?)(?=\n\s*6\))/
  );
  const suggestionsText = suggestionsMatch?.[1]?.trim() || "";
  const suggestions = parseBulletList(suggestionsText);

  // 解析下一次沟通提纲
  const nextStepsMatch = cleanText.match(
    /6\)\s*下一次沟通提纲[：:]\s*([\s\S]*?)$/
  );
  const nextStepsText = nextStepsMatch?.[1]?.trim() || "";
  const nextSteps = parseBulletList(nextStepsText);

  // 提取关键词（从话题标题和内容中提取）
  const keywords = extractKeywords(cleanText);

  // 提取预警词
  const alarmWords = extractAlarmWords(cleanText, riskLevel);

  return {
    reportId: chat.chatId,
    reportTitle: "家校沟通分析报告",
    reportType: "full",
    generatedAt: new Date(chat.updateTime).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    subjectName,
    summary,
    meta: {
      conversationTime: new Date(chat.updateTime).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      topic: topics.length > 0 ? topics[0].title : "家校沟通",
      expressionType: inferExpressionType(summary),
    },
    risk: {
      level: (["low", "medium", "high"].includes(riskLevel)
        ? riskLevel
        : "low") as "low" | "medium" | "high",
      label: riskLabels[riskLevel] || "低风险",
      reason: riskReason,
      needsFollowUp: riskLevel === "medium" || riskLevel === "high",
    },
    topics,
    alarmWords,
    keywords,
    suggestions,
    nextSteps,
  };
}

function parseTopics(
  text: string
): Array<{ title: string; evidence: string; analysis: string }> {
  const topics: Array<{
    title: string;
    evidence: string;
    analysis: string;
  }> = [];

  // 匹配 **标题**：描述 的模式
  const topicBlocks = text.split(/\*\s+\*\*/);

  for (const block of topicBlocks) {
    if (!block.trim()) continue;

    const titleMatch = block.match(/^([^*]+)\*\*[：:]\s*(.+)/);
    if (!titleMatch) continue;

    const title = titleMatch[1].trim();
    const analysis = titleMatch[2].trim();

    // 提取证据
    const evidences: string[] = [];
    const evidenceMatches = block.matchAll(
      /证据[：:]\s*(.+?)(?=\n|$)/g
    );
    for (const m of evidenceMatches) {
      evidences.push(m[1].trim());
    }

    topics.push({
      title,
      evidence: evidences.join(" "),
      analysis,
    });
  }

  return topics.length > 0 ? topics : [{ title: "会话分析", evidence: "", analysis: text }];
}

function parseBulletList(text: string): string[] {
  const items: string[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const cleaned = line
      .replace(/^\s*\*\s*/, "")
      .replace(/^\*\*(.+?)\*\*[：:]?\s*/, "$1：")
      .trim();
    if (cleaned && cleaned.length > 2) {
      items.push(cleaned);
    }
  }

  return items;
}

function extractKeywords(
  text: string
): Array<{ word: string; count?: number }> {
  const keywordPatterns = [
    "情绪", "压力", "沟通", "学习", "作业", "考试", "心情",
    "家庭", "孩子", "老师", "关怀", "支持", "引导", "焦虑",
    "疲惫", "无力", "不开心", "崩溃",
  ];

  const found: Array<{ word: string; count: number }> = [];
  for (const kw of keywordPatterns) {
    const count = (text.match(new RegExp(kw, "g")) || []).length;
    if (count > 0) {
      found.push({ word: kw, count });
    }
  }

  return found
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function extractAlarmWords(
  text: string,
  riskLevel: string
): Array<{ word: string; level?: number; count?: number }> {
  const alarmPatterns = [
    { word: "崩溃", level: 2 },
    { word: "无力", level: 1 },
    { word: "不开心", level: 1 },
    { word: "硬撑", level: 2 },
    { word: "疲惫", level: 1 },
    { word: "无奈", level: 1 },
    { word: "压力", level: 1 },
    { word: "焦虑", level: 2 },
    { word: "拒绝", level: 2 },
  ];

  const found: Array<{ word: string; level: number; count: number }> = [];
  for (const aw of alarmPatterns) {
    const count = (text.match(new RegExp(aw.word, "g")) || []).length;
    if (count > 0) {
      found.push({ ...aw, count });
    }
  }

  return found.sort((a, b) => b.level - a.level || b.count - a.count);
}

function inferExpressionType(summary: string): string {
  if (summary.includes("简短") || summary.includes("词汇"))
    return "简短情绪表达，沟通较为表面";
  if (summary.includes("主动") || summary.includes("求助"))
    return "家长主动求助并描述教育困扰";
  if (summary.includes("焦虑") || summary.includes("担心"))
    return "焦虑型表达，关注孩子发展";
  return "情绪化表达，需要进一步了解";
}
