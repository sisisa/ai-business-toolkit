"use client";
import { useState } from "react";

export default function RAGDemo() {
  const [docs, setDocs] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);

  const addDocs = (text: string) => {
    const chunks = text.split(/[\n。]\s+/).map(s => s.trim()).filter(Boolean);
    setDocs(chunks.slice(0, 10)); // 最大10チャンク
  };

  const simpleSimilarity = (a: string, b: string) => {
    const wordsA = a.toLowerCase().split(/\s+/);
    const wordsB = b.toLowerCase().split(/\s+/);
    const common = wordsA.filter(w => wordsB.includes(w)).length;
    return common / Math.sqrt(wordsA.length * wordsB.length) || 0;
  };

  const ask = async () => {
    if (!docs.length) return;

    const relevant = docs
      .map((doc, i) => ({
        doc,
        score: simpleSimilarity(question, doc),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(d => d.doc);

    const template = `以下の文書を参考に質問に答えて。出典も明記してください。

文書: {context}
質問: {question}`;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, input: { context: relevant.join("\n\n"), question } }),
    });
    const { result } = await res.json();
    
    setAnswer(result);
    setSources(relevant);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">📚 自分専用QA（簡易RAG）</h1>
      
      <textarea
        onChange={(e) => addDocs(e.target.value)}
        placeholder="技術メモや記事を貼り付け...（例：ReactのuseEffectは...）"
        className="w-full p-4 border rounded-lg h-40 mb-4 font-mono text-sm resize-vertical"
      />
      
      <div className="flex gap-2 mb-8">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="質問を入力（例：useEffectの依存配列って？）"
          className="flex-1 p-4 border rounded-lg"
        />
        <button
          onClick={ask}
          disabled={!docs.length || !question}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          質問
        </button>
      </div>

      {answer && (
        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <h3 className="font-semibold mb-2">回答</h3>
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-medium mb-2">出典（{sources.length}件）</h4>
            {sources.map((src, i) => (
              <p key={i} className="text-sm text-gray-700 p-2 bg-white rounded border-l-4 border-blue-400 mb-1">
                {src.slice(0, 100)}...
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
