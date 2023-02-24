import { OpenAI, LLMChain } from "langchain";
import { loadPrompt } from "langchain/prompts";

export const config = {
  runtime: "edge",
};

export default async (req: Request) => {
  const openai = new OpenAI();
  const chain = new LLMChain({
    llm: openai,
    prompt: await loadPrompt("lc://prompts/hello-world/prompt.yaml"),
  });
  await chain.run("hello");
  return new Response(`Hello, from ${req.url} I'm now an Edge Function!`);
};
