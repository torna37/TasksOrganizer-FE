
import { TaskList } from "../../types/models";

// In a real application, these functions would make actual API calls
// For this example, we're using mock data with async/await pattern to simulate API behavior

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
let mockTaskLists: TaskList[] = [
  {
    id: "1",
    name: "Personal Tasks",
    description: "My personal to-do list",
    createdAt: new Date("2023-01-15"),
    memberCount: 1
  },
  {
    id: "2",
    name: "Work Projects",
    description: "Team projects and deadlines",
    createdAt: new Date("2023-02-20"),
    memberCount: 5
  },
  {
    id: "3",
    name: "Household Chores",
    description: "Regular home maintenance",
    createdAt: new Date("2023-03-10"),
    memberCount: 3
  }
];

export const TaskListApi = {
  // Get all task lists for the current user
  getUserTaskLists: async (): Promise<TaskList[]> => {
    await delay(300); // Simulate network delay
    return [...mockTaskLists];
  },

  // Get a single task list by ID
  getTaskList: async (id: string): Promise<TaskList | undefined> => {
    await delay(200);
    return mockTaskLists.find(list => list.id === id);
  },

  // Create a new task list
  createTaskList: async (taskList: Omit<TaskList, 'id' | 'createdAt'>): Promise<TaskList> => {
    await delay(400);
    const newTaskList: TaskList = {
      id: `list-${Date.now()}`,
      createdAt: new Date(),
      memberCount: 1,
      ...taskList,
    };
    mockTaskLists.push(newTaskList);
    return newTaskList;
  },

  // Update an existing task list
  updateTaskList: async (id: string, updates: Partial<TaskList>): Promise<TaskList> => {
    await delay(300);
    const index = mockTaskLists.findIndex(list => list.id === id);
    if (index === -1) throw new Error(`Task list with ID ${id} not found`);
    
    mockTaskLists[index] = {
      ...mockTaskLists[index],
      ...updates
    };
    
    return mockTaskLists[index];
  },

  // Delete a task list
  deleteTaskList: async (id: string): Promise<boolean> => {
    await delay(500);
    const initialLength = mockTaskLists.length;
    mockTaskLists = mockTaskLists.filter(list => list.id !== id);
    return mockTaskLists.length < initialLength;
  }
};
