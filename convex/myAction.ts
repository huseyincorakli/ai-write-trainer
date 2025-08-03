"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";



export const ingest = action({
  args: {
    texts:v.array(v.string()),
    fileId:v.string()
  },
  handler: async (ctx,args) => {
    
    await ConvexVectorStore.fromTexts(
      args.texts,
      {file:args.fileId},
        new GoogleGenerativeAIEmbeddings({
        apiKey:"",
        model: "text-embedding-004", 
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",}),
      { ctx }
    );
  },
});