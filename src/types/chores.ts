
import { z } from "zod";

export const ChoreSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Chore name is required"),
  assignedTo: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly", "once"]),
  dueDate: z.date().optional(),
  completed: z.boolean().default(false),
  createdAt: z.date(),
  points: z.number().int().min(0).default(0),
});

export type Chore = z.infer<typeof ChoreSchema>;

export const ChoreContextSchema = z.object({
  chores: z.array(ChoreSchema),
  addChore: z.function()
    .args(ChoreSchema.omit({ id: true, createdAt: true }))
    .returns(z.void()),
  updateChore: z.function()
    .args(ChoreSchema)
    .returns(z.void()),
  deleteChore: z.function()
    .args(z.string())
    .returns(z.void()),
  toggleComplete: z.function()
    .args(z.string())
    .returns(z.void()),
});

export type ChoreContextType = z.infer<typeof ChoreContextSchema>;
