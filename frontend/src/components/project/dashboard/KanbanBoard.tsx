import React from 'react';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { getProjectById } from '../../../data/mockData';
import { TaskStatus } from '../../../types';
import { Calendar, FolderKanban, FolderGit2 } from 'lucide-react';
import { getDaysUntil } from '../../../utils/helpers';

interface KanbanColumn {
  status: TaskStatus;
  label: string;
  dotClass: string;
  bgClass: string;
}

const kanbanColumns: KanbanColumn[] = [
  { status: 'todo', label: 'To Do', dotClass: 'bg-slate-400', bgClass: 'bg-slate-50 dark:bg-slate-800/40' },
  { status: 'in-progress', label: 'In Progress', dotClass: 'bg-blue-500', bgClass: 'bg-blue-50/50 dark:bg-blue-900/10' },
  { status: 'in-review', label: 'In Review', dotClass: 'bg-amber-500', bgClass: 'bg-amber-50/50 dark:bg-amber-900/10' },
  { status: 'done', label: 'Done', dotClass: 'bg-emerald-500', bgClass: 'bg-emerald-50/50 dark:bg-emerald-900/10' },
];

const PRIORITY_CONFIG: Record<string, string> = {
  'high': 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20',
  'medium': 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20',
  'low': 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200/60 dark:border-slate-700',
};

const KanbanBoard: React.FC = () => {
  const { tasks } = useProject();
  const { user } = useAuthStore();
  const myTasks = tasks.filter(t => t.assigneeId === user?._id);

  return (
    <div className="space-y-6">
      
      {/* Header Area */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FolderKanban className="text-blue-600 dark:text-blue-500" size={20} />
          My Task Board
        </h2>
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[11px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
          {myTasks.length} Active Tasks
        </span>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {kanbanColumns.map(col => {
          const colTasks = myTasks.filter(t => {
            if (col.status === 'in-review') return t.status === 'in-review' || t.status === 'revision';
            return t.status === col.status;
          });

          return (
            <div 
              key={col.status} 
              className={`flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 min-h-[400px] ${col.bgClass}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dotClass} shadow-sm`} />
                  <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                    {col.label}
                  </span>
                </div>
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-3 flex-1">
                {colTasks.map(task => {
                  const project = getProjectById(task.projectId);
                  const daysLeft = getDaysUntil(task.dueDate);
                  
                  // Due date coloring
                  let dateColor = 'text-slate-500 dark:text-slate-400';
                  if (task.status !== 'done') {
                    if (daysLeft < 0) dateColor = 'text-rose-600 dark:text-rose-400 font-bold';
                    else if (daysLeft <= 3) dateColor = 'text-amber-600 dark:text-amber-400 font-bold';
                  }

                  return (
                    <div 
                      key={task.id} 
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col group"
                    >
                      {/* Task Title */}
                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </div>
                      
                      {/* Project Context */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                        <FolderGit2 size={12} className="shrink-0" />
                        <span className="truncate">{project?.title || 'Unknown Project'}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['low']}`}>
                          {task.priority}
                        </span>
                        
                        {task.status === 'revision' && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                            Needs Revision
                          </span>
                        )}
                      </div>

                      {/* Footer: Date & Version */}
                      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className={`flex items-center gap-1.5 text-[11px] ${dateColor}`}>
                          <Calendar size={12} className={task.status === 'done' ? 'opacity-50' : ''} />
                          <span className="whitespace-nowrap">
                            {daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Due today' : 'Overdue'}
                          </span>
                        </div>
                        
                        {task.submissions.length > 0 && (
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            v{task.submissions.length}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}

                {/* Empty State per Column */}
                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 text-slate-400 dark:text-slate-600">
                    <span className="text-xs font-bold uppercase tracking-widest">Empty</span>
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