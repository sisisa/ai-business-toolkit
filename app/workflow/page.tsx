"use client";
import { useState } from "react";

type Step = {
  step: number;
  input: string;
  output: string;
};

export default function WorkflowDemo() {
  const [input, setInput] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  const runWorkflow = async () => {
    setLoading(true);
    const text = input.trim();
    if (!text) return;

    try {
      // Step 1: 要約
      const summaryRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "以下のテキストを100文字以内で要約せよ。\n\n{ text }",
          input: { text },
        }),
      });
      const { result: summary } = await summaryRes.json();

      // Step 2: 分類
      const categoryRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "以下の要約を以下のカテゴリに分類し、理由も述べてください。\nカテゴリ：技術/業務/アイデア/その他\n\n要約：{ text }\n\n形式：カテゴリ：XXX\n理由：XXX",
          input: { text: summary },
        }),
      });
      const { result: category } = await categoryRes.json();

      // Step 3: アクション提案
      const actionRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "以下の内容について、明日1つだけ具体的なアクションを提案してください。\n\n{ text }\n\n提案：",
          input: { text: category },
        }),
      });
      const { result: action } = await actionRes.json();

      setSteps([
        { step: 1, input: text.slice(0, 80) + "...", output: summary },
        { step: 2, input: summary, output: category },
        { step: 3, input: category, output: action },
      ]);
    } catch (error) {
      console.error("Workflow error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">⚡ LLMワークフロー可視化</h1>
      
      <div className="mb-8">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="適当なメモを入力（例：ReactのuseEffectが無限ループする問題を解決したい）"
          className="w-full p-4 border rounded-lg h-32 resize-vertical"
        />
        <button
          onClick={runWorkflow}
          disabled={loading || !input.trim()}
          className="mt-3 px-8 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 font-semibold disabled:opacity-50"
        >
          {loading ? "実行中..." : "ワークフロー実行"}
        </button>
      </div>

      {steps.length > 0 && (
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group border-l-4 border-gradient-to-r from-purple-400 to-indigo-500 bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                  {step.step}
                </div>
                <h3 className="font-semibold text-lg">Step {step.step}</h3>
              </div>
              
              <div className="space-y-2 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Input:</span>
                  <p className="mt-1 p-3 bg-white rounded border text-sm">{step.input}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Output:</span>
                  <div className="mt-1 p-3 bg-gradient-to-r from-white to-gray-50 rounded border font-mono text-sm">
                    {step.output}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
