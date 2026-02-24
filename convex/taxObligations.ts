import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("taxObligations")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

export const getUpcoming = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("taxObligations")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
    return all.filter((t) => !t.paid);
  },
});

export const create = mutation({
  args: {
    companyId: v.id("companies"),
    type: v.union(
      v.literal("VAT"),
      v.literal("PIT"),
      v.literal("CIT"),
      v.literal("ZUS_spoleczne"),
      v.literal("ZUS_zdrowotne"),
      v.literal("ZUS_FP"),
      v.literal("akcyza")
    ),
    period: v.string(),
    amount: v.number(),
    dueDate: v.string(),
    declarationNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("taxObligations", {
      ...args,
      paid: false,
      createdAt: Date.now(),
    });
  },
});

export const markPaid = mutation({
  args: {
    id: v.id("taxObligations"),
    paidDate: v.string(),
    paidAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      paid: true,
      paidDate: args.paidDate,
      paidAmount: args.paidAmount,
    });
  },
});
