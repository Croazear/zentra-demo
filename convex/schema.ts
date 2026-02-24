import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ==========================================
  // FIRMA (Company)
  // ==========================================
  companies: defineTable({
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
    bankBalance: v.optional(v.number()),
    pkdCodes: v.optional(v.array(v.string())),
    foundingDate: v.optional(v.string()),
    ownerId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_nip", ["nip"])
    .index("by_owner", ["ownerId"]),

  // ==========================================
  // KONTRAHENCI (Contractors)
  // ==========================================
  contractors: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_nip", ["nip"]),

  // ==========================================
  // FAKTURY (Invoices - KSeF compatible)
  // ==========================================
  invoices: defineTable({
    companyId: v.id("companies"),
    contractorId: v.optional(v.id("contractors")),

    // Numer i typ
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

    // KSeF
    ksefReferenceNumber: v.optional(v.string()),
    ksefStatus: v.optional(
      v.union(
        v.literal("sent"),
        v.literal("accepted"),
        v.literal("rejected"),
        v.literal("pending"),
        v.literal("not_sent")
      )
    ),
    ksefSentAt: v.optional(v.number()),

    // Daty
    issueDate: v.string(),
    saleDate: v.optional(v.string()),
    dueDate: v.string(),

    // Sprzedawca
    sellerName: v.string(),
    sellerNip: v.string(),
    sellerAddress: v.optional(v.string()),

    // Nabywca
    buyerName: v.string(),
    buyerNip: v.optional(v.string()),
    buyerAddress: v.optional(v.string()),

    // Pozycje faktury
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

    // Sumy
    totalNet: v.number(),
    totalVat: v.number(),
    totalGross: v.number(),
    currency: v.optional(v.string()),

    // Płatność
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
    paymentDate: v.optional(v.string()),
    paymentBankAccount: v.optional(v.string()),

    // Kategoria
    category: v.union(v.literal("przychod"), v.literal("koszt")),
    source: v.union(
      v.literal("KSeF"),
      v.literal("Email"),
      v.literal("Skan"),
      v.literal("Recznie"),
      v.literal("API")
    ),

    // Korekta
    correctedInvoiceId: v.optional(v.id("invoices")),
    correctionReason: v.optional(v.string()),

    // Dodatkowe
    notes: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_contractor", ["contractorId"])
    .index("by_payment_status", ["paymentStatus"])
    .index("by_issue_date", ["issueDate"])
    .index("by_ksef_ref", ["ksefReferenceNumber"])
    .index("by_category", ["category"]),

  // ==========================================
  // DOKUMENTY FIRMY (Company Documents)
  // ==========================================
  companyDocuments: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_type", ["type"])
    .index("by_status", ["status"]),

  // ==========================================
  // KADRA (Employees / HR)
  // ==========================================
  employees: defineTable({
    companyId: v.id("companies"),
    firstName: v.string(),
    lastName: v.string(),
    pesel: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        postalCode: v.string(),
      })
    ),
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
    endDate: v.optional(v.string()),
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
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_status", ["status"])
    .index("by_employment_type", ["employmentType"]),

  // ==========================================
  // WYDARZENIA KALENDARZOWE
  // ==========================================
  calendarEvents: defineTable({
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
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("cancelled")),
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
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_date", ["date"])
    .index("by_type", ["type"]),

  // ==========================================
  // ZADANIA (Tasks)
  // ==========================================
  tasks: defineTable({
    companyId: v.id("companies"),
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
    dueDate: v.optional(v.string()),
    priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    assignedTo: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_completed", ["completed"]),

  // ==========================================
  // ZOBOWIĄZANIA PODATKOWE
  // ==========================================
  taxObligations: defineTable({
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
    paid: v.boolean(),
    paidDate: v.optional(v.string()),
    paidAmount: v.optional(v.number()),
    declarationNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_due_date", ["dueDate"])
    .index("by_type", ["type"]),

  // ==========================================
  // HISTORIA CZATU AI
  // ==========================================
  chatMessages: defineTable({
    companyId: v.optional(v.id("companies")),
    userId: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("model")),
    text: v.string(),
    actionType: v.optional(v.string()),
    actionLabel: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_company", ["companyId"])
    .index("by_user", ["userId"]),

  // ==========================================
  // UDOSTĘPNIENIA DOKUMENTÓW
  // ==========================================
  documentShares: defineTable({
    documentId: v.id("companyDocuments"),
    sharedWithEmail: v.string(),
    sharedWithName: v.optional(v.string()),
    permission: v.union(v.literal("view"), v.literal("edit"), v.literal("admin")),
    sharedAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_email", ["sharedWithEmail"]),
});
