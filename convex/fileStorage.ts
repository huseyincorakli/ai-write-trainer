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

export const deleteFile = mutation({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
   const file = await ctx.db.query("pdfFiles").filter((q) => q.eq(q.field("fileId"), args.fileId)).collect();
   
  if(file&& file.length>0){
    const documents = await ctx.db.query('documents').filter(q=>q.eq(q.field('metadata.file'),args.fileId)).collect();
    const notes = await ctx.db.query('notes').filter(q=>q.eq(q.field('fileId'),args.fileId)).collect();

     
     try {
      await ctx.storage.delete(file[0].storageId)
      await ctx.db.delete(file[0]._id);
      for (const doc of documents) {
        await ctx.db.delete(doc._id);
      }
      for (const note of notes) {
        await ctx.db.delete(note._id);
      }
     } catch (error) {
      
     }
  }
      

    return "File deleted successfully";
  }})
