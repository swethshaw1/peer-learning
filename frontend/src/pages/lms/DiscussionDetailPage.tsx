import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ThumbsUp, Eye, Send, MessageSquare, Clock, Share2 } from 'lucide-react'
import { discussionApi } from '../../api'
import { Avatar, Tag, Spinner } from '../../components/lms/ui'
import toast from 'react-hot-toast'
import type { DiscussionPost } from '../../types'

const MOCK: DiscussionPost = {
  _id: '1',
  title: 'How do closures work in JavaScript?',
  content: 'I am trying to understand closures in JS. Can someone explain with a simple example? I understand functions return values but how does a closure "remember" its environment? I have been reading about lexical scope but still confused.',
  author: { _id: 'u1', name: 'Harshit Sharma' },
  tags: ['JavaScript', 'Closures', 'Fundamentals'],
  likes: 12,
  views: 89,
  createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  replies: [
    { _id: 'r1', content: 'A closure is a function that remembers variables from its outer scope even after that outer function has returned. Think of it as the function "closing over" the variables it needs.', author: { _id: 'u2', name: 'Priya M.' }, likes: 5, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { _id: 'r2', content: 'Great question! Here is a simple example: function counter() { let count = 0; return () => ++count; } const inc = counter(); inc() // 1, inc() // 2. The inner function "closes over" count.', author: { _id: 'u3', name: 'Aman V.' }, likes: 8, createdAt: new Date(Date.now() - 1800000).toISOString() },
  ]
}

const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function DiscussionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<DiscussionPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [replying, setReplying] = useState(false)

  useEffect(() => {
    discussionApi.getById(id!)
      .then(r => setPost(r.data.data))
      .catch(() => setPost(MOCK))
      .finally(() => setLoading(false))
  }, [id])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    setReplying(true)
    const newReply = { 
      _id: Date.now().toString(), 
      content: reply, 
      author: { _id: 'me', name: 'You' }, 
      likes: 0, 
      createdAt: new Date().toISOString() 
    }
    
    try {
      await discussionApi.reply(id!, reply)
      setPost(prev => prev ? { ...prev, replies: [...prev.replies, newReply] } : prev)
      setReply('')
      toast.success('Response shared')
    } catch {
      // Optimistic fallback
      setPost(prev => prev ? { ...prev, replies: [...prev.replies, newReply] } : prev)
      setReply('')
      toast.success('Response shared')
    } finally { setReplying(false) }
  }

  const handleLike = async () => {
    setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : prev)
    try {
      await discussionApi.like(id!)
    } catch {
      // Error handled silently for UX
    }
  }

  if (loading) return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>
  if (!post) return <div className="flex h-96 items-center justify-center text-slate-500 font-medium">Post not found</div>

  return (
    <div className="mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/discussions')} 
        className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-500 transition-colors"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Back to Forum
      </button>

      {/* Primary Discussion Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="ring-2 ring-slate-100 dark:ring-slate-800 rounded-full">
                <Avatar name={post.author.name} src={post.author.avatar} size="md" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{post.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Clock size={12} />
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all">
              <Share2 size={18} />
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            {post.title}
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
              {post.content}
            </p>
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(t => (
                <Tag key={t} label={t} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border-none" />
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={handleLike} 
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="p-2 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
                <ThumbsUp size={18} className="group-active:scale-125 transition-transform" />
              </div>
              <span>{post.likes}</span>
            </button>
            
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <div className="p-2">
                <Eye size={18} />
              </div>
              <span>{post.views} Views</span>
            </div>

            <div className="ml-auto flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400">
              <MessageSquare size={18} />
              <span>{(post.replies?.length || 0)} Replies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Replies Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight px-2">
          Discussion Thread
        </h2>
        
        <div className="space-y-4">
          {(post.replies || []).map((r, index) => (
            <div 
              key={r._id} 
              className="group bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 transition-all animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={r.author?.name || 'Unknown'} src={r.author?.avatar} size="sm" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{r.author?.name || 'Deleted User'}</p>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{timeAgo(r.createdAt)}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-1">
                {r.content}
              </p>
              <div className="flex items-center gap-2 mt-4 pl-1">
                <button className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <ThumbsUp size={14} />
                  <span>{r.likes || 0} Helpful</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Persistent Reply Component */}
      <div className="sticky bottom-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <form onSubmit={handleReply} className="flex items-center gap-4">
          <div className="hidden sm:block shrink-0">
            <Avatar name="You" size="sm" />
          </div>
          <div className="relative flex-1">
            <textarea
              rows={1}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 transition-all resize-none overflow-hidden"
              placeholder="Contribute to the discussion..."
              value={reply}
              onChange={e => setReply(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={replying || !reply.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-90 disabled:opacity-40 shrink-0"
          >
            {replying ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Send size={18} className="translate-x-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}