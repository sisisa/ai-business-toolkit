"use client";
import { useState } from "react";

export default function CodeReviewBot() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setReview("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "review",
          payload: { code },
        }),
      });

      if (!res.ok) {
        throw new Error("API Error");
      }

      const { result } = await res.json();
      setReview(result);
    } catch {
      setError("レビュー中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">コードレビューBot</h1>
        <p className="text-gray-600">
          TypeScript / React のコードを実務視点でレビューします
        </p>
      </header>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`const fetchData = async () => {
          const res = await fetch("/api/data");
          return res.json();
        };`}
        className="w-full h-80 p-4 border rounded-lg font-mono text-sm"
      />

      <button
        onClick={reviewCode}
        disabled={loading || !code.trim()}
        className="px-8 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "レビュー中..." : "レビュー開始"}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {review && (
        <section className="p-6 bg-green-50 rounded-xl border">
          <h2 className="text-xl font-semibold mb-4">レビュー結果</h2>
          <div className="whitespace-pre-wrap font-mono text-sm">
            {review}
          </div>
        </section>
      )}
    </div>
  );
}
