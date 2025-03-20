
import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number(),
  category: z.string(),
  date: z.date(),
  type: z.enum(["income", "expense"]),
  paymentMethod: z.enum(["card", "cash"]).default("cash"),
  cardId: z.string().optional(), // Reference to the card used (if payment method is card)
  receiptImage: z.string().optional(), // Receipt image URI/URL (optional)
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const BudgetCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  budget: z.number().nonnegative(),
  color: z.string().optional(),
});

export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;

export const CardSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Card name is required"),
  balance: z.number().default(0),
  cardNumber: z.string().optional(), // Last 4 digits or masked number
  cardType: z.enum(["credit", "debit"]).default("debit"),
  color: z.string().optional(),
  expiryDate: z.string().optional(),
});

export type Card = z.infer<typeof CardSchema>;

export const SavingsAccountSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Account name is required"),
  goal: z.number().nonnegative().optional(),
  balance: z.number().default(0),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export type SavingsAccount = z.infer<typeof SavingsAccountSchema>;

export const SavingsTransactionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  description: z.string().min(1, "Description is required"),
  amount: z.number(),
  date: z.date(),
  type: z.enum(["deposit", "withdrawal"]),
  paymentMethod: z.enum(["card", "cash"]).default("cash"),
  cardId: z.string().optional(), // Reference to the card used (if payment method is card)
  receiptImage: z.string().optional(), // Receipt image URI/URL (optional)
});

export type SavingsTransaction = z.infer<typeof SavingsTransactionSchema>;

export const BudgetContextSchema = z.object({
  transactions: z.array(TransactionSchema),
  categories: z.array(BudgetCategorySchema),
  savingsAccounts: z.array(SavingsAccountSchema),
  savingsTransactions: z.array(SavingsTransactionSchema),
  cards: z.array(CardSchema),
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
  addSavingsAccount: z.function()
    .args(SavingsAccountSchema.omit({ id: true }))
    .returns(z.void()),
  updateSavingsAccount: z.function()
    .args(SavingsAccountSchema)
    .returns(z.void()),
  deleteSavingsAccount: z.function()
    .args(z.string())
    .returns(z.void()),
  addSavingsTransaction: z.function()
    .args(SavingsTransactionSchema.omit({ id: true }))
    .returns(z.void()),
  deleteSavingsTransaction: z.function()
    .args(z.string())
    .returns(z.void()),
  addCard: z.function()
    .args(CardSchema.omit({ id: true }))
    .returns(z.void()),
  updateCard: z.function()
    .args(CardSchema)
    .returns(z.void()),
  deleteCard: z.function()
    .args(z.string())
    .returns(z.void()),
});

export type BudgetContextType = z.infer<typeof BudgetContextSchema>;
