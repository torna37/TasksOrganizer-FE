
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import RecurrenceEditor from './RecurrenceEditor';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task, RecurrenceRule } from "@/types/models";

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
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              autoFocus
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task details"
              className="h-20 rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <Label htmlFor="recurring">Recurring task</Label>
          </div>

          {/* Due Date Selector - Always shown */}
          <div className="space-y-2">
            <Label>Due Date{isRecurring ? " (First Occurrence)" : ""}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-lg",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <AnimatePresence>
            {isRecurring && (
              <motion.div
                key="recurrence-options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Recurrence Options</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="multiple"
                        checked={multipleSelection}
                        onCheckedChange={setMultipleSelection}
                      />
                      <Label htmlFor="multiple">Multiple selections</Label>
                    </div>
                  </div>

                  {multipleSelection ? (
                    <RecurrenceEditor
                      value={recurrenceRule}
                      onChange={setRecurrenceRule}
                      showAdvanced={true}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Tabs 
                          defaultValue={recurrenceRule.frequency} 
                          onValueChange={(val: 'daily' | 'weekly' | 'monthly' | 'yearly') => 
                            setRecurrenceRule({...recurrenceRule, frequency: val})
                          }
                          className="mt-2"
                        >
                          <TabsList className="grid grid-cols-4 w-full">
                            <TabsTrigger value="daily">Daily</TabsTrigger>
                            <TabsTrigger value="weekly">Weekly</TabsTrigger>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger value="yearly">Yearly</TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      
                      <div>
                        <Label htmlFor="interval">Every</Label>
                        <div className="flex items-center mt-2">
                          <Input
                            id="interval"
                            type="number"
                            min={1}
                            value={recurrenceRule.interval}
                            onChange={e => setRecurrenceRule({
                              ...recurrenceRule, 
                              interval: parseInt(e.target.value) || 1
                            })}
                            className="w-20 rounded-lg"
                          />
                          <span className="ml-2 text-muted-foreground">
                            {recurrenceRule.interval === 1 
                              ? recurrenceRule.frequency.slice(0, -2) 
                              : recurrenceRule.frequency}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
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
