
import React from 'react';
import { motion } from 'framer-motion';
import TaskItem from './TaskItem';
import { Task, TaskOccurrence } from '@/types/models';

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  occurrences: TaskOccurrence[];
  onComplete: (occurrenceId: string, completed: boolean) => void;
  className?: string;
}

const TaskGroup: React.FC<TaskGroupProps> = ({ 
  title, 
  tasks, 
  occurrences, 
  onComplete,
  className = ''
}) => {
  // Group occurrences by task ID for easier lookup
  const taskMap = new Map<string, Task>();
  tasks.forEach(task => taskMap.set(task.id, task));

  // Filter out occurrences with no matching task
  const validOccurrences = occurrences.filter(occurrence => 
    taskMap.has(occurrence.taskId)
  );

  if (validOccurrences.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`mb-6 ${className}`}
    >
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="space-y-2">
        {validOccurrences.map(occurrence => {
          const task = taskMap.get(occurrence.taskId);
          if (!task) return null;
          
          return (
            <TaskItem 
              key={occurrence.id} 
              task={task}
              occurrence={occurrence}
              onComplete={onComplete}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default TaskGroup;
