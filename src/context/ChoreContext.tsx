
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Chore, ChoreContextType } from '@/types/chores';
import { useToast } from '@/hooks/use-toast';

const ChoreContext = createContext<ChoreContextType | undefined>(undefined);

export const ChoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chores, setChores] = useState<Chore[]>([]);
  const { toast } = useToast();

  // Load chores from localStorage on initial render
  useEffect(() => {
    const savedChores = localStorage.getItem('chores');
    if (savedChores) {
      try {
        const parsedChores = JSON.parse(savedChores);
        // Convert string dates back to Date objects
        const processedChores = parsedChores.map((chore: any) => ({
          ...chore,
          createdAt: new Date(chore.createdAt),
          dueDate: chore.dueDate ? new Date(chore.dueDate) : undefined,
        }));
        setChores(processedChores);
      } catch (error) {
        console.error('Failed to parse stored chores:', error);
      }
    }
  }, []);

  // Save chores to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chores', JSON.stringify(chores));
  }, [chores]);

  const addChore = (choreData: Omit<Chore, 'id' | 'createdAt'>) => {
    const newChore: Chore = {
      ...choreData,
      id: uuidv4(),
      createdAt: new Date(),
    };

    setChores((prev) => [...prev, newChore]);
    toast({
      title: "Chore Added",
      description: `"${choreData.name}" has been added to your chores list.`,
    });
  };

  const updateChore = (updatedChore: Chore) => {
    setChores((prev) => 
      prev.map((chore) => (chore.id === updatedChore.id ? updatedChore : chore))
    );
    toast({
      title: "Chore Updated",
      description: `"${updatedChore.name}" has been updated.`,
    });
  };

  const deleteChore = (id: string) => {
    const choreToDelete = chores.find(chore => chore.id === id);
    setChores((prev) => prev.filter((chore) => chore.id !== id));
    if (choreToDelete) {
      toast({
        title: "Chore Deleted",
        description: `"${choreToDelete.name}" has been removed.`,
      });
    }
  };

  const toggleComplete = (id: string) => {
    setChores((prev) =>
      prev.map((chore) => {
        if (chore.id === id) {
          const updated = { ...chore, completed: !chore.completed };
          toast({
            title: updated.completed ? "Chore Completed" : "Chore Reopened",
            description: `"${chore.name}" marked as ${updated.completed ? 'completed' : 'incomplete'}.`,
          });
          return updated;
        }
        return chore;
      })
    );
  };

  return (
    <ChoreContext.Provider value={{ chores, addChore, updateChore, deleteChore, toggleComplete }}>
      {children}
    </ChoreContext.Provider>
  );
};

export const useChores = (): ChoreContextType => {
  const context = useContext(ChoreContext);
  if (context === undefined) {
    throw new Error('useChores must be used within a ChoreProvider');
  }
  return context;
};
