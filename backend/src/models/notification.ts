import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType = 
  | 'theory' 
  | 'quiz' 
  | 'achievement' 
  | 'result' 
  | 'project_hiring' 
  | 'project_task' 
  | 'project_review' 
  | 'discussion_reply' 
  | 'system';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  projectId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['theory', 'quiz', 'achievement', 'result', 'project_hiring', 'project_task', 'project_review', 'discussion_reply', 'system'], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  actionUrl: { type: String },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);