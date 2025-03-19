
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Transaction, 
  BudgetCategory, 
  BudgetContextType, 
  SavingsAccount,
  SavingsTransaction
} from '@/types/budget';
import { useToast } from '@/hooks/use-toast';

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: uuidv4(), name: 'Food', budget: 300, color: '#84cc16' },
  { id: uuidv4(), name: 'Transportation', budget: 150, color: '#3b82f6' },
  { id: uuidv4(), name: 'Entertainment', budget: 100, color: '#8b5cf6' },
  { id: uuidv4(), name: 'Utilities', budget: 200, color: '#f97316' },
  { id: uuidv4(), name: 'Savings', budget: 100, color: '#06b6d4' },
];

const DEFAULT_SAVINGS_ACCOUNTS: SavingsAccount[] = [
  { id: uuidv4(), name: 'Emergency Fund', goal: 5000, balance: 1200, color: '#f97316', icon: 'shield' },
  { id: uuidv4(), name: 'Vacation', goal: 2000, balance: 500, color: '#06b6d4', icon: 'palmtree' },
];

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>(DEFAULT_SAVINGS_ACCOUNTS);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);
  const { toast } = useToast();

  // Load budget data from localStorage on initial render
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budgetTransactions');
    const savedCategories = localStorage.getItem('budgetCategories');
    const savedSavingsAccounts = localStorage.getItem('savingsAccounts');
    const savedSavingsTransactions = localStorage.getItem('savingsTransactions');
    
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

    if (savedSavingsAccounts) {
      try {
        const parsedSavingsAccounts = JSON.parse(savedSavingsAccounts);
        setSavingsAccounts(parsedSavingsAccounts);
      } catch (error) {
        console.error('Failed to parse stored savings accounts:', error);
      }
    }

    if (savedSavingsTransactions) {
      try {
        const parsedSavingsTransactions = JSON.parse(savedSavingsTransactions);
        // Convert string dates back to Date objects
        const processedSavingsTransactions = parsedSavingsTransactions.map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
        }));
        setSavingsTransactions(processedSavingsTransactions);
      } catch (error) {
        console.error('Failed to parse stored savings transactions:', error);
      }
    }
  }, []);

  // Save budget data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
    localStorage.setItem('budgetCategories', JSON.stringify(categories));
    localStorage.setItem('savingsAccounts', JSON.stringify(savingsAccounts));
    localStorage.setItem('savingsTransactions', JSON.stringify(savingsTransactions));
  }, [transactions, categories, savingsAccounts, savingsTransactions]);

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

  // Savings Account Functions
  const addSavingsAccount = (accountData: Omit<SavingsAccount, 'id'>) => {
    const newAccount: SavingsAccount = {
      ...accountData,
      id: uuidv4(),
      balance: accountData.balance || 0,
    };

    setSavingsAccounts((prev) => [...prev, newAccount]);
    toast({
      title: "Savings Account Added",
      description: `"${accountData.name}" has been added to your savings accounts.`,
    });
  };

  const updateSavingsAccount = (updatedAccount: SavingsAccount) => {
    setSavingsAccounts((prev) => 
      prev.map((account) => (account.id === updatedAccount.id ? updatedAccount : account))
    );
    toast({
      title: "Savings Account Updated",
      description: `"${updatedAccount.name}" has been updated.`,
    });
  };

  const deleteSavingsAccount = (id: string) => {
    const accountToDelete = savingsAccounts.find(account => account.id === id);
    setSavingsAccounts((prev) => prev.filter((account) => account.id !== id));
    
    // Also delete associated transactions
    setSavingsTransactions((prev) => prev.filter((transaction) => transaction.accountId !== id));
    
    if (accountToDelete) {
      toast({
        title: "Savings Account Deleted",
        description: `"${accountToDelete.name}" has been removed.`,
      });
    }
  };

  const addSavingsTransaction = (transactionData: Omit<SavingsTransaction, 'id'>) => {
    const newTransaction: SavingsTransaction = {
      ...transactionData,
      id: uuidv4(),
    };

    setSavingsTransactions((prev) => [...prev, newTransaction]);
    
    // Update account balance
    setSavingsAccounts((prev) => 
      prev.map((account) => {
        if (account.id === transactionData.accountId) {
          const amountChange = transactionData.type === 'deposit' 
            ? transactionData.amount 
            : -transactionData.amount;
          
          return {
            ...account,
            balance: account.balance + amountChange,
          };
        }
        return account;
      })
    );

    toast({
      title: `${transactionData.type === 'deposit' ? 'Deposit' : 'Withdrawal'} Completed`,
      description: `$${Math.abs(transactionData.amount).toFixed(2)} ${transactionData.type === 'deposit' ? 'added to' : 'withdrawn from'} account.`,
    });
  };

  const deleteSavingsTransaction = (id: string) => {
    const transactionToDelete = savingsTransactions.find(transaction => transaction.id === id);
    
    if (transactionToDelete) {
      // Reverse the transaction effect on account balance
      setSavingsAccounts((prev) => 
        prev.map((account) => {
          if (account.id === transactionToDelete.accountId) {
            const amountChange = transactionToDelete.type === 'deposit' 
              ? -transactionToDelete.amount 
              : transactionToDelete.amount;
            
            return {
              ...account,
              balance: account.balance + amountChange,
            };
          }
          return account;
        })
      );

      setSavingsTransactions((prev) => prev.filter((transaction) => transaction.id !== id));

      toast({
        title: "Transaction Deleted",
        description: `The ${transactionToDelete.type} transaction has been removed and account balance adjusted.`,
      });
    }
  };

  return (
    <BudgetContext.Provider value={{ 
      transactions, 
      categories, 
      savingsAccounts,
      savingsTransactions,
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      addSavingsAccount,
      updateSavingsAccount,
      deleteSavingsAccount,
      addSavingsTransaction,
      deleteSavingsTransaction
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
