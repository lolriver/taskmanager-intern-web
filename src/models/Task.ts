import mongoose from 'mongoose';
import User from './User';

export interface ITask extends mongoose.Document {
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  userId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const TaskSchema = new mongoose.Schema<ITask>({
  title: {
    type: String,
    required: [true, 'Please provide a title for the task'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must belong to a user'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for faster fetching/filtering by user & status
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, title: 'text' });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
