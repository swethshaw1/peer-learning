import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, X, CheckCircle, Send, Paperclip, Briefcase } from 'lucide-react';
import { Project } from '../../../types';

interface ApplicationPanelProps {
  project: Project;
}

const ApplicationPanel: React.FC<ApplicationPanelProps> = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const openRoles = project.roles.filter(r => !r.filled);

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

  if (openRoles.length === 0) return null;

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setSelectedRole('');
      setCoverNote('');
      setPortfolio('');
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
  };

  return (
    <>
      {/* Call to Action Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="text-blue-600 dark:text-blue-500" size={20} />
            Apply for this Project
          </h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            {openRoles.length} open position{openRoles.length > 1 ? 's' : ''} currently available.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          Apply Now
        </button>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={40} className="text-emerald-500 animate-[bounce_1s_ease-in-out_infinite]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                  Application Submitted!
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">
                  Your application has been successfully sent to the host. You'll be notified when they review it.
                </p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      Apply to Project
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[250px] sm:max-w-xs mt-0.5">
                      {project.title}
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

                {/* Modal Body (Scrollable) */}
                <div className="p-6 space-y-6 overflow-y-auto hide-scrollbar flex-1">
                  
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                      Select a Role <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex flex-col gap-3">
                      {openRoles.map(role => {
                        const isSelected = selectedRole === role.id;
                        return (
                          <label
                            key={role.id}
                            className={`
                              flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200
                              ${isSelected 
                                ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-500 shadow-sm shadow-blue-500/10' 
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50'
                              }
                            `}
                          >
                            <div className="flex items-center h-5">
                              <input
                                type="radio"
                                name="role"
                                value={role.id}
                                checked={isSelected}
                                onChange={e => setSelectedRole(e.target.value)}
                                className="w-4 h-4 text-blue-600 bg-white border-slate-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-900 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 transition-all cursor-pointer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-sm mb-1 transition-colors ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                                {role.title}
                              </div>
                              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                <span className="font-semibold text-slate-600 dark:text-slate-300">Skills:</span> {role.skillsRequired.join(', ')}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cover Note */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                      Cover Note <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      placeholder="Tell the host why you're interested in this role and what you bring to the table..."
                      value={coverNote}
                      onChange={e => setCoverNote(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[120px] resize-y"
                    />
                  </div>

                  {/* Resume Upload Zone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                      Resume <span className="text-slate-400 font-normal normal-case tracking-normal">(Optional)</span>
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
                        PDF, DOCX up to 5MB
                      </p>
                    </div>
                  </div>

                  {/* Portfolio / Link Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                      Portfolio / GitHub URL <span className="text-slate-400 font-normal normal-case tracking-normal">(Optional)</span>
                    </label>
                    <div className="relative group">
                      <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                      <input
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={portfolio}
                        onChange={e => setPortfolio(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                      />
                    </div>
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/80 rounded-b-3xl shrink-0">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedRole || !coverNote.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    <Send size={16} /> Submit Application
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

export default ApplicationPanel;