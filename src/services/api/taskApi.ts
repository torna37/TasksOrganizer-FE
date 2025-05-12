// This file contains mock implementations of TaskApi functions.
// In a real app, these would make API calls to a backend.

import { Task, TaskOccurrence, RecurrenceRule } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';
import { addDays, addWeeks, addMonths, addYears, subDays } from 'date-fns';

let tasks: Task[] = [
  {
    id: '1',
    taskListId: '1',
    title: 'Team meeting',
    description: 'Discuss project roadmap',
    isRecurring: true,
  },
  {
    id: '2',
    taskListId: '1',
    title: 'Submit expense report',
    description: 'For May business trip',
    dueDate: new Date('2025-05-20'),
    isRecurring: false,
  },
  {
    id: '3',
    taskListId: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    dueDate: new Date('2025-05-15'),
    isRecurring: false,
  },
];

let recurrenceRules: RecurrenceRule[] = [
  {
    id: '1',
    taskId: '1',
    frequency: 'weekly',
    interval: 1,
    daysOfWeek: [1], // Monday
  },
];

let taskOccurrences: TaskOccurrence[] = [
  {
    id: '1',
    taskId: '1',
    dueDate: addDays(new Date(), 0), // Today
    isCompleted: false,
  },
  {
    id: '2',
    taskId: '1',
    dueDate: addDays(new Date(), 7), // Next week
    isCompleted: false,
  },
  {
    id: '3',
    taskId: '1',
    dueDate: addDays(new Date(), 14), // Two weeks from now
    isCompleted: false,
  },
  {
    id: '4',
    taskId: '2',
    dueDate: new Date('2025-05-20'),
    isCompleted: false,
  },
  {
    id: '5',
    taskId: '3',
    dueDate: new Date('2025-05-15'),
    isCompleted: true,
  },
  {
    id: '6',
    taskId: '3',
    dueDate: subDays(new Date(), 2), // Two days ago (overdue)
    isCompleted: false,
  },
];

// Utility to generate occurrences based on recurrence rule
const generateOccurrences = (task: Task, rule: RecurrenceRule, startDate: Date, count = 10): TaskOccurrence[] => {
  const occurrences: TaskOccurrence[] = [];
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < count; i++) {
    occurrences.push({
      id: uuidv4(),
      taskId: task.id,
      dueDate: new Date(currentDate),
      isCompleted: false,
    });
    
    switch (rule.frequency) {
      case 'daily':
        currentDate = addDays(currentDate, rule.interval);
        break;
      case 'weekly':
        currentDate = addWeeks(currentDate, rule.interval);
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, rule.interval);
        break;
      case 'yearly':
        currentDate = addYears(currentDate, rule.interval);
        break;
    }
  }
  
  return occurrences;
};

export const TaskApi = {
  // Get tasks for a specific list
  getTasksByListId: async (listId: string): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = tasks.filter(task => task.taskListId === listId);
        resolve(filtered);
      }, 500);
    });
  },
  
  // Get all tasks
  getAllTasks: async (userId?: string): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tasks);
      }, 500);
    });
  },
  
  // Get task occurrences for a specific list
  getTaskOccurrencesByListId: async (listId: string): Promise<TaskOccurrence[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const listTasks = tasks.filter(task => task.taskListId === listId);
        const listTaskIds = listTasks.map(task => task.id);
        const filtered = taskOccurrences.filter(occurrence => 
          listTaskIds.includes(occurrence.taskId)
        );
        resolve(filtered);
      }, 500);
    });
  },
  
  // Get all task occurrences
  getAllTaskOccurrences: async (userId?: string): Promise<TaskOccurrence[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(taskOccurrences);
      }, 500);
    });
  },
  
  // Mark a task occurrence as complete/incomplete
  completeTaskOccurrence: async (occurrenceId: string, completed: boolean): Promise<TaskOccurrence> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const occurrenceIndex = taskOccurrences.findIndex(o => o.id === occurrenceId);
        
        if (occurrenceIndex !== -1) {
          taskOccurrences[occurrenceIndex] = {
            ...taskOccurrences[occurrenceIndex],
            isCompleted: completed,
          };
          
          resolve(taskOccurrences[occurrenceIndex]);
        } else {
          reject(new Error('Task occurrence not found'));
        }
      }, 500);
    });
  },
  
  // Create a new task
  createTask: async (task: Omit<Task, 'id'>, recurrenceRule?: Omit<RecurrenceRule, 'id' | 'taskId'>): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTaskId = uuidv4();
        
        const newTask: Task = {
          id: newTaskId,
          ...task,
        };
        
        tasks.push(newTask);
        
        if (task.isRecurring && recurrenceRule) {
          const newRule: RecurrenceRule = {
            id: uuidv4(),
            taskId: newTaskId,
            ...recurrenceRule,
          };
          
          recurrenceRules.push(newRule);
          
          // Generate occurrences based on the recurrence rule
          const startDate = task.dueDate || new Date();
          const newOccurrences = generateOccurrences(newTask, newRule, startDate);
          taskOccurrences = [...taskOccurrences, ...newOccurrences];
        } else if (!task.isRecurring && task.dueDate) {
          // For non-recurring tasks, create a single occurrence
          const newOccurrence: TaskOccurrence = {
            id: uuidv4(),
            taskId: newTaskId,
            dueDate: task.dueDate,
            isCompleted: false,
          };
          
          taskOccurrences.push(newOccurrence);
        }
        
        resolve(newTask);
      }, 500);
    });
  },
};
