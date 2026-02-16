// lib/ai/workflow.ts
import { createChain } from "@/lib/ai/langchain";

export type WorkflowStepResult = {
  step: number;
  input: string;
  output: string;
};

export async function workflowUseCase(text: string): Promise<WorkflowStepResult[]> {
    if (!text.trim()) {
        throw new Error("input text is required");
    }

    // Step 1: 要約
    const summaryTemplate = `
        以下のテキストを100文字以内で要約してください。

        {text}
    `;
    const summary = await createChain(summaryTemplate, { text });

    // Step 2: 分類
    const categoryTemplate = `
        以下の要約をカテゴリに分類し、理由も述べてください。

        【カテゴリ】
        技術 / 業務 / アイデア / その他

        【要約】
        {text}

        【形式】
        カテゴリ：XXX
        理由：XXX
    `;
    const category = await createChain(categoryTemplate, { text: summary });

    // Step 3: アクション提案
    const actionTemplate = `
        以下の内容を踏まえて、明日1つだけ実行できる具体的なアクションを提案してください。

        {text}

        提案：
    `;
    const action = await createChain(actionTemplate, { text: category });

    return [
        {
            step: 1,
            input: text.slice(0, 80) + "...",
            output: summary,
        },
        {
            step: 2,
            input: summary,
            output: category,
        },
        {
            step: 3,
            input: category,
            output: action,
        },
    ];
}
