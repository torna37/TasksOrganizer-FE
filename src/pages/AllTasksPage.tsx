// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import TaskGroup from "@/components/TaskGroup";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Task } from "@/types/models";

// const AllTasksPage: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [occurrences, setOccurrences] = useState<TaskOccurrence[]>([]);
//   const [showAllTasks, setShowAllTasks] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filterAssigned, setFilterAssigned] = useState(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     loadTasksAndOccurrences();
//   }, [filterAssigned]);

//   const loadTasksAndOccurrences = async () => {
//     try {
//       setIsLoading(true);
//       const allTasks = await getAllTasks(
//         filterAssigned ? "current-user" : undefined
//       );
//       const allOccurrences = await getAllTaskOccurrences(
//         filterAssigned ? "current-user" : undefined
//       );
//       setTasks(allTasks);
//       setOccurrences(allOccurrences);
//     } catch (error) {
//       console.error("Failed to load tasks and occurrences:", error);
//       toast({
//         title: "Error",
//         description: "Failed to load tasks. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleComplete = async (occurrenceId: string, completed: boolean) => {
//     try {
//       // Optimistic update
//       setOccurrences((prev) =>
//         prev.map((occ) =>
//           occ.id === occurrenceId ? { ...occ, completed } : occ
//         )
//       );

//       await completeTaskOccurrence(occurrenceId, completed);
//     } catch (error) {
//       console.error("Failed to update task completion status:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update task status. Please try again.",
//         variant: "destructive",
//       });

//       // Revert optimistic update on error
//       setOccurrences((prev) =>
//         prev.map((occ) =>
//           occ.id === occurrenceId ? { ...occ, completed: !completed } : occ
//         )
//       );
//     }
//   };

//   // Group occurrences by due date
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const nextWeek = new Date(today);
//   nextWeek.setDate(nextWeek.getDate() + 7);

//   const overdue = occurrences.filter(
//     (o) => new Date(o.dueDate) < today && !o.completed
//   );
//   const todayTasks = occurrences.filter((o) => {
//     const dueDate = new Date(o.dueDate);
//     dueDate.setHours(0, 0, 0, 0);
//     return (
//       dueDate.getTime() === today.getTime() && (!o.completed || showAllTasks)
//     );
//   });
//   const tomorrowTasks = occurrences.filter((o) => {
//     const dueDate = new Date(o.dueDate);
//     dueDate.setHours(0, 0, 0, 0);
//     return (
//       dueDate.getTime() === tomorrow.getTime() && (!o.completed || showAllTasks)
//     );
//   });
//   const thisWeekTasks = occurrences.filter((o) => {
//     const dueDate = new Date(o.dueDate);
//     dueDate.setHours(0, 0, 0, 0);
//     return (
//       dueDate > tomorrow && dueDate < nextWeek && (!o.completed || showAllTasks)
//     );
//   });
//   const laterTasks = occurrences.filter((o) => {
//     const dueDate = new Date(o.dueDate);
//     dueDate.setHours(0, 0, 0, 0);
//     return dueDate >= nextWeek && (!o.completed || showAllTasks);
//   });

//   const completedTasks = showAllTasks
//     ? occurrences.filter((o) => o.completed)
//     : [];

//   return (
//     <div className="container py-8 px-4 max-w-4xl mx-auto">
//       <motion.div
//         className="flex justify-between items-center mb-8"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//       >
//         <h1 className="text-3xl font-bold">All Tasks</h1>

//         <div className="flex space-x-4">
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="show-completed"
//               checked={showAllTasks}
//               onCheckedChange={setShowAllTasks}
//             />
//             <Label htmlFor="show-completed">Show All Tasks</Label>
//           </div>

//           <div className="flex items-center space-x-2">
//             <Switch
//               id="filter-assigned"
//               checked={filterAssigned}
//               onCheckedChange={setFilterAssigned}
//             />
//             <Label htmlFor="filter-assigned">Assigned to Me</Label>
//           </div>
//         </div>
//       </motion.div>

//       {isLoading ? (
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div
//               key={i}
//               className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse"
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="space-y-8">
//           {overdue.length > 0 && (
//             <TaskGroup
//               title="Overdue"
//               tasks={tasks}
//               occurrences={overdue}
//               onComplete={handleComplete}
//               className="bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl"
//             />
//           )}

//           <TaskGroup
//             title="Today"
//             tasks={tasks}
//             occurrences={todayTasks}
//             onComplete={handleComplete}
//           />

//           <TaskGroup
//             title="Tomorrow"
//             tasks={tasks}
//             occurrences={tomorrowTasks}
//             onComplete={handleComplete}
//           />

//           <TaskGroup
//             title="This Week"
//             tasks={tasks}
//             occurrences={thisWeekTasks}
//             onComplete={handleComplete}
//           />

//           <TaskGroup
//             title="Later"
//             tasks={tasks}
//             occurrences={laterTasks}
//             onComplete={handleComplete}
//           />

//           {showAllTasks && completedTasks.length > 0 && (
//             <TaskGroup
//               title="Completed"
//               tasks={tasks}
//               occurrences={completedTasks}
//               onComplete={handleComplete}
//               className="opacity-70"
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllTasksPage;

import React from "react";
const AllTasksPage: React.FC = () => {
  return (
    <div>
      <h1>All Tasks</h1>
    </div>
  );
};

export default AllTasksPage;
// This is a placeholder component for the AllTasksPage.