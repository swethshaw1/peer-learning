import React from 'react'
import clsx from 'clsx'
import { FolderOpen } from 'lucide-react' // Fallback icon for EmptyState

// ─── Loading Spinner ─────────────────────────────────────────────────────────
export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const s = { 
    sm: 'h-4 w-4 border-[1.5px]', 
    md: 'h-6 w-6 border-2', 
    lg: 'h-10 w-10 border-2' 
  }[size]
  
  return (
    <div 
      className={clsx(
        'animate-spin rounded-full border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-500', 
        s,
        className
      )} 
    />
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({
  icon, 
  title, 
  description, 
  action
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0F172A]/50">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 shadow-inner">
        {icon || <FolderOpen size={32} strokeWidth={1.5} />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div 
      className={clsx(
        'animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800/80', 
        className
      )} 
    />
  )
}

// ─── Progress ────────────────────────────────────────────────────────────────
export function Progress({ 
  value, 
  className,
  indicatorClassName 
}: { 
  value: number; 
  className?: string;
  indicatorClassName?: string;
}) {
  const safeValue = Math.min(100, Math.max(0, value))
  
  return (
    <div className={clsx('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      <div 
        className={clsx(
          'h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 ease-out rounded-full',
          indicatorClassName
        )} 
        style={{ width: `${safeValue}%` }} 
      />
    </div>
  )
}

// ─── Badge / Tag ─────────────────────────────────────────────────────────────
type BadgeVariant = 'beginner' | 'intermediate' | 'advanced' | 'default'

export function DifficultyBadge({ level }: { level: string }) {
  const variant = level.toLowerCase() as BadgeVariant
  
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border"
  
  const colorMap = {
    beginner:     'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-500/20',
    intermediate: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-500/20',
    advanced:     'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-500/20',
    default:      'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
  }
  
  const colorClasses = colorMap[variant] ?? colorMap.default

  return <span className={clsx(baseClasses, colorClasses)}>{level}</span>
}

export function Tag({ label, className }: { label: string; className?: string }) {
  return (
    <span className={clsx(
      "inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 shadow-sm transition-colors hover:bg-slate-200 dark:hover:bg-slate-700",
      className
    )}>
      {label}
    </span>
  )
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
export function Avatar({
  name, 
  src, 
  size = 'md'
}: { 
  name: string; 
  src?: string; 
  size?: 'sm' | 'md' | 'lg' 
}) {
  const s = { 
    sm: 'h-8 w-8 text-xs', 
    md: 'h-10 w-10 text-sm', 
    lg: 'h-14 w-14 text-base' 
  }[size]
  
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return src ? (
    <img 
      src={src} 
      alt={name} 
      className={clsx('rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm', s)} 
      loading="lazy"
    />
  ) : (
    <div 
      className={clsx(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-slate-100 dark:from-blue-900/40 dark:to-slate-800 border border-blue-100 dark:border-blue-800/50 font-bold text-blue-700 dark:text-blue-400 shadow-sm', 
        s
      )}
      aria-label={name}
    >
      {initials}
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({
  title, 
  subtitle, 
  action
}: { 
  title: string; 
  subtitle?: string; 
  action?: React.ReactNode 
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800/80 pb-4">
      <div className="flex-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}