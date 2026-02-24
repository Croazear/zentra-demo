import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    companyId: v.optional(v.id("companies")),
    userId: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("model")),
    text: v.string(),
    actionType: v.optional(v.string()),
    actionLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatMessages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
