// lib/ai/langchain.ts
import { ChatOpenAI } from "@langchain/openai";

export async function createChain(
  template: string,
  input: Record<string, string>
): Promise<string> {
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = Object.entries(input).reduce(
    (acc, [key, value]) =>
      acc.replace(new RegExp(`{${key}}`, "g"), value),
    template
  );

  const result = await model.invoke(prompt);
  const content = result.content;
  if (typeof content === "string") return content;
  return content.map((block) => ("text" in block ? block.text : String(block))).join("");
}
