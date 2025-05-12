import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, CheckSquare, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TaskApi } from '@/services/api/taskApi';
import { TaskListApi } from '@/services/api/taskListApi';
import { Task, TaskList, TaskOccurrence, RecurrenceRule } from '@/types/models';
import TaskCreationModal from '@/components/task/TaskCreationModal';
import TaskGroup from '@/components/TaskGroup';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { groupTasksByDate } from '@/utils/dateUtils';

const TaskListView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [taskList, setTaskList] = useState<TaskList | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [occurrences, setOccurrences] = useState<TaskOccurrence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterBy, setFilterBy] = useState<'all' | 'assigned'>('all');

  useEffect(() => {
    if (id) {
      loadData(id);
    }
  }, [id]);

  const loadData = async (taskListId: string) => {
    setIsLoading(true);
    try {
      const [list, taskData, occurrenceData] = await Promise.all([
        TaskListApi.getTaskList(taskListId),
        TaskApi.getTasksByListId(taskListId),
        TaskApi.getTaskOccurrencesByListId(taskListId)
      ]);
      
      if (!list) {
        toast({
          title: 'Error',
          description: 'Task list not found',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }
      
      setTaskList(list);
      setTasks(taskData);
      setOccurrences(occurrenceData);
    } catch (error) {
      console.error('Failed to load task list:', error);
      toast({
        title: 'Error',
        description: 'Failed to load task list data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async (
    task: Omit<Task, 'id'>, 
    recurrenceRule?: Omit<RecurrenceRule, 'id' | 'taskId'>
  ): Promise<void> => {
    try {
      await TaskApi.createTask(task, recurrenceRule);
      
      // For simplicity, reload tasks after creating one
      // In a real app with optimistic UI updates, we'd add the task to state directly
      if (id) {
        await loadData(id);
      }
      
      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
      
    } catch (error) {
      console.error('Failed to create task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleCompleteTask = async (occurrenceId: string, completed: boolean) => {
    try {
      // Optimistic UI update
      setOccurrences(prev => 
        prev.map(occ => 
          occ.id === occurrenceId ? { ...occ, isCompleted: true } : occ
        )
      );
      
      await TaskApi.completeTaskOccurrence(occurrenceId, completed);
      
      toast({
        title: 'Success',
        description: 'Task marked as complete',
      });
    } catch (error) {
      console.error('Failed to complete task:', error);
      
      // Revert the optimistic update
      setOccurrences(prev => 
        prev.map(occ => 
          occ.id === occurrenceId ? { ...occ, isCompleted: false } : occ
        )
      );
      
      toast({
        title: 'Error',
        description: 'Failed to mark task as complete',
        variant: 'destructive',
      });
    }
  };

  const groupedOccurrences = groupTasksByDate(occurrences);
  
  const filterOccurrences = (group: TaskOccurrence[]): TaskOccurrence[] => {
    // In a real app, we'd filter based on user assignments
    return filterBy === 'assigned' 
      ? group.slice(0, Math.ceil(group.length / 2))  // Mock assigned tasks filter
      : group;
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
            onClick={() => navigate('/')}
            className="mr-2 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold">{isLoading ? 'Loading...' : taskList?.name}</h1>
        </div>
        
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                <Filter className="mr-2 h-4 w-4" />
                {filterBy === 'all' ? 'All Tasks' : 'Assigned to Me'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <DropdownMenuRadioItem value="all">All Tasks</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="assigned">Assigned to Me</DropdownMenuRadioItem>
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
          {['Overdue', 'Today', 'Upcoming'].map(section => (
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
            occurrences={filterOccurrences(groupedOccurrences['Overdue'])}
            onComplete={handleCompleteTask}
            className="text-task-overdue"
          />
          
          <TaskGroup
            title="Today"
            tasks={tasks}
            occurrences={filterOccurrences(groupedOccurrences['Today'])}
            onComplete={handleCompleteTask}
            className="text-task-today"
          />
          
          <TaskGroup
            title="Upcoming"
            tasks={tasks}
            occurrences={filterOccurrences(groupedOccurrences['Upcoming'])}
            onComplete={handleCompleteTask}
            className="text-task-upcoming"
          />
          
          {Object.values(groupedOccurrences).every(group => 
            filterOccurrences(group).length === 0
          ) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                No tasks to show.{' '}
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
        taskListId={id || ''}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default TaskListView;
