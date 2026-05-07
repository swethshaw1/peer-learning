import { useNavigate } from 'react-router-dom'
import { MessageSquare, ThumbsUp, Eye } from 'lucide-react'
import { Avatar, Tag } from '../ui'
import type { DiscussionPost } from '../../../types'

export default function DiscussionCard({ post }: { post: DiscussionPost }) {
  const navigate = useNavigate()

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    const mins = Math.floor(diff / 60000)
    
    if (mins < 1) return 'Just now'
    if (mins < 60) return mins === 1 ? '1m ago' : `${mins}m ago`
    
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return hrs === 1 ? '1h ago' : `${hrs}h ago`
    
    const days = Math.floor(hrs / 24)
    return days === 1 ? '1d ago' : `${days}d ago`
  }

  const handleNavigation = () => {
    navigate(`/discussion/${post._id}`)
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
      aria-label={`View discussion: ${post.title} by ${post.author?.name || 'Unknown Author'}`}
      className="group relative flex flex-col bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 cursor-pointer transition-all duration-300 ease-out hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {/* Header: Author Info & Timestamp */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar 
            name={post.author?.name || 'Unknown'} 
            src={post.author?.avatar} 
            size="sm" 
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.author?.name || 'Deleted User'}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md shrink-0">
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Body: Title, Content, & Tags */}
      <div className="flex-1 mb-5">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight transition-colors line-clamp-1 mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {post.content}
        </p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <Tag key={t} label={t} />
            ))}
            {post.tags.length > 3 && (
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Stats Area */}
      <div className="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400">
        
        <div className="flex items-center gap-1.5 group/stat hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ThumbsUp size={15} className="text-slate-400 group-hover/stat:text-blue-500 dark:text-slate-500 transition-colors" />
          <span>{post.likes || 0}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <MessageSquare size={15} className="text-slate-400 dark:text-slate-500" />
          <span>{(post.replies?.length || 0)} Replies</span>
        </div>
        
        <div className="flex items-center gap-1.5 ml-auto">
          <Eye size={15} className="text-slate-400 dark:text-slate-500" />
          <span>{post.views || 0} Views</span>
        </div>
        
      </div>
    </div>
  )
}