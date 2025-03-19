
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Clipboard, Pencil, Trash2, CheckSquare, Square, CalendarIcon } from 'lucide-react';
import { Chore } from '@/types/chores';
import { useChores } from '@/context/ChoreContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import EditChoreDialog from './EditChoreDialog';

const ChoresList = () => {
  const { chores, toggleComplete, deleteChore } = useChores();
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (chore: Chore) => {
    setSelectedChore(chore);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteChore(id);
  };

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return <Badge variant="outline" className="bg-blue-100">Daily</Badge>;
      case 'weekly':
        return <Badge variant="outline" className="bg-green-100">Weekly</Badge>;
      case 'monthly':
        return <Badge variant="outline" className="bg-purple-100">Monthly</Badge>;
      case 'once':
        return <Badge variant="outline" className="bg-gray-100">One-time</Badge>;
      default:
        return null;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clipboard className="h-5 w-5" />
            Chores List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No chores added yet. Add your first chore to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Done</TableHead>
                  <TableHead>Chore</TableHead>
                  <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                  <TableHead className="hidden md:table-cell">Frequency</TableHead>
                  <TableHead className="hidden md:table-cell">Due Date</TableHead>
                  <TableHead className="hidden md:table-cell">Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chores.map((chore) => (
                  <TableRow key={chore.id} className={chore.completed ? "bg-muted/40" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={chore.completed}
                        onCheckedChange={() => toggleComplete(chore.id)}
                      />
                    </TableCell>
                    <TableCell className={`font-medium ${chore.completed ? "line-through text-muted-foreground" : ""}`}>
                      {chore.name}
                      <div className="md:hidden text-xs text-muted-foreground mt-1">
                        {chore.assignedTo && <div>Assigned to: {chore.assignedTo}</div>}
                        {chore.dueDate && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(chore.dueDate, 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{chore.assignedTo || '-'}</TableCell>
                    <TableCell className="hidden md:table-cell">{getFrequencyBadge(chore.frequency)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {chore.dueDate ? format(chore.dueDate, 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{chore.points}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(chore)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(chore.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedChore && (
        <EditChoreDialog 
          chore={selectedChore} 
          open={isEditDialogOpen} 
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </>
  );
};

export default ChoresList;
