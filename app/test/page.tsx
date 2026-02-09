"use client";

export default function TestPage() {
  const testAPI = async () => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: '{input}を要約せよ',
          input: 'LangChainはLLMアプリ開発フレームワーク'
        })
      });
      console.log("API KEY:", process.env.OPENAI_API_KEY);
      const data = await res.json();
      document.getElementById('result')!.innerHTML = 
        `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch(e) {
      document.getElementById('result')!.innerHTML = `Error: ${e}`;
    }
  };

  return (
    <div style={{padding: '40px', fontFamily: 'monospace'}}>
      <h1>APIテストページ</h1>
      <button onClick={testAPI} style={{padding: '10px 20px', fontSize: '16px'}}>
        APIテスト実行
      </button>
      <div id="result" style={{marginTop: '20px', background: '#f5f5f5', padding: '20px'}}>
        結果がここに表示されます
      </div>
    </div>
  );
}
