import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, CheckSquare, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TaskCreationModal from "@/components/task/TaskCreationModal";
import TaskGroup from "@/components/TaskGroup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { groupTasksByDate, groupOccurrencesByDate } from "@/utils/dateUtils";
import {
  useGetTaskListById,
  useGetOccurrencesByTaskList,
  useRemoveTaskList, // Import the new hook
} from "@/services/api/taskListApi";
import {
  useFindAllTasks,
  useCreateTask,
  useCompleteTaskOccurrence,
} from "@/services/api/taskApi";
import { TaskOccurrence, TaskCreation, Role } from "@/types/models";
import { useGetMe } from "@/services/api/userApi";
import { RoleEnum } from "@renzobeux/taskorganizer-api-contract";

const TaskListView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<"all" | "assigned">("all");

  // API hooks
  const { data: me, isLoading: isMeLoading } = useGetMe();
  const { data: taskList, isLoading: isTaskListLoading } = useGetTaskListById(
    id || ""
  );
  const { data: tasks, isLoading: isTasksLoading } = useFindAllTasks(id || "");
  const {
    data: occurrencesData,
    isLoading: isOccurrencesLoading,
    refetch: refetchOccurrences,
  } = useGetOccurrencesByTaskList(id || "");

  const createTaskMutation = useCreateTask();
  const completeTaskOccurrenceMutation = useCompleteTaskOccurrence();
  const removeTaskListMutation = useRemoveTaskList(); // Initialize the hook

  const isLoading =
    isTaskListLoading || isTasksLoading || isOccurrencesLoading || isMeLoading;

  const handleCreateTask = async (taskData: TaskCreation) => {
    if (!id) return;
    try {
      await createTaskMutation.mutateAsync({
        body: { ...taskData, taskListId: id },
      });
      toast({
        title: "Success",
        description: "Task created successfully.",
      });
      refetchOccurrences(); // Refetch occurrences after creating a task
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (occurrenceId: string) => {
    try {
      await completeTaskOccurrenceMutation.mutateAsync({
        params: { occurrenceId },
      });
      toast({
        title: "Success",
        description: "Task marked as complete.",
      });
      refetchOccurrences(); // Refetch occurrences after completing an occurrence
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete task.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTaskList = async () => {
    if (!id) return;
    // Add a confirmation dialog here for better UX
    if (!window.confirm("Are you sure you want to delete this task list?")) {
      return;
    }
    try {
      await removeTaskListMutation.mutateAsync({ params: { id } });
      toast({
        title: "Success",
        description: "Task list deleted successfully.",
        variant: "success",
      });
      navigate("/"); // Navigate back to the dashboard or a relevant page
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task list.",
        variant: "destructive",
      });
    }
  };

  const occurrences: TaskOccurrence[] = useMemo(
    () => occurrencesData || [],
    [occurrencesData]
  );

  const groupedOccurrences = useMemo(
    () => groupOccurrencesByDate(occurrences),
    [occurrences]
  );

  const filterOccurrences = (
    group: TaskOccurrence[] | undefined
  ): TaskOccurrence[] => {
    if (!group) return [];
    if (filterBy === "all") {
      return group;
    }
    // Assuming 'assignedTo' is a field in TaskOccurrence, or you have a way to filter
    // For now, returning all as placeholder for "assigned to me" logic
    return group; // Placeholder - implement actual filtering if needed
  };

  return (
    <div className="container py-8 px-4 mx-auto max-w-5xl">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold">
            {isLoading ? "Loading..." : taskList?.name}
          </h1>
          {/* Add delete button if the user is the owner - Assuming taskList has an isOwner field or similar */}
          {taskList &&
            me &&
            taskList.memberships.find((m) => m.userId === me.id).role ===
              RoleEnum.Enum.OWNER && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteTaskList}
                className="ml-4 rounded-lg"
                disabled={removeTaskListMutation.isPending}
              >
                {removeTaskListMutation.isPending
                  ? "Deleting..."
                  : "Delete List"}
              </Button>
            )}
        </div>

        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                <Filter className="mr-2 h-4 w-4" />
                {filterBy === "all" ? "All Tasks" : "Assigned to Me"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={filterBy}
                onValueChange={(value: string) =>
                  setFilterBy(value as "all" | "assigned")
                }
              >
                <DropdownMenuRadioItem value="all">
                  All Tasks
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="assigned">
                  Assigned to Me
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="space-y-8">
          {["Overdue", "Today", "Upcoming"].map((section) => (
            <div key={section} className="space-y-4">
              <h2 className="text-lg font-semibold">{section}</h2>
              <div className="h-32 rounded-xl bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <TaskGroup
            title="Overdue"
            tasks={tasks}
            occurrences={filterOccurrences(groupedOccurrences["Overdue"])}
            onComplete={(occurrenceId) => handleCompleteTask(occurrenceId)}
            className="text-task-overdue"
          />

          <TaskGroup
            title="Today"
            tasks={tasks}
            occurrences={filterOccurrences(groupedOccurrences["Today"])}
            onComplete={(occurrenceId) => handleCompleteTask(occurrenceId)}
            className="text-task-today"
          />

          <TaskGroup
            title="Upcoming"
            tasks={tasks}
            occurrences={filterOccurrences(groupedOccurrences["Upcoming"])}
            onComplete={(occurrenceId) => handleCompleteTask(occurrenceId)}
            className="text-task-upcoming"
          />

          {Object.values(groupedOccurrences).every(
            (group: TaskOccurrence[]) => filterOccurrences(group).length === 0
          ) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                No tasks to show.{" "}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="text-primary underline"
                >
                  Add a new task
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <TaskCreationModal
        open={isCreateModalOpen}
        taskListId={id || ""}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTask} // Pass the new handler
      />
    </div>
  );
};

export default TaskListView;
