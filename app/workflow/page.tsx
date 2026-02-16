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
  const [error, setError] = useState<string | null>(null);

  const runWorkflow = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setSteps([]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "workflow",
          payload: { text: input },
        }),
      });

      if (!res.ok) {
        throw new Error("API Error");
      }

      const data = await res.json();
      setSteps(data.steps);
    } catch {
      setError("ワークフロー実行中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">LLMワークフロー可視化</h1>
        <p className="text-gray-600">
          要約 → 分類 → アクション提案を順に実行します
        </p>
      </header>

      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メモや課題を入力してください"
          className="w-full h-32 p-4 border rounded-lg resize-vertical"
        />
        <button
          onClick={runWorkflow}
          disabled={loading || !input.trim()}
          className="mt-3 px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? "実行中..." : "ワークフロー実行"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {steps.length > 0 && (
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.step}
              className="border-l-4 border-purple-500 bg-purple-50 p-6 rounded-xl"
            >
              <h3 className="font-semibold mb-2">
                Step {step.step}
              </h3>

              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-600">Input</span>
                  <p className="mt-1 p-2 bg-white rounded border text-sm">
                    {step.input}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Output</span>
                  <pre className="mt-1 p-2 bg-white rounded border text-sm whitespace-pre-wrap">
                    {step.output}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
