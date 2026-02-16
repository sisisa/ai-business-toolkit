// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { reviewCodeUseCase } from "@/lib/ai/review";
import { ragQaUseCase } from "@/lib/ai/rag";
import { workflowUseCase } from "@/lib/ai/workflow";

export async function POST(req: NextRequest) {
  try {
    const { type, payload } = await req.json();

    if (type === "review") {
      const result = await reviewCodeUseCase(payload.code);
      return NextResponse.json({ result });
    }

    if (type === "rag") {
      const result = await ragQaUseCase(payload.docs, payload.question);
      return NextResponse.json(result);
    }

    if (type === "workflow") {
      const steps = await workflowUseCase(payload.text);
      return NextResponse.json({ steps });
    }

    return NextResponse.json(
      { error: "Unknown request type" },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "LLM Error" },
      { status: 500 }
    );
  }
}
