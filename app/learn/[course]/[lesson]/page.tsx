'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { CourseCheckoutModal } from '@/components/payments/CourseCheckoutModal';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

interface TestData {
  id: string;
  title: string;
  durationMinutes: number;
  passingScorePct: number;
  questions: Question[];
}

interface LessonData {
  id: string;
  title: string;
  duration: string;
  contentType: string;
  videoUrl?: string;
  contentText?: string;
}

interface ModuleData {
  id: string;
  title: string;
  description: string;
  lessons: LessonData[];
}

interface CourseData {
  courseId: string;
  title: string;
  modules: ModuleData[];
  tests: TestData[];
}

export default function CoursePlayerPage({ params }: { params: { course: string; lesson: string } }) {
  const router = useRouter();
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [activeLesson, setActiveLesson] = useState<LessonData | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);

  const [isTestMode, setIsTestMode] = useState(false);
  const [activeTest, setActiveTest] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testResult, setTestResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    async function loadPlayerData() {
      try {
        const res = await fetch(`/api/courses/${params.course}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);

          let foundLesson: LessonData | null = null;
          data.course.modules.forEach((mod: ModuleData) => {
            const l = mod.lessons.find((item) => item.id === params.lesson);
            if (l) foundLesson = l;
          });

          if (!foundLesson && data.course.modules[0]?.lessons[0]) {
            foundLesson = data.course.modules[0].lessons[0];
          }
          setActiveLesson(foundLesson);
        }

        // Check payment status from enrollments
        if (user) {
          const enrollRes = await fetch('/api/enrollments');
          const enrollData = await enrollRes.json();
          if (enrollData.enrollments) {
            const match = enrollData.enrollments.find((e: any) => e.courseId === params.course);
            if (match) {
              setCompletedLessons(match.completedLessons || []);
              setIsPaid(match.paymentStatus === 'paid');
            } else {
              setIsPaid(false);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load course player:', err);
      } finally {
        setIsCheckingPayment(false);
      }
    }
    loadPlayerData();
  }, [params.course, params.lesson, user]);

  const markLessonComplete = async () => {
    if (!activeLesson || !user || !isPaid) return;
    try {
      const res = await fetch('/api/enrollments/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.course, lessonId: activeLesson.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setCompletedLessons(data.completedLessons || []);
      }
    } catch (err) {
      console.error('Failed to mark lesson complete:', err);
    }
  };

  const handleTestOptionSelect = (qIndex: number, optIndex: number) => {
    const updated = [...answers];
    updated[qIndex] = optIndex;
    setAnswers(updated);
  };

  const submitTest = async () => {
    if (!activeTest || !isPaid) return;
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.course, testId: activeTest.id, answers }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      alert('Error submitting test.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setIsCheckoutOpen(false);
  };

  if (!course || isCheckingPayment) {
    return (
      <div className="min-h-screen bg-[#161616] text-white flex items-center justify-center p-8 font-sans">
        <div className="text-sm font-semibold text-[#a8a8a8]">Verifying enrollment & payment status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white flex flex-col font-sans">
      {/* Player Header */}
      <header className="h-14 bg-[#262626] border-b border-[#393939] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-xs text-[#78a9ff] hover:underline">
            ← Dashboard
          </Link>
          <span className="text-sm font-semibold border-l border-[#525252] pl-4">{course.title}</span>
        </div>
        <div className="flex items-center gap-3">
          {isPaid ? (
            <span className="text-xs bg-[#defbe6] text-[#198038] px-2.5 py-1 font-bold rounded-full">
              Paid & Unlocked ✓
            </span>
          ) : (
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-[#198038] text-white text-xs px-3.5 py-1.5 font-semibold rounded-lg hover:bg-[#0e6027] transition-colors"
            >
              💳 Pay ₹1,999 to Unlock (Coupon SKY90)
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* UNPAID LOCKED OVERLAY */}
        {!isPaid && (
          <div className="absolute inset-0 z-40 bg-[#161616]/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
            <div className="bg-[#262626] border border-[#393939] p-8 lg:p-12 max-w-lg w-full rounded-2xl space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-[#da1e28]/20 text-[#da1e28] flex items-center justify-center mx-auto text-3xl font-bold">
                🔒
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#da1e28] uppercase tracking-wider">Payment Required</span>
                <h2 className="text-2xl font-light text-white">Course Content Locked</h2>
                <p className="text-sm text-[#c6c6c6] leading-relaxed">
                  Please complete the payment for <strong className="text-white">{course.title}</strong> to access lessons, interactive code modules, and the final certification exam.
                </p>
              </div>

              <div className="bg-[#161616] border border-[#393939] p-4 rounded-xl text-left text-xs space-y-1.5">
                <div className="flex justify-between text-[#c6c6c6]">
                  <span>Standard Amount:</span>
                  <span className="font-semibold text-white">₹1,999</span>
                </div>
                <div className="flex justify-between text-[#42be65]">
                  <span>Discount with Coupon SKY90:</span>
                  <span className="font-bold">90% OFF (Pay ₹199)</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full bg-[#198038] text-white py-3.5 text-sm font-semibold rounded-xl hover:bg-[#0e6027] transition-colors shadow-lg"
              >
                Pay ₹1,999 for Course (Apply Coupon SKY90)
              </button>

              <div className="pt-2">
                <Link href="/dashboard" className="text-xs text-[#78a9ff] hover:underline">
                  ← Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Left Sidebar - Module Accordion */}
        <aside className="w-full lg:w-80 bg-[#161616] border-r border-[#393939] overflow-y-auto shrink-0">
          <div className="p-4 border-b border-[#393939] text-xs uppercase tracking-wider text-[#a8a8a8] font-semibold">
            Course Outline
          </div>
          <div className="divide-y divide-[#262626]">
            {course.modules.map((mod) => (
              <div key={mod.id} className="p-4 space-y-2">
                <div className="text-xs font-semibold text-[#78a9ff]">{mod.title}</div>
                <div className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isDone = completedLessons.includes(lesson.id);
                    const isActive = activeLesson?.id === lesson.id && !isTestMode;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setIsTestMode(false);
                          setActiveLesson(lesson);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                          isActive
                            ? 'bg-[#0f62fe] text-white font-semibold'
                            : 'text-[#c6c6c6] hover:bg-[#262626]'
                        }`}
                      >
                        <span className="truncate flex-1">{lesson.title}</span>
                        {isDone && <span className="text-[#42be65] font-bold text-xs ml-2">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Test tab */}
            {course.tests?.length > 0 && (
              <div className="p-4">
                <button
                  onClick={() => {
                    setIsTestMode(true);
                    setActiveTest(course.tests[0]);
                    setAnswers(new Array(course.tests[0].questions.length).fill(-1));
                    setTestResult(null);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-between border border-[#0f62fe] ${
                    isTestMode ? 'bg-[#0f62fe] text-white' : 'text-[#78a9ff] hover:bg-[#0f62fe]/10'
                  }`}
                >
                  <span>📝 Take Certification Test</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Right Main Player Screen */}
        <main className="flex-1 bg-[#262626] p-6 lg:p-10 overflow-y-auto">
          {!isTestMode ? (
            /* Lesson View */
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between border-b border-[#393939] pb-4">
                <div>
                  <span className="text-xs text-[#0f62fe] uppercase tracking-wider font-semibold">
                    {activeLesson?.contentType} Lesson
                  </span>
                  <h1 className="text-2xl lg:text-3xl font-light mt-1">{activeLesson?.title}</h1>
                </div>
                <button
                  onClick={markLessonComplete}
                  className="bg-[#198038] text-white text-xs px-4 py-2.5 font-semibold hover:bg-[#0e6027] transition-colors"
                >
                  Mark Lesson Complete ✓
                </button>
              </div>

              {/* Lesson Media/Content */}
              <div className="bg-[#161616] border border-[#393939] p-6 space-y-4">
                <div className="aspect-video bg-[#000000] border border-[#393939] flex items-center justify-center p-8">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-[#0f62fe] flex items-center justify-center mx-auto text-white text-2xl font-bold">
                      ▶
                    </div>
                    <p className="text-sm font-semibold text-white">Interactive Lesson Video Stream</p>
                    <p className="text-xs text-[#a8a8a8]">Duration: {activeLesson?.duration}</p>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none text-sm text-[#c6c6c6] leading-relaxed pt-4">
                  <h3 className="text-white text-base font-semibold mb-2">Lesson Notes & Reference Summary</h3>
                  <p>{activeLesson?.contentText || 'Study the material presented above carefully.'}</p>
                </div>
              </div>
            </div>
          ) : (
            /* Certification Test Runner */
            <div className="max-w-3xl mx-auto space-y-8 bg-[#161616] border border-[#393939] p-8">
              <div>
                <span className="text-xs bg-[#0f62fe] text-white px-2 py-0.5 uppercase font-semibold">
                  Official Exam
                </span>
                <h1 className="text-2xl font-light mt-2">{activeTest?.title}</h1>
                <p className="text-xs text-[#a8a8a8] mt-1">
                  Passing Score: {activeTest?.passingScorePct}% | 5 Multiple Choice Questions
                </p>
              </div>

              {testResult ? (
                /* Result Display */
                <div className="space-y-6 bg-[#262626] border border-[#393939] p-6">
                  <div className={`p-4 border-l-4 ${testResult.passed ? 'border-[#198038] bg-[#defbe6]/10 text-[#defbe6]' : 'border-[#da1e28] bg-[#fff0f1]/10 text-[#da1e28]'}`}>
                    <h2 className="text-xl font-bold">{testResult.message}</h2>
                    <p className="text-sm mt-1">Your Score: {testResult.scorePct}%</p>
                  </div>

                  {testResult.certificate && (
                    <div className="p-4 bg-[#0f62fe]/20 border border-[#0f62fe] space-y-3">
                      <h3 className="text-sm font-bold text-white">🏆 Digital Certificate Issued!</h3>
                      <p className="text-xs text-[#c6c6c6]">Certificate ID: {testResult.certificate.certificateId}</p>
                      <Link
                        href={`/certificate/${testResult.certificate.certificateId}`}
                        className="inline-block bg-[#198038] text-white text-xs px-4 py-2 font-semibold hover:bg-[#0e6027]"
                      >
                        View Verified Certificate
                      </Link>
                    </div>
                  )}

                  <button
                    onClick={() => setTestResult(null)}
                    className="border border-[#e0e0e0] text-white text-xs px-4 py-2 hover:bg-[#393939]"
                  >
                    Retake Test
                  </button>
                </div>
              ) : (
                /* Questions Form */
                <div className="space-y-8">
                  {activeTest?.questions.map((q, qIdx) => (
                    <div key={q.id} className="space-y-3 border-b border-[#393939] pb-6">
                      <p className="text-sm font-semibold text-white">
                        {qIdx + 1}. {q.questionText}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-3 p-3 text-xs border cursor-pointer transition-colors ${
                              answers[qIdx] === optIdx
                                ? 'bg-[#0f62fe] border-[#0f62fe] text-white font-medium'
                                : 'border-[#393939] bg-[#262626] text-[#c6c6c6] hover:bg-[#393939]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${qIdx}`}
                              checked={answers[qIdx] === optIdx}
                              onChange={() => handleTestOptionSelect(qIdx, optIdx)}
                              className="hidden"
                            />
                            <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={submitTest}
                    disabled={isSubmitting || answers.includes(-1)}
                    className="w-full bg-[#0f62fe] text-white py-3.5 text-sm font-semibold hover:bg-[#0043ce] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Grading test...' : 'Submit Assessment for Grading'}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CourseCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          courseId={params.course}
          courseTitle={course.title}
          originalPrice={1999}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
