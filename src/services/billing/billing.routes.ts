import { buildPath, withQuery } from "@/services/routes";

type InvoiceQuery = {
  status?: "draft" | "open" | "paid" | "void";
  page?: number;
  pageSize?: number;
};

export const billingRoutes = {
  invoices: (query?: InvoiceQuery) => withQuery("/billing/invoices", query),
  invoiceById: (id: string) => buildPath("/billing/invoices/:id", { id }),
  subscriptions: () => "/billing/subscriptions",
};
