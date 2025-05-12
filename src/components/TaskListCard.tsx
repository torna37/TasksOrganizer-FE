
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { TaskList } from '@/types/models';

interface TaskListCardProps {
  taskList: TaskList;
  onClick: (id: string) => void;
}

const TaskListCard: React.FC<TaskListCardProps> = ({ taskList, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="cursor-pointer shadow-card hover:shadow-lg transition-shadow duration-300 rounded-2xl overflow-hidden h-full"
        onClick={() => onClick(taskList.id)}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{taskList.name}</CardTitle>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-muted-foreground text-sm line-clamp-2">
            {taskList.description || 'No description'}
          </p>
        </CardContent>
        <CardFooter className="pt-2 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users size={16} className="mr-2" />
            <span>{taskList.memberCount || 1} {taskList.memberCount === 1 ? 'member' : 'members'}</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TaskListCard;
