import type { contract } from "@renzobeux/taskorganizer-api-contract";

// You may want to use z.infer<typeof ...> for runtime validation, but for static typing:
export type TaskList = ReturnType<
  (typeof contract.tasklists.findOne.responses)[200]["parse"]
>;
export type Task = ReturnType<
  (typeof contract.tasks.findOne.responses)[200]["parse"]
>;

// If you have additional UI-only fields, you can extend these types:
// export type TaskListUI = TaskList & { memberCount?: number };
