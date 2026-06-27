import express from 'express';
import cors from 'cors';
import path from 'path';
import todoRoutes from './routes/todoRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the separate frontend can communicate with this backend
app.use(cors());

// Body parser middleware
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Mount CRUD REST APIs on /todos
app.use('/todos', todoRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Todo App REST API',
    endpoints: {
      getAllTodos: 'GET /todos',
      getTodoById: 'GET /todos/:id',
      createTodo: 'POST /todos',
      updateTodo: 'PUT /todos/:id',
      deleteTodo: 'DELETE /todos/:id'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend Express server running on port ${PORT}`);
});
