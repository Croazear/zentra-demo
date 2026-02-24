import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("companyDocuments")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("companyDocuments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    companyId: v.id("companies"),
    title: v.string(),
    type: v.union(
      v.literal("umowa"),
      v.literal("aneks"),
      v.literal("polisa"),
      v.literal("regulamin"),
      v.literal("pismo_urzedowe"),
      v.literal("decyzja"),
      v.literal("koncesja"),
      v.literal("certyfikat"),
      v.literal("inne")
    ),
    contractor: v.optional(v.string()),
    contractorId: v.optional(v.id("contractors")),
    issueDate: v.optional(v.string()),
    expiryDate: v.optional(v.string()),
    status: v.union(
      v.literal("aktywny"),
      v.literal("archiwalny"),
      v.literal("do_podpisu"),
      v.literal("wygasly")
    ),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    source: v.optional(
      v.union(
        v.literal("KSeF"),
        v.literal("Email"),
        v.literal("Skan"),
        v.literal("Recznie"),
        v.literal("PUE")
      )
    ),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("companyDocuments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("companyDocuments"),
    status: v.union(
      v.literal("aktywny"),
      v.literal("archiwalny"),
      v.literal("do_podpisu"),
      v.literal("wygasly")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("companyDocuments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
