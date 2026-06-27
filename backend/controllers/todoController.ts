import { Request, Response } from 'express';
import * as todoModel from '../models/todoModel.js';

// GET /todos
export async function getTodos(req: Request, res: Response): Promise<void> {
  try {
    const todos = await todoModel.getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todos' });
  }
}

// GET /todos/:id
export async function getTodoById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const todo = await todoModel.getTodoById(id);
    
    if (!todo) {
      res.status(404).json({ error: `Todo with ID ${id} not found` });
      return;
    }
    
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve todo details' });
  }
}

// POST /todos
export async function createTodo(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, completed, priority } = req.body;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'Title is required and must be a non-empty string' });
      return;
    }
    
    const newTodo = await todoModel.createTodo({
      title: title.trim(),
      description: (description || '').trim(),
      completed: typeof completed === 'boolean' ? completed : false,
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium'
    });
    
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
}

// PUT /todos/:id
export async function updateTodo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;
    
    const updates: any = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        res.status(400).json({ error: 'Title must be a non-empty string' });
        return;
      }
      updates.title = title.trim();
    }
    
    if (description !== undefined) {
      updates.description = (description || '').trim();
    }
    
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        res.status(400).json({ error: 'Completed status must be a boolean' });
        return;
      }
      updates.completed = completed;
    }
    
    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority)) {
        res.status(400).json({ error: 'Priority must be low, medium, or high' });
        return;
      }
      updates.priority = priority;
    }
    
    const updatedTodo = await todoModel.updateTodo(id, updates);
    
    if (!updatedTodo) {
      res.status(404).json({ error: `Todo with ID ${id} not found` });
      return;
    }
    
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
}

// DELETE /todos/:id
export async function deleteTodo(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const success = await todoModel.deleteTodo(id);
    
    if (!success) {
      res.status(404).json({ error: `Todo with ID ${id} not found` });
      return;
    }
    
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
}
