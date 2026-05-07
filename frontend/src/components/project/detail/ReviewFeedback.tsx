import React, { useState } from 'react';
import { useProject } from '../../../context/ProjectContext';
import { formatDate } from '../../../utils/helpers';
import { ExternalLink, CheckCircle2, AlertTriangle, Clock, MessageSquare, ClipboardList, FileText, Send, X } from 'lucide-react';
import SubmissionGateway from './SubmissionGateway';
import toast from 'react-hot-toast';

interface ReviewFeedbackProps {
  projectId: string;
  isHost: boolean;
}

const ReviewFeedback: React.FC<ReviewFeedbackProps> = ({ projectId, isHost }) => {
  const { tasks, reviewTask } = useProject();
  const projectTasks = tasks.filter(t => t.projectId === projectId && t.submissions.length > 0);

  const [reviewingTask, setReviewingTask] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState<'done' | 'revision'>('done');
  const [feedback, setFeedback] = useState('');

  if (projectTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20">
        <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
          <ClipboardList size={32} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">No Submissions Yet</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
          No tasks have been submitted for review yet. When team members submit their work, it will appear here.
        </p>
      </div>
    );
  }

  const handleReview = async () => {
    if (!reviewingTask || !feedback) return;

    try {
      await reviewTask(reviewingTask, { status: reviewStatus, feedback });
      setReviewingTask(null);
      setFeedback('');
      toast.success(reviewStatus === 'done' ? 'Task approved!' : 'Revision requested');
    } catch (err) {
      toast.error('Failed to submit review');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          label: 'Approved',
          classes: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
          icon: <CheckCircle2 size={12} className="mr-1" />
        };
      case 'needs-revision':
        return {
          label: 'Needs Revision',
          classes: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
          icon: <AlertTriangle size={12} className="mr-1" />
        };
      default:
        return {
          label: 'Pending Review',
          classes: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
          icon: <Clock size={12} className="mr-1" />
        };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="text-blue-600 dark:text-blue-500" size={20} />
          Submissions & Reviews
        </h2>
      </div>

      <div className="space-y-8">
        {projectTasks.map(task => (
          <div key={task.id} className="space-y-4">
            
            {/* Task Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <FileText size={18} className="text-slate-400 dark:text-slate-500 shrink-0" />
                {task.title}
              </h4>
              {task.status !== 'done' && !isHost && (
                <div className="shrink-0">
                  <SubmissionGateway taskId={task.id} taskTitle={task.title} />
                </div>
              )}
            </div>

            {/* Submissions List */}
            <div className="space-y-4 pl-2 md:pl-6 border-l-2 border-slate-100 dark:border-slate-800 ml-2 md:ml-4">
              {task.submissions
                .slice()
                .sort((a, b) => b.version - a.version)
                .map(sub => {
                  const submitter = sub.userId as any; // Populated User
                  const statusConfig = getStatusConfig(sub.reviewStatus);

                  return (
                    <div key={sub.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm transition-all duration-200 hover:shadow-md">
                      
                      {/* Submission Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                        <div className="flex items-center gap-3">
                          {submitter?.avatar ? (
                            <img 
                              src={submitter.avatar} 
                              alt={submitter.name} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-slate-500">{submitter?.name?.charAt(0) || '?'}</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {submitter?.name || 'Unknown User'}
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                              v{sub.version} • {formatDate(sub.submittedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${statusConfig.classes}`}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Submission File / Link */}
                      <a 
                        href={sub.fileUrl || '#'} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group flex items-start gap-3 p-3 mb-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors"
                      >
                        <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 shrink-0 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <ExternalLink size={18} />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {sub.fileName || 'View Submission Deliverable'}
                          </h5>
                          {sub.description && (
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {sub.description}
                            </p>
                          )}
                        </div>
                      </a>

                      {/* Feedback History */}
                      {sub.feedback.length > 0 && (
                        <div className="space-y-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800/50">
                          <h6 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Review History</h6>
                          {sub.feedback.map(fb => {
                            const author = fb.authorId as any;
                            const isRevision = fb.type === 'revision';
                            const isApproval = fb.type === 'approval';
                            
                            return (
                              <div 
                                key={(fb as any)._id || fb.createdAt} 
                                className={`p-3 rounded-xl border text-sm ${
                                  isRevision ? 'bg-amber-50/50 dark:bg-amber-500/5 border-amber-100 dark:border-amber-500/10' :
                                  isApproval ? 'bg-emerald-50/50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10' :
                                  'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 shadow-sm'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <MessageSquare size={14} className="text-slate-400" />
                                    {author?.name || 'Reviewer'}
                                    
                                    {isApproval && <CheckCircle2 size={14} className="text-emerald-500 ml-1" />}
                                    {isRevision && <AlertTriangle size={14} className="text-amber-500 ml-1" />}
                                  </div>
                                  <span className="text-[10px] font-medium text-slate-400">
                                    {formatDate(fb.createdAt)}
                                  </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${isRevision ? 'text-amber-900 dark:text-amber-200' : isApproval ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-400'}`}>
                                  {fb.comment}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Host Actions */}
                      {isHost && sub.reviewStatus === 'pending' && (
                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                          {reviewingTask === task.id ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Provide Feedback</span>
                                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                  <button 
                                    onClick={() => setReviewStatus('done')}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${reviewStatus === 'done' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => setReviewStatus('revision')}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${reviewStatus === 'revision' ? 'bg-amber-500 text-white' : 'text-slate-500'}`}
                                  >
                                    Revision
                                  </button>
                                </div>
                              </div>
                              <textarea 
                                placeholder={reviewStatus === 'done' ? "Great work! Any final comments?" : "What needs to be fixed?"}
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm p-3 h-24 focus:ring-2 focus:ring-blue-500"
                              />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setReviewingTask(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                                <button 
                                  onClick={handleReview}
                                  className={`flex items-center gap-2 px-6 py-2 text-xs font-bold text-white rounded-lg shadow-lg ${reviewStatus === 'done' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-amber-600 shadow-amber-500/20'}`}
                                >
                                  <Send size={14} /> Submit Review
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-3">
                              <button 
                                onClick={() => { setReviewingTask(task.id); setReviewStatus('revision'); }}
                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 border border-amber-200 dark:border-amber-500/20 rounded-lg transition-colors"
                              >
                                <AlertTriangle size={14} /> Request Revision
                              </button>
                              <button 
                                onClick={() => { setReviewingTask(task.id); setReviewStatus('done'); }}
                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/20 rounded-lg transition-colors"
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