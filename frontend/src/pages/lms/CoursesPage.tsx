import { useEffect, useState, useMemo } from 'react'
import { Search, BookOpen, ChevronDown, Compass, Layers, Filter } from 'lucide-react'
import { courseApi } from '../../api'
import CourseCard from '../../components/lms/course/CourseCard'
import { Spinner, EmptyState } from '../../components/lms/ui'
import { useCohort } from '../../context/CohortContext'
import type { Course } from '../../types'

const CATEGORIES = ['All', 'Web Dev', 'Backend', 'Data Science', 'Mobile', 'DevOps', 'DSA', 'System Design']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const { activeCohort, allCohorts, isLoading: isCohortLoading } = useCohort()
  const [courses, setCourses]     = useState<Course[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [difficulty, setDifficulty] = useState('All')

  const currentCohort = useMemo(() => 
    allCohorts.find(c => c.name === activeCohort),
    [allCohorts, activeCohort]
  )

  useEffect(() => {
    // We wait for cohorts to load before deciding what to do
    if (isCohortLoading) return;

    const load = async () => {
      setLoading(true)
      try {
        // Only pass cohortId if we actually have one
        const params: any = {}
        if (currentCohort?._id) params.cohortId = currentCohort._id;
        
        const res = await courseApi.getAll(params)
        setCourses(res.data.data ?? [])
      } catch (err) {
        console.error("Failed to load courses:", err)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [currentCohort?._id, activeCohort, isCohortLoading])

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
      
      // Strict Categorization Rule: Don't show Cyber in Web Dev/Full Stack
      const isWebDev = category === 'Web Dev' || (activeCohort?.toLowerCase().includes('full stack'))
      const isCyberCourse = c.category?.toLowerCase().includes('cyber') || c.tags?.some(t => t.toLowerCase().includes('cyber'))
      
      if (isWebDev && isCyberCourse) return false

      const matchCat  = category   === 'All' || c.category === category
      const matchDiff = difficulty === 'All' || c.difficulty === difficulty
      
      return matchSearch && matchCat && matchDiff
    })
  }, [courses, search, category, difficulty, activeCohort])


  return (
      <div className="mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Compass className="text-blue-600 dark:text-blue-500" size={32} />
              Course Catalog
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
              {loading ? 'Loading library...' : `Explore ${courses.length} courses to upgrade your skills`}
            </p>
          </div>
        </div>


        {/* Premium Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses by title, keywords..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            {/* Category Filter */}
            <div className="relative group min-w-[160px]">
              <Layers size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
              <select
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-11 pr-10 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Difficulty Filter */}
            <div className="relative group min-w-[160px]">
              <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none z-10" />
              <select
                className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-11 pr-10 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all cursor-pointer"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d === 'All' ? 'All Levels' : d}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Spinner size="lg" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading Catalog</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={<BookOpen size={48} />}
              title="No courses found"
              description="We couldn't find any courses matching your current search criteria."
              action={
                <button 
                  onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All') }} 
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors outline-none focus:ring-2 focus:ring-slate-500/40"
                >
                  Clear Filters
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(course => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
        
      </div>
  )
}