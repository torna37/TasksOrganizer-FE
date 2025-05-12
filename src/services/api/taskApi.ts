
import { Task, TaskOccurrence, RecurrenceRule, TaskCompletion } from "../../types/models";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
let mockTasks: Task[] = [
  {
    id: "1",
    taskListId: "1",
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    isRecurring: false,
    isCompleted: false
  },
  {
    id: "2",
    taskListId: "1",
    title: "Pay utilities bill",
    description: "Electric and water bills",
    dueDate: new Date(),
    isRecurring: true,
    isCompleted: false
  },
  {
    id: "3",
    taskListId: "2",
    title: "Weekly team meeting",
    description: "Progress updates",
    isRecurring: true,
    isCompleted: false
  },
  {
    id: "4",
    taskListId: "3",
    title: "Clean gutters",
    description: "Front and back of house",
    dueDate: new Date(Date.now() - 86400000), // Yesterday (overdue)
    isRecurring: false,
    isCompleted: false
  }
];

let mockRecurrenceRules: RecurrenceRule[] = [
  {
    id: "1",
    taskId: "2",
    frequency: "monthly",
    interval: 1,
    daysOfMonth: [15]
  },
  {
    id: "2",
    taskId: "3",
    frequency: "weekly",
    interval: 1,
    daysOfWeek: [1] // Monday
  }
];

let mockTaskOccurrences: TaskOccurrence[] = [
  {
    id: "1",
    taskId: "1",
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    isCompleted: false
  },
  {
    id: "2",
    taskId: "2",
    dueDate: new Date(),
    isCompleted: false
  },
  {
    id: "3",
    taskId: "3",
    dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
    isCompleted: false
  },
  {
    id: "4",
    taskId: "4",
    dueDate: new Date(Date.now() - 86400000), // Yesterday (overdue)
    isCompleted: false
  }
];

let mockTaskCompletions: TaskCompletion[] = [];

export const TaskApi = {
  // Get all tasks for a specific task list
  getTasksForList: async (taskListId: string): Promise<Task[]> => {
    await delay(300);
    return mockTasks.filter(task => task.taskListId === taskListId);
  },

  // Get task occurrences for the given task list
  getTaskOccurrences: async (taskListId: string): Promise<TaskOccurrence[]> => {
    await delay(300);
    const tasks = mockTasks.filter(task => task.taskListId === taskListId);
    const taskIds = tasks.map(task => task.id);
    return mockTaskOccurrences.filter(occurrence => taskIds.includes(occurrence.taskId));
  },

  // Create a new task
  createTask: async (task: Omit<Task, 'id'>, recurrenceRule?: Omit<RecurrenceRule, 'id' | 'taskId'>): Promise<Task> => {
    await delay(500);
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...task
    };
    mockTasks.push(newTask);

    // If it's a recurring task, create the recurrence rule
    if (task.isRecurring && recurrenceRule) {
      const newRule: RecurrenceRule = {
        id: `rule-${Date.now()}`,
        taskId: newTask.id,
        ...recurrenceRule
      };
      mockRecurrenceRules.push(newRule);

      // Generate some mock occurrences
      generateOccurrences(newTask, newRule);
    } else if (!task.isRecurring && task.dueDate) {
      // Create a single occurrence for non-recurring task
      mockTaskOccurrences.push({
        id: `occurrence-${Date.now()}`,
        taskId: newTask.id,
        dueDate: task.dueDate,
        isCompleted: false
      });
    }

    return newTask;
  },

  // Get recurrence rule for a task
  getRecurrenceRule: async (taskId: string): Promise<RecurrenceRule | undefined> => {
    await delay(200);
    return mockRecurrenceRules.find(rule => rule.taskId === taskId);
  },

  // Mark a task occurrence as complete
  completeTaskOccurrence: async (occurrenceId: string, userId: string): Promise<TaskOccurrence> => {
    await delay(300);
    const occurrenceIndex = mockTaskOccurrences.findIndex(o => o.id === occurrenceId);
    
    if (occurrenceIndex === -1) {
      throw new Error(`Task occurrence with ID ${occurrenceId} not found`);
    }

    // Mark the occurrence as completed
    mockTaskOccurrences[occurrenceIndex] = {
      ...mockTaskOccurrences[occurrenceIndex],
      isCompleted: true
    };

    // Record the completion
    const completion: TaskCompletion = {
      id: `completion-${Date.now()}`,
      taskOccurrenceId: occurrenceId,
      userId,
      completedAt: new Date()
    };
    
    mockTaskCompletions.push(completion);
    
    return mockTaskOccurrences[occurrenceIndex];
  },

  // Get all tasks assigned to the current user
  getAssignedTasks: async (userId: string): Promise<Task[]> => {
    await delay(400);
    // In a real app, this would filter tasks by assignment
    // For now, we'll just return all tasks
    return [...mockTasks];
  }
};

// Helper function to generate occurrences based on recurrence rule
function generateOccurrences(task: Task, rule: RecurrenceRule): void {
  const today = new Date();
  const dates: Date[] = [];

  // Generate the next 3 occurrences based on the rule
  // This is a simplified implementation
  switch (rule.frequency) {
    case 'daily':
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i * rule.interval);
        dates.push(date);
      }
      break;
    
    case 'weekly':
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        for (let i = 0; i < 21; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);
          
          if (rule.daysOfWeek.includes(date.getDay())) {
            dates.push(new Date(date));
            if (dates.length >= 3) break;
          }
        }
      }
      break;
    
    case 'monthly':
      if (rule.daysOfMonth && rule.daysOfMonth.length > 0) {
        for (let i = 0; i < 3; i++) {
          const date = new Date(today);
          date.setMonth(date.getMonth() + i * rule.interval);
          
          for (const dayOfMonth of rule.daysOfMonth) {
            if (dayOfMonth <= 28) {
              const occurrenceDate = new Date(date.getFullYear(), date.getMonth(), dayOfMonth);
              if (occurrenceDate >= today) {
                dates.push(occurrenceDate);
              }
            }
          }
        }
      }
      break;
      
    case 'yearly':
      if (rule.monthsOfYear && rule.monthsOfYear.length > 0 && rule.daysOfMonth && rule.daysOfMonth.length > 0) {
        for (let i = 0; i < 3; i++) {
          const year = today.getFullYear() + i * rule.interval;
          
          for (const month of rule.monthsOfYear) {
            for (const day of rule.daysOfMonth) {
              const date = new Date(year, month - 1, day);
              if (date >= today) {
                dates.push(date);
                if (dates.length >= 3) break;
              }
            }
            if (dates.length >= 3) break;
          }
        }
      }
      break;
  }

  // Create occurrences from the generated dates
  dates.slice(0, 3).forEach(date => {
    mockTaskOccurrences.push({
      id: `occurrence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId: task.id,
      dueDate: date,
      isCompleted: false
    });
  });
}
