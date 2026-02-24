import { mutation } from "./_generated/server";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // ============ FIRMA ============
    const companyId = await ctx.db.insert("companies", {
      name: "TechFlow Sp. z o.o.",
      nip: "5213456789",
      regon: "147258369",
      krs: "0000567890",
      legalForm: "sp_z_oo",
      address: {
        street: "ul. Marszałkowska 55/3",
        city: "Warszawa",
        postalCode: "00-676",
        country: "PL",
      },
      taxForm: "CIT",
      vatRegistered: true,
      vatEU: true,
      bankAccount: "PL61 1090 1014 0000 0712 1981 2874",
      bankName: "Santander Bank Polska",
      bankBalance: 284350.67,
      pkdCodes: ["62.01.Z", "62.02.Z", "63.11.Z"],
      foundingDate: "2019-03-15",
      ownerId: "user_owner_1",
      createdAt: now,
      updatedAt: now,
    });

    // ============ KONTRAHENCI ============
    const kontrahent1 = await ctx.db.insert("contractors", {
      companyId,
      name: "ABC Software House Sp. z o.o.",
      nip: "7812345678",
      regon: "365412789",
      address: {
        street: "ul. Piłsudskiego 12",
        city: "Kraków",
        postalCode: "31-110",
        country: "PL",
      },
      email: "biuro@abcsoftware.pl",
      phone: "+48 12 345 67 89",
      type: "klient",
      bankAccount: "PL27 1140 2004 0000 3002 0135 5387",
      notes: "Stały klient od 2020 roku, terminowe płatności",
      createdAt: now,
    });

    const kontrahent2 = await ctx.db.insert("contractors", {
      companyId,
      name: "Jan Kowalski - Usługi IT",
      nip: "6181234567",
      address: {
        street: "ul. Poznańska 44",
        city: "Poznań",
        postalCode: "60-853",
        country: "PL",
      },
      email: "jan.kowalski@uslugit.pl",
      phone: "+48 61 234 56 78",
      type: "dostawca",
      bankAccount: "PL83 1020 4027 0000 1502 1365 0119",
      createdAt: now,
    });

    const kontrahent3 = await ctx.db.insert("contractors", {
      companyId,
      name: "DataVision S.A.",
      nip: "9512345678",
      regon: "012345678",
      address: {
        street: "ul. Lwowska 19",
        city: "Wrocław",
        postalCode: "50-301",
        country: "PL",
      },
      email: "kontakt@datavision.pl",
      phone: "+48 71 987 65 43",
      type: "oba",
      createdAt: now,
    });

    // ============ FAKTURY ============
    await ctx.db.insert("invoices", {
      companyId,
      contractorId: kontrahent1,
      invoiceNumber: "FV/2025/02/001",
      invoiceType: "VAT",
      ksefStatus: "accepted",
      ksefReferenceNumber: "KSeF-2025-0000012345-AA",
      ksefSentAt: now - 86400000 * 5,
      issueDate: "2025-02-10",
      saleDate: "2025-02-10",
      dueDate: "2025-02-24",
      sellerName: "TechFlow Sp. z o.o.",
      sellerNip: "5213456789",
      sellerAddress: "ul. Marszałkowska 55/3, 00-676 Warszawa",
      buyerName: "ABC Software House Sp. z o.o.",
      buyerNip: "7812345678",
      buyerAddress: "ul. Piłsudskiego 12, 31-110 Kraków",
      items: [
        {
          name: "Usługi programistyczne - rozwój platformy e-commerce",
          quantity: 160,
          unit: "godz.",
          unitPriceNet: 180,
          vatRate: "23",
          amountNet: 28800,
          amountVat: 6624,
          amountGross: 35424,
          gtu: "GTU_12",
        },
        {
          name: "Konsultacje architektura IT",
          quantity: 8,
          unit: "godz.",
          unitPriceNet: 350,
          vatRate: "23",
          amountNet: 2800,
          amountVat: 644,
          amountGross: 3444,
          gtu: "GTU_12",
        },
      ],
      totalNet: 31600,
      totalVat: 7268,
      totalGross: 38868,
      currency: "PLN",
      paymentMethod: "przelew",
      paymentStatus: "oplacone",
      paymentDate: "2025-02-20",
      paymentBankAccount: "PL61 1090 1014 0000 0712 1981 2874",
      category: "przychod",
      source: "KSeF",
      tags: ["IT", "e-commerce", "stały klient"],
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("invoices", {
      companyId,
      contractorId: kontrahent2,
      invoiceNumber: "FV/2025/02/002",
      invoiceType: "VAT",
      ksefStatus: "pending",
      issueDate: "2025-02-15",
      saleDate: "2025-02-15",
      dueDate: "2025-03-01",
      sellerName: "Jan Kowalski - Usługi IT",
      sellerNip: "6181234567",
      sellerAddress: "ul. Poznańska 44, 60-853 Poznań",
      buyerName: "TechFlow Sp. z o.o.",
      buyerNip: "5213456789",
      buyerAddress: "ul. Marszałkowska 55/3, 00-676 Warszawa",
      items: [
        {
          name: "Licencja oprogramowania - system CRM",
          quantity: 1,
          unit: "szt.",
          unitPriceNet: 12000,
          vatRate: "23",
          amountNet: 12000,
          amountVat: 2760,
          amountGross: 14760,
        },
      ],
      totalNet: 12000,
      totalVat: 2760,
      totalGross: 14760,
      currency: "PLN",
      paymentMethod: "przelew",
      paymentStatus: "nieoplacone",
      paymentBankAccount: "PL83 1020 4027 0000 1502 1365 0119",
      category: "koszt",
      source: "Email",
      tags: ["licencja", "CRM"],
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("invoices", {
      companyId,
      contractorId: kontrahent3,
      invoiceNumber: "FV/2025/01/008",
      invoiceType: "VAT",
      ksefStatus: "accepted",
      ksefReferenceNumber: "KSeF-2025-0000009876-BB",
      ksefSentAt: now - 86400000 * 30,
      issueDate: "2025-01-20",
      saleDate: "2025-01-20",
      dueDate: "2025-02-03",
      sellerName: "TechFlow Sp. z o.o.",
      sellerNip: "5213456789",
      sellerAddress: "ul. Marszałkowska 55/3, 00-676 Warszawa",
      buyerName: "DataVision S.A.",
      buyerNip: "9512345678",
      buyerAddress: "ul. Lwowska 19, 50-301 Wrocław",
      items: [
        {
          name: "Audyt bezpieczeństwa aplikacji webowej",
          quantity: 1,
          unit: "szt.",
          unitPriceNet: 15000,
          vatRate: "23",
          amountNet: 15000,
          amountVat: 3450,
          amountGross: 18450,
          gtu: "GTU_12",
        },
        {
          name: "Raport z rekomendacjami bezpieczeństwa",
          quantity: 1,
          unit: "szt.",
          unitPriceNet: 5000,
          vatRate: "23",
          amountNet: 5000,
          amountVat: 1150,
          amountGross: 6150,
          gtu: "GTU_12",
        },
      ],
      totalNet: 20000,
      totalVat: 4600,
      totalGross: 24600,
      currency: "PLN",
      paymentMethod: "przelew",
      paymentStatus: "przeterminowane",
      paymentBankAccount: "PL61 1090 1014 0000 0712 1981 2874",
      category: "przychod",
      source: "KSeF",
      tags: ["bezpieczeństwo", "audyt"],
      createdAt: now,
      updatedAt: now,
    });

    // ============ PRACOWNICY ============
    await ctx.db.insert("employees", {
      companyId,
      firstName: "Anna",
      lastName: "Nowak",
      pesel: "90051234567",
      email: "anna.nowak@techflow.pl",
      phone: "+48 600 123 456",
      address: { street: "ul. Wolska 12/4", city: "Warszawa", postalCode: "01-258" },
      position: "Senior Frontend Developer",
      department: "Development",
      employmentType: "UoP",
      hireDate: "2021-04-01",
      salaryGross: 18500,
      salaryNet: 13245.50,
      zusCode: "0110",
      taxOffice: "Urząd Skarbowy Warszawa-Wola",
      bankAccount: "PL50 1090 2688 0000 0001 4567 8901",
      status: "aktywny",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("employees", {
      companyId,
      firstName: "Piotr",
      lastName: "Wiśniewski",
      pesel: "85120912345",
      email: "piotr.wisniewski@techflow.pl",
      phone: "+48 601 987 654",
      address: { street: "ul. Grójecka 88/12", city: "Warszawa", postalCode: "02-094" },
      position: "Backend Developer",
      department: "Development",
      employmentType: "B2B",
      hireDate: "2022-01-15",
      salaryGross: 22000,
      status: "aktywny",
      notes: "Fakturuje jako Piotr Wiśniewski IT Services",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("employees", {
      companyId,
      firstName: "Katarzyna",
      lastName: "Zielińska",
      pesel: "95032145678",
      email: "k.zielinska@techflow.pl",
      phone: "+48 512 345 678",
      address: { street: "ul. Mokotowska 33", city: "Warszawa", postalCode: "00-560" },
      position: "Project Manager",
      department: "Management",
      employmentType: "UoP",
      hireDate: "2020-09-01",
      salaryGross: 16000,
      salaryNet: 11520.30,
      zusCode: "0110",
      taxOffice: "Urząd Skarbowy Warszawa-Śródmieście",
      bankAccount: "PL12 1050 1025 1000 0023 4567 8901",
      status: "urlop",
      notes: "Urlop wypoczynkowy 20.02-28.02.2025",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("employees", {
      companyId,
      firstName: "Tomasz",
      lastName: "Mazur",
      email: "t.mazur@techflow.pl",
      position: "Junior Developer",
      department: "Development",
      employmentType: "staz",
      hireDate: "2025-01-02",
      endDate: "2025-06-30",
      salaryGross: 4300,
      salaryNet: 3890,
      status: "aktywny",
      createdAt: now,
      updatedAt: now,
    });

    // ============ DOKUMENTY FIRMY ============
    await ctx.db.insert("companyDocuments", {
      companyId,
      title: "Umowa najmu biura - Marszałkowska 55",
      type: "umowa",
      contractor: "Nieruchomości Centrum Sp. z o.o.",
      issueDate: "2023-01-01",
      expiryDate: "2026-12-31",
      status: "aktywny",
      fileName: "umowa_najem_biuro_2023.pdf",
      source: "Recznie",
      tags: ["biuro", "najem", "stałe koszty"],
      notes: "Czynsz 8500 PLN/mies. + media. Waloryzacja roczna wg GUS.",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("companyDocuments", {
      companyId,
      title: "Polisa OC działalności gospodarczej",
      type: "polisa",
      contractor: "PZU S.A.",
      issueDate: "2025-01-01",
      expiryDate: "2025-12-31",
      status: "aktywny",
      fileName: "polisa_oc_2025.pdf",
      source: "Email",
      tags: ["ubezpieczenie", "OC"],
      notes: "Suma gwarancyjna 500 000 PLN. Składka roczna 3200 PLN.",
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("companyDocuments", {
      companyId,
      title: "Decyzja o nadaniu NIP",
      type: "decyzja",
      issueDate: "2019-03-20",
      status: "archiwalny",
      fileName: "decyzja_nip.pdf",
      source: "Recznie",
      tags: ["rejestracja", "NIP"],
      createdAt: now,
      updatedAt: now,
    });

    // ============ ZOBOWIĄZANIA PODATKOWE ============
    await ctx.db.insert("taxObligations", {
      companyId,
      type: "VAT",
      period: "2025-01",
      amount: 12450,
      dueDate: "2025-02-25",
      paid: true,
      paidDate: "2025-02-23",
      paidAmount: 12450,
      declarationNumber: "VAT-7/2025/01",
      createdAt: now,
    });

    await ctx.db.insert("taxObligations", {
      companyId,
      type: "CIT",
      period: "2025-01",
      amount: 8900,
      dueDate: "2025-02-20",
      paid: true,
      paidDate: "2025-02-19",
      paidAmount: 8900,
      declarationNumber: "CIT-8/2025/01",
      createdAt: now,
    });

    await ctx.db.insert("taxObligations", {
      companyId,
      type: "ZUS_spoleczne",
      period: "2025-02",
      amount: 4245.52,
      dueDate: "2025-03-15",
      paid: false,
      notes: "Składki za 4 pracowników UoP + stażystę",
      createdAt: now,
    });

    await ctx.db.insert("taxObligations", {
      companyId,
      type: "VAT",
      period: "2025-02",
      amount: 7268,
      dueDate: "2025-03-25",
      paid: false,
      createdAt: now,
    });

    // ============ WYDARZENIA KALENDARZOWE ============
    await ctx.db.insert("calendarEvents", {
      companyId,
      title: "Termin płatności VAT za luty",
      type: "tax",
      date: "2025-03-25",
      priority: "high",
      status: "pending",
      description: "Deklaracja VAT-7 za luty 2025. Szacowana kwota: 7 268 PLN",
      recurring: "monthly",
      createdAt: now,
    });

    await ctx.db.insert("calendarEvents", {
      companyId,
      title: "Składki ZUS - marzec",
      type: "zus",
      date: "2025-03-15",
      priority: "high",
      status: "pending",
      description: "Składki społeczne + zdrowotne za pracowników. Kwota: 4 245,52 PLN",
      recurring: "monthly",
      createdAt: now,
    });

    await ctx.db.insert("calendarEvents", {
      companyId,
      title: "Spotkanie z klientem ABC Software",
      type: "meeting",
      date: "2025-02-26",
      time: "10:00",
      priority: "medium",
      status: "pending",
      description: "Omówienie rozszerzenia projektu e-commerce - nowy moduł płatności",
      createdAt: now,
    });

    await ctx.db.insert("calendarEvents", {
      companyId,
      title: "Termin płatności FV/2025/01/008 - DataVision",
      type: "payment",
      date: "2025-02-03",
      priority: "high",
      status: "pending",
      description: "Faktura przeterminowana! Kwota: 24 600 PLN brutto. Kontakt: kontakt@datavision.pl",
      createdAt: now,
    });

    // ============ ZADANIA ============
    await ctx.db.insert("tasks", {
      companyId,
      title: "Windykacja FV/2025/01/008 - DataVision",
      description: "Faktura przeterminowana od 03.02. Wysłać wezwanie do zapłaty, kontakt telefoniczny.",
      completed: false,
      dueDate: "2025-02-25",
      priority: "high",
      assignedTo: "Katarzyna Zielińska",
      createdAt: now,
    });

    await ctx.db.insert("tasks", {
      companyId,
      title: "Przygotować deklarację VAT-7 za luty",
      description: "Zebrać wszystkie faktury sprzedażowe i kosztowe, obliczyć VAT należny i naliczony.",
      completed: false,
      dueDate: "2025-03-20",
      priority: "medium",
      createdAt: now,
    });

    await ctx.db.insert("tasks", {
      companyId,
      title: "Odnowienie certyfikatu SSL",
      description: "Certyfikat SSL dla techflow.pl wygasa 15.03.2025. Zamówić odnowienie.",
      completed: false,
      dueDate: "2025-03-10",
      priority: "medium",
      assignedTo: "Piotr Wiśniewski",
      createdAt: now,
    });

    await ctx.db.insert("tasks", {
      companyId,
      title: "Aktualizacja regulaminu pracy",
      description: "Dostosować regulamin do zmian w Kodeksie Pracy obowiązujących od 01.01.2025.",
      completed: true,
      dueDate: "2025-01-31",
      priority: "low",
      createdAt: now,
    });

    // ============ CZAT AI ============
    await ctx.db.insert("chatMessages", {
      companyId,
      userId: "user_owner_1",
      role: "user",
      text: "Jakie mam przeterminowane faktury?",
      createdAt: now - 3600000,
    });

    await ctx.db.insert("chatMessages", {
      companyId,
      userId: "user_owner_1",
      role: "model",
      text: "Masz 1 przeterminowaną fakturę: FV/2025/01/008 od DataVision S.A. na kwotę 24 600 PLN brutto. Termin płatności minął 03.02.2025. Zalecam wysłanie wezwania do zapłaty.",
      actionType: "navigate",
      actionLabel: "Zobacz fakturę",
      createdAt: now - 3500000,
    });

    return { success: true, message: "Dane testowe zostały dodane pomyślnie!" };
  },
});
