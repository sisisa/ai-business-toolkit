# AI ビジネスツールキット（TypeScript × Next.js × LLM）

TypeScript / Next.js（App Router）を用いて構築した  
**業務向けAIツールのポートフォリオ**です。

LLM（OpenAI）を活用し、**要約・QA（RAG）・コードレビュー・ワークフロー設計**といった  
実務で想定されるAI活用パターンを、API・UI両面から実装しています。

各機能は Next.js の `app/` ディレクトリ配下に UI を持ち、  
LLM・RAG・ワークフローなどのロジックは `lib/` に分離して実装しています。

[![Vercel Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sisisa/ai-business-toolkit)

---

## 実装済みツール一覧

| 機能 | ルート | 想定業務 |
|------|-------|---------|
| 社内QA（RAG） | `/rag` | ドキュメント検索 |
| コードレビュー支援 | `/review` | PRレビュー補助 |
| ワークフロー可視化 | `/workflow` | 処理設計の説明 |

各ルートは `page.tsx` を UI エントリとし、  
AI処理は `lib/` 配下のモジュールを呼び出す構成です。

---

## ディレクトリ構造
```text
.
├─ app
│  ├─ api
│  │  ├─ chat
│  │  │  └─ route.ts
│  │  ├─ review
│  │  │  └─ route.ts
│  │  ├─ rag
│  │  │  └─ route.ts
│  │  └─ workflow
│  │     └─ route.ts
│  │
│  ├─ review
│  │  └─ page.tsx
│  ├─ rag
│  │  └─ page.tsx
│  └─ workflow
│     └─ page.tsx
│
├─ lib
│  └─ ai
│     ├─ langchain.ts
│     ├─ review.ts
│     ├─ rag.ts
│     └─ workflow.ts
│
├─ .env.local
└─ README.md

```

---

## アーキテクチャ概要

- **フロントエンド**  
  - Next.js App Router  
  - Tailwind CSS  

- **API / サーバー処理**  
  - Next.js API Routes  
  - LangChain.js  

- **LLM / AI**  
  - OpenAI API（GPT-4o-mini）  
  - Prompt Engineering  
  - Zod による構造化レスポンス  

## 使用技術

| 区分 | 技術 |
|-----|------|
| 言語 | TypeScript |
| フレームワーク | Next.js（App Router） |
| LLMフレームワーク | LangChain.js |
| モデル | OpenAI API |
| ランタイム | Bun |
| UI | Tailwind CSS |
| 型・検証 | Zod |

### 技術スタック


- **ランタイム**: Bun
- **フロント / API**: Next.js 16 (App Router)
- **LLM / チェーン**: LangChain.js（OpenAI, プロンプト, パーサー）
- **言語・スタイル**: TypeScript, Tailwind CSS v4

---

## クイックスタート


```bash
# 依存関係のインストール
bun install

# プロジェクト作成（参考）
bun create next-app . --typescript --tailwind --eslint

# 主要パッケージ
bun add langchain @langchain/openai @langchain/community zod

# 環境変数（.env.local）
echo "OPENAI_API_KEY=sk-..." > .env.local

# 開発サーバー起動
bun run dev
```

ブラウザで http://localhost:3000 を開き、各デモ（/rag, /review, /workflow）にアクセスしてください。

---

## 設計方針
1. LLM ロジックは lib/ai に集約する

- プロンプト生成

- モデル設定

- invoke の呼び出し

これらはすべて /lib/ai 内で管理します。

API Route や UI 側に LangChain の詳細を漏らさないのが目的。

2. API Route は「橋渡し役」に徹する

- app/api/*/route.ts の責務は以下のみです。

- リクエストのバリデーション

- lib/ai の関数呼び出し

- レスポンス整形

ビジネスロジックやプロンプトは書きません。

3. UI は fetch だけ行う

page.tsx では以下を守ります。

- LLM の知識を持たない

- prompt を直接書かない

- API の戻り値を描画するだけ

これにより UI の差し替えや再利用が容易になります。

## 環境変数の設定

.env.local を作成し、以下を設定してください。
```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

Next.js の API Route と LangChain の両方で参照されます。