import Notification, { NotificationType } from '../models/notification';
import mongoose from 'mongoose';

export const sendNotification = async (
  userId: string | mongoose.Types.ObjectId,
  type: NotificationType,
  title: string,
  message: string,
  options?: {
    actionUrl?: string;
    projectId?: string | mongoose.Types.ObjectId;
  }
) => {
  try {
    await Notification.create({
      userId,
      type,
      title,
      message,
      actionUrl: options?.actionUrl,
      projectId: options?.projectId
    });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};
