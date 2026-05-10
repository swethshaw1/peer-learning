import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { TaskStatus } from '../../../types';
import { Calendar, FolderKanban, FolderGit2, GripVertical } from 'lucide-react';
import { getDaysUntil } from '../../../utils/helpers';

interface KanbanColumn {
  status: TaskStatus;
  label: string;
  dotClass: string;
  bgClass: string;
}

const kanbanColumns: KanbanColumn[] = [
  { status: 'todo', label: 'To Do', dotClass: 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]', bgClass: 'bg-slate-50/40 dark:bg-slate-800/20' },
  { status: 'in-progress', label: 'In Progress', dotClass: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]', bgClass: 'bg-blue-50/30 dark:bg-blue-900/10' },
  { status: 'in-review', label: 'In Review', dotClass: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]', bgClass: 'bg-amber-50/30 dark:bg-amber-900/10' },
  { status: 'done', label: 'Done', dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]', bgClass: 'bg-emerald-50/30 dark:bg-emerald-900/10' },
];

// Premium configuration using rings for crisp borders and balanced contrast
const PRIORITY_CONFIG: Record<string, string> = {
  'high': 'bg-rose-100/80 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-200 dark:ring-rose-500/30',
  'medium': 'bg-amber-100/80 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-200 dark:ring-amber-500/30',
  'low': 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-slate-700',
};

const KanbanBoard: React.FC = () => {
  const { tasks, projects } = useProject();
  const { user } = useAuthStore();
  const myTasks = tasks.filter(t => t.assigneeId === user?._id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <FolderKanban className="text-blue-600 dark:text-blue-400" size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Task Board
          </h2>
        </div>
        <span className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-full text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50 shadow-sm">
          {myTasks.length} Active Tasks
        </span>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {kanbanColumns.map((col, colIndex) => {
          const colTasks = myTasks.filter(t => {
            if (col.status === 'in-review') return t.status === 'in-review' || t.status === 'revision';
            return t.status === col.status;
          });

          return (
            <div 
              key={col.status} 
              style={{ animationDelay: `${colIndex * 100}ms` }}
              className={`flex flex-col rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800 p-4 min-h-[450px] animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both ${col.bgClass}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-5 px-1.5">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dotClass}`} />
                  <span className="text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                    {col.label}
                  </span>
                </div>
                <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-white dark:bg-slate-900 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 text-[11px] font-black text-slate-500 dark:text-slate-400 shadow-sm">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-3.5 flex-1">
                {colTasks.map((task, taskIndex) => {
                  const project = projects.find(p => (p.id === task.projectId || (p as any)._id === task.projectId));
                  const daysLeft = getDaysUntil(task.dueDate);
                  const isDone = task.status === 'done';
                  
                  // Due date coloring logic
                  let dateColor = 'text-slate-500 dark:text-slate-400';
                  let dateBg = 'bg-transparent';
                  if (!isDone) {
                    if (daysLeft < 0) {
                      dateColor = 'text-rose-700 dark:text-rose-300 font-bold';
                      dateBg = 'bg-rose-100/50 dark:bg-rose-500/20 px-2 py-0.5 rounded-md';
                    } else if (daysLeft <= 3) {
                      dateColor = 'text-amber-700 dark:text-amber-300 font-bold';
                      dateBg = 'bg-amber-100/50 dark:bg-amber-500/20 px-2 py-0.5 rounded-md';
                    }
                  }

                  return (
                    <div 
                      key={task.id} 
                      style={{ animationDelay: `${(colIndex * 100) + (taskIndex * 75)}ms` }}
                      className={`
                        group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200/80 dark:border-slate-700/80 rounded-[1.25rem] p-4 
                        transition-all duration-300 ease-out cursor-grab active:cursor-grabbing flex flex-col
                        hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-blue-900/20 hover:border-blue-300/60 dark:hover:border-blue-500/40 hover:-translate-y-1 active:scale-[0.98]
                        animate-in slide-in-from-bottom-4 fade-in fill-mode-both
                        ${isDone ? 'opacity-70 hover:opacity-100 saturate-50 hover:saturate-100' : ''}
                      `}
                    >
                      {/* Drag Handle & Context */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700/50">
                          <FolderGit2 size={12} className="shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors" />
                          <span className="truncate">{project?.title || 'Unknown Project'}</span>
                        </div>
                        <GripVertical size={14} className="text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Task Title */}
                      <div className={`text-sm font-bold leading-snug mb-4 transition-colors duration-300
                        ${isDone ? 'text-slate-600 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}
                      `}>
                        {task.title}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['low']}`}>
                          {task.priority}
                        </span>
                        
                        {task.status === 'revision' && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 ring-1 ring-inset ring-rose-200 dark:ring-rose-500/30 text-[10px] font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Revision
                          </span>
                        )}
                      </div>

                      {/* Footer: Date & Version */}
                      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${dateColor} ${dateBg}`}>
                          <Calendar size={13} className={isDone ? 'opacity-50' : ''} strokeWidth={2.5} />
                          <span className="whitespace-nowrap uppercase tracking-wider font-bold">
                            {isDone ? 'Completed' : daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                          </span>
                        </div>
                        
                        {task.submissions.length > 0 && (
                          <div className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md shadow-inner ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50">
                            v{task.submissions.length}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}

                {/* Empty State per Column */}
                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200/60 dark:border-slate-700/40 rounded-[1.25rem] bg-white/30 dark:bg-slate-900/20 text-slate-400 dark:text-slate-500 m-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Drop tasks here</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;