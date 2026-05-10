import React, { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { useAuthStore } from '../../../store/authStore';
import { getStatusLabel, getDaysUntil, formatDate } from '../../../utils/helpers';
import { Calendar, AlertTriangle, CheckCircle2, Clock, FileText, Activity, LayoutList, Plus, Send, ExternalLink, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface TaskBoardProps {
  projectId: string;
}

// Upgraded configuration with premium rings, contrast, and glowing shadows
const STATUS_CONFIG: Record<string, { icon: React.ElementType, color: string, bg: string, border: string, glow: string }> = {
  'done': {
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'ring-1 ring-inset ring-emerald-200/80 dark:ring-emerald-500/30',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]'
  },
  'in-review': {
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'ring-1 ring-inset ring-amber-200/80 dark:ring-amber-500/30',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.3)]'
  },
  'revision': {
    icon: AlertTriangle,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    border: 'ring-1 ring-inset ring-rose-200/80 dark:ring-rose-500/30',
    glow: 'shadow-[0_0_12px_rgba(225,29,72,0.3)]'
  },
  'in-progress': {
    icon: Activity,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'ring-1 ring-inset ring-blue-200/80 dark:ring-blue-500/30',
    glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]'
  },
  'todo': {
    icon: FileText,
    color: 'text-slate-500 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800/50',
    border: 'ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80',
    glow: 'shadow-sm'
  },
};

const PRIORITY_CONFIG: Record<string, string> = {
  'high': 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-200/80 dark:ring-rose-500/30',
  'medium': 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-200/80 dark:ring-amber-500/30',
  'low': 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80',
};

const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const { projectTasks, fetchProjectTasks, projects, createTask, submitTask } = useProject();
  const { user } = useAuthStore();
  const currentUserId = user?._id || user?.id;
  const project = projects.find(p => p.id === projectId || p._id === projectId);

  React.useEffect(() => {
    fetchProjectTasks(projectId);
  }, [projectId]);
  const isHost = project && (project.hostId === currentUserId || (project.hostId as any)?._id === currentUserId || (project.hostId as any)?.id === currentUserId);

  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  // Create Task Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Submit Task Form State
  const [subFileUrl, setSubFileUrl] = useState('');
  const [subFileName, setSubFileName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAssignee || !newDueDate) return;

    setIsSaving(true);
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
      await fetchProjectTasks(projectId);
      setIsCreating(false);
      setNewTitle('');
      setNewDesc('');
      setNewDueDate('');
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitWork = async (taskId: string) => {
    if (!subFileUrl || !subFileName) return;

    setIsUploading(true);
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <LayoutList className="text-blue-600 dark:text-blue-400" size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tasks & Components
          </h2>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="hidden sm:inline-flex px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 rounded-full text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-slate-200 dark:ring-slate-700/50 shadow-sm">
            {projectTasks.length} Tasks
          </span>
          {isHost && (
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              <Plus size={14} strokeWidth={2.5} /> <span className="hidden sm:inline">Add Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Create Task Form */}
      {isCreating && (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-blue-200/60 dark:border-blue-500/30 rounded-[1.5rem] p-6 shadow-xl shadow-blue-500/5 animate-in slide-in-from-top-4 fade-in duration-300">
          <form onSubmit={handleCreateTask} className="space-y-5">
            <h3 className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Plus size={12} strokeWidth={3} /> New Task Assignment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Design Landing Page"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-xl text-sm font-medium p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Assignee</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={newAssignee}
                    onChange={e => setNewAssignee(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-xl text-sm font-medium py-3.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all appearance-none"
                    required
                  >
                    <option value="" disabled>Select Team Member</option>
                    {project?.roles.filter(r => r.filled).map(r => (
                      <option key={r.id || (r as any)._id} value={(r.assignedUserId as any)?._id || r.assignedUserId as string}>
                        {r.title} — {(r.assignedUserId as any)?.name || 'Assigned'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Description</label>
              <textarea
                placeholder="Details, requirements, or links..."
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-xl text-sm font-medium p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[100px] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-xl text-sm font-medium p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1">Due Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-xl text-sm font-medium py-3.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                disabled={isSaving}
                className="px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !newTitle || !newAssignee || !newDueDate}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                {isSaving ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving</>
                ) : (
                  'Assign Task'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Task List */}
      {projectTasks.length > 0 ? (
        <div className="space-y-4">
          {projectTasks.map((task, index) => {
            const assignee = task.assigneeId as any;
            const daysLeft = getDaysUntil(task.dueDate);
            const config = STATUS_CONFIG[task.status] || STATUS_CONFIG['todo'];
            const StatusIcon = config.icon;

            const isMyTask = assignee?._id === user?._id || assignee === user?._id;
            const canSubmit = isMyTask && (task.status === 'todo' || task.status === 'in-progress' || task.status === 'revision');
            const isDone = task.status === 'done';

            // Due date coloring
            let dateColor = 'text-slate-500 dark:text-slate-400';
            let dateBg = 'bg-transparent';
            if (!isDone) {
              if (daysLeft < 0) {
                dateColor = 'text-rose-700 dark:text-rose-400 font-bold';
                dateBg = 'bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md';
              } else if (daysLeft <= 3) {
                dateColor = 'text-amber-700 dark:text-amber-400 font-bold';
                dateBg = 'bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md';
              }
            }

            return (
              <div
                key={task._id || task.id}
                className="space-y-3 animate-in slide-in-from-bottom-8 fade-in fill-mode-both duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Main Task Card */}
                <div className={`
                  group relative flex flex-col lg:flex-row lg:items-center gap-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[1.5rem] p-5 
                  transition-all duration-300 ease-out ring-1 ring-inset ring-slate-200/80 dark:ring-slate-800
                  hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-blue-900/20 hover:ring-blue-300/60 dark:hover:ring-blue-500/40 hover:-translate-y-0.5
                  ${isDone ? 'opacity-75 hover:opacity-100 saturate-[0.8] hover:saturate-100' : ''}
                `}>

                  {/* Status Icon */}
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${config.bg} ${config.border} ${config.color} ${config.glow}`}>
                    <StatusIcon size={20} strokeWidth={2.5} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-base font-extrabold mb-1.5 truncate transition-colors duration-300
                      ${isDone ? 'text-slate-600 dark:text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}
                    `}>
                      {task.title}
                    </h3>
                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1 lg:line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {/* Meta & Assignee Area */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 shrink-0 pt-3 lg:pt-0 mt-3 lg:mt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['low']}`}>
                        {task.priority}
                      </span>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${config.bg} ${config.border} ${config.color}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 hidden lg:block" />

                    {/* Date & User */}
                    <div className="flex items-center gap-4 ml-auto lg:ml-0">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${dateColor} ${dateBg}`}>
                        <Calendar size={14} className={isDone ? 'opacity-50' : ''} />
                        <span className="whitespace-nowrap uppercase tracking-wider text-[11px] font-bold">
                          {isDone ? 'Completed' : formatDate(task.dueDate)}
                        </span>
                      </div>

                      {assignee ? (
                        <div className="relative group/avatar">
                          <img
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800"
                          />
                          <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-md opacity-0 group-hover/avatar:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                            {assignee.name}
                          </div>
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-700 border border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                          <span className="text-xs font-bold text-slate-400">?</span>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    {canSubmit && (
                      <button
                        onClick={() => {
                          const taskId = task._id || task.id;
                          if (taskId) setIsSubmitting(isSubmitting === taskId ? null : taskId);
                        }}
                        className={`ml-1 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 active:scale-95 ${isSubmitting === (task._id || task.id)
                          ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ring-1 ring-inset ring-slate-200 dark:ring-slate-700'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white ring-1 ring-inset ring-blue-200/50 dark:ring-blue-500/30'
                          }`}
                      >
                        {isSubmitting === (task._id || task.id) ? 'Cancel' : <><Send size={14} /> Submit</>}
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Submission Form */}
                {isSubmitting === (task._id || task.id) && (
                  <div className="ml-4 lg:ml-12 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-blue-200/60 dark:border-blue-500/30 rounded-[1.5rem] p-5 shadow-lg shadow-blue-500/5 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Inputs */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-2 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest pl-1 mb-2">
                          <Send size={12} strokeWidth={3} /> Submit Your Work
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <ExternalLink size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="url"
                              placeholder="Project Link (GitHub/Figma/Drive)"
                              value={subFileUrl}
                              onChange={e => setSubFileUrl(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800/80 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-xl text-sm font-medium py-3.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
                              required
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Link Label (e.g. PR #42, V1 Design)"
                            value={subFileName}
                            onChange={e => setSubFileName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/80 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-xl text-sm font-medium p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
                            required
                          />
                        </div>
                        <textarea
                          placeholder="Notes for the host (What's done? Any blockers?)..."
                          value={subDesc}
                          onChange={e => setSubDesc(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-xl text-sm font-medium p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[80px] resize-y"
                        />
                      </div>

                      {/* Submit Action */}
                      <div className="flex items-end shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            const taskId = task._id || task.id;
                            if (taskId) handleSubmitWork(taskId);
                          }}
                          disabled={isUploading || !subFileUrl || !subFileName}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)] active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 h-12"
                        >
                          {isUploading ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting</>
                          ) : (
                            'Submit'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Latest Submission View */}
                {(task.status === 'in-review' || task.status === 'revision' || task.status === 'done') && task.submissions?.length > 0 && (
                  <div className="ml-6 lg:ml-16 flex items-center gap-4 p-3.5 bg-slate-50/80 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50 rounded-[1.25rem] group/sub">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-inset ring-slate-200 dark:ring-slate-700 text-slate-400 group-hover/sub:text-blue-500 transition-colors shadow-sm shrink-0">
                      <ExternalLink size={16} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Latest Submission</p>
                      <a href={task.submissions[task.submissions.length - 1].fileUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block">
                        {task.submissions[task.submissions.length - 1].fileName}
                      </a>
                    </div>
                    <span className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ring-1 ring-inset ${task.submissions[task.submissions.length - 1].reviewStatus === 'approved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-200/80 dark:ring-emerald-500/30' :
                      task.submissions[task.submissions.length - 1].reviewStatus === 'needs-revision' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-rose-200/80 dark:ring-rose-500/30' :
                        'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-200/80 dark:ring-amber-500/30'
                      }`}>
                      {task.submissions[task.submissions.length - 1].reviewStatus}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="relative overflow-hidden flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/10 dark:to-slate-900/20 group">
          <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] bg-[size:20px_20px]" />
          <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-700 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
            <LayoutList size={36} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="relative text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">No Tasks Yet</h3>
          <p className="relative text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
            {isHost ? 'Break down your project and assign tasks to your team members to get started.' : 'Tasks and components will appear here once assigned by the host.'}
          </p>
          {isHost && (
            <button
              onClick={() => setIsCreating(true)}
              className="relative mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] active:scale-95"
            >
              Add First Task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;