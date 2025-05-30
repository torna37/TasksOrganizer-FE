import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TaskListCard from "@/components/TaskListCard";
import TaskListCreationModal from "@/components/TaskListCreationModal";
import { TaskListCreation } from "@/types/models";
import { auth } from "@/services/firebase";
import {
  useCreateTaskList,
  useGetAllTaskLists,
} from "@/services/api/taskListApi";

const TaskListDashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    data: taskLists,
    isLoading: listsLoading,
    error,
  } = useGetAllTaskLists();

  // create task list
  const { mutateAsync: createTaskList, isPending: isCreating } =
    useCreateTaskList();

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      console.log("user: ", user);
    }
    if (error) {
      console.error("Error fetching task lists:", error);
      toast({
        title: "Error",
        description: "Failed to load task lists.",
        variant: "destructive",
      });
    }
  }, [user, error, toast]);

  const handleCreateList = async (taskListData: TaskListCreation) => {
    // Renamed taskList to taskListData to avoid conflict
    try {
      await createTaskList({ body: taskListData });
      toast({
        title: "Success",
        description: "Task list created successfully",
      });
      // setIsCreateModalOpen(false); // Optionally close modal on success
    } catch (error) {
      console.error("Failed to create task list:", error);
      toast({
        title: "Error",
        description: "Failed to create task list. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleListClick = (id: string) => {
    navigate(`/task-list/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const actualIsLoading = listsLoading;

  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold">Your Task Lists</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New List
        </Button>
      </motion.div>

      {actualIsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : taskLists && taskLists.length > 0 ? ( // Added check for taskLists being defined
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {taskLists.map((list) => (
            <TaskListCard
              key={list.id}
              taskList={list}
              onClick={handleListClick}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-4">No task lists yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first task list to get started
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New List
          </Button>
        </motion.div>
      )}

      <TaskListCreationModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateList}
      />
    </div>
  );
};

export default TaskListDashboard;
