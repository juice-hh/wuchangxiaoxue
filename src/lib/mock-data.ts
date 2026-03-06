import type { ReportData, ReportType, ReportTypeOption } from "@/types/report";

export const REPORT_TYPE_OPTIONS: ReportTypeOption[] = [
  {
    type: "full",
    title: "完整分析报告",
    description: "全面、详细的对话分析，适合存档与深度阅读",
    contents: [
      "基本信息与会话概览",
      "关键话题与证据引用",
      "风险评估与等级判定",
      "可执行建议清单",
      "下一次沟通提纲",
    ],
    recommended: true,
  },
  {
    type: "summary",
    title: "简版摘要报告",
    description: "快速了解核心内容，适合分享与速览",
    contents: [
      "一句话总结",
      "核心问题提炼",
      "风险等级",
      "关键建议",
    ],
  },
  {
    type: "risk",
    title: "风险预警报告",
    description: "聚焦潜在风险与预警信号，适合重点关注对象",
    contents: [
      "风险等级评估",
      "触发依据与预警词",
      "风险详情说明",
      "建议处理动作",
    ],
  },
];

export function generateMockReport(
  reportType: ReportType,
  reportId: string
): ReportData {
  const base: ReportData = {
    reportId,
    reportTitle:
      reportType === "full"
        ? "家校沟通分析报告"
        : reportType === "summary"
        ? "家校沟通摘要报告"
        : "学生风险预警报告",
    reportType,
    generatedAt: new Date().toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    subjectName: "王同学家长",
    summary:
      "本次会话中，家长主要表达了对孩子学习习惯和作业拖延的困扰。家长反映孩子回家后不愿主动写作业，常常拖延到很晚，导致睡眠不足和第二天上课精力不集中。家长尝试过多种方式督促但效果不明显，表现出一定的焦虑和无力感。整体沟通态度积极，属于主动求助型家长。",
    meta: {
      conversationTime: "2026-03-04 17:45",
      duration: "约 25 分钟",
      topic: "学习习惯与家庭沟通",
      expressionType: "家长主动求助并描述教育困扰",
    },
    risk: {
      level: "low",
      label: "低风险",
      reason:
        "家长虽然存在焦虑和无力感，但始终在积极寻求解决方案，孩子未表现出严重的情绪或行为问题，整体属于正常教育困扰范畴。",
      needsFollowUp: true,
    },
    topics: [
      {
        title: "学习习惯与作业拖延",
        evidence:
          "「孩子每天回来就抱着手机，让他写作业要喊好几遍，总是拖到九十点才开始写。」",
        analysis:
          "孩子在学习任务启动方面存在困难，可能与手机依赖和缺乏自律能力有关。需要家长协助建立固定的学习流程。",
      },
      {
        title: "亲子沟通方式",
        evidence:
          "「我也知道不应该老是吼他，但是说了好多遍都不听，我真的很崩溃。」",
        analysis:
          "家长意识到当前沟通方式存在问题，但缺乏有效的替代策略。建议引导家长学习正面管教技巧。",
      },
      {
        title: "睡眠与精力问题",
        evidence:
          "「因为作业写到太晚，第二天早上起不来，老师也反映上课没精神。」",
        analysis:
          "作业拖延已经形成连锁反应，影响到孩子的作息和课堂表现，需要从时间管理根源上解决。",
      },
      {
        title: "家长情绪与压力",
        evidence:
          "「有时候我觉得自己是不是教育方式有问题，特别是看到别人家孩子那么自觉。」",
        analysis:
          "家长存在自我怀疑和比较心理，可能增加家庭教育中的焦虑情绪，需要适当疏导。",
      },
    ],
    alarmWords: [
      { word: "崩溃", level: 2, count: 1 },
      { word: "无力感", level: 1, count: 1 },
    ],
    keywords: [
      { word: "作业拖延", count: 4 },
      { word: "学习习惯", count: 3 },
      { word: "手机依赖", count: 2 },
      { word: "亲子沟通", count: 2 },
      { word: "睡眠不足", count: 2 },
      { word: "时间管理", count: 1 },
      { word: "正面管教", count: 1 },
    ],
    suggestions: [
      "与孩子共同制定「回家流程表」，明确到家后的时间分配",
      "设定手机使用规则：作业完成前手机由家长保管",
      "使用番茄钟等工具，将作业拆分为 25 分钟小段完成",
      "对孩子的每个微小进步及时给予具体表扬，而非笼统夸奖",
      "家长自身情绪管理：在督促孩子前先深呼吸，避免情绪化沟通",
      "建议每周与孩子进行一次轻松的「家庭会议」，倾听孩子想法",
    ],
    nextSteps: [
      "一周后跟进「回家流程表」的执行情况",
      "了解孩子对手机管理规则的接受度",
      "观察番茄钟工具使用后作业完成时间是否提前",
      "建议家长记录本周亲子沟通中的积极瞬间",
    ],
  };

  return base;
}
