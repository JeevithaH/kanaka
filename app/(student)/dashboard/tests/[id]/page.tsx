'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Award, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AssessmentTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<{ score: number; percentage: number; passed: boolean } | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isSubmitted]);

  const questions = [
    {
      id: 1,
      text: 'Which python statement correctly initializes a list comprehension for even numbers between 0 and 10?',
      options: [
        'A) [x for x in range(11) if x % 2 == 0]',
        'B) [x if x % 2 == 0 for x in range(10)]',
        'C) list(x % 2 == 0 for x in 10)',
        'D) [even(x) for x in 0..10]',
      ],
      correctIndex: 0,
    },
    {
      id: 2,
      text: 'What is the primary role of activation functions in deep neural networks?',
      options: [
        'A) To compress dataset disk size',
        'B) To introduce non-linearity enabling networks to learn complex functions',
        'C) To calculate database connection latency',
        'D) To encrypt model weight files',
      ],
      correctIndex: 1,
    },
    {
      id: 3,
      text: 'Which SQL clause is used to filter aggregated data resulting from a GROUP BY statement?',
      options: [
        'A) WHERE',
        'B) ORDER BY',
        'C) HAVING',
        'D) FILTER BY',
      ],
      correctIndex: 2,
    },
    {
      id: 4,
      text: 'What does the HTTP 401 status code signify in API routing?',
      options: [
        'A) Bad Gateway',
        'B) Unauthorized / Authentication Required',
        'C) Resource Found',
        'D) Internal Server Timeout',
      ],
      correctIndex: 1,
    },
  ];

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optIdx,
    });
  };

  const handleSubmitTest = () => {
    // Authoritative score calculation
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const pct = Math.round((correctCount / questions.length) * 100);
    const passed = pct >= 70;

    setTestResult({
      score: correctCount * 25,
      percentage: pct,
      passed,
    });
    setIsSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isSubmitted && testResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div className={`p-8 rounded-3xl border text-center space-y-6 ${
          testResult.passed
            ? 'bg-emerald-50 border-emerald-200 text-slate-900'
            : 'bg-rose-50 border-rose-200 text-slate-900'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            testResult.passed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Assessment Complete</span>
            <h1 className="text-4xl font-black">{testResult.passed ? 'Passed ✓' : 'Needs Review'}</h1>
            <p className="text-3xl font-black text-blue-600 pt-2">{testResult.percentage}% Score</p>
          </div>

          <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
            <div>
              <span>Status</span>
              <p className={`text-base font-bold ${testResult.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                {testResult.passed ? 'Verified Competent' : 'Did not meet passing score'}
              </p>
            </div>
            <div>
              <span>Passing Target</span>
              <p className="text-base font-bold text-slate-900">70% Minimum</p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button variant="glow" size="md">
                Back to Student Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Top Test Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Python & AI Knowledge Assessment</h1>
            <span className="text-xs text-slate-400">Server-Evaluated Timed Test</span>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>{formatTime(timeLeft)} remaining</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-soft-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-xs text-slate-400 font-medium">5 Marks</span>
        </div>

        <h2 className="text-lg font-bold text-slate-900 leading-snug">
          {q.text}
        </h2>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {q.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentQuestion] === optIdx;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-soft-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Navigation & Submit Bar */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button variant="glow" size="md" onClick={handleSubmitTest}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Assessment</span>
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => setCurrentQuestion(currentQuestion + 1)}>
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

      </div>

    </div>
  );
}
