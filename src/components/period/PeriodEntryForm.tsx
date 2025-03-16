
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { usePeriod } from '@/context/PeriodContext';
import { FlowLevel, Symptom, PeriodEntry } from '@/types/period';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Plus, Edit, Droplet } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

// Define symptom options with labels
const symptomOptions = [
  { value: 'cramps', label: 'Cramps' },
  { value: 'headache', label: 'Headache' },
  { value: 'fatigue', label: 'Fatigue' },
  { value: 'bloating', label: 'Bloating' },
  { value: 'backache', label: 'Backache' },
  { value: 'nausea', label: 'Nausea' },
  { value: 'moodSwings', label: 'Mood Swings' },
  { value: 'breastTenderness', label: 'Breast Tenderness' },
  { value: 'spotting', label: 'Spotting' },
];

// Define flow level options with colors and labels
const flowOptions = [
  { value: 'none', label: 'None', color: '#E5DEFF' },
  { value: 'light', label: 'Light', color: '#FEC6A1' },
  { value: 'medium', label: 'Medium', color: '#F97316' },
  { value: 'heavy', label: 'Heavy', color: '#9b87f5' },
];

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  flow: z.enum(['none', 'light', 'medium', 'heavy'] as const),
  symptoms: z.array(z.string()),
  notes: z.string().optional(),
});

type PeriodFormValues = z.infer<typeof formSchema>;

// Component for adding/editing period entries
interface PeriodEntryFormProps {
  date?: Date;
  existingEntry?: PeriodEntry;
  onComplete?: () => void;
}

const PeriodEntryForm: React.FC<PeriodEntryFormProps> = ({ 
  date = new Date(), 
  existingEntry, 
  onComplete 
}) => {
  const { addPeriodEntry, updatePeriodEntry, deletePeriodEntry } = usePeriod();
  const [open, setOpen] = useState(false);
  
  const isEditing = !!existingEntry;

  const form = useForm<PeriodFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: existingEntry ? new Date(existingEntry.date) : date,
      flow: (existingEntry?.flow || 'none') as FlowLevel,
      symptoms: existingEntry?.symptoms || [],
      notes: existingEntry?.notes || '',
    },
  });

  const onSubmit = (values: PeriodFormValues) => {
    if (isEditing && existingEntry) {
      updatePeriodEntry({
        id: existingEntry.id,
        date: values.date,
        flow: values.flow,
        symptoms: values.symptoms as Symptom[],
        notes: values.notes,
      });
    } else {
      addPeriodEntry({
        date: values.date,
        flow: values.flow,
        symptoms: values.symptoms as Symptom[],
        notes: values.notes,
      });
    }
    
    setOpen(false);
    if (onComplete) onComplete();
  };

  const handleDelete = () => {
    if (isEditing && existingEntry) {
      deletePeriodEntry(existingEntry.id);
      setOpen(false);
      if (onComplete) onComplete();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditing ? "outline" : "default"} size="sm">
          {isEditing ? (
            <Edit className="mr-2 h-4 w-4" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isEditing ? "Edit Entry" : "Add Entry"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Period Entry" : "Add Period Entry"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update your period information for this day." 
              : "Track your period and symptoms for better health insights."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MMMM d, yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="flow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flow Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select flow level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {flowOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: option.color }}
                            />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Symptoms</FormLabel>
                    <FormDescription>
                      Select any symptoms you experienced
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {symptomOptions.map((option) => (
                      <FormField
                        key={option.value}
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.value}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    return checked
                                      ? field.onChange([...currentValue, option.value])
                                      : field.onChange(
                                          currentValue.filter(
                                            (value) => value !== option.value
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="gap-2 sm:gap-0">
              {isEditing && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}
              <Button type="submit">
                {isEditing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PeriodEntryForm;
