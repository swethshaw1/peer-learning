import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Users, Target, Rocket, Calendar, ChevronRight, Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import { useProject } from '../../../context/ProjectContext';
import { useCohort } from '../../../context/CohortContext';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProject();
  const { cohorts } = useCohort();
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
      { title: 'Project Lead', description: 'Coordinate with the mentor and drive project execution.', skillsRequired: ['Leadership'], filled: false }
    ]
  });

  const handleAddRole = () => {
    setFormData(prev => ({
      ...prev,
      roles: [...prev.roles, { title: '', description: '', skillsRequired: [], filled: false }]
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
          skillsRequired: typeof r.skillsRequired === 'string' ? (r.skillsRequired as string).split(',').map(s => s.trim()) : r.skillsRequired
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Create New Project</h2>
            <p className="text-blue-100 text-sm font-medium mt-1">Designate yourself as a Mentor and find a team.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Project Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI-Powered LMS"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Target Cohort</label>
              <select
                required
                value={formData.cohortId}
                onChange={e => setFormData({ ...formData, cohortId: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="">Select a Cohort</option>
                {cohorts.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Elevator Pitch (One line)</label>
            <input
              required
              type="text"
              value={formData.pitch}
              onChange={e => setFormData({ ...formData, pitch: e.target.value })}
              placeholder="What makes your project unique?"
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Detailed Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain the vision and goals..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Tech Stack (comma separated)</label>
              <input
                required
                type="text"
                value={formData.techStack}
                onChange={e => setFormData({ ...formData, techStack: e.target.value })}
                placeholder="React, Node.js, MongoDB"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Deadline</label>
              <input
                required
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Roles Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={16} className="text-blue-500" /> Required Roles
              </h3>
              <button
                type="button"
                onClick={handleAddRole}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <PlusCircle size={14} /> Add Role
              </button>
            </div>

            <div className="space-y-4">
              {formData.roles.map((role, index) => (
                <div key={index} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 relative group">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(index)}
                      className="absolute -top-2 -right-2 p-1.5 bg-white dark:bg-slate-900 text-rose-500 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Role Title (e.g. Project Lead)"
                      value={role.title}
                      onChange={e => handleRoleChange(index, 'title', e.target.value)}
                      className="bg-white dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      required
                      placeholder="Skills (comma separated)"
                      value={role.skillsRequired}
                      onChange={e => handleRoleChange(index, 'skillsRequired', e.target.value)}
                      className="bg-white dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <textarea
                    required
                    placeholder="Briefly describe what this person will do..."
                    value={role.description}
                    onChange={e => handleRoleChange(index, 'description', e.target.value)}
                    className="w-full mt-3 bg-white dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-blue-500 h-16"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6">
            <button
              disabled={isSubmitting}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Launch Project <Rocket size={18} /></>
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default CreateProjectModal;
