export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    'pending': 'warning',
    'reviewing': 'info',
    'shortlisted': 'info',
    'hired': 'success',
    'accepted': 'success',
    'rejected': 'danger',
    'todo': 'neutral',
    'in-progress': 'info',
    'in-review': 'warning',
    'revision': 'warning',
    'done': 'success',
    'approved': 'success',
    'needs-revision': 'warning',
    'active': 'success',
    'upcoming': 'info',
    'completed': 'success',
    'hiring': 'warning',
    'archived': 'neutral',
  };
  return map[status] || 'neutral';
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    'pending': 'Pending',
    'reviewing': 'Reviewing',
    'shortlisted': 'Shortlisted',
    'hired': 'Hired',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'in-review': 'In Review',
    'revision': 'Needs Revision',
    'done': 'Done',
    'approved': 'Approved',
    'needs-revision': 'Needs Revision',
    'active': 'Active',
    'upcoming': 'Upcoming',
    'completed': 'Completed',
    'hiring': 'Hiring',
    'archived': 'Archived',
  };
  return map[status] || status;
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}
