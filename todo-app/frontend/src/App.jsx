import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import TodoList from './pages/TodoList.jsx';
import TodoDetails from './pages/TodoDetails.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-950">
        
        {/* Navigation Bar */}
        <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner">
                <CheckSquare size={20} />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-800">
                  Todo<span className="text-indigo-600">Sphere</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block -mt-1 font-mono">
                  Full-Stack Suite
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                GitHub Repository
              </a>
              <div className="h-4 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Server Live
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/todo" element={<TodoDetails />} />
            {/* Catch-all fallback redirect to home */}
            <Route path="*" element={<TodoList />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-100 py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            <p>© 2026 TodoSphere Workspace. Crafted for absolute performance.</p>
            <div className="flex gap-4">
              <span>React 19</span>
              <span>•</span>
              <span>Express 4 REST Suite</span>
              <span>•</span>
              <span>Vite 6</span>
            </div>
          </div>
        </footer>

      </div>
    </BrowserRouter>
  );
}
