
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, BudgetCategory, BudgetContextType } from '@/types/budget';
import { useToast } from '@/hooks/use-toast';

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: uuidv4(), name: 'Food', budget: 300, color: '#84cc16' },
  { id: uuidv4(), name: 'Transportation', budget: 150, color: '#3b82f6' },
  { id: uuidv4(), name: 'Entertainment', budget: 100, color: '#8b5cf6' },
  { id: uuidv4(), name: 'Utilities', budget: 200, color: '#f97316' },
  { id: uuidv4(), name: 'Savings', budget: 100, color: '#06b6d4' },
];

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
  const { toast } = useToast();

  // Load budget data from localStorage on initial render
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budgetTransactions');
    const savedCategories = localStorage.getItem('budgetCategories');
    
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        // Convert string dates back to Date objects
        const processedTransactions = parsedTransactions.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
        }));
        setTransactions(processedTransactions);
      } catch (error) {
        console.error('Failed to parse stored transactions:', error);
      }
    }

    if (savedCategories) {
      try {
        const parsedCategories = JSON.parse(savedCategories);
        setCategories(parsedCategories);
      } catch (error) {
        console.error('Failed to parse stored categories:', error);
      }
    }
  }, []);

  // Save budget data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
    localStorage.setItem('budgetCategories', JSON.stringify(categories));
  }, [transactions, categories]);

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4(),
    };

    setTransactions((prev) => [...prev, newTransaction]);
    toast({
      title: `${transactionData.type === 'income' ? 'Income' : 'Expense'} Added`,
      description: `$${Math.abs(transactionData.amount).toFixed(2)} for "${transactionData.description}" has been recorded.`,
    });
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) => 
      prev.map((transaction) => (transaction.id === updatedTransaction.id ? updatedTransaction : transaction))
    );
    toast({
      title: "Transaction Updated",
      description: `"${updatedTransaction.description}" has been updated.`,
    });
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(transaction => transaction.id === id);
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    if (transactionToDelete) {
      toast({
        title: "Transaction Deleted",
        description: `"${transactionToDelete.description}" has been removed.`,
      });
    }
  };

  const addCategory = (categoryData: Omit<BudgetCategory, 'id'>) => {
    const newCategory: BudgetCategory = {
      ...categoryData,
      id: uuidv4(),
    };

    setCategories((prev) => [...prev, newCategory]);
    toast({
      title: "Category Added",
      description: `"${categoryData.name}" has been added to your budget categories.`,
    });
  };

  const updateCategory = (updatedCategory: BudgetCategory) => {
    setCategories((prev) => 
      prev.map((category) => (category.id === updatedCategory.id ? updatedCategory : category))
    );
    toast({
      title: "Category Updated",
      description: `"${updatedCategory.name}" has been updated.`,
    });
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(category => category.id === id);
    setCategories((prev) => prev.filter((category) => category.id !== id));
    if (categoryToDelete) {
      toast({
        title: "Category Deleted",
        description: `"${categoryToDelete.name}" has been removed.`,
      });
    }
  };

  return (
    <BudgetContext.Provider value={{ 
      transactions, 
      categories, 
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
