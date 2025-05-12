
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Task, TaskOccurrence } from '@/types/models';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  occurrence: TaskOccurrence;
  onComplete: (occurrenceId: string, completed: boolean) => void;
  className?: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, occurrence, onComplete, className }) => {
  const taskDueDate = new Date(occurrence.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate if task is overdue
  const isOverdue = taskDueDate < today && !occurrence.isCompleted;

  // Format the due date
  const dueDate = format(taskDueDate, 'MMM d');
  
  // Handle checkbox click
  const handleCheckboxClick = () => {
    onComplete(occurrence.id, !occurrence.isCompleted);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
        opacity: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all hover:shadow-md",
          occurrence.isCompleted && "opacity-75",
          isOverdue && "border-red-300 dark:border-red-900",
          className
        )}
      >
        <CardContent className="p-0">
          <div className="flex items-center p-3">
            <div 
              role="checkbox"
              aria-checked={occurrence.isCompleted}
              tabIndex={0}
              onClick={handleCheckboxClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCheckboxClick();
                }
              }}
              className={cn(
                "flex-shrink-0 mr-3 w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors",
                occurrence.isCompleted 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground hover:border-primary"
              )}
            >
              {occurrence.isCompleted && <Check className="h-3 w-3" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium line-clamp-1",
                occurrence.isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </p>
              
              {task.description && (
                <p className={cn(
                  "text-xs text-muted-foreground line-clamp-1",
                  occurrence.isCompleted && "line-through"
                )}>
                  {task.description}
                </p>
              )}
            </div>

            <div 
              className={cn(
                "flex items-center text-xs ml-2",
                isOverdue ? "text-red-500 dark:text-red-400" : "text-muted-foreground",
                occurrence.isCompleted && "text-muted-foreground"
              )}
            >
              <Clock className="h-3 w-3 mr-1" />
              <span>{dueDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default TaskItem;
