import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import { requireAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    await connectToDatabase();
    const notifications = await Notification.find({ userId: user!.id }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ notifications });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user, errorResponse } = await requireAuth(req);
    if (errorResponse) return errorResponse;

    const { notificationId } = await req.json();

    await connectToDatabase();
    if (notificationId) {
      await Notification.updateOne({ _id: notificationId, userId: user!.id }, { isRead: true });
    } else {
      await Notification.updateMany({ userId: user!.id }, { isRead: true });
    }

    return NextResponse.json({ message: 'Notifications marked as read' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
