import { useState, useReducer, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { cn } from './lib/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type Action = 
  | { type: 'ADD'; payload: string }
  | { type: 'TOGGLE'; payload: string }
  | { type: 'DELETE'; payload: string };


const todoReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case 'ADD':
      return [{ id: crypto.randomUUID(), text: action.payload, completed: false }, ...state];
    case 'TOGGLE':
      return state.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t);
    case 'DELETE':
      return state.filter(t => t.id !== action.payload);
    default:
      return state;
  }
};

export default function App() {
  const [input, setInput] = useState('');
  
  const [todos, dispatch] = useReducer(todoReducer, [], () => {
    const saved = localStorage.getItem('v4-todo-data');
    return saved ? JSON.parse(saved) : [];
  });


  useEffect(() => {
    localStorage.setItem('v4-todo-data', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatch({ type: 'ADD', payload: input });
    setInput('');
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800 text-slate-200">
      <div className="w-full max-w-md fl">
        
        {/* Brand Header */}
        <header className="flex items-center gap-3 mb-10">
          <div className="bg-slate-700 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <ListTodo className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FocusFlow</h1>
        </header>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="relative mb-8 group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-5 pr-14 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all shadow-inner"
          />
          <button className="absolute right-3 top-2.5 bg-brand p-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md">
            <Plus size={20} className="text-white" />
          </button>
        </form>

        {/* Task Container */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-center text-slate-500 mt-10 italic">No tasks yet. Enjoy your day!</p>
          ) : (
            todos.map(todo => (
              <div 
                key={todo.id} 
                className="group flex items-center gap-4 bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl hover:bg-slate-900 transition-all hover:translate-x-1"
              >
                <button 
                  onClick={() => dispatch({ type: 'TOGGLE', payload: todo.id })}
                  className="shrink-0"
                >
                  {todo.completed ? 
                    <CheckCircle2 className="text-emerald-400" size={22} /> : 
                    <Circle className="text-slate-600" size={22} />
                  }
                </button>
                
                <span className={cn(
                  "flex-1 text-sm font-medium transition-all duration-300",
                  todo.completed && "text-slate-600 line-through"
                )}>
                  {todo.text}
                </span>

                <button 
                  onClick={() => dispatch({ type: 'DELETE', payload: todo.id })}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}