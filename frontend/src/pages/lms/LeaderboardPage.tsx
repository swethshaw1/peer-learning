import { useEffect, useState } from 'react'
import { leaderboardApi } from '../../api'
import { Avatar, Spinner } from '../../components/lms/ui'
import { useAuthStore } from '../../store/authStore'
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react'
import type { LeaderboardEntry } from '../../types'
import { MOCK_LEADERBOARD } from '../../lib/mockData'

const medalColors = ['text-amber-400', 'text-slate-300', 'text-amber-700']
const rankBg = ['bg-amber-500/10 border-amber-500/30', 'bg-slate-500/10 border-slate-500/30', 'bg-amber-700/10 border-amber-700/30']

const medalIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="text-amber-400" size={28} />
  if (rank === 2) return <Medal className="text-slate-300" size={24} />
  if (rank === 3) return <Medal className="text-amber-700" size={24} />
  return <span className="text-sm font-bold text-slate-500">#{rank}</span>
}

import { useCohort } from '../../context/CohortContext'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const { activeCohort, cohorts } = useCohort()

  useEffect(() => {
    setLoading(true)
    const currentCohort = cohorts.find(c => c.name === activeCohort)
    
    const fetchPromise = currentCohort?._id 
      ? leaderboardApi.getCohort(currentCohort._id)
      : leaderboardApi.getGlobal()

    fetchPromise
      .then(r => { 
        const d = r.data.data ?? []
        setEntries(d.length ? d : MOCK_LEADERBOARD) 
      })
      .catch(() => setEntries(MOCK_LEADERBOARD))
      .finally(() => setLoading(false))
  }, [activeCohort, cohorts])

  const myEntry = entries.find(e => e.user.name === user?.name)

  return (
    <div className="mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-amber-500" size={32} />
            Leaderboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Top performers in the current cohort
          </p>
        </div>
        
        {myEntry && (
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-4 py-2 rounded-2xl flex items-center gap-3">
            <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
              Your Rank: #{myEntry.rank}
            </span>
          </div>
        )}
      </div>

      {/* Podium (Top 3) */}
      {!loading && entries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          {[entries[1], entries[0], entries[2]].map((entry, i) => {
            const displayRank = i === 0 ? 2 : i === 1 ? 1 : 3
            const isFirst = displayRank === 1
            
            return (
              <div 
                key={entry.user._id} 
                className={`
                  relative bg-white dark:bg-slate-900 border-2 rounded-3xl p-6 text-center flex flex-col items-center gap-4 transition-all duration-300
                  ${displayRank === 1 ? 'border-amber-400 shadow-xl shadow-amber-500/10 order-1 md:order-2 md:-translate-y-4 py-10' : ''}
                  ${displayRank === 2 ? 'border-slate-200 dark:border-slate-800 order-2 md:order-1' : ''}
                  ${displayRank === 3 ? 'border-slate-200 dark:border-slate-800 order-3 md:order-3' : ''}
                `}
              >
                <div className="absolute -top-6">
                  <div className={`p-3 rounded-2xl shadow-lg bg-white dark:bg-slate-800 border-2 ${displayRank === 1 ? 'border-amber-400' : 'border-slate-200 dark:border-slate-700'}`}>
                    {medalIcon(displayRank)}
                  </div>
                </div>

                <div className="relative">
                  <div className="ring-4 ring-white dark:ring-slate-900 shadow-md rounded-full">
                    <Avatar name={entry.user.name} src={entry.user.avatar} size={isFirst ? 'lg' : 'md'} />
                  </div>
                  {isFirst && <Star className="absolute -right-2 -top-2 text-amber-400 fill-amber-400" size={20} />}
                </div>

                <div className="space-y-1">
                  <p className="font-black text-slate-900 dark:text-white text-lg truncate max-w-[150px]">
                    {entry.user.name}
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-blue-600 dark:text-blue-400 font-black text-xl">
                      {entry.points.toLocaleString()}
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 w-full gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{entry.coursesCompleted}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{entry.badges}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Badges</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full Leaderboard Table */}
      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[80px_1fr_120px_120px_100px] px-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.15em]">
            <span>Rank</span>
            <span>Learner</span>
            <span className="text-right">Points</span>
            <span className="text-right">Courses</span>
            <span className="text-right">Badges</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.map((entry) => {
              const isMe = entry.user.name === user?.name
              const isTopThree = entry.rank <= 3

              return (
                <div
                  key={entry.user._id}
                  className={`
                    grid grid-cols-[50px_1fr_80px] md:grid-cols-[80px_1fr_120px_120px_100px] items-center px-6 md:px-8 py-4 transition-all
                    ${isMe ? 'bg-blue-50/50 dark:bg-blue-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}
                  `}
                >
                  <div className="flex items-center">
                    {isTopThree ? (
                      <div className="md:pl-1">{medalIcon(entry.rank)}</div>
                    ) : (
                      <span className="text-sm font-black text-slate-400 md:pl-2">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 min-w-0">
                    <div className="hidden sm:block">
                      <Avatar name={entry.user.name} src={entry.user.avatar} size="sm" />
                    </div>
                    <div className="truncate">
                      <p className={`text-sm font-bold truncate ${isMe ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                        {entry.user.name}
                      </p>
                      {isMe && <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-tighter">It's You</span>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <TrendingUp size={14} className="text-emerald-500" />
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        {entry.points.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Learning Points</p>
                  </div>

                  <span className="hidden md:block text-right text-sm font-bold text-slate-600 dark:text-slate-400">
                    {entry.coursesCompleted}
                  </span>
                  
                  <div className="hidden md:flex justify-end gap-1 text-slate-400">
                    <Award size={18} />
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{entry.badges}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}