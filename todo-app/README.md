# TodoSphere Full-Stack Suite 🚀

Welcome to **TodoSphere**, a complete production-ready full-stack Todo application. This project has been built using a modular architecture with **React (JavaScript)** on the frontend and **Node.js with Express.js** on the backend.

It is designed to be highly responsive, modern, visually polished, and fully functional, adhering strictly to all requirements of your developer assignment.

---

## 🌟 Key Features

### 💻 Frontend (React, Vite, React Router, Tailwind)
- **Multi-Page Application**: Built with standard Client-Side Routing via React Router (`/` and `/todo`).
- **Milestone Stats Board**: Real-time counter reporting total, completed, pending, and high-priority milestones.
- **Dynamic CRUD Operations**: Live addition, editing, completion-toggling, and deletion.
- **Advanced Query Filters**:
  - Full-text search over titles and descriptions.
  - Quick status dropdowns (All, Completed, Pending).
  - Priority badge selectors (All, High, Medium, Low).
- **Flexible Sorting**: Sort tasks by newest or oldest created.
- **Visual Design**: Styled with a slate/indigo modern UI (Tailwind CSS) featuring cards, responsive badges, and smooth hover state indicators.
- **Sliding Overlays**: Modal integration keeps lists neat and simple.

### 🔌 Backend (Node.js, Express, File System Storage)
- **RESTful APIs**: Exposes pristine Express router-based endpoints.
- **Persistent JSON Engine**: Reads and writes directly to local file storage at `backend/data/todos.json`.
- **Express Router Isolation**: Standardized separation of routes, controllers, models, and schemas.
- **Full validation**: Handles query checks, type validation, and appropriate HTTP statuses (200, 201, 400, 404, 500).

---

## 📁 Folder Structure

```text
todo-app/
├── backend/
│   ├── data/
│   │   └── todos.json          # Persistent file storage
│   ├── controllers/
│   │   └── todoController.js   # API request/response controllers
│   ├── models/
│   │   └── todoModel.js        # File I/O operations & queries
│   ├── routes/
│   │   └── todoRoutes.js       # Express routes declaration
│   ├── server.js               # Standalone backend server (Port 5000)
│   └── package.json            # Backend dependency configuration
│
├── frontend/
│   ├── index.html              # Primary entry HTML
│   ├── vite.config.js          # Vite server & proxy configuration
│   ├── package.json            # Frontend dependency configuration
│   └── src/
│       ├── main.jsx            # Application bootstrap
│       ├── App.jsx             # Shell & Router wrapper
│       ├── App.css             # Main stylesheet (Tailwind imports)
│       ├── services/
│       │   └── todoService.js  # API request proxy client
│       └── pages/
│           ├── TodoList.jsx    # Display, search, filter, and management
│           └── TodoDetails.jsx # Detailed view (?id=1) with audit logs
│
└── README.md                   # Project documentation
```

---

## ⚡ Setup & Installation

### Prerequisite
Make sure you have [Node.js](https://nodejs.org/) (v18+) installed.

---

### Step 1: Run the Backend API

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the server:
   ```bash
   node server.js
   ```
   *The API will start running at `http://localhost:5000`*

---

### Step 2: Run the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend website will open at `http://localhost:3000`*

---

## 🔌 API Endpoints Reference

All endpoints are mounted on the `/todos` prefix:

| Method | Endpoint | Description | Request Body (JSON) | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/todos` | Retrieve all todo items | *None* | `200 OK` |
| **GET** | `/todos/:id` | Get individual todo details | *None* | `200 OK` / `404 Not Found` |
| **POST** | `/todos` | Add a new todo item | `{ "title", "description"?, "priority"?, "completed"? }` | `201 Created` / `400 Bad Request` |
| **PUT** | `/todos/:id` | Modify any field of an existing todo | `{ "title"?, "description"?, "priority"?, "completed"? }` | `200 OK` / `404 Not Found` |
| **DELETE** | `/todos/:id` | Purge a todo item from storage | *None* | `200 OK` / `404 Not Found` |

### Sample JSON Request Body (POST /todos)
```json
{
  "title": "Launch TodoSphere App",
  "description": "Verify local JSON file writes and browser networking",
  "priority": "high",
  "completed": false
}
```

---

## 🖼️ UI/UX Highlights (Screenshots)
- **Primary Grid**: Features full stats dashboard displaying active, completed, and high priority metrics in beautiful responsive badges.
- **Advanced Query Panel**: Interactive filters instantly reduce lists on title/desc matches, priority level, or status completion state.
- **Deep Metadata Card**: Navigating to `/todo?id=123` displays complete creation logs, priority dots, and accurate ISO modification stamps.
