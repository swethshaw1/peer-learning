import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock, Layers, ArrowRight, Bookmark, CheckCircle2 } from 'lucide-react'
import { Progress, DifficultyBadge, Tag } from '../../lms/ui'
import { bookmarkApi } from '../../../api'
import type { Course } from '../../../types'
import { toast } from 'react-hot-toast'

export default function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(course.isBookmarked ?? false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  const handleNavigation = () => {
    navigate(`/courses/${course._id}`)
  }

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (bookmarkLoading) return
    
    setBookmarkLoading(true)
    try {
      if (isBookmarked) {
        await bookmarkApi.remove(course._id)
        setIsBookmarked(false)
        toast.success('Removed from bookmarks')
      } else {
        await bookmarkApi.add(course._id)
        setIsBookmarked(true)
        toast.success('Added to bookmarks')
      }
    } catch (err) {
      toast.error('Failed to update bookmark')
    } finally {
      setBookmarkLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNavigation()
    }
  }

  return (
    <div
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View course: ${course.title}`}
      className="group relative flex flex-col h-full bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 cursor-pointer transition-all duration-300 ease-out hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {/* Thumbnail Container */}
      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center shrink-0 mb-4 mask-image">
        {course.thumbnail ? (
          <>
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800 flex flex-col items-center justify-center gap-2">
            <BookOpen size={32} className="text-slate-400 dark:text-slate-500/50" />
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <DifficultyBadge level={course.difficulty} />
        </div>

        <button
          onClick={toggleBookmark}
          disabled={bookmarkLoading}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all duration-300 ${
            isBookmarked 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
          } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} className={bookmarkLoading ? 'animate-pulse' : ''} />
        </button>
        
        {course.isEnrolled && (
          <div className="absolute bottom-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-md shadow-sm border border-transparent">
            {course.progressPercent === 100 ? (
              <span className="flex items-center gap-1 text-[11px] font-black tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={12} />
                Completed
              </span>
            ) : (
              <span className="text-[11px] font-bold tracking-wide uppercase text-blue-700 dark:text-blue-400">
                Enrolled
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4 flex-1">
          {course.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <Layers size={14} className="text-slate-400 dark:text-slate-500" />
            <span>{course.totalModules} Modules</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400 dark:text-slate-500" />
            <span>{course.totalLessons} Lessons</span>
          </div>
        </div>

        {/* Tags */}
        {course.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {course.tags.slice(0, 3).map(tag => (
              <Tag key={tag} label={tag} />
            ))}
            {course.tags.length > 3 && (
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center">
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Area (Progress & CTA) */}
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
        {course.isEnrolled && course.progressPercent !== undefined && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
              <span className="text-slate-500 dark:text-slate-400">Course Progress</span>
              <span className={course.progressPercent === 100 ? 'text-emerald-600' : 'text-blue-600 dark:text-blue-400'}>
                {course.progressPercent}%
              </span>
            </div>
            <Progress 
              value={course.progressPercent} 
              className="h-1.5 bg-slate-100 dark:bg-slate-800" 
              indicatorClassName={course.progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'}
            />
          </div>
        )}

        <button 
          tabIndex={-1} 
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
            ${course.progressPercent === 100
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
              : course.isEnrolled 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 dark:shadow-blue-900/20' 
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 group-hover:border-blue-500/30 group-hover:text-blue-700 dark:group-hover:text-blue-400'
            }
          `}
        >
          <span>
            {course.progressPercent === 100 ? 'Review Course' : course.isEnrolled ? 'Continue Learning' : 'View Course Details'}
          </span>
          <ArrowRight 
            size={16} 
            className={`transition-transform duration-300 ${course.isEnrolled ? 'group-hover:translate-x-1' : ''}`} 
          />
        </button>

      </div>
    </div>
  )
}