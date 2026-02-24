import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("employees") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    companyId: v.id("companies"),
    firstName: v.string(),
    lastName: v.string(),
    pesel: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    position: v.string(),
    department: v.optional(v.string()),
    employmentType: v.union(
      v.literal("UoP"),
      v.literal("B2B"),
      v.literal("zlecenie"),
      v.literal("dzielo"),
      v.literal("staz"),
      v.literal("praktyka")
    ),
    hireDate: v.string(),
    salaryGross: v.optional(v.number()),
    salaryNet: v.optional(v.number()),
    zusCode: v.optional(v.string()),
    taxOffice: v.optional(v.string()),
    bankAccount: v.optional(v.string()),
    status: v.union(
      v.literal("aktywny"),
      v.literal("urlop"),
      v.literal("l4"),
      v.literal("zwolniony"),
      v.literal("zawieszony")
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("employees", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("employees"),
    status: v.union(
      v.literal("aktywny"),
      v.literal("urlop"),
      v.literal("l4"),
      v.literal("zwolniony"),
      v.literal("zawieszony")
    ),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      endDate: args.endDate,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("employees") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
