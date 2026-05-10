import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Shield,
  Loader2,
  Edit3,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Cake,
  Save,
  X,
  Lock,
  AlertCircle,
  GitBranch,
  Network,
  Hash,
  Eye,
  EyeOff,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { userApi } from "../api";

const API_URL = import.meta.env.VITE_API_URL;

const NAME_REGEX = /^[A-Za-z\s\-']{2,50}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const URL_REGEX =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [formData, setFormData] = useState<any>({});

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passwordStatus, setPasswordStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  useEffect(() => {
    if (!user?._id) return;

    const fetchProfile = async () => {
      try {
        const res = await userApi.getById(user._id);
        const data = res.data;

        if (data.success) {
          setProfileData(data.data);
          setFormData({
            name: data.data.name || "",
            gender: data.data.gender || "",
            birthday: data.data.birthday
              ? new Date(data.data.birthday).toISOString().split("T")[0]
              : "",
            work: data.data.work || "",
            experience: data.data.experience || "",
            bio: data.data.bio || "",
            education: data.data.education || "",
            skills: data.data.skills ? data.data.skills.join(", ") : "",
            socialLinks: {
              github: data.data.socialLinks?.github || "",
              linkedin: data.data.socialLinks?.linkedin || "",
              twitter: data.data.socialLinks?.twitter || "",
            },
          });
        } else {
          setError(data.message || "Failed to load profile.");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPasswordModalOpen) {
        closePasswordModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPasswordModalOpen]);

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({ current: "", new: "", confirm: "" });
    setShowPasswords({ current: false, new: false, confirm: false });
    setPasswordStatus({ loading: false, error: "", success: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProfileError("");

    if (name.startsWith("social_")) {
      const network = name.split("_")[1];
      setFormData((prev: any) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [network]: value },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const validateProfileData = () => {
    if (!NAME_REGEX.test(formData.name.trim())) {
      setProfileError(
        "Name must be 2-50 characters and contain only valid letters.",
      );
      return false;
    }
    const { github, linkedin, twitter } = formData.socialLinks;
    if (github && !URL_REGEX.test(github.trim())) {
      setProfileError("Please enter a valid GitHub URL.");
      return false;
    }
    if (linkedin && !URL_REGEX.test(linkedin.trim())) {
      setProfileError("Please enter a valid LinkedIn URL.");
      return false;
    }
    if (twitter && !URL_REGEX.test(twitter.trim())) {
      setProfileError("Please enter a valid Twitter URL.");
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileData()) return;

    setIsSaving(true);
    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s: string) => s.trim())
        .filter((s: string) => s);
        
      const payload = {
        ...formData,
        name: formData.name.trim(),
        work: formData.work.trim(),
        bio: formData.bio.trim(),
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        skills: skillsArray,
        socialLinks: {
          github: formData.socialLinks.github.trim(),
          linkedin: formData.socialLinks.linkedin.trim(),
          twitter: formData.socialLinks.twitter.trim(),
        },
      };

      const res = await userApi.update(user?._id || "", payload);
      const data = res.data;
      if (data.success) {
        setProfileData(data.data);
        setIsEditing(false);
      } else {
        setProfileError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setProfileError("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: "", success: "" });
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setPasswordStatus({
        loading: false,
        error: "All fields are required.",
        success: "",
      });
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordStatus({
        loading: false,
        error: "New passwords do not match.",
        success: "",
      });
      return;
    }
    if (!PASSWORD_REGEX.test(passwordData.new)) {
      setPasswordStatus({
        loading: false,
        error:
          "Password must be 8+ chars with an uppercase, lowercase, number, and special character.",
        success: "",
      });
      return;
    }
    if (passwordData.current === passwordData.new) {
      setPasswordStatus({
        loading: false,
        error: "New password must be different from the current one.",
        success: "",
      });
      return;
    }

    try {
      const res = await userApi.updatePassword(user?._id || "", {
        currentPassword: passwordData.current,
        newPassword: passwordData.new,
      });
      const data = res.data;

      if (data.success) {
        setPasswordStatus({
          loading: false,
          error: "",
          success: "Password changed successfully!",
        });
        setTimeout(() => {
          closePasswordModal();
        }, 2000);
      } else {
        setPasswordStatus({
          loading: false,
          error: data.message || "Failed to change password.",
          success: "",
        });
      }
    } catch (err) {
      setPasswordStatus({
        loading: false,
        error: "Server error. Please try again.",
        success: "",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0F172A]">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">
          Loading Profile...
        </p>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0F172A] p-4">
        <div className="bg-white dark:bg-slate-900 shadow-xl shadow-red-500/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/30 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="font-bold text-slate-800 dark:text-slate-200 mb-6">{error || "User not found."}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all active:scale-95 focus:ring-4 focus:ring-red-500/20"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 p-4 md:p-8 font-sans pb-20 selection:bg-violet-500/30">
      
      {/* Password Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closePasswordModal}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="password-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80">
                <h3 id="password-modal-title" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock size={20} className="text-violet-600 dark:text-violet-400" /> 
                  Change Password
                </h3>
                <button
                  onClick={closePasswordModal}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-all focus:ring-2 focus:ring-violet-500 outline-none"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
                {passwordStatus.error && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold rounded-xl border border-red-200 dark:border-red-500/20 flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    {passwordStatus.error}
                  </div>
                )}
                {passwordStatus.success && (
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-xl border border-emerald-200 dark:border-emerald-500/20 flex items-start gap-2">
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                    {passwordStatus.success}
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Current Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      required
                      value={passwordData.current}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, current: e.target.value });
                        setPasswordStatus((p) => ({ ...p, error: "" }));
                      }}
                      className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-slate-900 dark:text-white transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({...p, current: !p.current}))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      aria-label={showPasswords.current ? "Hide password" : "Show password"}
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    New Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      required
                      value={passwordData.new}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, new: e.target.value });
                        setPasswordStatus((p) => ({ ...p, error: "" }));
                      }}
                      className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-slate-900 dark:text-white transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({...p, new: !p.new}))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      required
                      value={passwordData.confirm}
                      onChange={(e) => {
                        setPasswordData({ ...passwordData, confirm: e.target.value });
                        setPasswordStatus((p) => ({ ...p, error: "" }));
                      }}
                      className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-slate-900 dark:text-white transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(p => ({...p, confirm: !p.confirm}))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={passwordStatus.loading}
                  className="w-full py-3 mt-6 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-500/50 text-white rounded-xl font-bold transition-all active:scale-[0.98] focus:ring-4 focus:ring-violet-500/30 flex justify-center items-center gap-2"
                >
                  {passwordStatus.loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-30 bg-slate-50/80 dark:bg-[#0F172A]/80 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">Profile</span>
          </h1>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {profileError && (
              <div className="hidden md:flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-xl border border-red-200 dark:border-red-500/20 animate-in slide-in-from-right">
                <AlertCircle size={16} /> {profileError}
              </div>
            )}

            {isEditing ? (
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfileError("");
                  }}
                  className="flex-1 md:flex-none px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-800 transition-all outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/30 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-70 active:scale-[0.98] outline-none"
                >
                  {isSaving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}{" "}
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 focus:ring-4 focus:ring-violet-500/20 transition-all shadow-sm outline-none active:scale-[0.98]"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Mobile Error Toast */}
        {profileError && (
          <div className="md:hidden flex items-start gap-2 text-sm text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20 animate-in slide-in-from-top">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{profileError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Avatar & Socials) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Identity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-500/80 dark:to-indigo-500/80"></div>
              <div
                className={`relative w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center text-5xl font-black text-white shadow-xl z-10 mt-4 transition-transform duration-500 group-hover:scale-105 ${profileData.avatarColor || "bg-slate-800"}`}
              >
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-5 tracking-tight">
                {profileData.name}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider mt-3 border border-slate-200 dark:border-slate-700">
                {profileData.role === "admin" ? (
                  <Shield size={14} className="text-violet-500" />
                ) : (
                  <UserIcon size={14} className="text-violet-500" />
                )}
                {profileData.role}
              </div>

              {/* Points & Stats */}
              <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                <div className="text-center">
                  <p className="text-2xl font-black text-violet-600 dark:text-violet-400">
                    {profileData.points || 0}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                    Points
                  </p>
                </div>
                <div className="text-center border-l border-slate-100 dark:border-slate-800/50">
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {profileData.badges?.length || 0}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                    Badges
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Badges Display Card */}
            {profileData.badges?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm"
              >
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" /> Earned Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profileData.badges.map((badge: any, i: number) => (
                    <div 
                      key={badge._id || i} 
                      className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm hover:scale-110 transition-transform cursor-help"
                      title={badge.name}
                    >
                      <img src={badge.icon} alt={badge.name} className="w-8 h-8 object-contain" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Social Links Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800/80 shadow-sm"
            >
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Network size={18} className="text-slate-400" /> Web Presence
              </h3>
              <div className="space-y-5">
                
                {/* GitHub (Swapped Icon) */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-inner">
                    <GitBranch size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">GitHub</p>
                    {isEditing ? (
                      <input
                        name="social_github"
                        type="url"
                        value={formData.socialLinks.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      />
                    ) : (
                      <a
                        href={profileData.socialLinks?.github || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 truncate block transition-colors"
                      >
                        {profileData.socialLinks?.github || "Not added"}
                      </a>
                    )}
                  </div>
                </div>

                {/* LinkedIn (Swapped Icon) */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                    <Network size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">LinkedIn</p>
                    {isEditing ? (
                      <input
                        name="social_linkedin"
                        type="url"
                        value={formData.socialLinks.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      />
                    ) : (
                      <a
                        href={profileData.socialLinks?.linkedin || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 truncate block transition-colors"
                      >
                        {profileData.socialLinks?.linkedin || "Not added"}
                      </a>
                    )}
                  </div>
                </div>

                {/* Twitter (Swapped Icon) */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-500 dark:text-sky-400 shadow-inner">
                    <Hash size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Twitter / X</p>
                    {isEditing ? (
                      <input
                        name="social_twitter"
                        type="url"
                        value={formData.socialLinks.twitter}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/username"
                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                      />
                    ) : (
                      <a
                        href={profileData.socialLinks?.twitter || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 truncate block transition-colors"
                      >
                        {profileData.socialLinks?.twitter || "Not added"}
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

          {/* Right Column (Forms) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800/80 shadow-sm"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <UserIcon className="text-violet-500" size={20} /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent">
                      {profileData.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                    Email Address
                  </label>
                  <div className="px-4 py-3 font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 cursor-not-allowed select-none">
                    <span className="truncate">{profileData.email}</span>
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 ml-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent">
                      {profileData.gender || <span className="text-slate-400 font-medium">Not specified</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Cake size={12} /> Birthday
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
                    />
                  ) : (
                    <div className="px-4 py-3 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent">
                      {profileData.birthday
                        ? new Date(profileData.birthday).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : <span className="text-slate-400 font-medium">Not specified</span>}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>

            {/* Professional Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800/80 shadow-sm"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Briefcase className="text-violet-500" size={20} /> Professional & Academic
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                    Current Role / Work
                  </label>
                  {isEditing ? (
                    <input
                      name="work"
                      value={formData.work}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineer at Tech Corp"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent">
                      {profileData.work || <span className="text-slate-400 font-medium">Not specified</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <GraduationCap size={14} /> Education
                  </label>
                  {isEditing ? (
                    <input
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      placeholder="e.g. B.S. Computer Science"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent">
                      {profileData.education || <span className="text-slate-400 font-medium">Not specified</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Hash size={14} /> Experience Level
                  </label>
                  {isEditing ? (
                    <input
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g. 2 Years"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                    />
                  ) : (
                    <div className="px-4 py-3 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent">
                      {profileData.experience || <span className="text-slate-400 font-medium">Not specified</span>}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                    <Sparkles size={14} /> Technical Skills
                  </label>
                  {isEditing ? (
                    <div>
                      <input
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="React, TypeScript, Node.js (comma separated)"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                      />
                      <p className="text-[11px] font-medium text-slate-400 mt-2 pl-2">
                        Separate multiple skills with commas.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 px-2 py-1">
                      {profileData.skills?.length > 0 ? (
                        profileData.skills.map((skill: string, i: number) => (
                          <span
                            key={i}
                            className="px-4 py-1.5 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 rounded-lg text-sm font-bold border border-violet-200 dark:border-violet-500/20 shadow-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 font-medium px-2 py-1">
                          No skills added yet
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                    Bio & Background
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Briefly describe your goals, interests, or anything else you'd like to share..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all min-h-[120px] resize-y"
                    />
                  ) : (
                    <div className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent whitespace-pre-wrap leading-relaxed min-h-[100px]">
                      {profileData.bio || <span className="text-slate-400">No bio provided.</span>}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Security Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800/80 shadow-sm"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Shield className="text-violet-500" size={20} /> Security Settings
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                    <Lock size={20} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-base">
                      Account Password
                    </p>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      Ensure your account stays secure.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800 hover:bg-violet-50/50 dark:hover:bg-violet-500/10 focus:ring-4 focus:ring-violet-500/20 transition-all shadow-sm outline-none active:scale-[0.98]"
                >
                  Change Password
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}