import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
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
  Folder,
  PanelLeftClose,
  PanelLeftOpen,
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
  const location = useLocation();

  // New state for desktop collapse
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Auto-open menus based on current route context
  const [openMenus, setOpenMenus] = useState({
    lms: ["/lms-dashboard", "/course", "/bookmarks", "/discussions", "/lms-leaderboard"].includes(location.pathname),
    projects: ["/project-dashboard", "/explore-projects"].includes(location.pathname),
    quiz: ["/learning", "/peer-quiz", "/results", "/forum", "/quiz-leaderboard"].includes(location.pathname),
  });

  // Keyboard shortcut listener (Ctrl/Cmd + B to toggle sidebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const checkUnreadNotifications = async () => {
      if (!user) return;
      try {
        const res = await notificationApi.getAll(user._id);
        const data = res.data;
        if (data.success) {
          setHasUnread(data.data.some((n: any) => !n.isRead && n.cohort === activeCohort));
        }
      } catch (err) {
        console.error("Failed to check notifications", err);
      }
    };
    checkUnreadNotifications();
  }, [user?._id, activeCohort]);

  // Handle Accordion clicks: if collapsed, uncollapse first
  const toggleMenu = (menu: keyof typeof openMenus) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenMenus((p) => ({ ...p, [menu]: !p[menu] }));
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => `
    group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    ${
      isActive
        ? "bg-blue-50/80 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold shadow-sm"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
    }
  `;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen flex flex-col 
        bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 
        transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isCollapsed ? "lg:w-20" : "lg:w-72 w-72"}
      `}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 shrink-0 border-b border-transparent lg:border-slate-200/50 dark:lg:border-slate-800/50 transition-colors">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105 shrink-0">
              <Logo size={22} className="text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight animate-in fade-in duration-300 whitespace-nowrap">
                PeerLearning
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
          
          {/* General Section */}
          <div className="space-y-1.5">
            {!isCollapsed && (
              <p className="px-4 mb-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] whitespace-nowrap">
                General
              </p>
            )}
            <NavLink to="/dashboard" className={navLinkClass} title={isCollapsed ? "Dashboard" : ""}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
                  <LayoutDashboard size={20} className="shrink-0 transition-transform group-hover:scale-110" />
                  {!isCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
                </>
              )}
            </NavLink>
          </div>

          {/* Learning Section */}
          <div className="space-y-1.5">
            {!isCollapsed && (
              <p className="px-4 mb-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] whitespace-nowrap">
                Learning
              </p>
            )}

            {/* Reusable Accordion Logic */}
            <AccordionItem
              icon={BookOpen}
              label="Theory (LMS)"
              isOpen={openMenus.lms}
              isCollapsed={isCollapsed}
              onClick={() => toggleMenu("lms")}
            >
              <SubLink to="/lms-dashboard" label="LMS Dashboard" isCollapsed={isCollapsed} />
              <SubLink to="/course" label="My Courses" isCollapsed={isCollapsed} />
              <SubLink to="/bookmarks" label="Bookmarks" isCollapsed={isCollapsed} />
              <SubLink to="/discussions" label="Discussions" isCollapsed={isCollapsed} />
            </AccordionItem>

            <AccordionItem
              icon={Folder}
              label="Projects"
              isOpen={openMenus.projects}
              isCollapsed={isCollapsed}
              onClick={() => toggleMenu("projects")}
            >
              <SubLink to="/project-dashboard" label="Project Dashboard" isCollapsed={isCollapsed} />
              <SubLink to="/explore-projects" label="Explore Projects" isCollapsed={isCollapsed} />
            </AccordionItem>

            <AccordionItem
              icon={BarChart3}
              label="Assessment"
              isOpen={openMenus.quiz}
              isCollapsed={isCollapsed}
              onClick={() => toggleMenu("quiz")}
            >
              <SubLink to="/learning" label="Practice" isCollapsed={isCollapsed} />
              <SubLink to="/peer-quiz" label="Peer Quiz" isCollapsed={isCollapsed} />
              <SubLink to="/results" label="My Results" isCollapsed={isCollapsed} />
            </AccordionItem>
          </div>

          {/* Connect Section */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
            <NavLink to="/notifications" className={navLinkClass} title={isCollapsed ? "Notifications" : ""}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
                  <div className="relative flex items-center gap-3 flex-1">
                    <Bell size={20} className="shrink-0 transition-transform group-hover:scale-110" /> 
                    {!isCollapsed && <span className="whitespace-nowrap">Notifications</span>}
                    {hasUnread && (
                      <span className={`absolute border-2 border-white dark:border-[#0B1120] rounded-full bg-red-500 animate-pulse ${isCollapsed ? "right-[-4px] top-[-4px] w-3 h-3" : "left-3.5 top-0 w-2.5 h-2.5"}`} />
                    )}
                  </div>
                </>
              )}
            </NavLink>

            <NavLink to="/help" className={navLinkClass} title={isCollapsed ? "Help Center" : ""}>
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />}
                  <HelpCircle size={20} className="shrink-0 transition-transform group-hover:scale-110" /> 
                  {!isCollapsed && <span className="whitespace-nowrap">Help Center</span>}
                </>
              )}
            </NavLink>
          </div>
        </nav>

        {/* Footer Area */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800/80 space-y-4">
          
          {!isCollapsed && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <div className="relative">
                <select
                  value={activeCohort}
                  onChange={(e) => setActiveCohort(e.target.value)}
                  className="w-full appearance-none bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm"
                >
                  {Object.keys(cohortData).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              <div className="flex bg-slate-200/50 dark:bg-slate-800/80 rounded-xl p-1 gap-1">
                <ThemeButton active={theme === "light"} onClick={() => setTheme("light")} icon={Sun} title="Light" />
                <ThemeButton active={theme === "system"} onClick={() => setTheme("system")} icon={Monitor} title="System" />
                <ThemeButton active={theme === "dark"} onClick={() => setTheme("dark")} icon={Moon} title="Dark" />
              </div>
            </div>
          )}

          <div className={`flex items-center gap-3 pt-2 ${isCollapsed ? 'justify-center flex-col' : ''}`}>
            <NavLink
              to="/profile"
              className={`flex items-center gap-3 hover:bg-white dark:hover:bg-slate-800/80 rounded-xl transition-colors group ${isCollapsed ? 'p-1' : 'flex-1 p-2 shadow-sm'}`}
              title={isCollapsed ? "Profile" : ""}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 border border-blue-200 dark:border-blue-500/30">
                <UserCircle size={24} />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {user?.name || "Student"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">View Profile</p>
                </div>
              )}
            </NavLink>

            {!isCollapsed && (
              <button
                onClick={logout}
                title="Sign Out"
                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-all"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors mt-2"
            title={`Toggle Sidebar (Ctrl+B)`}
          >
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}

// ---------------- Helper Components ----------------

const AccordionItem = ({ icon: Icon, label, isOpen, isCollapsed, onClick, children }: any) => (
  <div>
    <button
      onClick={onClick}
      title={isCollapsed ? label : ""}
      className={`w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className="shrink-0 transition-transform group-hover:scale-110" />
        {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
      </div>
      {!isCollapsed && (
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`}
        />
      )}
    </button>
    
    {/* Smooth height transition using grid */}
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
        isOpen && !isCollapsed ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="ml-6 pl-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-1 py-1">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const SubLink = ({ to, label, isCollapsed }: any) => {
  if (isCollapsed) return null; // Hide sublinks completely when collapsed to save space
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        ${
          isActive
            ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-500/10 shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:translate-x-1"
        }
      `}
    >
      {label}
    </NavLink>
  );
};

const ThemeButton = ({ active, onClick, icon: Icon, title }: any) => (
  <button
    onClick={onClick}
    title={title}
    className={`flex-1 flex justify-center items-center py-1.5 rounded-lg transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
      active
        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200/50 dark:ring-transparent"
        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
    }`}
  >
    <Icon size={16} className={active ? "scale-110" : ""} />
  </button>
);