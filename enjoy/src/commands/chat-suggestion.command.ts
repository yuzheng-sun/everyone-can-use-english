import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { jsonCommand } from "./json.command";

export const chatSuggestionCommand = async (
  params: {
    learningLanguage: string;
    nativeLanguage: string;
    context: string;
  },
  options: {
    key: string;
    modelName?: string;
    temperature?: number;
    baseUrl?: string;
  }
): Promise<{
  suggestions: {
    text: string;
    explaination: string;
  }[];
}> => {
  const { learningLanguage, nativeLanguage, context } = params;
  const schema = z.object({
    words: z.array(
      z.object({
        content: z.string().min(1),
        explaination: z.string().min(1),
      })
    ),
  });

  const prompt = await ChatPromptTemplate.fromMessages([
    ["system", SYSTEM_PROMPT],
    ["human", PROMPT],
  ]).format({
    native_language: nativeLanguage,
    learning_language: learningLanguage,
    context,
  });

  return jsonCommand(prompt, { ...options, schema });
};

const SYSTEM_PROMPT = `I speak {native_language}. You're my {learning_language} coach. I'am chatting with foreign friends. And I don't know what to say next.

[Context]
{context}`;

const PROMPT = `Please provide me with at least 5 suggestions for what counld I say and explain them in {native_language}.

Reply in JSON format only. The output should be structured like this:
{{
  suggestions: [
    {{
      text: "suggestion",
      explaination: "explaination"
    }}
  ]
}}`;
