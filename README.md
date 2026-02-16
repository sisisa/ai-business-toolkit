# AI ビジネスツールキット（TypeScript × Next.js × LLM）

## 概要

このリポジトリは、（TypeScript × Next.js（App Router）と AI系のフレームワークを用いて  
複数の LLM 機能を整理された構造で実装するためのサンプルプロジェクトです。

以下の点を重視しています。

- LLM ロジックを `/lib/ai` 配下に集約
- API Route は用途別に薄く保つ
- UI（page.tsx）は API を呼ぶだけに専念
- review / rag / workflow を同一の設計思想で統一

「とりあえず動く」ではなく、「拡張しても破綻しない構成」を目的としています。

---

## 技術スタック

- Next.js（App Router）
- TypeScript
- LangChain（JavaScript）
- OpenAI API
- Tailwind CSS（UI 部分）

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

## 設計方針

### 1. LLM ロジックは lib/ai に集約する

- プロンプト生成
- モデル設定
- invoke の呼び出し

これらはすべて `/lib/ai` に閉じ込めます。

API Route や UI 側に LangChain の詳細を漏らさないのが目的です。

---

### 2. API Route は「橋渡し役」に徹する

`app/api/*/route.ts` の責務は以下のみです。

- リクエストのバリデーション
- lib/ai の関数呼び出し
- レスポンス整形

ビジネスロジックやプロンプトは書きません。

---

### 3. UI は fetch だけ行う

`page.tsx` では以下を守ります。

- LLM の知識を持たない
- prompt を直接書かない
- API の戻り値を描画するだけ

これにより UI の差し替えや再利用が容易になります。

---

## 環境変数の設定

`.env.local` を作成し、以下を設定してください。

```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```


Next.js の API Route と LangChain の両方で参照されます。

---

## 各機能の説明

### /review（コードレビュー）

- TypeScript / React コードを入力
- 可読性、保守性、パフォーマンス、型安全性の観点でレビュー
- 出力形式を固定し、安定したレスポンスを得る設計

対応ファイル：

- lib/ai/review.ts
- app/api/review/route.ts
- app/review/page.tsx

---

### /rag（簡易 RAG）

- 複数ドキュメントを context として渡す
- 質問に対して根拠付きで回答
- 将来的に Embedding や Vector DB に差し替え可能な構造

対応ファイル：

- lib/ai/rag.ts
- app/api/rag/route.ts
- app/rag/page.tsx

---

### /workflow（LLM ワークフロー）

- 要約 → 分類 → アクション提案 の 3 ステップ
- 各ステップを順番に実行
- 入力と出力を UI 上で可視化

対応ファイル：

- lib/ai/workflow.ts
- app/api/workflow/route.ts
- app/workflow/page.tsx

---

## 共通 LLM 設定

`lib/ai/llm.ts` に以下を集約しています。

- ChatOpenAI の初期化
- モデル名
- temperature
- API Key の参照

これにより、モデル変更やパラメータ調整を一箇所で行えます。

---

## この構成のメリット

- 機能追加時に迷わない
- LLM ロジックのテストがしやすい
- UI / API / AI の責務が明確
- 個人開発から実務レベルまでスケール可能

---

## 想定ユースケース

- LLM を使った社内ツールの PoC
- LangChain + Next.js の学習用
- 複数 AI 機能を持つアプリの土台
- プロンプト設計とアーキテクチャ検証

---
