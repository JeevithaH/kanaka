'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Plus, CheckCircle2, Send, Clock, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Task Assignment state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDateDays, setDueDateDays] = useState<number>(7);
  const [isAssigning, setIsAssigning] = useState(false);

  const fetchTasksData = async () => {
    try {
      const [taskRes, userRes] = await Promise.all([
        fetch('/api/admin/tasks'),
        fetch('/api/admin/users'),
      ]);
      const taskData = await taskRes.json();
      const userData = await userRes.json();

      if (taskData.tasks) setTasks(taskData.tasks);
      if (taskData.submissions) setSubmissions(taskData.submissions);
      if (userData.users) {
        setUsers(userData.users);
        if (userData.users[0]) setTargetUserId(userData.users[0]._id);
      }
    } catch (err) {
      console.error('Failed to load admin task assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const handleCreateAndAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !taskTitle) {
      alert('Select a student user and enter a task title.');
      return;
    }

    setIsAssigning(true);
    try {
      const calculatedDueDate = new Date(Date.now() + dueDateDays * 24 * 60 * 60 * 1000).toISOString();
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          dueDate: calculatedDueDate,
        }),
      });

      if (res.ok) {
        alert('Personalized task assigned to student successfully!');
        setIsAssignModalOpen(false);
        setTaskTitle('');
        setTaskDescription('');
        fetchTasksData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to assign task');
      }
    } catch {
      alert('Network error while assigning task');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>Task & Evaluation Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Personalized Task Assignment System
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Assign custom assignments to specific student users, set deadlines, and review student work submissions.
          </p>
        </div>

        <Button
          onClick={() => setIsAssignModalOpen(true)}
          variant="glow"
          size="md"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Assign Task to Student</span>
        </Button>
      </div>

      {/* Grid: Task Assignments & Submissions Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* All Assigned Tasks */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm">
          <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">All Assigned Tasks</h2>

          {isLoading ? (
            <p className="text-xs text-slate-500 py-4 text-center">Loading task database...</p>
          ) : tasks.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {tasks.map((t) => (
                <div key={t._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{t.title}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Status: {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{t.description || 'No description'}</p>
                  <div className="flex justify-between text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-200/60">
                    <span>User ID: {t.userId}</span>
                    <span>Due: {new Date(t.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Received Student Submissions */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm">
          <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">Received Student Work Submissions</h2>

          {submissions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No student submissions received yet.</p>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {submissions.map((s) => (
                <div key={s._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{s.userName} ({s.userId})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${s.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                      {s.status}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800">
                    <p className="font-bold text-[10px] text-slate-400">SUBMITTED CONTENT / LINK:</p>
                    <p className="break-all mt-1">{s.submissionContent}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Task Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateAndAssignTask} className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Assign Personalized Task</h3>
              <button type="button" onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Select Student User</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-purple-600 bg-white"
              >
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.fullName} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Task Title</label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Build REST API for User Authentication"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e: any) => setTaskPriority(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Deadline (Days)</label>
                <input
                  type="number"
                  value={dueDateDays}
                  onChange={(e) => setDueDateDays(Number(e.target.value))}
                  required
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Task Description & Instructions</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Detailed instructions for the student..."
                rows={3}
                className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <Button type="submit" disabled={isAssigning} variant="glow" size="md" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
              <span>{isAssigning ? 'Assigning Task...' : 'Assign Task to Student'}</span>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
