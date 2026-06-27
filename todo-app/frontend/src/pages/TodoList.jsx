import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit2, 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Filter, 
  SortAsc, 
  X, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { fetchAllTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService.js';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter/Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPriority, setFormPriority] = useState('medium');

  // Load Todos on Mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchAllTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos. Please ensure the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Complete
  const handleToggleComplete = async (todo) => {
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t.id === todo.id ? updated : t));
    } catch (err) {
      console.error('Failed to toggle completion status:', err);
    }
  };

  // Delete Todo
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) return;
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingTodo(null);
    setFormTitle('');
    setFormDescription('');
    setFormPriority('medium');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (todo) => {
    setEditingTodo(todo);
    setFormTitle(todo.title);
    setFormDescription(todo.description);
    setFormPriority(todo.priority);
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    try {
      if (editingTodo) {
        // Edit flow
        const updated = await updateTodo(editingTodo.id, {
          title: formTitle,
          description: formDescription,
          priority: formPriority
        });
        setTodos(prev => prev.map(t => t.id === editingTodo.id ? updated : t));
      } else {
        // Add flow
        const brandNew = await createTodo({
          title: formTitle,
          description: formDescription,
          completed: false,
          priority: formPriority
        });
        setTodos(prev => [brandNew, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save todo:', err);
    }
  };

  // Filter and Sort Logic
  const filteredTodos = todos
    .filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            todo.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true :
                            statusFilter === 'completed' ? todo.completed : !todo.completed;
      const matchesPriority = priorityFilter === 'all' ? true : todo.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Simple statistics
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const highPriorityCount = todos.filter(t => t.priority === 'high' && !t.completed).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            My Workspace Tasks
          </h1>
          <p className="text-slate-500 mt-2 font-sans">
            Manage your daily milestones, set priorities, and track progress effortlessly.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 cursor-pointer self-start md:self-auto"
        >
          <Plus size={20} />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', val: totalCount, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
          { label: 'Completed', val: completedCount, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Pending', val: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
          { label: 'High Priority (Pending)', val: highPriorityCount, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.bg} flex flex-col justify-between`}>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
            <span className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.val}</span>
          </div>
        ))}
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col gap-4">
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm placeholder-slate-400"
          />
        </div>

        {/* Row 2: Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Status: All Tasks</option>
              <option value="completed">Status: Completed</option>
              <option value="pending">Status: Pending</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 shrink-0" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">Priority: All</option>
              <option value="high">Priority: High Only</option>
              <option value="medium">Priority: Medium Only</option>
              <option value="low">Priority: Low Only</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc size={16} className="text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-600 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm mt-4">Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center gap-4 text-rose-700">
          <AlertCircle size={24} className="shrink-0" />
          <div>
            <h3 className="font-semibold text-rose-800">Connection Error</h3>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl py-16 px-4 text-center">
          <FileText className="mx-auto text-slate-300 mb-4" size={48} />
          <h3 className="font-semibold text-slate-700 text-lg">No Tasks Found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-1">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? "We couldn't find any tasks matching your filters. Try clearing some selections."
              : "You haven't added any tasks yet. Click 'Add New Task' to begin!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTodos.map((todo) => {
            const priorityStyles = {
              high: 'bg-rose-50 text-rose-700 border-rose-100',
              medium: 'bg-amber-50 text-amber-700 border-amber-100',
              low: 'bg-emerald-50 text-emerald-700 border-emerald-100',
            };

            return (
              <div
                key={todo.id}
                className={`group p-6 bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:shadow-md ${
                  todo.completed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-100'
                }`}
              >
                <div>
                  {/* Header: Checkbox + Title + Edit/Delete */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleComplete(todo)}
                        className="mt-0.5 text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer shrink-0 focus:outline-none"
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="text-emerald-500" size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                      <h3 
                        className={`font-semibold text-slate-800 text-base leading-snug break-all ${
                          todo.completed ? 'line-through text-slate-400 font-normal' : ''
                        }`}
                      >
                        {todo.title}
                      </h3>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => openEditModal(todo)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Edit Task"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {todo.description && (
                    <p 
                      className={`text-sm text-slate-500 mt-2 line-clamp-2 break-words pl-8 ${
                        todo.completed ? 'text-slate-300' : ''
                      }`}
                    >
                      {todo.description}
                    </p>
                  )}
                </div>

                {/* Footer metadata */}
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 pl-8">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full border ${priorityStyles[todo.priority]}`}>
                      {todo.priority}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(todo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <Link
                    to={`/todo?id=${todo.id}`}
                    className="flex items-center gap-0.5 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                  >
                    <span>Details</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Add Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800">
                {editingTodo ? 'Edit Milestone Task' : 'Add New Milestone Task'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter short, descriptive title"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Add optional notes, details, or checklist instructions..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'low', label: 'Low', activeClass: 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold' },
                    { value: 'medium', label: 'Medium', activeClass: 'bg-amber-50 border-amber-500 text-amber-800 font-semibold' },
                    { value: 'high', label: 'High', activeClass: 'bg-rose-50 border-rose-500 text-rose-800 font-semibold' },
                  ].map((prio) => (
                    <button
                      key={prio.value}
                      type="button"
                      onClick={() => setFormPriority(prio.value)}
                      className={`py-3 px-2 border rounded-xl text-xs text-center transition-all duration-200 cursor-pointer ${
                        formPriority === prio.value 
                          ? prio.activeClass 
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {prio.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold text-sm rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-100 cursor-pointer"
                >
                  {editingTodo ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
