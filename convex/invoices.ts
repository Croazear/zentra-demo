import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Pobierz wszystkie faktury firmy
export const getByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
  },
});

// Pobierz fakturę po ID
export const getById = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Pobierz faktury wg statusu płatności
export const getByPaymentStatus = query({
  args: {
    paymentStatus: v.union(
      v.literal("oplacone"),
      v.literal("nieoplacone"),
      v.literal("czesciowo"),
      v.literal("przeterminowane")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invoices")
      .withIndex("by_payment_status", (q) =>
        q.eq("paymentStatus", args.paymentStatus)
      )
      .collect();
  },
});

// Utwórz nową fakturę
export const create = mutation({
  args: {
    companyId: v.id("companies"),
    contractorId: v.optional(v.id("contractors")),
    invoiceNumber: v.string(),
    invoiceType: v.union(
      v.literal("VAT"),
      v.literal("korygujaca"),
      v.literal("zaliczkowa"),
      v.literal("koncowa"),
      v.literal("marza"),
      v.literal("RR"),
      v.literal("proforma")
    ),
    issueDate: v.string(),
    saleDate: v.optional(v.string()),
    dueDate: v.string(),
    sellerName: v.string(),
    sellerNip: v.string(),
    sellerAddress: v.optional(v.string()),
    buyerName: v.string(),
    buyerNip: v.optional(v.string()),
    buyerAddress: v.optional(v.string()),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        unit: v.string(),
        unitPriceNet: v.number(),
        vatRate: v.union(
          v.literal("23"),
          v.literal("8"),
          v.literal("5"),
          v.literal("0"),
          v.literal("zw"),
          v.literal("np")
        ),
        amountNet: v.number(),
        amountVat: v.number(),
        amountGross: v.number(),
        pkwiu: v.optional(v.string()),
        gtu: v.optional(v.string()),
      })
    ),
    totalNet: v.number(),
    totalVat: v.number(),
    totalGross: v.number(),
    currency: v.optional(v.string()),
    paymentMethod: v.optional(
      v.union(
        v.literal("przelew"),
        v.literal("gotowka"),
        v.literal("karta"),
        v.literal("kompensata"),
        v.literal("barter")
      )
    ),
    paymentStatus: v.union(
      v.literal("oplacone"),
      v.literal("nieoplacone"),
      v.literal("czesciowo"),
      v.literal("przeterminowane")
    ),
    category: v.union(v.literal("przychod"), v.literal("koszt")),
    source: v.union(
      v.literal("KSeF"),
      v.literal("Email"),
      v.literal("Skan"),
      v.literal("Recznie"),
      v.literal("API")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("invoices", {
      ...args,
      ksefStatus: "not_sent",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Aktualizuj status płatności
export const updatePaymentStatus = mutation({
  args: {
    id: v.id("invoices"),
    paymentStatus: v.union(
      v.literal("oplacone"),
      v.literal("nieoplacone"),
      v.literal("czesciowo"),
      v.literal("przeterminowane")
    ),
    paymentDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      paymentStatus: args.paymentStatus,
      paymentDate: args.paymentDate,
      updatedAt: Date.now(),
    });
  },
});

// Usuń fakturę
export const remove = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
