import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calendarEvents")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calendarEvents")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

export const create = mutation({
  args: {
    companyId: v.id("companies"),
    title: v.string(),
    type: v.union(
      v.literal("zus"),
      v.literal("tax"),
      v.literal("meeting"),
      v.literal("payment"),
      v.literal("hr"),
      v.literal("inne")
    ),
    date: v.string(),
    time: v.optional(v.string()),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    description: v.optional(v.string()),
    recurring: v.optional(
      v.union(
        v.literal("daily"),
        v.literal("weekly"),
        v.literal("monthly"),
        v.literal("yearly")
      )
    ),
    relatedInvoiceId: v.optional(v.id("invoices")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calendarEvents", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const toggleStatus = mutation({
  args: {
    id: v.id("calendarEvents"),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
