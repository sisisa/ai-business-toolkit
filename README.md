# AI ビジネスツールキット（TypeScript × Next.js × LLM）

TypeScript / Next.js（App Router）を用いて構築した  
**業務向けAIツールのポートフォリオ**です。

LLM（OpenAI）を活用し、**要約・QA（RAG）・コードレビュー・ワークフロー設計**といった  
実務で想定されるAI活用パターンを、API・UI両面から実装しています。

各機能は Next.js の `app/` ディレクトリ配下に UI を持ち、  
LLM・RAG・ワークフローなどのロジックは `lib/` に分離して実装しています。

[![Vercel Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sisisa/langchain-portfolio)

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
app/
├ rag/
│ └ page.tsx        # UI / API呼び出し
├ review/
│ └ page.tsx
├ workflow/
│ └ page.tsx

lib/
├ llm/
│ └ client.ts       # LLM共通処理
├ rag/
│ └ pipeline.ts    # RAGロジック
├ review/
│ └ prompt.ts
├ workflow/
│ └ chain.ts
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

### 開発の流れ（共通）

1. **セットアップ**
   - リポジトリをクローンし、`bun install` で依存関係をインストール
   - `.env.local` に `OPENAI_API_KEY` を設定
2. **開発サーバー起動**
   - `bun run dev` でローカル確認（例: http://localhost:3000）
3. **各アプリの実装**
   - `/rag` … 文書の埋め込み・検索パイプラインとQA用チェーン
   - `/review` … コードを入力とするプロンプト＋構造化出力（Zod）
   - `/workflow` … 複数ステップのチェーンを組み、可視化用データを返すAPI
4. **ビルド・デプロイ**
   - `bun run build` でビルド、Vercel 等でデプロイ

### 技術スタック（概要）

```bash
# プロジェクト作成（参考）
bun create next-app . --typescript --tailwind --eslint

# 主要パッケージ
bun add langchain @langchain/openai @langchain/community zod
```

- **ランタイム**: Bun
- **フロント / API**: Next.js 16 (App Router)
- **LLM / チェーン**: LangChain.js（OpenAI, プロンプト, パーサー）
- **言語・スタイル**: TypeScript, Tailwind CSS v4

---

## クイックスタート

```bash
# 依存関係のインストール
bun install

# 環境変数（.env.local）
echo "OPENAI_API_KEY=sk-..." > .env.local

# 開発サーバー起動
bun run dev
```

ブラウザで http://localhost:3000 を開き、各デモ（/rag, /review, /workflow）にアクセスしてください。

---
