'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { Clock, MapPin, CheckCircle2, ShieldCheck, ArrowRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface InternshipTask {
  taskId: string;
  title: string;
  description: string;
  instructions?: string;
  deadlineDays: number;
  maxScore: number;
}

interface InternshipDetail {
  _id: string;
  internshipId: string;
  title: string;
  description: string;
  organization: string;
  mode: string;
  location: string;
  durationWeeks: number;
  type: string;
  requiredSkills: string[];
  tasks: InternshipTask[];
  validationFee: number;
  certificateEligible: boolean;
}

export default function InternshipDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [internship, setInternship] = useState<InternshipDetail | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'pending' | 'paid' | 'validated'>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/internships/${params.id}`);
        const data = await res.json();
        if (data.internship) {
          setInternship(data.internship);
        }

        if (user) {
          const dashRes = await fetch('/api/dashboard');
          const dashData = await dashRes.json();
          if (dashData.internshipEnrollments) {
            const match = dashData.internshipEnrollments.find(
              (e: any) => e.internshipId === params.id || e.internshipId === data.internship?.internshipId
            );
            if (match) {
              setIsEnrolled(true);
              setValidationStatus(match.validationStatus || 'pending');
            }
          }
        }
      } catch (err) {
        console.error('Failed to load internship detail:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id, user]);

  const handleEnrollFree = async () => {
    if (!user) {
      router.push(`/login?redirect=/internships/${params.id}`);
      return;
    }

    setIsEnrolling(true);
    try {
      const res = await fetch(`/api/internships/${params.id}`, { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setIsEnrolled(true);
        router.push('/dashboard');
      } else {
        alert(data.error || 'Failed to enroll in internship');
      }
    } catch {
      alert('Network error while enrolling');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handlePayValidation = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/internships/${params.id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'upi' }),
      });
      const data = await res.json();
      if (res.ok) {
        setValidationStatus('paid');
        alert('Validation fee paid successfully! Official certificate process activated.');
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch {
      alert('Error processing validation payment');
    }
  };

  if (isLoading || !internship) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-slate-500 font-sans">
        Loading internship program details...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 lg:p-12 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
            {internship.mode} Program
          </span>
          <span className="text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
            Free Internship Enrollment
          </span>
        </div>

        <h1 className="text-3xl lg:text-5xl font-black tracking-tight">{internship.title}</h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-medium">
          <span>Organization: <strong className="text-white">{internship.organization}</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-400" /> {internship.location}</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-emerald-400" /> {internship.durationWeeks} Weeks</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          {!isEnrolled ? (
            <Button
              onClick={handleEnrollFree}
              disabled={isEnrolling}
              variant="glow"
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {isEnrolling ? 'Enrolling...' : 'Join Internship Program (Free)'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard">
                <Button variant="secondary" size="lg" className="bg-white text-slate-900 font-bold">
                  Go to Dashboard & Submit Tasks
                </Button>
              </Link>

              {validationStatus === 'pending' ? (
                <Button
                  onClick={handlePayValidation}
                  variant="glow"
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  💳 Pay ₹{internship.validationFee || 499} Validation & Certificate Fee
                </Button>
              ) : (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Validation Service Active
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Program Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Program Overview */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-4 shadow-soft-sm">
            <h2 className="text-xl font-bold text-slate-900">Program Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{internship.description}</p>
          </div>

          {/* Assigned Tasks Outline */}
          <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 shadow-soft-sm">
            <h2 className="text-xl font-bold text-slate-900">Program Tasks & Milestones</h2>
            <div className="space-y-4">
              {internship.tasks?.map((task, idx) => (
                <div key={task.taskId} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 uppercase">Task {idx + 1}</span>
                    <span className="text-xs text-slate-500 font-semibold">Max Score: {task.maxScore} pts</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-600">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-soft-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {internship.requiredSkills?.map((skill, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Official Certification</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Complete assigned tasks and pass the evaluation to earn your verified credential ID. Optional validation fee: ₹{internship.validationFee || 499}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
