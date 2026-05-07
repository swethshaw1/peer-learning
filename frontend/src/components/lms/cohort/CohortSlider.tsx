import { motion } from 'framer-motion'
import { useCohort } from '../../../context/CohortContext'
import { Users, CheckCircle2 } from 'lucide-react'

export default function CohortSlider() {
  const { activeCohort, setActiveCohort, cohorts } = useCohort()

  if (cohorts.length === 0) return null

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {cohorts.map((cohort) => {
        const isActive = activeCohort === cohort.name
        return (
          <motion.button
            key={cohort._id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveCohort(cohort.name)}
            className={`
              relative flex flex-col items-start min-w-[200px] p-4 rounded-2xl border transition-all duration-300
              ${isActive 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }
            `}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <Users size={18} className={isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white/20 rounded-full p-0.5"
                >
                  <CheckCircle2 size={14} />
                </motion.div>
              )}
            </div>
            
            <h4 className={`text-sm font-black truncate w-full ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              {cohort.name}
            </h4>
            <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
              {cohort.activeMembers || 0} Peers Active
            </p>

            {isActive && (
              <motion.div
                layoutId="active-glow"
                className="absolute inset-0 bg-white/10 rounded-2xl pointer-events-none"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
