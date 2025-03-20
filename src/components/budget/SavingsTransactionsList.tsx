
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpCircle, ArrowDownCircle, Trash2, FileImage, CreditCard, Wallet, AlertTriangle } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavingsTransactionsListProps {
  accountId: string;
}

const SavingsTransactionsList: React.FC<SavingsTransactionsListProps> = ({ accountId }) => {
  const { savingsTransactions, deleteSavingsTransaction, cards } = useBudget();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
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

  const handleDeleteClick = (id: string) => {
    setTransactionToDelete(id);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteSavingsTransaction(transactionToDelete);
      setTransactionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTransactionToDelete(null);
  };

  const getCardName = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return card ? card.name : '';
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
            <TableHead className="hidden md:table-cell">Payment</TableHead>
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
                  {transaction.paymentMethod === 'card' && transaction.cardId && (
                    <span> • {getCardName(transaction.cardId)}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className={`text-right font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {format(transaction.date, 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {transaction.paymentMethod === 'card' ? (
                  <div className="flex items-center">
                    <CreditCard className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="text-xs">{getCardName(transaction.cardId || '')}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Wallet className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-xs">Cash</span>
                  </div>
                )}
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
                  onClick={() => handleDeleteClick(transaction.id)}
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

      {/* Confirm Delete Dialog */}
      <AlertDialog open={!!transactionToDelete} onOpenChange={(open) => !open && setTransactionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This will also update the account balance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SavingsTransactionsList;
