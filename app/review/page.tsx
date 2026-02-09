"use client";
import { useState } from "react";

export default function CodeReviewBot() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");

  const reviewCode = async () => {
    const template = `以下のTypeScript/Reactコードを厳しくレビューしてください。
観点：可読性・保守性・パフォーマンス・TypeScript厳格性・エラーハンドリング

形式（必ずこの形式で）：
## 改善点1
問題：...
修正案：...
理由：...

## 改善点2
問題：...
修正案：...
理由：...

## 改善点3
問題：...
修正案：...
理由：...

コード：
\`\`\`
{code}
\`\`\``;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, input: { code } }),
    });
    const { result } = await res.json();
    setReview(result);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🔍 コードレビューBot</h1>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`// レビューしたいコード（例）
const fetchData = async () => {
  const res = await fetch('/api/data');
  return res.json(); // ❌ エラーハンドリングなし
};`}
        className="w-full p-4 border rounded-lg h-80 mb-6 font-mono text-sm resize-vertical"
      />
      
      <button
        onClick={reviewCode}
        disabled={!code.trim()}
        className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-50"
      >
        レビュー開始
      </button>

      {review && (
        <div className="mt-8">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border">
            <h3 className="text-xl font-semibold mb-4">🎯 レビュー結果</h3>
            <div 
              className="whitespace-pre-wrap font-mono text-sm leading-relaxed"
              style={{ lineHeight: '1.6' }}
            >
              {review}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
