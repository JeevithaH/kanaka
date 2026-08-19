'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminNewInternshipPage() {
  const router = useRouter();
  const [internshipId, setInternshipId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organization, setOrganization] = useState('Skyrellac Innovation Labs');
  const [mode, setMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [location, setLocation] = useState('Global / Remote');
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [validationFee, setValidationFee] = useState<number>(499);
  const [requiredSkillsText, setRequiredSkillsText] = useState('Python, SQL, Machine Learning');

  // Program tasks
  const [tasks, setTasks] = useState([
    {
      taskId: 'task-1',
      title: 'Milestone 1: Project Setup & Research Analysis',
      description: 'Clean data features and author an exploratory research document.',
      instructions: 'Submit GitHub link or project document.',
      deadlineDays: 7,
      maxScore: 100,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTask = () => {
    const taskNum = tasks.length + 1;
    setTasks([
      ...tasks,
      {
        taskId: `task-${taskNum}`,
        title: `Milestone ${taskNum}: Core Implementation & Testing`,
        description: 'Implement core functionality and evaluate benchmarks.',
        instructions: 'Submit project URL or output telemetry.',
        deadlineDays: taskNum * 7,
        maxScore: 100,
      },
    ]);
  };

  const handleRemoveTask = (index: number) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const handleSubmitInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !internshipId || !description) {
      alert('Please fill out internship title, ID, and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const skillsArray = requiredSkillsText.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/admin/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internshipId: internshipId.toLowerCase().trim().replace(/\s+/g, '-'),
          title,
          description,
          organization,
          mode,
          location,
          durationWeeks,
          validationFee,
          requiredSkills: skillsArray,
          tasks,
          certificateEligible: true,
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Internship program posted successfully!');
        router.push('/admin/internships');
      } else {
        alert(data.error || 'Failed to post internship');
      }
    } catch {
      alert('Network error while creating internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-soft-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/internships">
            <Button variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Post New Internship Program</h1>
            <p className="text-xs text-slate-500">Configure free student enrollment + optional paid validation fee (₹499).</p>
          </div>
        </div>

        <Button
          onClick={handleSubmitInternship}
          disabled={isSubmitting}
          variant="glow"
          size="md"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
        >
          <Save className="w-4 h-4 mr-1.5" />
          <span>{isSubmitting ? 'Posting Program...' : 'Publish Internship'}</span>
        </Button>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSubmitInternship} className="space-y-8">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm">
          <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">1. Program Overview & Pricing</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Program Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!internshipId) setInternshipId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                placeholder="e.g. Cloud Security Analyst Intern"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Internship Slug / ID</label>
              <input
                type="text"
                value={internshipId}
                onChange={(e) => setInternshipId(e.target.value)}
                placeholder="e.g. cloud-security-analyst-intern"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-mono focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Organization Name</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Skyrellac Innovation Labs"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Configurable Validation Fee (INR ₹)</label>
              <input
                type="number"
                value={validationFee}
                onChange={(e) => setValidationFee(Number(e.target.value))}
                placeholder="499"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Mode</label>
              <select
                value={mode}
                onChange={(e: any) => setMode(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600 bg-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Duration (Weeks)</label>
              <input
                type="number"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                placeholder="8"
                required
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Required Skills (Comma separated)</label>
            <input
              type="text"
              value={requiredSkillsText}
              onChange={(e) => setRequiredSkillsText(e.target.value)}
              placeholder="Python, SQL, Linux"
              className="w-full border border-slate-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Program Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe program responsibilities, eligibility, and learning outcomes..."
              rows={4}
              required
              className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>

        {/* Tasks Builder */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-soft-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-slate-900 tracking-wider">2. Milestone Tasks Builder</h2>
            <Button type="button" onClick={handleAddTask} variant="secondary" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              <span>Add Task</span>
            </Button>
          </div>

          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div key={task.taskId} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 uppercase">Task {idx + 1}</span>
                  <button type="button" onClick={() => handleRemoveTask(idx)} className="text-rose-600 hover:bg-rose-50 p-1 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => {
                      const updated = [...tasks];
                      updated[idx].title = e.target.value;
                      setTasks(updated);
                    }}
                    placeholder="Task Title"
                    className="border border-slate-200 rounded-lg p-2 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={task.deadlineDays}
                    onChange={(e) => {
                      const updated = [...tasks];
                      updated[idx].deadlineDays = Number(e.target.value);
                      setTasks(updated);
                    }}
                    placeholder="Deadline Days (e.g. 7)"
                    className="border border-slate-200 rounded-lg p-2 focus:outline-none"
                  />
                </div>

                <textarea
                  value={task.description}
                  onChange={(e) => {
                    const updated = [...tasks];
                    updated[idx].description = e.target.value;
                    setTasks(updated);
                  }}
                  placeholder="Task Description & Instructions..."
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} variant="glow" size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold">
          <span>{isSubmitting ? 'Publishing Internship...' : 'Publish Internship Program'}</span>
        </Button>
      </form>
    </div>
  );
}
