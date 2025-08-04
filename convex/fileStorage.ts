import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const addFileEntryToDb = mutation({
  args: {
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    createdBy: v.string(),
    fileUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("pdfFiles", {
      fileId: args.fileId,
      storageId: args.storageId,
      fileName: args.fileName,
      createdBy: args.createdBy,
      fileUrl: args.fileUrl,
    });

    return "Inserted";
  },
});

export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const response = ctx.storage.getUrl(args.storageId);
    return response;
  },
});

//&& q.eq(q.field('createdBy'),args.usermail)
export const getFileRecord = query({
  args: {
    fileId: v.string(),
    // usermail:v.string()
  },
  handler: async (ctx, args) => {
    const fileInfo = await ctx.db
      .query("pdfFiles")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    return fileInfo;
  },
});

export const getUserFiles = query({
  args: {
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pdfFiles")
      .filter(
        (q) =>
          q.eq(q.field("createdBy"), args.createdBy)
      )
      .collect();
  },
});
