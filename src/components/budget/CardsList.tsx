
import React, { useState } from 'react';
import { CreditCard, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { Card as CardType } from '@/types/budget';
import { useBudget } from '@/context/BudgetContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EditCardDialog from './EditCardDialog';
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

const CardsList: React.FC = () => {
  const { cards, deleteCard } = useBudget();
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  
  const handleEdit = (card: CardType) => {
    setSelectedCard(card);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setCardToDelete(id);
  };

  const confirmDelete = () => {
    if (cardToDelete) {
      deleteCard(cardToDelete);
      setCardToDelete(null);
    }
  };

  const cancelDelete = () => {
    setCardToDelete(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            My Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cards.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cards added yet. Add your first card to start tracking your spending.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-lg p-4 relative overflow-hidden transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: card.color || '#3b82f6',
                    color: 'white',
                  }}
                >
                  <div className="absolute top-0 right-0 p-2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(card)}
                      className="h-7 w-7 p-0 text-white/80 hover:text-white hover:bg-white/20"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(card.id)}
                      className="h-7 w-7 p-0 text-white/80 hover:text-white hover:bg-white/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                  
                  <div className="mb-6">
                    <CreditCard className="h-10 w-10 mb-2" />
                    <div className="text-lg font-medium">{card.name}</div>
                    <div className="text-sm text-white/80">{card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} Card</div>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-white/80">Card Number</div>
                      <div className="font-mono">•••• {card.cardNumber || '****'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/80">Balance</div>
                      <div className="text-lg font-bold">
                        ${Math.abs(card.balance).toFixed(2)}
                        {card.cardType === 'credit' && card.balance < 0 && <span className="text-sm ml-1">(Owed)</span>}
                      </div>
                    </div>
                  </div>
                  
                  {card.expiryDate && (
                    <div className="mt-3 text-xs text-white/80">
                      Expires: {card.expiryDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCard && (
        <EditCardDialog 
          card={selectedCard} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
        />
      )}

      <AlertDialog open={!!cardToDelete} onOpenChange={(open) => !open && setCardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
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

export default CardsList;
