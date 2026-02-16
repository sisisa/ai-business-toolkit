export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          LangChain × TypeScript
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          LangChainの実践ポートフォリオ。RAG、構造化プロンプト、チェーンを体感。
        </p>

       <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <a href="/rag" className="group p-8 bg-white/70 backdrop-blur-sm rounded-2xl border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              📚
            </div>
            <h3 className="text-xl font-bold mb-2">自分専用QA（RAG）</h3>
            <p>技術メモを貼ると質問に答えてくれる</p>
          </a>
          
          <a href="/review" className="group p-8 bg-white/70 backdrop-blur-sm rounded-2xl border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              🔍
            </div>
            <h3 className="text-xl font-bold mb-2">コードレビューBot</h3>
            <p>TS/Reactコードの改善提案を自動生成</p>
          </a>
          
          <a href="/workflow" className="group p-8 bg-white/70 backdrop-blur-sm rounded-2xl border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-2">ワークフロー可視化</h3>
            <p>LLMチェーンの各ステップを可視化</p>
          </a>
        </div>
        
      </div>
    </div>
  );
}
