
import { Task, TaskOccurrence, RecurrenceRule } from '@/types/models';

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    taskListId: '1',
    title: 'Complete project proposal',
    description: 'Finish the draft and send it for review',
    isRecurring: false,
    dueDate: new Date(2025, 4, 17),
  },
  {
    id: '2',
    taskListId: '1',
    title: 'Team meeting',
    description: 'Weekly sync with the team',
    isRecurring: true,
  },
  {
    id: '3',
    taskListId: '1',
    title: 'Review pull requests',
    isRecurring: false,
    dueDate: new Date(2025, 4, 15),
  },
  {
    id: '4',
    taskListId: '2',
    title: 'Shopping list',
    description: 'Buy groceries for the week',
    isRecurring: true,
  },
  {
    id: '5',
    taskListId: '2',
    title: 'Pay bills',
    description: 'Electricity and internet',
    isRecurring: false,
    dueDate: new Date(2025, 4, 20),
  },
];

const mockRecurrenceRules: RecurrenceRule[] = [
  {
    id: '1',
    taskId: '2',
    frequency: 'weekly',
    interval: 1,
    daysOfWeek: [1], // Monday
  },
  {
    id: '2',
    taskId: '4',
    frequency: 'monthly',
    interval: 1,
    daysOfMonth: [1], // 1st of month
  }
];

// Generate occurrences based on tasks and recurrence rules
const generateMockOccurrences = () => {
  const occurrences: TaskOccurrence[] = [];
  
  // Add non-recurring tasks directly
  mockTasks
    .filter(task => !task.isRecurring)
    .forEach(task => {
      if (task.dueDate) {
        occurrences.push({
          id: `occ-${task.id}-1`,
          taskId: task.id,
          dueDate: task.dueDate,
          completed: false
        });
      }
    });
  
  // Generate occurrences for recurring tasks
  mockTasks
    .filter(task => task.isRecurring)
    .forEach(task => {
      const rule = mockRecurrenceRules.find(r => r.taskId === task.id);
      if (rule) {
        const today = new Date();
        
        // Generate for the next few weeks/months
        if (rule.frequency === 'weekly') {
          for (let i = 0; i < 5; i++) {
            const dueDate = new Date();
            dueDate.setDate(today.getDate() + (i * 7) + ((rule.daysOfWeek?.[0] || 0) - today.getDay()));
            
            occurrences.push({
              id: `occ-${task.id}-${i}`,
              taskId: task.id,
              dueDate,
              completed: i === 0 && task.id === '2' // Mark the first meeting as completed for demo
            });
          }
        } else if (rule.frequency === 'monthly') {
          for (let i = 0; i < 3; i++) {
            const dueDate = new Date();
            dueDate.setMonth(today.getMonth() + i);
            dueDate.setDate(rule.daysOfMonth?.[0] || 1);
            
            occurrences.push({
              id: `occ-${task.id}-${i}`,
              taskId: task.id,
              dueDate,
              completed: false
            });
          }
        }
      }
    });
  
  return occurrences;
};

// API
export const TaskApi = {
  getTasksByListId: async (listId: string): Promise<Task[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return mockTasks.filter(task => task.taskListId === listId);
  },

  getAllTasks: async (userId?: string): Promise<Task[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return mockTasks; // In a real app, filter by userId if provided
  },
  
  getTaskOccurrencesByListId: async (listId: string): Promise<TaskOccurrence[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    const occurrences = generateMockOccurrences();
    const listTasks = mockTasks.filter(task => task.taskListId === listId);
    return occurrences.filter(occ => listTasks.some(task => task.id === occ.taskId));
  },

  getAllTaskOccurrences: async (userId?: string): Promise<TaskOccurrence[]> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return generateMockOccurrences(); // In a real app, filter by userId if provided
  },
  
  completeTaskOccurrence: async (occurrenceId: string, completed: boolean): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    // In a real app, update the completion status in the database
    console.log(`Task occurrence ${occurrenceId} marked as ${completed ? 'completed' : 'incomplete'}`);
  },
  
  createTask: async (
    task: Omit<Task, "id">, 
    recurrenceRule?: Omit<RecurrenceRule, "id" | "taskId">
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    // In a real app, this would save to a database
    const newId = `${mockTasks.length + 1}`;
    const newTask: Task = {
      id: newId,
      ...task
    };
    
    mockTasks.push(newTask);
    
    // If there's a recurrence rule, add it to the rules
    if (recurrenceRule && task.isRecurring) {
      const newRuleId = `${mockRecurrenceRules.length + 1}`;
      mockRecurrenceRules.push({
        id: newRuleId,
        taskId: newId,
        ...recurrenceRule
      });
    }
    
    console.log('New task created:', newTask);
  },
  
  updateTask: async (task: Task): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    // Find and update the task
    const index = mockTasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      mockTasks[index] = { ...task };
    }
  }
};
