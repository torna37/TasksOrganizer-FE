
import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateShort, isToday, isPast } from '@/utils/dateUtils';
import { Check } from 'lucide-react';
import { Task, TaskOccurrence } from '@/types/models';

interface TaskItemProps {
  task: Task;
  occurrence: TaskOccurrence;
  onComplete: (occurrenceId: string, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, occurrence, onComplete }) => {
  const isCompleted = occurrence.isCompleted;
  const dueDate = new Date(occurrence.dueDate);
  
  const getStatusColor = () => {
    if (isCompleted) return 'text-task-completed';
    if (isPast(dueDate)) return 'text-task-overdue';
    if (isToday(dueDate)) return 'text-task-today';
    return 'text-task-upcoming';
  };
  
  const handleChange = (checked: boolean) => {
    onComplete(occurrence.id, checked);
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-3 p-3 rounded-xl bg-white hover:bg-gray-50
                ${isCompleted ? 'opacity-70' : 'opacity-100'}`}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleChange}
        className="mt-1"
      />
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h3>
          <span className={`text-sm ${getStatusColor()}`}>
            {formatDateShort(dueDate)}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default TaskItem;
