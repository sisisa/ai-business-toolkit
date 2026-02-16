// lib/ai/rag.ts
import { createChain } from "@/lib/ai/langchain";

/**
 * シンプルな類似度（デモ用）
 */
function similarity(a: string, b: string) {
  const wa = a.toLowerCase().split(/\s+/);
  const wb = b.toLowerCase().split(/\s+/);
  const common = wa.filter(w => wb.includes(w)).length;
  return common / Math.sqrt(wa.length * wb.length) || 0;
}

/**
 * RAG QA ユースケース
 */
export async function ragQaUseCase(
  docs: string[],
  question: string
) {
  if (!docs.length || !question) {
    throw new Error("docs and question are required");
  }

  const relevantDocs = docs
    .map(doc => ({
      doc,
      score: similarity(question, doc),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(d => d.doc);

  const template = `
    以下の文書を参考に、質問に日本語で答えてください。
    必ず文書の内容に基づいて回答してください。

    【文書】
    {context}

    【質問】
    {question}

    【出力条件】
    - 不明な場合は「文書内に記載がありません」と答える
    - 推測しない
  `;

  const answer = await createChain(template, {
    context: relevantDocs.join("\n\n"),
    question,
  });

  return {
    answer,
    sources: relevantDocs,
  };
}
