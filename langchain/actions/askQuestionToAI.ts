"use server";
import * as dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 1,
});

const prompt =
  ChatPromptTemplate.fromTemplate(`
    You are a high-level assistant. However, you should not stray from the main idea of the answer [answer is : {answer}] given. For example, if the main idea is related to history, you are an expert in history, but you have no opinion on other subjects.
    For question:{question} and with the given content as a answer please give appropriate answer in HTML format.
    The answer is :{answer}.\n
    You can use HTML tags to enhance the paragraph.(hr,pre,underline,bold,italic,highlight etc.) \n
    Like this : <p><strong>Answer</strong> :Lorem ipsum is a dummy or <strong>placeholder</strong> text commonly used in graphic design, publishing, and web development. <p/> \n
    Not like this: <!DOCTYPE html><html><head><title>Answer</title></head><body><p>....content....</p></body></html>
    `);

const chain = prompt.pipe(model);

export const askAI = async (answer: string, question: string) => {
  try {
    const respnse = await chain.invoke({
      answer,
      question,
    });
    return {
      success: true,
      aiMessage: respnse.content,
    };
  } catch (error) {
    console.log(error);
  }
};
