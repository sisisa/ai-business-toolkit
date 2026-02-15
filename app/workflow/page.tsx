"use client";
import { useState } from "react";

// ワークフローの各ステップを画面表示用に保持するための型
type Step = {
  // 何番目のステップか（1, 2, 3 ...）
  step: number;
  // LLM に渡した入力（要約や分類結果など）
  input: string;
  // LLM から返ってきた出力テキスト
  output: string;
};

// ワークフロー可視化用のデモコンポーネント
export default function WorkflowDemo() {
  // テキストエリアの入力値
  const [input, setInput] = useState("");
  // ワークフローの各ステップの結果
  const [steps, setSteps] = useState<Step[]>([]);
  // API 呼び出し中かどうかのフラグ
  const [loading, setLoading] = useState(false);

  // ワークフロー全体（要約 -> 分類 -> アクション提案）を順番に実行する関数
  const runWorkflow = async () => {
    setLoading(true);

    // 入力テキストをトリムして空でないかチェック
    const text = input.trim();
    if (!text) {
      // 何も入力されていない場合はローディング状態を解除して終了
      setLoading(false);
      return;
    }

    try {
      // Step 1: 要約
      // - /api/chat では OpenAI API キー（.env.local）を使って LangChain 経由で LLM を呼び出す
      // - ここでは「100文字以内で要約せよ」というテンプレートと実際の入力テキストを渡している
      const summaryRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: "以下のテキストを100文字以内で要約せよ。\n\n{text}",
          input: {text},
        }),
      });
      const { result: summary } = await summaryRes.json();

      // Step 2: 分類
      // - Step 1 の要約結果を使って「技術/業務/アイデア/その他」に分類
      // - カテゴリとその理由をセットで返してもらう
      const categoryRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template:
            "以下の要約を以下のカテゴリに分類し、理由も述べてください。\nカテゴリ：技術/業務/アイデア/その他\n\n要約：{text}\n\n形式：カテゴリ：XXX\n理由：XXX",
          input: { text: summary },
        }),
      });
      const { result: category } = await categoryRes.json();

      // Step 3: アクション提案
      // - Step 2 の分類結果をもとに、明日 1 つだけ実行する具体的なアクション案を生成
      const actionRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template:
            "以下の内容について、明日1つだけ具体的なアクションを提案してください。\n\n{text}\n\n提案：",
          input: { text: category },
        }),
      });
      const { result: action } = await actionRes.json();

      // 3 つのステップを画面表示用の配列にまとめて保存
      setSteps([
        {
          step: 1,
          // 入力テキストは長くなりがちなので、先頭だけ切り出して表示
          input: text.slice(0, 80) + "...",
          output: summary,
        },
        { step: 2, input: summary, output: category },
        { step: 3, input: category, output: action },
      ]);
    } catch (error) {
      // ネットワークエラーや LLM 側のエラーが発生した場合
      console.error("Workflow error:", error);
    } finally {
      // 成功・失敗に関わらずローディング状態を解除
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

      {/* ステップが 1 つ以上存在する場合のみ結果を表示 */}
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
