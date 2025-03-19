
import React from 'react';
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';
import { useBudget } from '@/context/BudgetContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface SavingsTransactionsListProps {
  accountId: string;
}

const SavingsTransactionsList: React.FC<SavingsTransactionsListProps> = ({ accountId }) => {
  const { savingsTransactions, deleteSavingsTransaction } = useBudget();
  
  const filteredTransactions = savingsTransactions
    .filter(transaction => transaction.accountId === accountId)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-2 text-muted-foreground text-sm">
        No transactions for this account yet.
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTransactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {transaction.type === 'deposit' ? (
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
              )}
            </TableCell>
            <TableCell className="font-medium">
              {transaction.description}
              <div className="md:hidden text-xs text-muted-foreground mt-1">
                {format(transaction.date, 'MMM d, yyyy')}
              </div>
            </TableCell>
            <TableCell className={`text-right font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(transaction.amount).toFixed(2)}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {format(transaction.date, 'MMM d, yyyy')}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteSavingsTransaction(transaction.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SavingsTransactionsList;
