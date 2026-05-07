import React, { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { getStatusLabel, getDaysUntil, formatDate } from '../../../utils/helpers';
import { Calendar, AlertTriangle, CheckCircle2, Clock, FileText, Activity, LayoutList, Plus, Send, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskBoardProps {
  projectId: string;
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType, color: string, bg: string, border: string }> = {
  'done': { 
    icon: CheckCircle2, 
    color: 'text-emerald-600 dark:text-emerald-400', 
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/20'
  },
  'in-review': { 
    icon: Clock, 
    color: 'text-amber-600 dark:text-amber-400', 
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-200 dark:border-amber-500/20'
  },
  'revision': { 
    icon: AlertTriangle, 
    color: 'text-rose-600 dark:text-rose-400', 
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'border-rose-200 dark:border-rose-500/20'
  },
  'in-progress': { 
    icon: Activity, 
    color: 'text-blue-600 dark:text-blue-400', 
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/20'
  },
  'todo': { 
    icon: FileText, 
    color: 'text-slate-600 dark:text-slate-400', 
    bg: 'bg-slate-100 dark:bg-slate-800/80',
    border: 'border-slate-200 dark:border-slate-700'
  },
};

const PRIORITY_CONFIG: Record<string, string> = {
  'high': 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20',
  'medium': 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20',
  'low': 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200/60 dark:border-slate-700',
};

const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const { tasks, projects, createTask, submitTask } = useProject();
  const { user } = useAuthStore();
  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const isHost = project?.hostId === user?._id;

  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  
  // Create Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState('');

  // Submit Task Form State
  const [subFileUrl, setSubFileUrl] = useState('');
  const [subFileName, setSubFileName] = useState('');
  const [subDesc, setSubDesc] = useState('');

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAssignee || !newDueDate) return;

    try {
      await createTask({
        projectId,
        title: newTitle,
        description: newDesc,
        assigneeId: newAssignee,
        priority: newPriority,
        dueDate: new Date(newDueDate),
        status: 'todo'
      });
      setIsCreating(false);
      setNewTitle('');
      setNewDesc('');
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleSubmitWork = async (taskId: string) => {
    if (!subFileUrl || !subFileName) return;

    try {
      await submitTask(taskId, {
        fileUrl: subFileUrl,
        fileName: subFileName,
        description: subDesc
      });
      setIsSubmitting(null);
      setSubFileUrl('');
      setSubFileName('');
      setSubDesc('');
      toast.success('Work submitted for review');
    } catch (err) {
      toast.error('Failed to submit work');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <LayoutList className="text-blue-600 dark:text-blue-500" size={20} />
          Tasks & Components
        </h2>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[11px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
            {projectTasks.length} Tasks
          </span>
          {isHost && (
            <button 
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all"
            >
              <Plus size={14} /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* Create Task Modal/Form */}
      {isCreating && (
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-500/30 rounded-2xl p-6 shadow-xl animate-in zoom-in-95 duration-200">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Task Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <select 
                value={newAssignee}
                onChange={e => setNewAssignee(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Assignee</option>
                {project?.roles.filter(r => r.filled).map(r => (
                  <option key={r.id || (r as any)._id} value={r.assignedUserId as any}>
                    {r.title} ({(r as any).assignedUserId?.name || 'Assigned'})
                  </option>
                ))}
              </select>
            </div>
            <textarea 
              placeholder="Description"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500 h-24"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input 
                type="date" 
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20"
              >
                Assign Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      {projectTasks.length > 0 ? (
        <div className="space-y-3">
          {projectTasks.map(task => {
            const assignee = task.assigneeId as any;
            const daysLeft = getDaysUntil(task.dueDate);
            const config = STATUS_CONFIG[task.status] || STATUS_CONFIG['todo'];
            const StatusIcon = config.icon;
            
            const isMyTask = assignee?._id === user?._id || assignee === user?._id;
            const canSubmit = isMyTask && (task.status === 'todo' || task.status === 'in-progress' || task.status === 'revision');

            // Due date coloring logic
            let dateColor = 'text-slate-500 dark:text-slate-400';
            if (task.status !== 'done') {
              if (daysLeft < 0) dateColor = 'text-rose-600 dark:text-rose-400 font-bold';
              else if (daysLeft <= 3) dateColor = 'text-amber-600 dark:text-amber-400 font-bold';
            }

            return (
              <div key={task.id} className="space-y-3">
                <div className="group flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500/50">
                  {/* Status Icon */}
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center border ${config.bg} ${config.border} ${config.color} transition-transform group-hover:scale-110`}>
                    <StatusIcon size={18} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1 md:line-clamp-2">
                      {task.description}
                    </p>
                  </div>

                  {/* Meta & Assignee */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0 mt-2 md:mt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['low']}`}>
                      {task.priority}
                    </span>
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${config.bg} ${config.border} ${config.color}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    
                    {assignee ? (
                      <img 
                        src={assignee.avatar} 
                        alt={assignee.name} 
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        title={`Assigned to ${assignee.name}`}
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
                        <span className="text-[10px] text-slate-400">?</span>
                      </div>
                    )}

                    <div className={`flex items-center gap-1.5 text-xs ${dateColor} min-w-[90px] justify-end`}>
                      <Calendar size={14} />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>

                    {canSubmit && (
                      <button 
                        onClick={() => setIsSubmitting(task.id)}
                        className="ml-2 p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Send size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Submission Form for this task */}
                {isSubmitting === task.id && (
                  <div className="ml-8 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Submit Work</h4>
                      <button onClick={() => setIsSubmitting(null)} className="text-slate-400 hover:text-slate-600">Cancel</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Project Link (GitHub / Figma / Drive)"
                        value={subFileUrl}
                        onChange={e => setSubFileUrl(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border-none rounded-xl text-sm p-3"
                        required
                      />
                      <input 
                        type="text" 
                        placeholder="Link Label (e.g. PR #1)"
                        value={subFileName}
                        onChange={e => setSubFileName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border-none rounded-xl text-sm p-3"
                        required
                      />
                    </div>
                    <textarea 
                      placeholder="Notes for the host..."
                      value={subDesc}
                      onChange={e => setSubDesc(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border-none rounded-xl text-sm p-3 h-20"
                    />
                    <button 
                      onClick={() => handleSubmitWork(task.id)}
                      className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20"
                    >
                      Submit for Review
                    </button>
                  </div>
                )}
                
                {/* Latest Submission View (if in review or revision) */}
                {(task.status === 'in-review' || task.status === 'revision' || task.status === 'done') && task.submissions?.length > 0 && (
                  <div className="ml-8 flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-blue-600">
                      <ExternalLink size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Latest Submission</p>
                      <a href={task.submissions[task.submissions.length-1].fileUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline truncate block">
                        {task.submissions[task.submissions.length-1].fileName}
                      </a>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.submissions[task.submissions.length-1].reviewStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                      task.submissions[task.submissions.length-1].reviewStatus === 'needs-revision' ? 'bg-rose-100 text-rose-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {task.submissions[task.submissions.length-1].reviewStatus}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <div className="h-12 w-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-200 dark:border-slate-700">
            <LayoutList size={24} className="text-slate-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No tasks created</h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {isHost ? 'Start by adding a task to your team.' : 'Tasks and components will appear here once assigned by the host.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;