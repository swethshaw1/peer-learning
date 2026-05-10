import React, { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { formatDate } from '../../../utils/helpers';
import { ExternalLink, CheckCircle2, AlertTriangle, Clock, MessageSquare, ClipboardList, FileText, Send, X, History } from 'lucide-react';
import SubmissionGateway from './SubmissionGateway';
import toast from 'react-hot-toast';

interface ReviewFeedbackProps {
  projectId: string;
  isHost: boolean;
}

const ReviewFeedback: React.FC<ReviewFeedbackProps> = ({ projectId, isHost }) => {
  const { projectTasks: allProjectTasks, fetchProjectTasks, reviewTask } = useProject();
  const tasksForReview = allProjectTasks.filter(t => t.projectId === projectId && t.submissions.length > 0);

  React.useEffect(() => {
    fetchProjectTasks(projectId);
  }, [projectId]);

  const [reviewingTask, setReviewingTask] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'done' | 'revision'>('done');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (tasksForReview.length === 0) {
    return (
      <div className="relative overflow-hidden flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-800/10 dark:to-slate-900/20 group animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.05] bg-[size:20px_20px]" />
        <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-100 dark:ring-slate-700 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
          <ClipboardList size={36} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="relative text-xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">No Submissions Yet</h3>
        <p className="relative text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
          No tasks have been submitted for review yet. When team members submit their work, it will appear here.
        </p>
      </div>
    );
  }

  const handleReview = async () => {
    if (!reviewingTask || !feedback) return;
    setIsSubmitting(true);
    
    try {
      await reviewTask(reviewingTask, { status: reviewStatus, feedback });
      await fetchProjectTasks(projectId);
      setReviewingTask(null);
      setFeedback('');
      toast.success(reviewStatus === 'done' ? 'Task approved!' : 'Revision requested');
    } catch (err) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          classes: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-200/80 dark:ring-emerald-500/30',
          icon: <CheckCircle2 size={13} className="mr-1.5" />
        };
      case 'needs-revision':
        return {
          label: 'Needs Revision',
          classes: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-200/80 dark:ring-amber-500/30',
          icon: <AlertTriangle size={13} className="mr-1.5" />
        };
      default:
        return {
          label: 'Pending Review',
          classes: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-200/80 dark:ring-blue-500/30',
          icon: <Clock size={13} className="mr-1.5" />
        };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
            <MessageSquare className="text-blue-600 dark:text-blue-400" size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Submissions & Reviews
          </h2>
        </div>
      </div>

      <div className="space-y-10">
        {tasksForReview.map((task, taskIndex) => (
          <div 
            key={task.id} 
            className="space-y-5 animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both"
            style={{ animationDelay: `${taskIndex * 150}ms` }}
          >
            
            {/* Task Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-[1.5rem] ring-1 ring-inset ring-slate-200/80 dark:ring-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl shrink-0">
                  <FileText size={20} className="text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug mb-1">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <History size={14} />
                    <span>{task.submissions.length} Version{task.submissions.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              {task.status !== 'done' && !isHost && (
                <div className="shrink-0">
                  <SubmissionGateway taskId={task.id} taskTitle={task.title} />
                </div>
              )}
            </div>

            {/* Submissions List (Timeline style) */}
            <div className="space-y-6 pl-2 md:pl-8 border-l-2 border-slate-200/60 dark:border-slate-800 ml-4 md:ml-6 relative">
              {task.submissions
                .slice()
                .sort((a, b) => b.version - a.version)
                .map((sub, subIndex) => {
                  const submitter = sub.userId as any; // Populated User
                  const statusConfig = getStatusConfig(sub.reviewStatus);

                  return (
                    <div 
                      key={sub.id} 
                      className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-md ring-1 ring-inset ring-slate-200/80 dark:ring-slate-700/80 rounded-[1.5rem] p-6 shadow-sm transition-all duration-300 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.1)] dark:hover:shadow-blue-900/20 hover:ring-blue-300/50 dark:hover:ring-blue-500/40 group"
                    >
                      {/* Timeline Connector Dot */}
                      <div className="absolute top-10 -left-[29px] md:-left-[53px] w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 ring-4 ring-slate-50 dark:ring-slate-950 group-hover:bg-blue-500 transition-colors duration-300" />

                      {/* Submission Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
                        <div className="flex items-center gap-4">
                          {submitter?.avatar ? (
                            <img 
                              src={submitter.avatar} 
                              alt={submitter.name} 
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0" 
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full ring-2 ring-slate-100 dark:ring-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <span className="text-sm font-black text-slate-500">{submitter?.name?.charAt(0) || '?'}</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                              {submitter?.name || 'Unknown User'}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-widest text-[9px]">
                                v{sub.version}
                              </span> 
                              • {formatDate(sub.submittedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset shrink-0 ${statusConfig.classes}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Submission File / Link */}
                      <a 
                        href={sub.fileUrl || '#'} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group/link flex items-start gap-4 p-4 mb-6 rounded-[1.25rem] bg-slate-50/80 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200/60 dark:ring-slate-700/50 hover:ring-blue-300 dark:hover:ring-blue-500/50 transition-all duration-300"
                      >
                        <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-700 shrink-0 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors">
                          <ExternalLink size={20} strokeWidth={2.5} />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h5 className="text-sm font-extrabold text-slate-900 dark:text-white truncate group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400 transition-colors duration-300">
                            {sub.fileName || 'View Submission Deliverable'}
                          </h5>
                          {sub.description && (
                            <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                              {sub.description}
                            </p>
                          )}
                        </div>
                      </a>

                      {/* Feedback History */}
                      {sub.feedback.length > 0 && (
                        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-[1.25rem] p-5 ring-1 ring-inset ring-slate-200/60 dark:ring-slate-800/50 mb-6">
                          <h6 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">Review History</h6>
                          {sub.feedback.map((fb, fbIndex) => {
                            const author = fb.authorId as any;
                            const isRevision = fb.type === 'revision';
                            const isApproval = fb.type === 'approval';
                            
                            return (
                              <div 
                                key={(fb as any)._id || fb.createdAt} 
                                className={`p-4 rounded-[1rem] ring-1 ring-inset text-sm transition-all duration-300 hover:shadow-sm ${
                                  isRevision ? 'bg-amber-50/80 dark:bg-amber-500/10 ring-amber-200/60 dark:ring-amber-500/20' :
                                  isApproval ? 'bg-emerald-50/80 dark:bg-emerald-500/10 ring-emerald-200/60 dark:ring-emerald-500/20' :
                                  'bg-white dark:bg-slate-800 ring-slate-200 dark:ring-slate-700'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                  <div className="flex items-center gap-2 text-[13px] font-extrabold text-slate-700 dark:text-slate-300">
                                    <MessageSquare size={14} className="text-slate-400 shrink-0" />
                                    {author?.name || 'Reviewer'}
                                    
                                    {isApproval && <CheckCircle2 size={14} className="text-emerald-500 ml-1 shrink-0" />}
                                    {isRevision && <AlertTriangle size={14} className="text-amber-500 ml-1 shrink-0" />}
                                  </div>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    {formatDate(fb.createdAt)}
                                  </span>
                                </div>
                                <p className={`text-[13px] font-medium leading-relaxed ${isRevision ? 'text-amber-900 dark:text-amber-200' : isApproval ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'}`}>
                                  {fb.comment}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Host Actions / Inline Editor */}
                      {isHost && sub.reviewStatus === 'pending' && (
                        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                          {reviewingTask === task.id ? (
                            <div className="space-y-5 bg-white dark:bg-slate-900 rounded-[1.5rem] ring-1 ring-inset ring-slate-200 dark:ring-slate-700 p-5 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/40 animate-in fade-in slide-in-from-top-4 duration-300">
                              
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                                  Provide Feedback
                                </span>
                                
                                {/* Status Toggle */}
                                <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl p-1.5 ring-1 ring-inset ring-slate-200/50 dark:ring-slate-700/50">
                                  <button 
                                    onClick={() => setReviewStatus('done')}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest rounded-lg transition-all duration-300 ${
                                      reviewStatus === 'done' 
                                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                  >
                                    <CheckCircle2 size={14} /> Approve
                                  </button>
                                  <button 
                                    onClick={() => setReviewStatus('revision')}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest rounded-lg transition-all duration-300 ${
                                      reviewStatus === 'revision' 
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' 
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                  >
                                    <AlertTriangle size={14} /> Revision
                                  </button>
                                </div>
                              </div>

                              <textarea 
                                placeholder={reviewStatus === 'done' ? "Great work! Any final comments or praise?" : "What specific details need to be fixed or improved?"}
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white p-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all resize-y disabled:opacity-60"
                              />
                              
                              <div className="flex items-center justify-end gap-3 pt-2">
                                <button 
                                  onClick={() => setReviewingTask(null)}
                                  disabled={isSubmitting}
                                  className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={handleReview}
                                  disabled={!feedback.trim() || isSubmitting}
                                  className={`flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold uppercase tracking-widest text-white rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg ${
                                    reviewStatus === 'done' 
                                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 hover:shadow-emerald-500/30' 
                                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20 hover:shadow-amber-500/30'
                                  }`}
                                >
                                  {isSubmitting ? (
                                    <>
                                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                      Submitting
                                    </>
                                  ) : (
                                    <>
                                      <Send size={14} /> Submit Review
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-3">
                              <button 
                                onClick={() => { setReviewingTask(task.id); setReviewStatus('revision'); }}
                                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 ring-1 ring-inset ring-amber-200/60 dark:ring-amber-500/30 rounded-xl transition-all duration-300 hover:shadow-sm"
                              >
                                <AlertTriangle size={14} /> Request Revision
                              </button>
                              <button 
                                onClick={() => { setReviewingTask(task.id); setReviewStatus('done'); }}
                                className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 ring-1 ring-inset ring-emerald-200/60 dark:ring-emerald-500/30 rounded-xl transition-all duration-300 hover:shadow-sm"
                              >
                                <CheckCircle2 size={14} /> Approve
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewFeedback;