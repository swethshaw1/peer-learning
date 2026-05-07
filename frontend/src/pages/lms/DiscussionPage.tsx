import { useEffect, useState } from 'react'
import { MessageSquare, Plus, X, Send, Hash, Type, AlignLeft, Sparkles } from 'lucide-react'
import { discussionApi } from '../../api'
import DiscussionCard from '../../components/lms/discussion/DiscussionCard'
import { Spinner, EmptyState } from '../../components/lms/ui'
import toast from 'react-hot-toast'
import type { DiscussionPost } from '../../types'
import { MOCK_DISCUSSIONS } from '../../lib/mockData'

export default function DiscussionPage() {
  const [posts, setPosts]         = useState<DiscussionPost[]>([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [title, setTitle]         = useState('')
  const [content, setContent]     = useState('')
  const [tags, setTags]           = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    discussionApi.getAll()
      .then(r => { 
        const d = r.data.data ?? []
        setPosts(d.length ? d : MOCK_DISCUSSIONS) 
      })
      .catch(() => setPosts(MOCK_DISCUSSIONS))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)
    
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)

    try {
      const res = await discussionApi.create({
        title: title.trim(),
        content: content.trim(),
        tags: tagArray,
      })
      setPosts(prev => [res.data.data, ...prev])
      setTitle(''); setContent(''); setTags(''); setShowForm(false)
      toast.success('Post published successfully')
    } catch {
      // Optimistic fallback for demo/offline
      const fake: DiscussionPost = {
        _id: Date.now().toString(), 
        title, 
        content,
        author: { _id: 'me', name: 'You' },
        tags: tagArray,
        replies: [], likes: 0, views: 0, createdAt: new Date().toISOString()
      }
      setPosts(prev => [fake, ...prev])
      setTitle(''); setContent(''); setTags(''); setShowForm(false)
      toast.success('Post created locally')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="mx-auto space-y-8 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="text-blue-600 dark:text-blue-500" size={32} />
            Community Forum
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Ask questions and share technical knowledge with your peers
          </p>
        </div>
        
        <button 
          onClick={() => setShowForm(p => !p)} 
          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm ${
            showForm 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700' 
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'New Discussion'}
        </button>
      </div>

      {/* Create form Section */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-amber-500" size={20} />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Start a new conversation</h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                <Type size={14} /> Topic Title
              </label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                placeholder="What's on your mind? Be specific..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                <AlignLeft size={14} /> Description
              </label>
              <textarea
                required
                rows={5}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none"
                placeholder="Describe your context, share code snippets, or provide details..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                <Hash size={14} /> Tags
              </label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                placeholder="JavaScript, React, Architecture (comma separated)"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 dark:disabled:bg-slate-700 text-white text-sm font-black rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95"
              >
                {submitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <Send size={18} />
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Discussion Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Spinner size="lg" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">
              Loading Feed
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12">
            <EmptyState 
              icon={<MessageSquare size={48} className="text-slate-300 dark:text-slate-600" />} 
              title="No active discussions" 
              description="Be the first to start a conversation and share insights with the community." 
            />
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {posts.map((post, index) => (
              <div 
                key={post._id} 
                className="transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DiscussionCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  )
}