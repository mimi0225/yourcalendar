
import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number(),
  category: z.string(),
  date: z.date(),
  type: z.enum(["income", "expense"]),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const BudgetCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  budget: z.number().nonnegative(),
  color: z.string().optional(),
});

export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;

export const BudgetContextSchema = z.object({
  transactions: z.array(TransactionSchema),
  categories: z.array(BudgetCategorySchema),
  addTransaction: z.function()
    .args(TransactionSchema.omit({ id: true }))
    .returns(z.void()),
  updateTransaction: z.function()
    .args(TransactionSchema)
    .returns(z.void()),
  deleteTransaction: z.function()
    .args(z.string())
    .returns(z.void()),
  addCategory: z.function()
    .args(BudgetCategorySchema.omit({ id: true }))
    .returns(z.void()),
  updateCategory: z.function()
    .args(BudgetCategorySchema)
    .returns(z.void()),
  deleteCategory: z.function()
    .args(z.string())
    .returns(z.void()),
});

export type BudgetContextType = z.infer<typeof BudgetContextSchema>;
