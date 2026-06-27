import fs from 'fs/promises';
import path from 'path';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), 'backend', 'data', 'todos.json');

// Ensure database file exists
async function ensureFileExists() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export async function getAllTodos(): Promise<Todo[]> {
  await ensureFileExists();
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as Todo[];
  } catch (error) {
    console.error('Error reading todos file:', error);
    return [];
  }
}

export async function getTodoById(id: string): Promise<Todo | null> {
  const todos = await getAllTodos();
  return todos.find(todo => todo.id === id) || null;
}

export async function createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> {
  const todos = await getAllTodos();
  
  const newTodo: Todo = {
    ...todoData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
  return newTodo;
}

export async function updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo | null> {
  const todos = await getAllTodos();
  const index = todos.findIndex(todo => todo.id === id);
  
  if (index === -1) return null;
  
  const updatedTodo: Todo = {
    ...todos[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  todos[index] = updatedTodo;
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
  return updatedTodo;
}

export async function deleteTodo(id: string): Promise<boolean> {
  const todos = await getAllTodos();
  const initialLength = todos.length;
  const filteredTodos = todos.filter(todo => todo.id !== id);
  
  if (filteredTodos.length === initialLength) return false;
  
  await fs.writeFile(DATA_FILE, JSON.stringify(filteredTodos, null, 2), 'utf-8');
  return true;
}
