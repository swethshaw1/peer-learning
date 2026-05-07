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
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setLinkUrl('');
      setDescription('');
    }, 2500);
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
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-95"
      >
        <Upload size={14} /> Submit Work
      </button>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-emerald-500 animate-[bounce_1s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                  Submission Uploaded!
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Your work has been successfully submitted for review. The host will be notified shortly.
                </p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      Submit Work
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[250px] sm:max-w-xs mt-0.5">
                      {taskTitle}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  
                  {/* Link Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                      Link <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative group">
                      <ExternalLink size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                      <input
                        type="url"
                        required
                        placeholder="https://github.com/your-repo/pull/42"
                        value={linkUrl}
                        onChange={e => setLinkUrl(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                      />
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 pl-1">Provide a link to your PR, Figma file, Google Doc, etc.</p>
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                      Description <span className="text-slate-400 font-normal normal-case tracking-normal">(Optional)</span>
                    </label>
                    <textarea
                      placeholder="Briefly describe what you've done, any decisions made, or questions you have..."
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[100px] resize-y"
                    />
                  </div>

                  {/* File Upload Zone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                      Attachments <span className="text-slate-400 font-normal normal-case tracking-normal">(Optional)</span>
                    </label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`
                        relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all cursor-pointer
                        ${isDragging 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' 
                          : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-900'
                        }
                      `}
                    >
                      <div className={`p-3 rounded-full mb-3 transition-colors ${isDragging ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                        <Paperclip size={20} />
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 text-center">
                        <span className="text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center">
                        Any file up to 10MB
                      </p>
                      {/* Hidden file input would go here in production */}
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/80 rounded-b-3xl">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!linkUrl}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <Send size={16} /> Submit for Review
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