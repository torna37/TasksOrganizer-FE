import { tsrReactQuery } from "./tsRestClient";
import { Task } from "@/types/models";

// Export each hook separately for idiomatic usage
export const useFindAllTasks = (taskListId: string) => {
  const result = tsrReactQuery.tasks.findAllTasks.useQuery({
    queryData: { params: { id: taskListId } },
    queryKey: ["tasks", taskListId],
  });
  return {
    ...result,
    data: result.data?.body ?? [],
  };
};

export const useFindTaskById = (taskId: string) => {
  const result = tsrReactQuery.tasks.findOne.useQuery({
    queryData: { params: { taskId } },
    queryKey: ["task", taskId],
  });
  return {
    ...result,
    data: result.data?.body,
  };
};

export const useCreateTask = () => {
  const result = tsrReactQuery.tasks.create.useMutation();
  return {
    ...result,
    data: result.data?.body,
  };
};

export const useUpdateTask = () => {
  const result = tsrReactQuery.tasks.update.useMutation();
  return {
    ...result,
    data: result.data?.body,
  };
};

export const useRemoveTask = () => {
  const result = tsrReactQuery.tasks.remove.useMutation();
  return {
    ...result,
    data: result.data?.body,
  };
};
