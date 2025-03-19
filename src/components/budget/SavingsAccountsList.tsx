
import React, { useState } from 'react';
import { format } from 'date-fns';
import { PiggyBank, ArrowUpCircle, ArrowDownCircle, Trash2, Plus, Minus } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';
import { SavingsAccount } from '@/types/budget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SavingsTransactionsList from './SavingsTransactionsList';

const SavingsAccountsList: React.FC = () => {
  const { savingsAccounts, savingsTransactions, addSavingsTransaction, deleteSavingsAccount } = useBudget();
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [showTransactionsFor, setShowTransactionsFor] = useState<string | null>(null);

  const handleTransactionSubmit = () => {
    if (!selectedAccount || !amount || !description) return;
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    // For withdrawals, check if sufficient balance
    if (transactionType === 'withdrawal' && parsedAmount > selectedAccount.balance) {
      alert("Insufficient balance for this withdrawal");
      return;
    }

    addSavingsTransaction({
      accountId: selectedAccount.id,
      description,
      amount: parsedAmount,
      date: new Date(),
      type: transactionType
    });

    // Reset form
    setAmount("");
    setDescription("");
    setTransactionDialogOpen(false);
  };

  const openTransactionDialog = (account: SavingsAccount, type: 'deposit' | 'withdrawal') => {
    setSelectedAccount(account);
    setTransactionType(type);
    setTransactionDialogOpen(true);
  };

  const handleDelete = (accountId: string) => {
    deleteSavingsAccount(accountId);
  };

  const toggleTransactionsList = (accountId: string) => {
    setShowTransactionsFor(showTransactionsFor === accountId ? null : accountId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5" />
            Savings Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {savingsAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No savings accounts yet. Add your first account to start saving for your goals.
            </div>
          ) : (
            <div className="space-y-6">
              {savingsAccounts.map((account) => {
                const accountTransactions = savingsTransactions.filter(
                  (t) => t.accountId === account.id
                );
                
                const goalProgress = account.goal 
                  ? Math.min(Math.round((account.balance / account.goal) * 100), 100)
                  : 0;
                
                return (
                  <div key={account.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">{account.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(account.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Balance: <span className="text-emerald-600">${account.balance.toFixed(2)}</span></span>
                      {account.goal && (
                        <span>
                          Goal: ${account.goal.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {account.goal && (
                      <Progress 
                        value={goalProgress}
                        className={`h-2 ${
                          goalProgress > 90 ? 'bg-emerald-100' : 
                          goalProgress > 50 ? 'bg-amber-100' : 
                          'bg-sky-100'
                        }`}
                      />
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => openTransactionDialog(account, 'deposit')}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Funds
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => openTransactionDialog(account, 'withdrawal')}
                      >
                        <Minus className="h-4 w-4 mr-1" /> Withdraw
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-1 text-xs"
                      onClick={() => toggleTransactionsList(account.id)}
                    >
                      {showTransactionsFor === account.id ? 'Hide Transactions' : 'Show Transactions'}
                    </Button>
                    
                    {showTransactionsFor === account.id && (
                      <div className="pt-2">
                        <SavingsTransactionsList accountId={account.id} />
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 mt-4 pt-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {transactionType === 'deposit' ? (
                <ArrowUpCircle className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownCircle className="h-5 w-5 text-red-500" />
              )}
              {transactionType === 'deposit' ? 'Add Funds' : 'Withdraw Funds'}
            </DialogTitle>
            <DialogDescription>
              {transactionType === 'deposit' 
                ? 'Add money to your savings account.' 
                : 'Withdraw money from your savings account.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder={transactionType === 'deposit' ? "e.g., Monthly savings" : "e.g., Emergency expense"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            {selectedAccount && transactionType === 'withdrawal' && (
              <div className="text-sm">
                Available balance: <span className="font-medium">${selectedAccount.balance.toFixed(2)}</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransactionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransactionSubmit}
              className={transactionType === 'deposit' ? 'bg-green-600' : 'bg-red-600'}
            >
              {transactionType === 'deposit' ? 'Add Funds' : 'Withdraw'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavingsAccountsList;
