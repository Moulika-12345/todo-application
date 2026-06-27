import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Activity, 
  Tag, 
  CheckCircle2, 
  Circle,
  FileText
} from 'lucide-react';
import { fetchTodoById } from '../services/todoService.js';

export default function TodoDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid or missing task ID.');
      setLoading(false);
      return;
    }

    const loadTodo = async () => {
      try {
        setLoading(true);
        const data = await fetchTodoById(id);
        setTodo(data);
        setError(null);
      } catch (err) {
        setError(`Failed to retrieve task details for ID "${id}". Make sure the backend server is running.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTodo();
  }, [id]);

  // Priority Styles and Color Mapping
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' };
      case 'medium':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
      case 'low':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-100', dot: 'bg-slate-500' };
    }
  };

  const priorityMeta = getPriorityStyle(todo?.priority);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {/* Return Button */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Workspace Tasks</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm mt-4">Retrieving milestone info...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl text-center flex flex-col items-center">
          <AlertCircle size={40} className="text-rose-600 mb-4" />
          <h3 className="font-bold text-rose-800 text-lg">Task Not Found</h3>
          <p className="text-rose-600/80 text-sm mt-1 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Go Back Home
          </button>
        </div>
      ) : todo ? (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-md shadow-slate-100/40 overflow-hidden">
          {/* Cover Header Accent */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div className="p-6 md:p-8">
            {/* Badges / Tag line */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${priorityMeta.bg}`}>
                <span className={`w-2 h-2 rounded-full ${priorityMeta.dot}`}></span>
                {todo.priority} Priority
              </span>

              {todo.completed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 size={13} />
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold uppercase tracking-wider">
                  <Circle size={13} />
                  Pending
                </span>
              )}
            </div>

            {/* Task Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight break-words">
              {todo.title}
            </h1>

            {/* Task Description */}
            <div className="mt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} />
                Description
              </h3>
              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-50 mt-2 text-slate-600 text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[100px]">
                {todo.description || (
                  <span className="text-slate-400 italic">No detailed description was provided for this task.</span>
                )}
              </div>
            </div>

            {/* Audit Logs / Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50/40 p-4 rounded-xl border border-slate-50">
                <Calendar className="text-slate-400 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created On</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {new Date(todo.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50/40 p-4 rounded-xl border border-slate-50">
                <Clock className="text-slate-400 shrink-0" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Modified</p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {new Date(todo.updatedAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Quick-Check Controller */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center bg-indigo-50/30 p-5 rounded-2xl border border-indigo-50/60">
              <div className="flex items-center gap-3">
                <Activity className="text-indigo-600" size={20} />
                <div>
                  <p className="text-xs font-bold text-slate-700">Quick Audit Mode</p>
                  <p className="text-[11px] text-slate-400">Current status is logged in secure storage.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
