
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign } from 'lucide-react';
import { Card } from '@/types/budget';
import { useBudget } from '@/context/BudgetContext';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface EditCardDialogProps {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Card name is required'),
  balance: z.coerce.number(),
  cardNumber: z.string().optional(),
  cardType: z.enum(['credit', 'debit']),
  color: z.string().optional(),
  expiryDate: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const EditCardDialog: React.FC<EditCardDialogProps> = ({ 
  card, 
  open, 
  onOpenChange 
}) => {
  const { updateCard } = useBudget();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: card.id,
      name: card.name,
      balance: card.balance,
      cardNumber: card.cardNumber || '',
      cardType: card.cardType,
      color: card.color || '#CCCCCC',
      expiryDate: card.expiryDate || '',
    },
  });

  const onSubmit = (data: FormData) => {
    updateCard({
      ...data,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardType"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Card Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="debit" />
                        </FormControl>
                        <FormLabel className="font-normal">Debit</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="credit" />
                        </FormControl>
                        <FormLabel className="font-normal">Credit</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number (last 4 digits)</FormLabel>
                  <FormControl>
                    <Input 
                      maxLength={4} 
                      {...field} 
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date (MM/YY)</FormLabel>
                  <FormControl>
                    <Input 
                      maxLength={5} 
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^\d/]/g, '');
                        
                        // Add slash after 2 digits if not already there
                        if (value.length === 2 && !value.includes('/')) {
                          value += '/';
                        }
                        
                        // Prevent more than one slash
                        if (value.split('/').length > 2) {
                          value = value.substring(0, value.lastIndexOf('/'));
                        }
                        
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: field.value || '#CCCCCC' }}
                      />
                      <Input type="color" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCardDialog;
