import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

export async function createChain(template: string, input: Record<string, any>) {
  try {
    const prompt = ChatPromptTemplate.fromTemplate(template);
    const chain = prompt.pipe(llm).pipe(new StringOutputParser());
    return await chain.invoke(input);
  } catch (e) {
    console.error(e);
    throw e;
  }
}
