import { tsrReactQuery } from "./tsRestClient";

// It's more idiomatic to export hooks directly for React Query usage
export const useGetAllTaskLists = () => {
  const result = tsrReactQuery.tasklists.findAll.useQuery({
    queryKey: ["taskLists"],
  });
  return {
    ...result,
    data: result.data?.body ?? [],
  };
};

export const useGetTaskListById = (id: string) => {
  const result = tsrReactQuery.tasklists.findOne.useQuery({
    queryData: { params: { id } },
    queryKey: ["taskList", id],
  });
  return {
    ...result,
    data: result.data?.body,
  };
};

export const useCreateTaskList = () => {
  return tsrReactQuery.tasklists.create.useMutation();
};

export const useUpdateTaskList = () => {
  const result = tsrReactQuery.tasklists.update.useMutation();
  return {
    ...result,
    data: result.data?.body,
  };
};

export const useRemoveTaskList = () => {
  const result = tsrReactQuery.tasklists.remove.useMutation();
  return {
    ...result,
    data: result.data?.body,
  };
};

export const useGetOccurrencesByTaskList = (taskListId: string) => {
  const result = tsrReactQuery.tasklists.getOccurrencesByTaskList.useQuery({
    queryData: { params: { taskListId } },
    queryKey: ["taskOccurrences", taskListId],
  });
  return {
    ...result,
    data: result.data?.body ?? [],
  };
};
