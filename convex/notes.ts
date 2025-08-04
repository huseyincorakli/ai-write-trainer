import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addNotes = mutation({
  args: {
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("fileId"), args.fileId))
      .collect();
    try {
      if (record?.length == 0) {
        await ctx.db.insert("notes", {
          fileId: args.fileId,
          createdBy: args.createdBy,
          notes: args.notes,
        });
        return "Added";
      } else {
        await ctx.db.patch(record[0]._id, { notes: args.notes });
        return "Updated";
      }
    } catch (error) {
      console.log("ADDNOTE ERROR", error);
    }
  },
});

export const getNotes = query({
  args: {
    fileId: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("notes")
      .filter((q) =>
        q.and(
          q.eq(q.field("fileId"), args.fileId),
          q.eq(q.field("createdBy"), args.createdBy)
        )
      )
      .collect();

    if (records.length > 0) {
      return records[0].notes as string;
    } else {
      return "<p></p>";
    }
  },
});
