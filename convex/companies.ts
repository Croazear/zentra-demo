import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("companies").collect();
  },
});

export const getById = query({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByNip = query({
  args: { nip: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("companies")
      .withIndex("by_nip", (q) => q.eq("nip", args.nip))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    nip: v.string(),
    regon: v.optional(v.string()),
    krs: v.optional(v.string()),
    legalForm: v.union(
      v.literal("JDG"),
      v.literal("sp_z_oo"),
      v.literal("sp_jawna"),
      v.literal("sp_komandytowa"),
      v.literal("sa"),
      v.literal("inne")
    ),
    address: v.object({
      street: v.string(),
      city: v.string(),
      postalCode: v.string(),
      country: v.optional(v.string()),
    }),
    taxForm: v.union(
      v.literal("ryczalt"),
      v.literal("liniowy"),
      v.literal("skala"),
      v.literal("CIT")
    ),
    vatRegistered: v.boolean(),
    vatEU: v.optional(v.boolean()),
    bankAccount: v.optional(v.string()),
    bankName: v.optional(v.string()),
    pkdCodes: v.optional(v.array(v.string())),
    foundingDate: v.optional(v.string()),
    ownerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("companies", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("companies"),
    name: v.optional(v.string()),
    bankBalance: v.optional(v.number()),
    bankAccount: v.optional(v.string()),
    bankName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});
