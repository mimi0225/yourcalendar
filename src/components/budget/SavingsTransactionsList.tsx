
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2, FileImage } from 'lucide-react';
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
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

interface SavingsTransactionsListProps {
  accountId: string;
}

const SavingsTransactionsList: React.FC<SavingsTransactionsListProps> = ({ accountId }) => {
  const { savingsTransactions, deleteSavingsTransaction } = useBudget();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
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

  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="text-center">Receipt</TableHead>
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
              <TableCell className="text-center">
                {transaction.receiptImage ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openImagePreview(transaction.receiptImage!)}
                  >
                    <FileImage className="h-4 w-4 text-blue-500" />
                    <span className="sr-only">View Receipt</span>
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
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

      {/* Receipt Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt Image</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-2">
            {previewImage && (
              <img 
                src={previewImage} 
                alt="Receipt" 
                className="max-h-[70vh] object-contain rounded-md" 
              />
            )}
          </div>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavingsTransactionsList;
