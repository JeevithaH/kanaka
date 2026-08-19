import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Feedback } from '@/models/Feedback';

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

export async function GET(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user || !user.id) {
      return NextResponse.json({ feedbacks: [] });
    }

    await connectToDatabase();
    const feedbacks = await Feedback.find({ userId: user.id });
    return NextResponse.json({ feedbacks });
  } catch (error: any) {
    console.error('Fetch feedback error:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, rating, review } = await req.json();
    if (!courseId || !rating) {
      return NextResponse.json({ error: 'Course ID and Rating (1-5) are required' }, { status: 400 });
    }

    await connectToDatabase();
    let feedback = await Feedback.findOne({ userId: user.id, courseId });
    if (feedback) {
      feedback.rating = rating;
      feedback.review = review || '';
      await feedback.save();
    } else {
      feedback = await Feedback.create({
        userId: user.id,
        courseId,
        rating,
        review: review || '',
      });
    }

    return NextResponse.json({ message: 'Feedback submitted successfully', feedback });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}
