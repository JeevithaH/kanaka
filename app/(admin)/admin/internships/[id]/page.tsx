'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, CheckCircle2, XCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminInternshipParticipantReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [evaluationScore, setEvaluationScore] = useState<number>(90);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/admin/internships/${unwrappedParams.id}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Failed to load internship participants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [unwrappedParams.id]);

  const handleEvaluateTask = async (submissionId: string, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          status,
          score: evaluationScore,
          feedback: evaluationFeedback,
        }),
      });

      if (res.ok) {
        alert(`Submission status set to ${status}!`);
        setSelectedSubmission(null);
        fetchDetail();
      } else {
        alert('Failed to update submission status');
      }
    } catch {
      alert('Error updating submission evaluation');
    }
  };

  if (isLoading || !data) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-xs text-slate-500 font-sans">
        Loading internship participant audit data...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/internships">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back</span>
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Submission Evaluation Console</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">{data.internship.title}</h1>
            <p className="text-xs text-slate-500">{data.internship.organization} • {data.participants?.length || 0} Total Enrolled Participants</p>
          </div>
        </div>
      </div>

      {/* Grid: Participants & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Participants Overview */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm">
          <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">Enrolled Participants</h2>
          
          {data.participants?.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No student participants enrolled yet.</p>
          ) : (
            <div className="space-y-3">
              {data.participants?.map((p: any) => (
                <div key={p._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span>Student User ID: {p.userId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${p.validationStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-amber-50 text-amber-700'}`}>
                      Validation: {p.validationStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Enrolled: {new Date(p.enrollmentDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending & Submitted Task Work */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm">
          <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">Student Task Submissions for Review</h2>

          {data.submissions?.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No task submissions received for evaluation yet.</p>
          ) : (
            <div className="space-y-4">
              {data.submissions?.map((s: any) => (
                <div key={s._id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{s.userName}</span>
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Status: {s.status}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                    <p className="font-bold text-slate-500 text-[10px]">SUBMITTED WORK / LINK:</p>
                    <p className="break-all">{s.submissionContent}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedSubmission(s)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      Evaluate Submission
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Submission Evaluation Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Evaluate Student Task</h3>
              <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-slate-500 font-semibold">Student: <strong className="text-slate-900">{selectedSubmission.userName}</strong></p>
              <p className="text-slate-500 font-semibold">Task ID: <strong className="text-slate-900">{selectedSubmission.taskId}</strong></p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Score (0 - 100)</label>
              <input
                type="number"
                value={evaluationScore}
                onChange={(e) => setEvaluationScore(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Admin Review Feedback</label>
              <textarea
                value={evaluationFeedback}
                onChange={(e) => setEvaluationFeedback(e.target.value)}
                placeholder="Provide constructive feedback for the student..."
                rows={3}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleEvaluateTask(selectedSubmission._id, 'Approved')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Submission</span>
              </button>

              <button
                onClick={() => handleEvaluateTask(selectedSubmission._id, 'Rejected')}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject & Request Revision</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
