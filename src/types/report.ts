export type ReportType = "full" | "summary" | "risk";

export interface ChatHistory {
  chatId: string;
  updateTime: string;
  title: string;
  customTitle?: string;
  top?: boolean;
}

export interface ReportData {
  reportId: string;
  reportTitle: string;
  reportType: ReportType;
  generatedAt: string;
  subjectName: string;
  summary: string;
  meta: {
    conversationTime?: string;
    duration?: string;
    topic?: string;
    expressionType?: string;
  };
  risk: {
    level: "low" | "medium" | "high";
    label: string;
    reason: string;
    needsFollowUp?: boolean;
  };
  topics: Array<{
    title: string;
    evidence: string;
    analysis: string;
  }>;
  alarmWords: Array<{
    word: string;
    level?: number;
    count?: number;
  }>;
  keywords: Array<{
    word: string;
    count?: number;
  }>;
  suggestions: string[];
  nextSteps: string[];
}

export interface ReportTypeOption {
  type: ReportType;
  title: string;
  description: string;
  contents: string[];
  recommended?: boolean;
}
