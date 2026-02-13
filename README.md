# LangChain × TypeScript ポートフォリオ

Bun + Next.js + LangChain で構築した **3つの実践アプリ** のデモリポジトリです。RAG・プロンプトエンジニアリング・マルチステップチェーンを実装し、LLMアプリ開発の実務スキルをポートフォリオとして示します。

[![Vercel Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sisisa/langchain-portfolio)

---

## デモアプリ一覧

| アプリ | パス | 概要 | 主な技術 |
|--------|------|------|----------|
| **自分専用QA（RAG）** | [/rag](/rag) | 文書検索＋LLM回答 | RAG, 簡易ベクター検索 |
| **コードレビューBot** | [/review](/review) | 構造化コードレビュー | Prompt Engineering, 構造化出力 |
| **ワークフロー可視化** | [/workflow](/workflow) | LLMチェーン可視化 | Multi-step Chain, LCEL |

---

## 3つのアプリを作る流れとツール

### 必要な環境・ツール

| 種別 | ツール | 用途 |
|------|--------|------|
| ランタイム | [Bun](https://bun.sh/) | パッケージ管理・スクリプト実行（`bun install` / `bun run`） |
| フレームワーク | [Next.js](https://nextjs.org/) | App Router, API Routes, フロント |
| LLM | [LangChain.js](https://js.langchain.com/) | チェーン・プロンプト・パーサー |
| モデル | [OpenAI API](https://platform.openai.com/) | GPT-4o-mini 等（環境変数で指定） |
| スタイル | [Tailwind CSS](https://tailwindcss.com/) | UI |
| 型・検証 | [TypeScript](https://www.typescriptlang.org/) + [Zod](https://zod.dev/) | 型安全・構造化出力 |

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
