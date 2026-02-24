import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contractors")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("contractors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    nip: v.optional(v.string()),
    regon: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        postalCode: v.string(),
        country: v.optional(v.string()),
      })
    ),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.union(v.literal("klient"), v.literal("dostawca"), v.literal("oba")),
    bankAccount: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contractors", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("contractors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
