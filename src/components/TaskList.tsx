import { useState } from 'react';
import { CheckCircle2, Circle, Plus, ChevronUp, ChevronDown, Trash2, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const TaskList = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Review chapter 5 notes', completed: false },
    { id: '2', text: 'Complete practice problems', completed: true },
    { id: '3', text: 'Watch lecture video', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed bottom-24 right-4 z-40">
      {/* Collapsed state */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="glass-card px-4 py-3 flex items-center gap-3 hover:border-primary/30 transition-all shadow-lg"
          variant="ghost"
        >
          <ListTodo className="w-5 h-5 text-primary" />
          <span className="font-medium">Tasks</span>
          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
            {completedCount}/{tasks.length}
          </span>
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        </Button>
      )}

      {/* Expanded state */}
      {isExpanded && (
        <div className="glass-card w-80 max-h-96 flex flex-col animate-scale-in shadow-xl">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold">Study Tasks</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(false)}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="px-4 pt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{completedCount}/{tasks.length} completed</span>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-48">
            {tasks.map(task => (
              <div 
                key={task.id}
                className={cn(
                  "group flex items-center gap-3 p-2 rounded-lg transition-all",
                  task.completed ? "bg-muted/30" : "hover:bg-muted/20"
                )}
              >
                <button onClick={() => toggleTask(task.id)}>
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                <span className={cn(
                  "flex-1 text-sm transition-all",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}

            {tasks.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No tasks yet. Add one below!
              </p>
            )}
          </div>

          {/* Add task input */}
          <div className="p-4 border-t border-white/10">
            <form 
              onSubmit={(e) => { e.preventDefault(); addTask(); }}
              className="flex gap-2"
            >
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task..."
                className="flex-1 bg-muted/30 border-white/10 text-sm"
              />
              <Button type="submit" size="icon" disabled={!newTask.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
