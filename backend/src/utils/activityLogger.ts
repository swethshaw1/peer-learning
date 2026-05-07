import ProjectActivity, { ProjectActivityType } from '../models/ProjectActivity';
import mongoose from 'mongoose';

export const logProjectActivity = async (
  projectId: string | mongoose.Types.ObjectId,
  userId: string | mongoose.Types.ObjectId,
  type: ProjectActivityType,
  message: string,
  detail?: string,
  actionUrl?: string
) => {
  try {
    await ProjectActivity.create({
      projectId,
      userId,
      type,
      message,
      detail,
      actionUrl
    });
  } catch (error) {
    console.error('Failed to log project activity:', error);
  }
};
