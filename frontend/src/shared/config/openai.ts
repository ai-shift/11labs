export const openaiApiKey = process.env.OPENAI_API_KEY;
if (openaiApiKey == null) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}
