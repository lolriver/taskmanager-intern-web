import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { z } from 'zod';
import dbConnect from '@/lib/db';
import { createServerErrorResponse } from '@/lib/server-errors';
import Task from '@/models/Task';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(1000).optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
});

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = createTaskSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation Error', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await dbConnect();

    const task = await Task.create({
      ...result.data,
      userId: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({ message: 'Task created', task }, { status: 201 });
  } catch (error) {
    return createServerErrorResponse(error);
  }
}

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query.status = status;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    await dbConnect();

    const skip = (page - 1) * limit;
    const tasks = await Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Task.countDocuments(query);

    return NextResponse.json({
      tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return createServerErrorResponse(error);
  }
}
