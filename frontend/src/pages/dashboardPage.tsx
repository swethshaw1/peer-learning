import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  ChevronRight,
  CalendarDays,
  Flame,
  Zap,
  ChevronDown,
  Users,
  Play,
  BookOpen,
  Target,
  Activity,
  LayoutGrid,
  Inbox,
  ChevronLeft,
  BarChart3,
  Layout,
  FolderKanban,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { useCohort } from "../context/CohortContext";
import { useAuthStore } from "../store/authStore";
import { useProject } from "../context/ProjectContext";
import { leaderboardApi, dashboardApi, courseApi } from "../api";
import { formatDate } from "../utils/helpers";

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeCohort, cohortData, isLoading: cohortLoading, refreshData: refreshCohort } = useCohort();
  const { user } = useAuthStore();
  const { projects, tasks, activities, isLoading: projectLoading, refreshData: refreshProjects } = useProject();

  // State
  const [leaders, setLeaders] = useState<any[]>([]);
  const [userRank, setUserRank] = useState<number | string>("...");
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<Record<string, number>>({});
  const [topicProgress, setTopicProgress] = useState<any>({});
  const [streak, setStreak] = useState(0);

  // New states for Unified Dashboard
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(4); 

  // Filter tasks to show only pending ones for the current user
  const pendingTasks = useMemo(() => {
    return tasks
      .filter(t => (t.status === 'todo' || t.status === 'in-progress' || t.status === 'revision') && 
                  (t.assigneeId as any)?._id === user?._id)
      .slice(0, 5);
  }, [tasks, user?._id]);

  useEffect(() => {
    refreshCohort();
    refreshProjects();

    if (!activeCohort || !user) return;

    const fetchDashboardData = async () => {
      try {
        const [leadRes, roomRes, actRes, dashRes, courseRes] = await Promise.all([
          leaderboardApi.getCohort(activeCohort),
          dashboardApi.getActiveRooms(),
          dashboardApi.getActivity(user._id),
          dashboardApi.getDashboardStats(user._id),
          courseApi.getMyCourses(),
        ]);

        if (leadRes.data?.success) {
          setLeaders(leadRes.data.data);
          const myRankObj = leadRes.data.data.find((u: any) => u.id === user._id);
          setUserRank(myRankObj ? myRankObj.rank : "Unranked");
        }
        if (roomRes.data?.success) setActiveRooms(roomRes.data.data);
        
        if (actRes.data?.success) {
          const activityMap: Record<string, number> = {};
          actRes.data.data.forEach((day: any) => { activityMap[day._id] = day.totalScore; });
          setActivityData(activityMap);

          // Calculate Streak
          let currentStreak = 0;
          const today = new Date();
          for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            if (activityMap[dateStr] > 0) currentStreak++;
            else if (i > 0) break;
          }
          setStreak(currentStreak);
        }

        if (dashRes.data?.success) setTopicProgress(dashRes.data.data);
        if (courseRes.data?.success) setEnrolledCourses(courseRes.data.data.slice(0, 3));

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, [refreshCohort, refreshProjects, activeCohort, user]);

  const displayTopics = useMemo(() => {
    return topicProgress[activeCohort]?.length > 0
      ? topicProgress[activeCohort]
      : cohortData[activeCohort] || [];
  }, [topicProgress, activeCohort, cohortData]);

  const stats = useMemo(() => {
    const total = displayTopics.length;
    let totalAccuracy = 0;
    displayTopics.forEach((t: any) => {
      if (t.totalQuestions > 0) totalAccuracy += (t.solvedQuestions / t.totalQuestions) * 100;
    });
    return {
      total,
      quizzesDone: displayTopics.filter((t: any) => t.solvedQuestions > 0).length,
      avgQuizScore: total > 0 ? Math.round(totalAccuracy / total) : 0,
    };
  }, [displayTopics]);

  if (cohortLoading || projectLoading) return <LoadingScreen />;

  return (
    <div className="mx-auto space-y-8 pb-12">
      <WelcomeBanner user={user} streak={streak} activeCohort={activeCohort} userRank={userRank} navigate={navigate} />

      <QuickStats stats={stats} userRank={userRank} enrolledCount={enrolledCourses.length} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left & Center Columns */}
        <div className="lg:col-span-2 space-y-8">
          <HeatmapWidget activityData={activityData} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LMSPreviewWidget courses={enrolledCourses} navigate={navigate} />
            <ProjectTasksWidget tasks={pendingTasks} navigate={navigate} />
          </div>

          <ActiveProjectsWidget projects={projects} navigate={navigate} />

          <ActivityLogWidget activities={activities} />

          <TopicBreakdownWidget displayTopics={displayTopics} visibleCount={visibleCount} setVisibleCount={setVisibleCount} stats={stats} navigate={navigate} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <ActiveLobbiesWidget activeRooms={activeRooms} navigate={navigate} />
          <LeaderboardWidget leaders={leaders} user={user} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}


// --- SUB-COMPONENTS ---

function WelcomeBanner({ user, streak, activeCohort, userRank, navigate }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 rounded-4xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-xs font-black tracking-widest uppercase">
            <Flame size={14} className="text-orange-400" /> {streak} Day Streak
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Welcome, {user?.name?.split(" ")[0]}!
          </h2>
          <p className="text-violet-100 max-w-xl font-medium text-lg leading-relaxed">
            You're currently in the <span className="text-white font-bold underline decoration-amber-400 underline-offset-4">{activeCohort}</span> track. Rank <span className="text-amber-300 font-black">#{userRank}</span>.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/learning")} className="bg-white text-violet-700 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2">
            <Play size={18} fill="currentColor" /> Continue Study
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function QuickStats({ stats, userRank, enrolledCount }: any) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={<LayoutGrid />} title="Curriculum" value={`${stats.quizzesDone}/${stats.total}`} subtitle="Modules Tracked" color="text-blue-500" bg="bg-blue-50 dark:bg-blue-500/10" />
      <StatCard icon={<Target />} title="Accuracy" value={`${stats.avgQuizScore}%`} subtitle="Avg Score" color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-500/10" />
      <StatCard icon={<BookOpen />} title="Courses" value={enrolledCount} subtitle="Active LMS" color="text-fuchsia-500" bg="bg-fuchsia-50 dark:bg-fuchsia-500/10" />
      <StatCard icon={<Trophy />} title="Rank" value={`#${userRank}`} subtitle="Cohort Standing" color="text-amber-500" bg="bg-amber-50 dark:bg-amber-500/10" />
    </div>
  );
}

function LMSPreviewWidget({ courses, navigate }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-lg flex items-center gap-2 text-slate-900 dark:text-white">
          <BookOpen className="text-fuchsia-500" size={20} /> My Courses
        </h3>
        <button onClick={() => navigate("/courses")} className="text-xs font-bold text-fuchsia-600">View All</button>
      </div>
      <div className="space-y-4">
        {courses.map((course: any) => (
          <div key={course._id} className="group cursor-pointer" onClick={() => navigate(`/courses/${course._id}`)}>
            <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-600 dark:text-slate-400">
              <span className="truncate pr-4">{course.title}</span>
              <span>{course.progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-fuchsia-500 transition-all duration-700" style={{ width: `${course.progressPercent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectTasksWidget({ tasks, navigate }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-lg flex items-center gap-2 text-slate-900 dark:text-white">
          <CheckCircle2 className="text-emerald-500" size={20} /> Action Items
        </h3>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No pending tasks</p>
        ) : (
          tasks.map((task: any) => (
            <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                task.status === 'revision' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                  {task.status === 'revision' ? <AlertTriangle size={16} /> : <Clock size={16} />}
              </div>
              <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{task.title}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Due {formatDate(task.dueDate)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActiveProjectsWidget({ projects, navigate }: any) {
  const activeProjects = projects.filter((p: any) => p.status === 'hiring' || p.status === 'in-progress').slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-4xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h3 className="font-black text-xl flex items-center gap-2 text-slate-900 dark:text-white">
          <FolderKanban className="text-blue-500" size={24} /> My Projects
        </h3>
        <button 
          onClick={() => navigate("/project")} 
          className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800"
        >
          Explore All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeProjects.length === 0 ? (
          <div className="col-span-1 md:col-span-3 text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
             <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100 dark:border-slate-700">
               <FolderKanban size={20} className="text-slate-400" />
             </div>
             <p className="text-sm font-bold text-slate-500">Not enrolled in any projects yet.</p>
             <button onClick={() => navigate("/project")} className="mt-3 text-xs font-black text-blue-600 uppercase tracking-widest">Browse Cohort Projects</button>
          </div>
        ) : (
          activeProjects.map((project: any) => (
            <div 
              key={project.id} 
              onClick={() => navigate(`/project/${project.id}`)}
              className="p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${project.status === 'hiring' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {project.status === 'hiring' ? 'Recruiting' : 'In Progress'}
                </span>
              </div>
              <h4 className="font-black text-slate-900 dark:text-white text-base mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.roles.filter((r: any) => r.assignedUserId).slice(0, 3).map((r: any, i: number) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-black shadow-sm overflow-hidden">
                       <div className="bg-blue-100 text-blue-600 w-full h-full flex items-center justify-center">
                        {i+1}
                       </div>
                    </div>
                  ))}
                  {project.maxParticipants > project.roles.filter((r: any) => r.assignedUserId).length && (
                     <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-black text-slate-500 shadow-sm">
                      +{project.maxParticipants - project.roles.filter((r: any) => r.assignedUserId).length}
                     </div>
                  )}
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActivityLogWidget({ activities }: { activities: any[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'hired': 
      case 'new_applicant': return <Users size={16} className="text-emerald-500" />;
      case 'submission': 
      case 'task_submitted': return <ExternalLink size={16} className="text-blue-500" />;
      case 'review': 
      case 'review_given': 
      case 'task_rejected': return <MessageSquare size={16} className="text-amber-500" />;
      case 'milestone_completed': return <Target size={16} className="text-fuchsia-500" />;
      default: return <Activity size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-lg flex items-center gap-2 text-slate-900 dark:text-white">
          <Activity className="text-blue-500" size={20} /> Actionable Activity
        </h3>
      </div>
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No recent activity</p>
        ) : (
          activities.slice(0, 5).map((act: any) => (
            <div key={act.id || act._id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
                {getActivityIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{act.type}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{formatDate(act.createdAt)}</p>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">{act.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{act.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


function StatCard({ icon, title, value, subtitle, color, bg }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between mb-4 text-slate-400">
        <p className="text-[10px] font-black uppercase tracking-widest">{title}</p>
        <div className={`p-2 rounded-xl ${bg} ${color}`}>{icon}</div>
      </div>
      <p className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{value}</p>
      <div className="text-xs font-bold text-slate-500">{subtitle}</div>
    </div>
  );
}

function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-violet-200 dark:border-violet-900/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-500 font-bold tracking-widest uppercase text-xs">Assembling Dashboard...</p>
        </div>
    );
}

function HeatmapWidget({ activityData }: any) {
  const [heatmapMode, setHeatmapMode] = useState<"month" | "year">("month");
  const [dateOffset, setDateOffset] = useState(0);

  const renderHeatmap = () => {
    const today = new Date();

    if (heatmapMode === "month") {
      const targetDate = new Date(
        today.getFullYear(),
        today.getMonth() - dateOffset,
        1,
      );
      const daysInMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0,
      ).getDate();
      const monthName = targetDate.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });

      const days = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(targetDate.getFullYear(), targetDate.getMonth(), i);
        const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const score = activityData[dateString] || 0;
        days.push({ date: d, dateString, score });
      }

      return (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {monthName}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setDateOffset((p) => p + 1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setDateOffset((p) => Math.max(0, p - 1))}
                disabled={dateOffset === 0}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 border border-slate-200 dark:border-slate-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(28px,1fr))] sm:grid-cols-7 md:grid-cols-10 gap-2">
            {days.map(({ date, dateString, score }) => {
              let colorClass =
                "bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700";
              if (score > 0 && score <= 5)
                colorClass =
                  "bg-violet-200 border-violet-300 dark:bg-violet-900/50 dark:border-violet-800";
              else if (score > 5 && score <= 15)
                colorClass = "bg-violet-400 border-violet-500";
              else if (score > 15)
                colorClass =
                  "bg-violet-600 border-violet-700 shadow-[0_0_10px_rgba(124,58,237,0.4)]";

              return (
                <div
                  key={dateString}
                  className={`relative aspect-square rounded-lg transition-all duration-300 hover:scale-110 hover:z-10 group cursor-pointer ${colorClass}`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-400 opacity-50 group-hover:opacity-0 transition-opacity">
                    {date.getDate()}
                  </span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                    {date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                    :{" "}
                    <span className="text-violet-400 dark:text-violet-600">
                      {score} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    } else {
      const targetYear = today.getFullYear() - dateOffset;
      const months = Array.from({ length: 12 }, (_, i) => {
        const monthPrefix = `${targetYear}-${String(i + 1).padStart(2, "0")}`;
        const monthlyScore = Object.keys(activityData)
          .filter((k) => k.startsWith(monthPrefix))
          .reduce((sum, key) => sum + activityData[key], 0);
        return {
          name: new Date(targetYear, i).toLocaleDateString(undefined, {
            month: "short",
          }),
          score: monthlyScore,
        };
      });

      const maxScore = Math.max(...months.map((m) => m.score), 1);

      return (
        <>
          <div className="flex items-center justify-between mb-6">
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {targetYear} Overview
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setDateOffset((p) => p + 1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setDateOffset((p) => Math.max(0, p - 1))}
                disabled={dateOffset === 0}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 border border-slate-200 dark:border-slate-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-end justify-between h-40 gap-2">
            {months.map(({ name, score }) => (
              <div
                key={name}
                className="flex-1 flex flex-col items-center gap-2 group relative"
              >
                <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-t-lg relative flex items-end overflow-hidden group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors h-32">
                  <div
                    className="w-full bg-linear-to-t from-violet-600 to-violet-400 rounded-t-sm transition-all duration-700 ease-out"
                    style={{ height: `${(score / maxScore) * 100}%` }}
                  />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    {score} pts
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-slate-900 rounded-4xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <CalendarDays className="text-violet-500" size={24} /> Performance
            Heatmap
          </h3>
          <p className="text-sm font-medium text-slate-500">
            Track your consistency and earned points over time.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl shrink-0 self-start">
          <button
            onClick={() => {
              setHeatmapMode("month");
              setDateOffset(0);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${heatmapMode === "month" ? "bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <Layout size={14} /> Month
          </button>
          <button
            onClick={() => {
              setHeatmapMode("year");
              setDateOffset(0);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${heatmapMode === "year" ? "bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
          >
            <BarChart3 size={14} /> Year
          </button>
        </div>
      </div>

      <div className="min-h-55">{renderHeatmap()}</div>

      {heatmapMode === "month" && (
        <div className="flex items-center justify-end gap-2 mt-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Less</span>
          <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="w-3 h-3 rounded bg-violet-200 dark:bg-violet-900/50" />
          <div className="w-3 h-3 rounded bg-violet-400" />
          <div className="w-3 h-3 rounded bg-violet-600 shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
          <span>More</span>
        </div>
      )}
    </motion.div>
  );
}

function TopicBreakdownWidget({
  displayTopics,
  visibleCount,
  setVisibleCount,
  stats,
  navigate,
}: any) {
  const visibleTopics = displayTopics.slice(0, visibleCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-4xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
        <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="text-violet-500" size={24} /> Module Breakdown
        </h3>
        <span className="text-xs font-black tracking-widest uppercase text-violet-600 bg-violet-50 dark:bg-violet-900/20 px-4 py-1.5 rounded-full border border-violet-100 dark:border-violet-800/50">
          {stats.total} Tracks
        </span>
      </div>

      <div className="space-y-4">
        {visibleTopics.length > 0 ? (
          <>
            {visibleTopics.map((topic: any) => {
              const theoryWidth =
                topic.theoryCompleted || topic.isRead ? 100 : 0;
              const totalQ = topic.totalQuestions || 0;
              const solvedQ = topic.solvedQuestions || 0;
              const quizWidth =
                totalQ > 0 ? Math.round((solvedQ / totalQ) * 100) : 0;

              return (
                <div
                  key={topic._id}
                  className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-center mb-5">
                    <span className="font-black text-slate-800 dark:text-slate-200 text-lg group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {topic.title}
                    </span>
                    <button
                      onClick={() => navigate(`/config/${topic._id}`)}
                      className="text-slate-500 hover:text-white text-sm font-bold flex items-center transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-violet-600 hover:border-violet-600 dark:hover:bg-violet-500 px-4 py-2 rounded-xl shadow-sm"
                    >
                      Practice <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                        <span>Theory Mastery</span>
                        <span
                          className={
                            theoryWidth === 100 ? "text-emerald-500" : ""
                          }
                        >
                          {theoryWidth}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/50">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                          style={{ width: `${theoryWidth}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
                        <span>Quiz Accuracy</span>
                        <span
                          className={quizWidth >= 80 ? "text-violet-500" : ""}
                        >
                          {quizWidth}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/50">
                        <div
                          className="h-full bg-linear-to-r from-violet-400 to-violet-600 rounded-full transition-all duration-1000"
                          style={{ width: `${quizWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <AnimatePresence>
              {visibleCount < displayTopics.length && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-4 flex justify-center"
                >
                  <button
                    onClick={() => setVisibleCount((prev: number) => prev + 4)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    Show More Modules <ChevronDown size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <Inbox size={24} className="text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-bold text-lg">
              No curriculum assigned yet.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Select a different cohort or check back later.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ActiveLobbiesWidget({ activeRooms, navigate }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-slate-900 rounded-4xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="text-amber-500" size={24} fill="currentColor" />{" "}
          Active Lobbies
        </h3>
        {activeRooms.length > 0 && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      <div className="space-y-3">
        {activeRooms.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <Users
              size={32}
              className="mx-auto text-slate-300 dark:text-slate-600 mb-3"
            />
            <p className="text-sm font-bold text-slate-500 mb-4">
              The arena is quiet right now.
            </p>
            <button
              onClick={() => navigate("/peer-quiz")}
              className="w-full py-3 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 rounded-xl text-sm font-black hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors uppercase tracking-widest border border-violet-200 dark:border-violet-800/50"
            >
              Host a Session
            </button>
          </div>
        ) : (
          activeRooms.slice(0, 3).map((room: any) => (
            <div
              key={room._id}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <p className="font-black text-base text-slate-800 dark:text-slate-200 truncate pr-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {room.topicId?.title || "Custom Assesment"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Host: {room.hostId?.name?.split(" ")[0] || "Peer"}
                </p>
                <button
                  onClick={() => navigate(`/peer-quiz?join=${room.code}`)}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-xl text-xs font-bold hover:bg-violet-600 dark:hover:bg-violet-500 hover:text-white transition-all hover:-translate-y-0.5 shadow-md flex items-center gap-1"
                >
                  <Play size={12} fill="currentColor" /> Enter
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function LeaderboardWidget({ leaders, user, navigate }: any) {
  const top3 = leaders.slice(0, 3);
  const myRankObj = leaders.find((l: any) => l.id === user?._id);
  const amIInTop3 = top3.some((l: any) => l.id === user?._id);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-slate-900 rounded-4xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <h3 className="font-black text-xl text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Trophy className="text-amber-500" size={24} /> Top Performers
      </h3>
      <div className="space-y-3">
        {leaders.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <Trophy
              size={32}
              className="mx-auto text-slate-300 dark:text-slate-600 mb-3"
            />
            <p className="text-sm font-bold text-slate-500">
              Leaderboard is waiting to be conquered.
            </p>
          </div>
        ) : (
          <>
            {top3.map((leader: any, index: number) => {
              const rank = index + 1;
              return (
                <div
                  key={leader.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-md ${
                        rank === 1
                          ? "bg-linear-to-br from-amber-300 to-amber-500 text-white ring-2 ring-amber-200 dark:ring-amber-900"
                          : rank === 2
                            ? "bg-linear-to-br from-slate-300 to-slate-400 text-white"
                            : "bg-linear-to-br from-orange-300 to-orange-500 text-white"
                      }`}
                    >
                      #{rank}
                    </div>
                    <div>
                      <span className="font-black text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {leader.name}{" "}
                        {leader.id === user?._id && (
                          <span className="text-[9px] bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 px-2 py-0.5 rounded-full uppercase tracking-widest border border-violet-200 dark:border-violet-700/50">
                            You
                          </span>
                        )}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {leader.points} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {!amIInTop3 && myRankObj && (
              <>
                <div className="flex justify-center py-1">
                  <div className="w-1 bg-slate-200 dark:bg-slate-700 h-1 rounded-full my-0.5"></div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-violet-50/50 dark:bg-violet-900/20 border border-violet-200/50 dark:border-violet-800/50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-sm bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      #{myRankObj.rank}
                    </div>
                    <div>
                      <span className="font-black text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {myRankObj.name}{" "}
                        <span className="text-[9px] bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 px-2 py-0.5 rounded-full uppercase tracking-widest border border-violet-200 dark:border-violet-700/50">
                          You
                        </span>
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {myRankObj.points} XP
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={() => navigate("/leaderboard")}
            className="w-full py-3.5 text-center text-sm font-black tracking-widest uppercase text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
          >
            View Global Ranks
          </button>
        </div>
      </div>
    </motion.div>
  );
}
