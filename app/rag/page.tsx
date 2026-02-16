"use client";
import { useState } from "react";

export default function RAGDemo() {
  const [docs, setDocs] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDocs = (text: string) => {
    const chunks = text
      .split(/[\n。]\s+/)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 10);
    setDocs(chunks);
  };

  const ask = async () => {
    if (!docs.length || !question) return;

    setLoading(true);
    setError(null);
    setAnswer("");
    setSources([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "rag",
          payload: {
            docs,
            question,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("API Error");
      }

      const data = await res.json();
      setAnswer(data.answer);
      setSources(data.sources);
    } catch {
      setError("質問処理中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">自分専用QA（RAG）</h1>
        <p className="text-gray-600">
          メモを貼り付けて質問すると、内容に基づいて回答します
        </p>
      </header>

      <textarea
        onChange={(e) => addDocs(e.target.value)}
        placeholder="技術メモや記事を貼り付けてください"
        className="w-full h-40 p-4 border rounded-lg font-mono text-sm"
      />

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="質問を入力"
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={ask}
          disabled={loading || !docs.length || !question}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "回答中..." : "質問"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {answer && (
        <section className="space-y-4">
          <div className="p-6 bg-blue-50 rounded-xl border">
            <h2 className="font-semibold mb-2">回答</h2>
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-medium mb-2">
              出典（{sources.length}件）
            </h3>
            {sources.map((s, i) => (
              <p
                key={i}
                className="text-sm bg-white p-2 rounded border-l-4 border-blue-400 mb-1"
              >
                {s.slice(0, 100)}...
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}