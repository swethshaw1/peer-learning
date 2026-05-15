import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Users, Target, Rocket, Calendar, ChevronRight, Briefcase, PlusCircle, Trash2, Code2, AlignLeft, Sparkles, ChevronDown } from 'lucide-react';
import { useProject } from '../../../context/ProjectContext';
import { useCohort } from '../../../context/CohortContext';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProject();
  const { allCohorts } = useCohort();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    pitch: '',
    description: '',
    problemStatement: '',
    techStack: '',
    cohortId: '',
    deadline: '',
    maxParticipants: 5,
    roles: [
      { title: 'Project Lead', description: 'Coordinate with the mentor and drive project execution.', skillsRequired: 'Leadership, Management', filled: false }
    ]
  });

  // Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const handleAddRole = () => {
    setFormData(prev => ({
      ...prev,
      roles: [...prev.roles, { title: '', description: '', skillsRequired: '', filled: false }]
    }));
  };

  const handleRemoveRole = (index: number) => {
    if (formData.roles.length <= 1) return;
    const newRoles = [...formData.roles];
    newRoles.splice(index, 1);
    setFormData(prev => ({ ...prev, roles: newRoles }));
  };

  const handleRoleChange = (index: number, field: string, value: any) => {
    const newRoles = [...formData.roles];
    (newRoles[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, roles: newRoles }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cohortId) return toast.error('Please select a cohort');

    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s),
        roles: formData.roles.map(r => ({
          ...r,
          skillsRequired: typeof r.skillsRequired === 'string' ? r.skillsRequired.split(',').map((s: string) => s.trim()) : r.skillsRequired
        }))
      };

      await createProject(submissionData);
      toast.success('Project created! You are now the Mentor.');
      onClose();
    } catch (err) {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl w-full max-w-3xl max-h-[90vh] flex flex-col rounded-[2rem] shadow-2xl ring-1 ring-slate-200/50 dark:ring-white/10 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Premium Header */}
            <div className="relative px-6 sm:px-8 py-6 sm:py-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 shrink-0 overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />
              <div className="relative flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest ring-1 ring-inset ring-white/30 mb-3 shadow-sm">
                    <Sparkles size={12} /> Host Mode
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">Create New Project</h2>
                  <p className="text-blue-100 text-sm font-medium mt-1.5 opacity-90 max-w-sm">Designate yourself as a Mentor, define the scope, and build your dream team.</p>
                </div>
                <button 
                  onClick={() => !isSubmitting && onClose()} 
                  className="p-2.5 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-95"
                >
                  <X size={22} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 sm:p-8">
              <form id="create-project-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Info Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Target size={18} className="text-blue-500" /> Core Details
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Project Title <span className="text-rose-500">*</span></label>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. AI-Powered LMS"
                        disabled={isSubmitting}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Target Cohort <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <select
                          required
                          value={formData.cohortId}
                          onChange={e => setFormData({ ...formData, cohortId: e.target.value })}
                          disabled={isSubmitting}
                          className="w-full bg-slate-50 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-2xl px-5 py-4 pr-10 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all appearance-none disabled:opacity-60"
                        >
                          <option value="" disabled>Select a Cohort</option>
                          {allCohorts.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Elevator Pitch <span className="text-rose-500">*</span></label>
                    <input
                      required
                      type="text"
                      value={formData.pitch}
                      onChange={e => setFormData({ ...formData, pitch: e.target.value })}
                      placeholder="In one sentence, what makes your project unique?"
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Detailed Description <span className="text-rose-500">*</span></label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Explain the broader vision, goals, and problem it solves..."
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all resize-y min-h-[120px] placeholder:text-slate-400 disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">
                      <AlignLeft size={14} /> Problem Statement <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.problemStatement}
                      onChange={e => setFormData({ ...formData, problemStatement: e.target.value })}
                      placeholder="What specific problem does this project aim to solve?"
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all resize-y min-h-[90px] placeholder:text-slate-400 disabled:opacity-60"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2.5">
                      <label className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">
                        <Code2 size={14} /> Tech Stack <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.techStack}
                        onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                        placeholder="React, Node.js, MongoDB (Comma separated)"
                        disabled={isSubmitting}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400 disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">
                        <Calendar size={14} /> Target Deadline <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="date"
                        value={formData.deadline}
                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                        disabled={isSubmitting}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 ring-1 ring-inset ring-slate-200 dark:ring-slate-700/80 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* Roles Section */}
                <div className="space-y-5 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                      <Users size={18} className="text-blue-500" /> Required Team Roles
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddRole}
                      disabled={isSubmitting}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 rounded-lg text-xs font-extrabold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:opacity-50"
                    >
                      <PlusCircle size={14} strokeWidth={2.5} /> Add Role
                    </button>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {formData.roles.map((role, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, height: 0, scale: 0.95 }}
                          animate={{ opacity: 1, height: 'auto', scale: 1 }}
                          exit={{ opacity: 0, height: 0, scale: 0.95 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="relative p-5 rounded-[1.5rem] bg-slate-50/50 dark:bg-slate-800/30 ring-1 ring-inset ring-slate-200/80 dark:ring-slate-700/80 group overflow-hidden"
                        >
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRole(index)}
                              disabled={isSubmitting}
                              className="absolute top-3 right-3 p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/50 disabled:opacity-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Role Title</label>
                              <input
                                required
                                placeholder="e.g. Frontend Developer"
                                value={role.title}
                                onChange={e => handleRoleChange(index, 'title', e.target.value)}
                                disabled={isSubmitting}
                                className="w-full bg-white dark:bg-slate-900 ring-1 ring-inset ring-slate-200/60 dark:ring-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-60"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Required Skills</label>
                              <input
                                required
                                placeholder="React, Tailwind (Comma separated)"
                                value={role.skillsRequired}
                                onChange={e => handleRoleChange(index, 'skillsRequired', e.target.value)}
                                disabled={isSubmitting}
                                className="w-full bg-white dark:bg-slate-900 ring-1 ring-inset ring-slate-200/60 dark:ring-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-60"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Role Responsibilities</label>
                            <textarea
                              required
                              placeholder="Briefly describe what this team member will do..."
                              value={role.description}
                              onChange={e => handleRoleChange(index, 'description', e.target.value)}
                              disabled={isSubmitting}
                              className="w-full bg-white dark:bg-slate-900 ring-1 ring-inset ring-slate-200/60 dark:ring-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all h-20 resize-none disabled:opacity-60"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

              </form>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/80 shrink-0">
              <button
                type="submit"
                form="create-project-form"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[1.25rem] font-extrabold text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:active:scale-100 disabled:hover:shadow-none disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    Launch Project <Rocket size={18} strokeWidth={2.5} className="ml-1" />
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModal;
