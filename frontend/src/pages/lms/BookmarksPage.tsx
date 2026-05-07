import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Compass, ArrowRight } from 'lucide-react'
import { bookmarkApi } from '../../api'
import CourseCard from '../../components/lms/course/CourseCard'
import { Spinner, EmptyState } from '../../components/lms/ui'
import type { Course } from '../../types'

export default function BookmarksPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    bookmarkApi.getAll()
      .then(r => setCourses(r.data.data ?? []))
      .catch((err) => {
        console.error("Failed to load bookmarks:", err)
        setCourses([])
      })
      .finally(() => setLoading(false))
  }, [])


  return (
      <div className="mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Bookmark className="text-blue-600 dark:text-blue-500 fill-blue-600/10" size={32} />
              My Bookmarks
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
              {loading ? 'Retrieving your list...' : `You have ${courses.length} courses saved for later`}
            </p>
          </div>
          
          {!loading && courses.length > 0 && (
            <button 
              onClick={() => navigate('/courses')}
              className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
            >
              Discover More <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Spinner size="lg" />
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
              Syncing Bookmarks
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-12 animate-in fade-in zoom-in-95 duration-500">
            <EmptyState
              icon={<Compass size={48} className="text-slate-300 dark:text-slate-600" />}
              title="Your library is empty"
              description="You haven't bookmarked any courses yet. Explore our catalog to find topics that interest you."
              action={
                <button 
                  onClick={() => navigate('/courses')} 
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
                >
                  Browse Courses
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {courses.map((course, index) => (
              <div 
                key={course._id} 
                className="transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CourseCard course={{ ...course, isBookmarked: true }} />
              </div>
            ))}
          </div>
        )}
        
      </div>
  )
}