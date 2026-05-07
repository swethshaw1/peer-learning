import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  Trophy, 
  TrendingUp, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Compass,
  Calendar,
  CheckCircle2,
  Layers
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { courseApi, cohortApi, dashboardApi } from '../../api'
import { SectionHeader, Progress, DifficultyBadge, Skeleton, Avatar } from '../../components/lms/ui'
import type { Course, Cohort, UserActivity } from '../../types'
import { useCohort } from '../../context/CohortContext'

export default function DashboardPage() {
  const { user, fetchMe } = useAuthStore()
  const { activeCohort, cohorts, allCohorts } = useCohort()
  const navigate = useNavigate()

  const [myCourses, setMyCourses]         = useState<Course[]>([])
  const [myCohorts, setMyCohorts]         = useState<Cohort[]>([])
  const [cohortCoursesCount, setCohortCoursesCount] = useState(0)
  const [lmsActivity, setLmsActivity] = useState<any[]>([])
  const [weeklyChart, setWeeklyChart] = useState<number[]>([0,0,0,0,0,0,0])
  const [performance, setPerformance] = useState({ streak: 0, weeklyTotal: 0 })
  const [loading, setLoading]         = useState(true)

  const currentCohort = allCohorts.find(c => c.name === activeCohort)

  useEffect(() => {
    const load = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true)
        const currentCohortId = allCohorts.find(c => c.name === activeCohort)?._id
        const res = await dashboardApi.getSummary(currentCohortId)
        const d = res.data.data

        setMyCourses(d.myCourses ?? [])
        setCohortCoursesCount(d.cohortCoursesCount ?? 0)
        setLmsActivity(d.activities ?? [])
        setWeeklyChart(d.chart ?? [0,0,0,0,0,0,0])
        setPerformance({
          streak: d.streak ?? 0,
          weeklyTotal: d.weeklyTotal ?? 0
        })
        setMyCohorts(cohorts)
      } catch (err) {
        console.error("Dashboard summary fetch failed:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?._id, activeCohort, cohorts]);

  const totalCompleted  = myCourses.filter(c => (c.progressPercent ?? 0) === 100).length
  
  const stats = [
    { label: 'My Courses',      value: myCourses.length,    icon: BookOpen,   color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Available Units', value: cohortCoursesCount, icon: Layers,     color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10' },
    { label: 'Completed',         value: totalCompleted,    icon: Trophy,     color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Learning Points',   value: user?.points ?? 0, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ]

  const resumeCourse = [...myCourses].sort((a, b) =>
    (b.progressPercent ?? 0) - (a.progressPercent ?? 0)
  ).find(c => (c.progressPercent ?? 0) > 0 && (c.progressPercent ?? 0) < 100)

  return (
    <div className="mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{user?.name?.split(' ')[0] ?? 'Learner'}</span>
            <Sparkles className="text-amber-500 animate-pulse" size={28} />
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg font-medium mt-1.5">
            You've earned <span className="text-blue-600 dark:text-blue-400 font-bold">{user?.points ?? 0} points</span> so far. Keep it up!
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Active Session</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 group">
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${bg} mb-5 group-hover:scale-110 transition-transform`}>
              <Icon size={28} className={color} />
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</p>
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-[0.2em]">{label}</p>
          </div>
        ))}
      </div>

      {/* Resume Banner */}
      {resumeCourse && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/courses/${resumeCourse._id}`)}
          className="group relative overflow-hidden bg-slate-900 dark:bg-blue-900/20 border border-slate-800 dark:border-blue-500/20 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8 cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => navigate(`/courses/${resumeCourse._id}`)}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-blue-600/20 transition-colors" />
          <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-600/40 group-hover:scale-110 transition-transform duration-500">
            <Play size={32} className="fill-white translate-x-0.5" />
          </div>
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-500/30">Continue Learning</span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">{resumeCourse.category}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white truncate mb-4 tracking-tight">{resumeCourse.title}</h3>
            <div className="flex items-center gap-6 max-w-xl">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Course Progress</span>
                   <span className="text-sm text-blue-400 font-black">{resumeCourse.progressPercent}%</span>
                </div>
                <Progress 
                  value={resumeCourse.progressPercent ?? 0} 
                  className="h-2.5 bg-white/5 border border-white/10" 
                  indicatorClassName="bg-gradient-to-r from-blue-600 to-indigo-500" 
                />
              </div>
            </div>
          </div>
          <div className="relative hidden md:flex items-center justify-center h-16 w-16 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
            <ArrowRight size={28} className="text-white group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-2 space-y-8">
          <SectionHeader
            title="My Learning Path"
            subtitle={`${myCourses.length} courses in your library`}
            action={
              <button 
                onClick={() => navigate('/courses')} 
                className="group flex items-center gap-2 px-5 py-2.5 text-sm font-black text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20"
              >
                Explore More <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            }
          />

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
            </div>
          ) : myCourses.length === 0 ? (
            <div className="bg-white dark:bg-[#0F172A] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-16 text-center flex flex-col items-center">
              <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                <Compass size={40} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Ready to start?</h4>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-8 font-medium leading-relaxed">Join a course to begin your journey toward mastery and earn your first badges.</p>
              <button 
                onClick={() => navigate('/courses')} 
                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-base font-black rounded-2xl transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:-translate-y-1 active:scale-95"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid gap-5">
              {myCourses.slice(0, 6).map(course => (
                <div
                  key={course._id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/courses/${course._id}`)}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="group flex flex-col sm:flex-row sm:items-center gap-6 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 cursor-pointer hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1.5 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <BookOpen size={32} className="text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <DifficultyBadge level={course.difficulty} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{course.category}</span>
                    </div>
                    <h4 className="font-black text-slate-900 dark:text-white text-xl truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-4">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-4">
                      <Progress value={course.progressPercent ?? 0} className="flex-1 h-2 bg-slate-100 dark:bg-slate-800" />
                      <span className="text-xs font-black text-slate-600 dark:text-slate-400 flex-shrink-0 w-10 text-right">
                        {course.progressPercent ?? 0}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Badges Showcase */}
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
            <SectionHeader
              title="My Achievements"
              subtitle={`${user?.badges?.length || 0} badges earned`}
              action={
                <button className="text-sm font-black text-blue-600 dark:text-blue-400 hover:underline">
                  View All
                </button>
              }
            />
            {user?.badges && user.badges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {user.badges.slice(0, 4).map((badge: any) => (
                  <div key={badge._id} className="flex flex-col items-center p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:scale-105 transition-transform">
                    <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-inner mb-3" style={{ backgroundColor: badge.color + '20', color: badge.color }}>
                      {badge.icon || '🏆'}
                    </div>
                    <span className="text-[10px] font-black text-slate-900 dark:text-white text-center uppercase tracking-wider">{badge.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 py-10 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-400">Complete courses to earn your first badge!</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"></div>
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-[0.1em]">Recent Performance</h3>
               <Trophy className="text-amber-500" size={24} />
                        </div>
            <div className="space-y-6">
               <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Score</p>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-600">
                    {(user?.points ?? 0).toLocaleString()}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase">
                    <div className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                      <Sparkles size={12} />
                      <span>{performance.streak} Day Streak</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <TrendingUp size={12} />
                      <span>Top 5%</span>
                    </div>
                  </div>
               </div>

               {/* Weekly Activity Chart (Simplified) */}
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Weekly Activity</p>
                  <div className="flex items-end justify-between gap-1 h-20 px-1">
                     {weeklyChart.map((h, i) => (
                       <div key={i} className="flex-1 group relative">
                         <div 
                           className="w-full bg-blue-500/20 dark:bg-blue-500/10 rounded-t-lg group-hover:bg-blue-500 transition-all duration-300" 
                           style={{ height: `${Math.max(h, 5)}%` }}
                         ></div>
                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[8px] px-1.5 py-0.5 rounded transition-opacity">
                            {h}%
                         </div>
                       </div>
                     ))}
                  </div>
                  <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-tighter px-1">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
               </div>

               <div className="space-y-3 pt-2">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Learning Activity</p>
                    <div className="space-y-3">
                       {lmsActivity.length > 0 ? lmsActivity.map((act, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-colors">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                               <CheckCircle2 size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{act.title}</p>
                               <p className="text-[10px] text-slate-500 font-medium">{act.detail}</p>
                            </div>
                         </div>
                       )) : (
                         <div className="flex items-center gap-3 p-3 bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500">
                               <CheckCircle2 size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="text-xs font-bold text-slate-900 dark:text-white truncate">LMS Profile Active</p>
                               <p className="text-[10px] text-slate-500 font-medium">Tracking your progress...</p>
                            </div>
                         </div>
                       )}
                    </div>
               </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm">
            <SectionHeader
              title="My Cohorts"
              action={
                <button 
                  onClick={() => navigate('/cohorts')} 
                  className="p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all"
                  aria-label="View all cohorts"
                >
                  <ArrowRight size={22} />
                </button>
              }
            />
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
              </div>
            ) : myCohorts.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">No active cohorts</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {myCohorts.map(cohort => (
                  <div
                    key={cohort._id}
                    onClick={() => navigate(`/cohorts/${cohort._id}`)}
                    className="group flex flex-col p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer hover:border-violet-500/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all duration-300"
                  >
                    <h4 className="font-black text-slate-900 dark:text-white text-base truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-4">{cohort.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={cohort.mentor?.name || "Mentor"} size="sm" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{cohort.mentor?.name || "Mentor"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}