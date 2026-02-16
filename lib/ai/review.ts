// lib/ai/review.ts
import { createChain } from "@/lib/ai/langchain";

export async function reviewCodeUseCase(code: string) {
  const template = `
  あなたはプロのエンジニアです。
  以下の TypeScript / React コードを実務レビューしてください。

  【観点】
  - 可読性
  - 保守性
  - パフォーマンス
  - 型安全性
  - エラーハンドリング

  【出力形式】
  ## 改善点1
  問題：
  修正案：
  理由：

  ## 改善点2
  問題：
  修正案：
  理由：

  ## 改善点3
  問題：
  修正案：
  理由：

  【コード】
  \`\`\`ts
  {code}
  \`\`\`
  `;

  return createChain(template, { code });
}
