import { NextRequest, NextResponse } from "next/server";
import { createChain } from "@/lib/langchain";

export async function POST(req: NextRequest) {
  try {
    const { template, input } = await req.json();

    if (!template || !input) {
      return NextResponse.json(
        { error: "template or input missing" },
        { status: 400 }
      );
    }

    const result = await createChain(template, input);
    return NextResponse.json({ result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "LLM Error" }, { status: 500 });
  }
}
