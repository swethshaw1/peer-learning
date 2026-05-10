import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, X, CheckCircle, Send, Paperclip, Briefcase, Sparkles } from 'lucide-react';
import { Project } from '../../../types';
import { applicationApi } from '../../../api';
import { useProject } from '../../../context/ProjectContext';

interface ApplicationPanelProps {
  project: Project;
}

const ApplicationPanel: React.FC<ApplicationPanelProps> = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { refreshData } = useProject();
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
      if (e.key === 'Escape' && showModal && !isSubmitting) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, isSubmitting]);

  if (openRoles.length === 0) return null;

  const handleSubmit = async () => {
    if (!selectedRole || !coverNote.trim()) return;
    
    setIsSubmitting(true);
    console.log('Submitting application:', {
      projectId: project.id || (project as any)._id,
      roleId: selectedRole,
      coverNote,
      portfolioUrl: portfolio,
      resumeUrl: resumeUrl
    });
    try {
      await applicationApi.apply(project.id || (project as any)._id, {
        roleId: selectedRole,
        coverNote,
        portfolioUrl: portfolio,
        resumeUrl: resumeUrl
      });
      
      setSubmitted(true);
      await refreshData();
      
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setSelectedRole('');
        setCoverNote('');
        setPortfolio('');
        setResumeUrl('');
      }, 2500);
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Premium Call to Action Card */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 mt-8 group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/10">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6 z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-blue-500/20 mb-3">
              <Sparkles size={12} /> Now Hiring
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              Apply for this Project
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 max-w-lg">
              There are currently <strong className="text-slate-700 dark:text-slate-300">{openRoles.length} open position{openRoles.length > 1 ? 's' : ''}</strong>. Select a role, drop your resume, and let the host know why you're a great fit.
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="relative px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => !isSubmitting && setShowModal(false)}
        >
          <div 
            className="w-full max-w-xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
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
                  Application Sent!
                </h3>
                <p className="text-base font-medium text-slate-500 dark:text-slate-400 max-w-sm animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
                  Your profile and cover note have been forwarded to the host. Keep an eye on your activity feed.
                </p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                      <Briefcase size={20} className="text-blue-600 dark:text-blue-400" />
                      Apply to Project
                    </h3>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate max-w-[250px] sm:max-w-xs mt-1">
                      {project.title}
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

                {/* Modal Body (Scrollable) */}
                <div className="p-6 space-y-8 overflow-y-auto hide-scrollbar flex-1">
                  
                  {/* Role Selection */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                      Select a Role <span className="text-rose-500 text-lg leading-none">*</span>
                    </label>
                    <div className="flex flex-col gap-3">
                      {openRoles.map(role => {
                        const isSelected = selectedRole === (role._id || role.id);
                        return (
                          <div
                            key={role._id || role.id}
                            onClick={() => !isSubmitting && setSelectedRole(role._id || role.id)}
                            className={`
                              group relative flex items-start gap-4 p-4 rounded-[1.25rem] cursor-pointer transition-all duration-300 ease-out
                              ${isSelected 
                                ? 'bg-blue-50/80 dark:bg-blue-500/10 ring-2 ring-blue-500 shadow-md shadow-blue-500/10 -translate-y-0.5' 
                                : 'bg-slate-50 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 hover:ring-blue-300 dark:hover:ring-blue-500/50 hover:bg-white dark:hover:bg-slate-800/80'
                              }
                              ${isSubmitting ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}
                            `}
                          >
                            {/* Custom Animated Radio */}
                            <div className="flex items-center justify-center w-5 h-5 mt-0.5 rounded-full ring-2 ring-inset bg-white dark:bg-slate-900 transition-colors duration-300 shrink-0
                                ${isSelected ? 'ring-blue-500' : 'ring-slate-300 dark:ring-slate-600 group-hover:ring-blue-400'}">
                              <div className={`w-2.5 h-2.5 rounded-full bg-blue-500 transition-transform duration-300 ${isSelected ? 'scale-100' : 'scale-0'}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className={`font-bold text-sm mb-1.5 transition-colors duration-300 ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                                {role.title}
                              </div>
                              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                <span className="font-bold text-slate-600 dark:text-slate-300">Skills:</span> {role.skillsRequired.join(', ')}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cover Note */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                      Cover Note <span className="text-rose-500 text-lg leading-none">*</span>
                    </label>
                    <textarea
                      placeholder="Introduce yourself, highlight relevant experience, and explain why you're a great fit for this role..."
                      value={coverNote}
                      onChange={e => setCoverNote(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all min-h-[140px] resize-y disabled:opacity-60"
                    />
                  </div>

                  {/* Resume Link Input */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                      Resume Link <span className="text-rose-500 text-lg leading-none">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 group-focus-within:border-blue-500 dark:group-focus-within:border-blue-500 transition-colors pointer-events-none">
                        <Paperclip size={14} className="text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/your-resume.pdf"
                        value={resumeUrl}
                        onChange={e => setResumeUrl(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className="w-full pl-[3.25rem] pr-5 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Portfolio / Link Input */}
                  <div className="space-y-3 pb-2">
                    <label className="flex items-center gap-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                      Portfolio / GitHub URL <span className="text-slate-400 font-bold normal-case tracking-normal opacity-60">(Optional)</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200 dark:border-slate-700 group-focus-within:border-blue-500 dark:group-focus-within:border-blue-500 transition-colors pointer-events-none">
                        <LinkIcon size={14} className="text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" />
                      </div>
                      <input
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={portfolio}
                        onChange={e => setPortfolio(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full pl-[3.25rem] pr-5 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-60"
                      />
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
                    disabled={!selectedRole || !coverNote.trim() || !resumeUrl.trim() || isSubmitting}
                    className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span> <Send size={16} className="ml-1" />
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

export default ApplicationPanel;