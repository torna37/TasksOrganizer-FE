
import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, RecurrenceRule } from "@/types/models";
import BasicTaskForm from './BasicTaskForm';
import RecurrenceOptions from './RecurrenceOptions';

interface TaskCreationModalProps {
  open: boolean;
  taskListId: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: Omit<Task, 'id'>, recurrenceRule?: Omit<RecurrenceRule, 'id' | 'taskId'>) => Promise<void>;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({
  open,
  taskListId,
  onOpenChange,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [multipleSelection, setMultipleSelection] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState<RecurrenceRule>({
    id: '',
    taskId: '',
    frequency: 'daily',
    interval: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIsRecurring(false);
    setDueDate(undefined);
    setMultipleSelection(false);
    setRecurrenceRule({
      id: '',
      taskId: '',
      frequency: 'daily',
      interval: 1,
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);

    const task: Omit<Task, 'id'> = {
      taskListId,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: isRecurring ? dueDate : dueDate, // For recurring tasks, the dueDate is now the first occurrence
      isRecurring,
    };

    try {
      await onSubmit(task, isRecurring ? recurrenceRule : undefined);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list. Fill out the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <BasicTaskForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            isRecurring={isRecurring}
            setIsRecurring={setIsRecurring}
            dueDate={dueDate}
            setDueDate={setDueDate}
          />

          <AnimatePresence>
            {isRecurring && (
              <RecurrenceOptions
                multipleSelection={multipleSelection}
                setMultipleSelection={setMultipleSelection}
                recurrenceRule={recurrenceRule}
                setRecurrenceRule={setRecurrenceRule}
              />
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting || (!dueDate)}
            className="rounded-lg"
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationModal;
