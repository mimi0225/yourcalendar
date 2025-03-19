
import React from 'react';
import { Coins, ArrowUp, ArrowDown, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBudget } from '@/context/BudgetContext';
import { Progress } from '@/components/ui/progress';

const BudgetSummary: React.FC = () => {
  const { transactions, categories } = useBudget();

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const getCategoryExpenses = (categoryId: string) => {
    return transactions
      .filter(t => t.category === categoryId && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Budget vs. Spending
          </CardTitle>
          <CardDescription>
            Track how much of your budget you've used for each category
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No categories yet. Add categories to track your budget.
            </div>
          ) : (
            <div className="space-y-5">
              {categories.map((category) => {
                const expenses = getCategoryExpenses(category.id);
                const percentage = category.budget > 0 
                  ? Math.min(Math.round((expenses / category.budget) * 100), 100) 
                  : 0;
                
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span>
                        ${expenses.toFixed(2)} / ${category.budget.toFixed(2)}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={
                        percentage > 90 ? 'bg-red-100' : 
                        percentage > 70 ? 'bg-amber-100' : 
                        'bg-green-100'
                      } 
                    />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
