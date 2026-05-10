import React, { useState, useEffect } from 'react';
import { Upload, ExternalLink, X, Send, Paperclip, CheckCircle } from 'lucide-react';

interface SubmissionGatewayProps {
  taskId: string;
  taskTitle: string;
}

const SubmissionGateway: React.FC<SubmissionGatewayProps> = ({ taskId, taskTitle }) => {
  const [showModal, setShowModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal && !isSubmitting) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, isSubmitting]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Auto-close success screen
      setTimeout(() => {
        setShowModal(false);
        setTimeout(() => {
          // Reset states after modal is completely closed
          setSubmitted(false);
          setLinkUrl('');
          setDescription('');
        }, 300);
      }, 2500);
    }, 1200);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In a real app, handle e.dataTransfer.files here
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
      >
        <Upload size={14} strokeWidth={2.5} /> Submit Work
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => !isSubmitting && !submitted && setShowModal(false)}
        >
          <div 
            className="w-full max-w-xl flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[90vh]"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-500/10 animate-in zoom-in duration-500 delay-150">
                  <CheckCircle size={48} className="text-emerald-500 dark:text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200">
                  Submission Uploaded!
                </h3>
                <p className="text-base font-medium text-slate-500 dark:text-slate-400 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
                  Your work has been successfully submitted for review. The host will be notified shortly.
                </p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <Upload size={20} className="text-blue-600 dark:text-blue-400" />
                      Submit Work
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-[250px] sm:max-w-xs mt-1">
                      {taskTitle}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
                  >
                    <X size={20} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-7 overflow-y-auto hide-scrollbar flex-1">
                  
                  {/* Link Input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                      Primary Link <span className="text-rose-500 text-lg leading-none">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 group-focus-within:border-blue-500 dark:group-focus-within:border-blue-500 transition-colors pointer-events-none">
                        <ExternalLink size={14} className="text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <input
                        type="url"
                        required
                        disabled={isSubmitting}
                        placeholder="https://github.com/your-repo/pull/42"
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        className="w-full pl-[3.25rem] pr-5 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-60"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 pl-2">Provide a link to your PR, Figma file, Google Doc, etc.</p>
                  </div>

                  {/* Description Input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                      Description <span className="text-slate-400 font-bold normal-case tracking-normal opacity-60">(Optional)</span>
                    </label>
                    <textarea
                      placeholder="Briefly describe what you've done, any key decisions made, or specific areas you want feedback on..."
                      value={description}
                      disabled={isSubmitting}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[120px] resize-y disabled:opacity-60"
                    />
                  </div>

                  {/* File Upload Zone */}
                  <div className="space-y-3 pb-2">
                    <label className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                      Attachments <span className="text-slate-400 font-bold normal-case tracking-normal opacity-60">(Optional)</span>
                    </label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`
                        relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ease-out group
                        ${isSubmitting ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
                        ${isDragging 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.02]' 
                          : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 bg-white dark:bg-slate-900/50'
                        }
                      `}
                    >
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                        disabled={isSubmitting}
                        onChange={(e) => {
                          if (e.target.files?.[0]) console.log('File selected:', e.target.files[0].name);
                        }}
                      />
                      <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${isDragging ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 scale-110' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:scale-110 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`}>
                        <Paperclip size={24} className={isDragging ? 'animate-bounce' : ''} />
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 text-center">
                        <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 text-center">
                        Any supplemental files (Max 10MB)
                      </p>
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800/80 rounded-b-[2rem] shrink-0">
                  <button 
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 bg-slate-100 dark:bg-slate-800/50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!linkUrl || isSubmitting}
                    className="flex items-center justify-center gap-2 min-w-[180px] px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] active:scale-[0.98] disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit for Review</span> <Send size={16} className="ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionGateway;