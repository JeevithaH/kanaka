import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Task } from '@/models/Task';

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
      return NextResponse.json({ tasks: [] });
    }

    await connectToDatabase();
    const tasks = await Task.find({ userId: user.id }).sort({ dueDate: 1 });
    return NextResponse.json({ tasks });
  } catch (error: any) {
    console.error('Fetch tasks error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = getUserFromCookie(req);
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }

    await connectToDatabase();
    const task = await Task.findOne({ _id: taskId, userId: user.id });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    return NextResponse.json({ message: 'Task status updated', task });
  } catch (error: any) {
    console.error('Toggle task error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
