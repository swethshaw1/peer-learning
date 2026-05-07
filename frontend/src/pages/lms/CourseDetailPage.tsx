import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, Play, FileText, Link as LinkIcon,
  CheckCircle2, Circle, ChevronDown, ChevronRight, Sparkles,
  Clock, Layers, ShieldCheck, LayoutDashboard, Trophy
} from 'lucide-react'
import { courseApi } from '../../api'
import { Progress, DifficultyBadge, Tag, Spinner } from '../../components/lms/ui'
import toast from 'react-hot-toast'
import type { Course, Module } from '../../types'
import { MOCK_COURSES } from '../../lib/mockData'

const typeIcon = (type: string) => {
  if (type === 'video') return <Play size={14} className="text-blue-400" />
  if (type === 'article') return <FileText size={14} className="text-violet-400" />
  return <LinkIcon size={14} className="text-emerald-400" />
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [openModules, setOpenModules] = useState<Set<string>>(new Set())

  useEffect(() => {
    const load = async () => {
      try {
        const res = await courseApi.getById(id!)
        setCourse(res.data.data)
        if (res.data.data.modules?.[0]) setOpenModules(new Set([res.data.data.modules[0]._id]))
      } catch {
        const found = MOCK_COURSES.find(c => c._id === id) ?? MOCK_COURSES[0]
        setCourse(found)
        if (found.modules?.[0]) setOpenModules(new Set([found.modules[0]._id]))
      } finally { setLoading(false) }
    }
    load()
  }, [id])

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await courseApi.enroll(id!)
      setCourse(prev => prev ? { ...prev, isEnrolled: true } : prev)
      toast.success('Enrollment confirmed')
    } catch {
      toast.error('Enrollment failed')
    } finally { setEnrolling(false) }
  }

  const toggleModule = (mid: string) =>
    setOpenModules(prev => {
      const next = new Set(prev)
      next.has(mid) ? next.delete(mid) : next.add(mid)
      return next
    })

  const handleCompleteLesson = async (lessonId: string) => {
    if (!course) return
    try {
      const res = await courseApi.completeLesson(course._id, lessonId)
      const { progressPercent, completedLessons } = res.data.data

      setCourse(prev => {
        if (!prev) return prev
        return {
          ...prev,
          progressPercent,
          completedLessons,
          modules: prev.modules.map(m => ({
            ...m,
            lessons: m.lessons.map(l =>
              l._id === lessonId ? { ...l, isCompleted: true } : l
            )
          }))
        }
      })
      toast.success('Progress saved')
    } catch {
      toast.error('Sync failed')
    }
  }

  if (loading) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>
  if (!course) return <div className="flex h-96 items-center justify-center text-slate-500 font-medium">Course not discovered</div>

  return (
    <div className="mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/courses')} 
        className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Back to Library
      </button>

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 dark:from-blue-500/10 dark:to-indigo-500/5" />
        
        <div className="relative p-8 md:p-10 flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <DifficultyBadge level={course.difficulty} />
              <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">{course.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {course.tags?.map(t => (
                <span key={t} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-bold rounded-full border border-slate-200 dark:border-slate-700">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Layers size={16} className="text-blue-500" />
                <span>{course.totalModules} Modules</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Play size={16} className="text-blue-500" />
                <span>{course.totalLessons} Lessons</span>
              </div>
            </div>
          </div>

          <div className="lg:w-80 shrink-0">
            <div className="h-full rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-6 border border-slate-200/50 dark:border-slate-700/50">
              {course.progressPercent === 100 ? (
                <div className="space-y-5">
                   <div className="flex flex-col items-center text-center p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                      <div className="h-16 w-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                         <Trophy size={32} />
                      </div>
                      <h4 className="text-lg font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">Course Completed</h4>
                      <p className="text-xs font-bold text-emerald-600/80 mt-1">Excellent work, pioneer!</p>
                   </div>
                   <button className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 transition-all">
                    Review Curriculum
                  </button>
                </div>
              ) : course.isEnrolled ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Your Progress</span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">{course.progressPercent}%</span>
                  </div>
                  <Progress value={course.progressPercent ?? 0} className="h-3 bg-slate-200 dark:bg-slate-700" indicatorClassName="bg-blue-600" />
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>{course.completedLessons ?? 0} of {course.totalLessons} tasks finished</span>
                  </div>
                  <button className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 transition-all">
                    Continue Module
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <ShieldCheck size={20} />
                      <span className="text-sm font-bold">Lifetime Access</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Join the cohort to start peer-reviewing and earn points for your portfolio.</p>
                  </div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-95 disabled:opacity-50"
                  >
                    {enrolling ? <Loader2 size={20} className="animate-spin" /> : (
                      <>
                        <Sparkles size={18} />
                        Enroll in Course
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-blue-500" size={24} />
            Curriculum
          </h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {course.totalLessons} Lessons Total
          </span>
        </div>

        <div className="space-y-4 relative">
          {!course.isEnrolled && (
            <div className="absolute inset-0 z-10 bg-slate-50/20 dark:bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-center max-w-sm mx-4">
                  <ShieldCheck size={40} className="text-blue-500 mx-auto mb-4" />
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">Enrollment Required</h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                    You need to be enrolled in this course to access the lessons and track your progress.
                  </p>
                  <button 
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
               </div>
            </div>
          )}

          {course.modules.map((mod: Module) => {
            const isOpen = openModules.has(mod._id)
            const completedCount = mod.lessons.filter(l => l.isCompleted).length
            const progress = mod.lessons.length ? (completedCount / mod.lessons.length) * 100 : 0

            return (
              <div 
                key={mod._id} 
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen 
                  ? 'border-blue-500/30 bg-white dark:bg-slate-900 shadow-md shadow-blue-500/5' 
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 hover:bg-white dark:hover:bg-slate-800/40'
                }`}
              >
                <button
                  onClick={() => toggleModule(mod._id)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      isOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                      {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`text-base font-bold truncate ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                        {mod.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                           {completedCount}/{mod.lessons.length} Completed
                         </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-4 shrink-0 ml-4">
                    <div className="w-24">
                      <Progress value={progress} className="h-1.5" indicatorClassName="bg-blue-600" />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="bg-slate-50/50 dark:bg-black/10 px-2 pb-2">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y dark:divide-slate-800">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson._id}
                          className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 group"
                        >
                          <button
                            onClick={() => !lesson.isCompleted && course.isEnrolled && handleCompleteLesson(lesson._id)}
                            className={`shrink-0 transition-all transform active:scale-90 ${
                              lesson.isCompleted ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600 hover:text-blue-500'
                            }`}
                            disabled={!course.isEnrolled || lesson.isCompleted}
                          >
                            {lesson.isCompleted ? <CheckCircle2 size={22} strokeWidth={2.5} /> : <Circle size={22} strokeWidth={2.5} />}
                          </button>

                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="shrink-0 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                              {typeIcon(lesson.type)}
                            </div>
                            <span className={`text-sm font-semibold truncate ${
                              lesson.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {lesson.title}
                            </span>
                          </div>

                          {lesson.duration && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 shrink-0">
                              <Clock size={12} />
                              <span>{lesson.duration}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Loader2({ size, className }: { size: number, className?: string }) {
  return <div className={`animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 ${className}`} style={{ height: size, width: size }} />
}