'use client';

import React from 'react';
import { User, Award, BookOpen, Briefcase, Github, Linkedin, ExternalLink, MapPin, GraduationCap, Code } from 'lucide-react';
import { MOCK_CREDENTIALS } from '@/lib/supabase/mock-data';
import { Button } from '@/components/ui/Button';

export default function StudentProfilePage() {
  const skills = [
    { name: 'Python Programming', level: 80 },
    { name: 'SQL & Data Modeling', level: 65 },
    { name: 'Machine Learning Basics', level: 50 },
    { name: 'React & Next.js', level: 75 },
    { name: 'Communication & Technical Writing', level: 85 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Profile Header Box */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-soft-md">
            AJ
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900">Alex Johnson</h1>
            <p className="text-sm font-semibold text-blue-600">Computer Science Undergraduate • AI Aspirant</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                State Institute of Technology (Class of 2026)
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                California, USA
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Button variant="secondary" size="sm">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </Button>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <Button variant="secondary" size="sm">
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Main Grid: Skill Meters & Verified Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Skill Proficiency Meters */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Skill Proficiency Meters</h2>
            <span className="text-xs text-slate-400 font-medium">Updated from course assessments</span>
          </div>

          <div className="space-y-5">
            {skills.map((skill, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{skill.name}</span>
                  <span className="text-blue-600 font-mono">{skill.level}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Credentials Column */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-soft-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">Verified Credentials</h2>

          <div className="space-y-4">
            {MOCK_CREDENTIALS.map((cred) => (
              <div key={cred.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h3 className="text-xs font-bold text-slate-900 truncate">{cred.title}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-500 block">{cred.credential_id}</span>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Issued: {cred.issue_date}</span>
                  <span className="font-bold text-blue-600">Verified ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
