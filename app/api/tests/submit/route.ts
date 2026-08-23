import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Course } from '@/models/Course';
import { Enrollment } from '@/models/Enrollment';
import { Certificate } from '@/models/Certificate';

function getUserFromCookie(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/skyrellac_session=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, testId, answers } = await req.json();
    if (!courseId || !testId || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid submission parameters.' }, { status: 400 });
    }

    await connectToDatabase();

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    }

    const test = course.tests.find((t: any) => t.id === testId);
    if (!test) {
      return NextResponse.json({ error: 'Test not found.' }, { status: 404 });
    }

    // Grade test
    let correctCount = 0;
    test.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / test.questions.length) * 100);
    const passed = scorePct >= test.passingScorePct;

    // Update Enrollment test status
    const enrollment = await Enrollment.findOne({ userId: user.id, courseId });
    if (enrollment) {
      const existingTestIdx = enrollment.testStatus.findIndex((t: any) => t.testId === testId);
      const testRecord = {
        testId,
        testTitle: test.title,
        score: scorePct,
        totalMarks: 100,
        passed,
        attemptedAt: new Date(),
      };

      if (existingTestIdx >= 0) {
        enrollment.testStatus[existingTestIdx] = testRecord;
      } else {
        enrollment.testStatus.push(testRecord);
      }

      let cert = null;
      if (passed) {
        enrollment.certificateStatus.eligible = true;

        // Check if certificate already exists
        let existingCert = await Certificate.findOne({ userId: user.id, courseId });
        if (!existingCert) {
          const certId = 'CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
          existingCert = await Certificate.create({
            certificateId: certId,
            userId: user.id,
            courseId,
            userName: user.name || user.email,
            courseTitle: course.title,
            issueDate: new Date(),
            testScore: scorePct,
            testTotal: 100,
          });
        }
        enrollment.certificateStatus.issued = true;
        enrollment.certificateStatus.certificateId = existingCert.certificateId;
        enrollment.certificateStatus.issuedAt = existingCert.issueDate;
        cert = existingCert;
      }

      await enrollment.save();

      return NextResponse.json({
        message: passed ? 'Congratulations! You passed the test.' : 'Test completed. Keep studying to pass!',
        scorePct,
        passed,
        correctCount,
        totalQuestions: test.questions.length,
        certificate: cert,
      });
    }

    return NextResponse.json({
      scorePct,
      passed,
      correctCount,
      totalQuestions: test.questions.length,
    });
  } catch (error: any) {
    console.error('Test submission error:', error);
    return NextResponse.json({ error: 'Failed to evaluate test submission' }, { status: 500 });
  }
}
