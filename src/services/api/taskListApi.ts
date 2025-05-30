import { TaskList } from "@/types/models";
import { tsrReactQuery } from "./tsRestClient";
import { useEffect } from "react";

export const useGetAllTaskLists = () => {
  const result = tsrReactQuery.tasklists.findAll.useQuery({
    queryKey: ["taskLists"],
  });

  // Log actual data returned to debug
  useEffect(() => {
    console.log("Fetched taskLists full response:", result.data);
  }, [result.data]);

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
  const queryClient = tsrReactQuery.useQueryClient();

  return tsrReactQuery.tasklists.create.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["taskLists"] });
    },
  });
};

export const useUpdateTaskList = () => {
  const result = tsrReactQuery.tasklists.update.useMutation();
  return {
    ...result,
    data: result.data?.body,
  };
};

export const useRemoveTaskList = () => {
  const queryClient = tsrReactQuery.useQueryClient();
  return tsrReactQuery.tasklists.remove.useMutation({
    onSuccess: async () => {
      console.log(
        "useRemoveTaskList onSuccess: Invalidation started for queryKey ['taskLists']"
      );
      await queryClient.invalidateQueries({
        queryKey: ["taskLists"],
        refetchType: "all",
      });
      console.log(
        "useRemoveTaskList onSuccess: Invalidation completed for queryKey ['taskLists']"
      );
    },
    onError: (error) => {
      console.error("Failed to remove task list:", error);
    },
  });
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
