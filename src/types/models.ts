import type {
  contract,
  TaskListCreateSchema,
  TaskOccurrenceSchema,
  RecurrenceRuleSchema,
} from "@renzobeux/taskorganizer-api-contract";
import { z } from "zod";

// You may want to use z.infer<typeof ...> for runtime validation, but for static typing:
export type TaskList = ReturnType<
  (typeof contract.tasklists.findOne.responses)[200]["parse"]
>;
export type Task = ReturnType<
  (typeof contract.tasks.findOne.responses)[200]["parse"]
>;

export type TaskListCreation = z.infer<typeof TaskListCreateSchema>;
export type TaskCreation = Omit<Task, "id" | "createdAt">;
// Corrected RecurrenceRule type definition
export type RecurrenceRule = z.infer<typeof RecurrenceRuleSchema>;

export type TaskOccurrence = z.infer<typeof TaskOccurrenceSchema>;

// If you have additional UI-only fields, you can extend these types:
// export type TaskListUI = TaskList & { memberCount?: number };
