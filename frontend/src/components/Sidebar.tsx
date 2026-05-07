import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  Users,
  BarChart3,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Monitor,
  LayoutDashboard,
  ChevronDown,
  Bell,
  UserCircle,
  X,
  Trophy,
  History,
  GraduationCap,
  Bookmark,
  MessageSquare,
  Globe,
  Folder,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useCohort } from "../context/CohortContext";
import { useUser } from "../context/UserContext";
import Logo from "./Logo";
import { notificationApi } from "../api";

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();
  const { activeCohort, setActiveCohort, cohortData } = useCohort();
  const { user, logout } = useUser();

  const [openMenus, setOpenMenus] = useState({ lms: false, quiz: false, projects: false });
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnreadNotifications = async () => {
      if (!user) return;
      try {
        const res = await notificationApi.getAll(user._id);
        const data = res.data;

        if (data.success) {
          const unreadExists = data.data.some(
            (n: any) => !n.isRead && n.cohort === activeCohort,
          );
          setHasUnread(unreadExists);
        }
      } catch (err) {
        console.error("Failed to check notifications", err);
      }
    };

    checkUnreadNotifications();
  }, [user?._id, activeCohort]);

  // Premium active state with subtle background and crisp text colors
  const navLinkClass = ({ isActive }: { isActive: boolean }) => `
    group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out
    ${
      isActive
        ? "bg-blue-50/80 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
    }
  `;

  return (
    <>
      {/* Enhanced backdrop with smooth fade and blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen w-72 flex flex-col 
        bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 
        transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
              <Logo size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight">
              PeerLearning
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          
          {/* General Section */}
          <div className="space-y-1.5">
            <p className="px-4 mb-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
              General
            </p>
            <NavLink to="/dashboard" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
                  <LayoutDashboard size={20} className="transition-transform group-hover:scale-110" />
                  <span>Dashboard</span>
                </>
              )}
            </NavLink>
          </div>

          {/* Learning Section (Combined Theory, Projects, Assessment) */}
          <div className="space-y-1.5">
            <p className="px-4 mb-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
              Learning
            </p>

            {/* Theory (LMS) Accordion */}
            <div>
              <button
                onClick={() => setOpenMenus((p) => ({ ...p, lms: !p.lms }))}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="transition-transform group-hover:scale-110" />
                  <span>Theory (LMS)</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-300 ease-in-out ${openMenus.lms ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  openMenus.lms ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-6 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1 py-1">
                    <SubLink to="/lms-dashboard" label="LMS Dashboard" />
                    <SubLink to="/course" label="My Courses" />
                    <SubLink to="/bookmarks" label="Bookmarks" />
                    <SubLink to="/discussions" label="Discussions" />
                    <SubLink to="/lms-leaderboard" label="LMS Leaderboard" />
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Accordion */}
            <div>
              <button
                onClick={() => setOpenMenus((p) => ({ ...p, projects: !p.projects }))}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Folder size={20} className="transition-transform group-hover:scale-110" />
                  <span>Projects</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-300 ease-in-out ${openMenus.projects ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  openMenus.projects ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-6 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1 py-1">
                    <SubLink to="/project-dashboard" label="Project Dashboard" />
                    <SubLink to="/explore-projects" label="Explore Projects" />
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Accordion */}
            <div>
              <button
                onClick={() => setOpenMenus((p) => ({ ...p, quiz: !p.quiz }))}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} className="transition-transform group-hover:scale-110" />
                  <span>Assessment (Quiz)</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform duration-300 ease-in-out ${openMenus.quiz ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  openMenus.quiz ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="ml-6 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1 py-1">
                    <SubLink to="/learning" label="Practice" />
                    <SubLink to="/peer-quiz" label="Peer Quiz" />
                    <SubLink to="/results" label="My Results" />
                    <SubLink to="/forum" label="Quiz Forum" />
                    <SubLink to="/quiz-leaderboard" label="Quiz Leaderboard" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Section */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
            <NavLink to="/notifications" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
                  <div className="relative flex items-center gap-3 flex-1">
                    <Bell size={20} className="transition-transform group-hover:scale-110" /> 
                    <span>Notifications</span>
                    {hasUnread && (
                      <span className="absolute left-3.5 top-0 w-2.5 h-2.5 border-2 border-white dark:border-[#0B1120] rounded-full bg-red-500 animate-pulse" />
                    )}
                  </div>
                </>
              )}
            </NavLink>

            <NavLink to="/help" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
                  <HelpCircle size={20} className="transition-transform group-hover:scale-110" /> 
                  <span>Help Center</span>
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* Footer Area */}
        <div className="p-5 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/50 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4">
          
          <div className="space-y-3">
            {/* Custom styled select */}
            <div className="relative">
              <select
                value={activeCohort}
                onChange={(e) => setActiveCohort(e.target.value)}
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {Object.keys(cohortData).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Segmented Theme Toggler */}
            <div className="flex bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1 gap-1">
              <ThemeButton active={theme === "light"} onClick={() => setTheme("light")} icon={Sun} title="Light Mode" />
              <ThemeButton active={theme === "system"} onClick={() => setTheme("system")} icon={Monitor} title="System Theme" />
              <ThemeButton active={theme === "dark"} onClick={() => setTheme("dark")} icon={Moon} title="Dark Mode" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <NavLink
              to="/profile"
              className="flex-1 flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <UserCircle size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {user?.name || "Student"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  View Profile
                </p>
              </div>
            </NavLink>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Clean SubLink component prioritizing text hierarchy and layout nesting over repeated icons
const SubLink = ({ to, label, onClick }: any) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200
      ${
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:translate-x-1"
      }
    `}
  >
    {label}
  </NavLink>
);

const ThemeButton = ({ active, onClick, icon: Icon, title }: any) => (
  <button
    onClick={onClick}
    title={title}
    className={`flex-1 flex justify-center items-center py-2 rounded-lg transition-all duration-300 ${
      active
        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
    }`}
  >
    <Icon size={16} className={active ? "scale-110" : ""} />
  </button>
);