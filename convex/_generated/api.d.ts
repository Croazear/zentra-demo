/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as calendarEvents from "../calendarEvents.js";
import type * as chatMessages from "../chatMessages.js";
import type * as companies from "../companies.js";
import type * as companyDocuments from "../companyDocuments.js";
import type * as contractors from "../contractors.js";
import type * as employees from "../employees.js";
import type * as invoices from "../invoices.js";
import type * as tasks from "../tasks.js";
import type * as taxObligations from "../taxObligations.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  calendarEvents: typeof calendarEvents;
  chatMessages: typeof chatMessages;
  companies: typeof companies;
  companyDocuments: typeof companyDocuments;
  contractors: typeof contractors;
  employees: typeof employees;
  invoices: typeof invoices;
  tasks: typeof tasks;
  taxObligations: typeof taxObligations;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
