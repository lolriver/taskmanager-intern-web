'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Clock,
  Edit2,
  LayoutGrid,
  Loader2,
  LogOut,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getApiErrorMessage, type ApiErrorPayload } from '@/lib/api-errors';

type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
}

const emptyTaskForm = {
  title: '',
  description: '',
  status: 'Pending' as TaskStatus,
};

async function readApiPayload(response: Response) {
  return (await response.json().catch(() => null)) as ApiErrorPayload | Record<string, any> | null;
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFetchingTasks, setIsFetchingTasks] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState(emptyTaskForm);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, router, user]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const fetchTasks = async () => {
    setIsFetchingTasks(true);

    const params = new URLSearchParams({
      page: String(page),
      limit: '6',
    });

    if (statusFilter !== 'All') {
      params.set('status', statusFilter);
    }

    if (search.trim()) {
      params.set('search', search.trim());
    }

    try {
      const res = await fetch(`/api/tasks?${params.toString()}`);
      const data = await readApiPayload(res);

      if (!res.ok) {
        toast.error(getApiErrorMessage(data as ApiErrorPayload | null, 'Failed to fetch tasks'));
        return;
      }

      setTasks((data as { tasks: Task[] }).tasks ?? []);
      setTotalPages((data as { pagination?: { totalPages?: number } }).pagination?.totalPages ?? 1);
    } catch {
      toast.error('Failed to fetch tasks');
    } finally {
      setIsFetchingTasks(false);
    }
  };

  useEffect(() => {
    if (user) {
      void fetchTasks();
    }
  }, [user, page, statusFilter, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await readApiPayload(res);

      if (!res.ok) {
        toast.error(getApiErrorMessage(data as ApiErrorPayload | null, 'Failed to create task'));
        return;
      }

      toast.success('Task created successfully');
      setIsCreateOpen(false);
      setFormData(emptyTaskForm);
      await fetchTasks();
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask) {
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/tasks/${currentTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await readApiPayload(res);

      if (!res.ok) {
        toast.error(getApiErrorMessage(data as ApiErrorPayload | null, 'Failed to update task'));
        return;
      }

      toast.success('Task updated successfully');
      setIsEditOpen(false);
      setCurrentTask(null);
      await fetchTasks();
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    setDeletingTaskId(id);

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      const data = await readApiPayload(res);

      if (!res.ok) {
        toast.error(getApiErrorMessage(data as ApiErrorPayload | null, 'Failed to delete task'));
        return;
      }

      toast.success('Task deleted');
      await fetchTasks();
    } catch {
      toast.error('An error occurred');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
            <Circle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 blur-[100px] bg-gradient-to-bl from-indigo-500 to-purple-500 pointer-events-none rounded-full" />

      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <LayoutGrid className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">FocusFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium border border-border">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-foreground">{user.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 relative">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Task Dashboard</h2>
            <p className="text-muted-foreground mt-1 text-sm">Organize, strategize, and execute your objectives.</p>
          </div>
          <Button
            type="button"
            className="w-full md:w-auto h-11 px-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            onClick={() => {
              setCurrentTask(null);
              setFormData(emptyTaskForm);
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" /> Create Task
          </Button>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Task Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  autoFocus
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => value && setFormData({ ...formData, status: value as TaskStatus })}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Task'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-muted/50 border-transparent focus:border-ring transition-colors"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'All')}>
              <SelectTrigger className="h-10 bg-muted/50 border-transparent focus:border-ring transition-colors">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFetchingTasks && tasks.length === 0 ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-muted/30 rounded-3xl border border-border/50 border-dashed">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">You are all caught up</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">No tasks match your current filters. Create a new task to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <Card className="h-full flex flex-col group relative overflow-hidden border-border/50 bg-card hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                    <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-lg font-bold leading-tight line-clamp-2">{task.title}</CardTitle>
                        {getStatusBadge(task.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 flex-1">
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {task.description || <span className="italic opacity-40">No description provided</span>}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-4 pb-4 bg-muted/10 border-t border-border/40 flex justify-between items-center text-xs text-muted-foreground font-medium">
                      <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                          onClick={() => {
                            setCurrentTask(task);
                            setFormData({
                              title: task.title,
                              description: task.description,
                              status: task.status,
                            });
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleDelete(task._id)}
                          disabled={deletingTaskId === task._id}
                        >
                          {deletingTaskId === task._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  autoFocus
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => value && setFormData({ ...formData, status: value as TaskStatus })}>
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              disabled={page === 1}
              className="rounded-full shadow-sm"
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              Page <span className="text-foreground">{page}</span> of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
              disabled={page === totalPages}
              className="rounded-full shadow-sm"
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
